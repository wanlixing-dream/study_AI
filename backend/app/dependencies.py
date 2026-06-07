from dataclasses import dataclass

from app.adapters.dev import (
    InMemoryDocumentRepository,
    InMemoryGraphRepository,
    InMemoryQueueAdapter,
    InMemoryVectorRepository,
    LocalFileStorageAdapter,
)
from app.config import get_settings
from app.ports import DocumentRepositoryPort, GraphRepositoryPort, QueuePort, VectorRepositoryPort
from app.services.ingestion import IngestionService
from app.services.ingestion_worker import IngestionWorkerService
from app.services.retrieval import RetrievalService


@dataclass
class AppContainer:
    documents: DocumentRepositoryPort
    queue: QueuePort
    vector: VectorRepositoryPort
    graph: GraphRepositoryPort
    ingestion: IngestionService
    ingestion_worker: IngestionWorkerService
    retrieval: RetrievalService


def create_container() -> AppContainer:
    settings = get_settings()
    storage = LocalFileStorageAdapter(settings.storage_root)

    if settings.repository_backend == "memory":
        documents = InMemoryDocumentRepository()
        queue = InMemoryQueueAdapter()
    elif settings.repository_backend == "postgres":
        from app.adapters.postgres import (
            PostgresConnectionFactory,
            PostgresDocumentRepository,
            PostgresQueueAdapter,
        )

        connection_factory = PostgresConnectionFactory(settings.database_url)
        documents = PostgresDocumentRepository(connection_factory)
        queue = PostgresQueueAdapter(connection_factory)
    else:
        raise ValueError(f"Unsupported repository backend: {settings.repository_backend}")

    vector = InMemoryVectorRepository()
    graph = InMemoryGraphRepository()
    ingestion = IngestionService(storage=storage, documents=documents, queue=queue)
    ingestion_worker = IngestionWorkerService(
        storage=storage,
        documents=documents,
        queue=queue,
        vector=vector,
        graph=graph,
    )
    retrieval = RetrievalService(vector=vector)
    return AppContainer(
        documents=documents,
        queue=queue,
        vector=vector,
        graph=graph,
        ingestion=ingestion,
        ingestion_worker=ingestion_worker,
        retrieval=retrieval,
    )
