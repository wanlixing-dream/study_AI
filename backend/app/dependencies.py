from dataclasses import dataclass

from app.adapters.dev import InMemoryDocumentRepository, InMemoryQueueAdapter, LocalFileStorageAdapter
from app.config import get_settings
from app.services.ingestion import IngestionService


@dataclass
class AppContainer:
    documents: InMemoryDocumentRepository
    queue: InMemoryQueueAdapter
    ingestion: IngestionService


def create_container() -> AppContainer:
    settings = get_settings()
    storage = LocalFileStorageAdapter(settings.storage_root)
    documents = InMemoryDocumentRepository()
    queue = InMemoryQueueAdapter()
    ingestion = IngestionService(storage=storage, documents=documents, queue=queue)
    return AppContainer(documents=documents, queue=queue, ingestion=ingestion)
