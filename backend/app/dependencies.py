from dataclasses import dataclass

from app.adapters.dev import InMemoryDocumentRepository, InMemoryQueueAdapter, LocalFileStorageAdapter
from app.config import get_settings
from app.ports import DocumentRepositoryPort, QueuePort
from app.services.ingestion import IngestionService


@dataclass
class AppContainer:
    documents: DocumentRepositoryPort
    queue: QueuePort
    ingestion: IngestionService


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

    ingestion = IngestionService(storage=storage, documents=documents, queue=queue)
    return AppContainer(documents=documents, queue=queue, ingestion=ingestion)
