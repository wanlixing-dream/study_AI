from dataclasses import dataclass

from app.adapters.dev import (
    InMemoryDocumentRepository,
    InMemoryGraphRepository,
    InMemoryMemoryRepository,
    InMemoryQueueAdapter,
    InMemoryVectorRepository,
    LocalFileStorageAdapter,
)
from app.config import get_settings
from app.ports import (
    DocumentRepositoryPort,
    GraphRepositoryPort,
    MemoryRepositoryPort,
    QueuePort,
    VectorRepositoryPort,
)
from app.services.ingestion import IngestionService
from app.services.ingestion_worker import IngestionWorkerService
from app.services.memory import MemoryService
from app.services.retrieval import RetrievalService


@dataclass
class AppContainer:
    documents: DocumentRepositoryPort
    queue: QueuePort
    vector: VectorRepositoryPort
    graph: GraphRepositoryPort
    memories: MemoryRepositoryPort
    ingestion: IngestionService
    ingestion_worker: IngestionWorkerService
    retrieval: RetrievalService
    memory: MemoryService


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
    memories = InMemoryMemoryRepository()
    ingestion = IngestionService(storage=storage, documents=documents, queue=queue)
    ingestion_worker = IngestionWorkerService(
        storage=storage,
        documents=documents,
        queue=queue,
        vector=vector,
        graph=graph,
    )
    retrieval = RetrievalService(vector=vector)
    memory = MemoryService(memories=memories)
    return AppContainer(
        documents=documents,
        queue=queue,
        vector=vector,
        graph=graph,
        memories=memories,
        ingestion=ingestion,
        ingestion_worker=ingestion_worker,
        retrieval=retrieval,
        memory=memory,
    )
