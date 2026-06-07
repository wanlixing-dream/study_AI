import hashlib

from app.domain.models import DocumentRecord, IngestionJob
from app.ports import DocumentRepositoryPort, QueuePort, StoragePort


class IngestionService:
    def __init__(
        self,
        storage: StoragePort,
        documents: DocumentRepositoryPort,
        queue: QueuePort,
    ) -> None:
        self.storage = storage
        self.documents = documents
        self.queue = queue

    def accept_upload(
        self,
        *,
        filename: str,
        content: bytes,
        owner_id: str = "local-user",
        source_type: str = "upload",
        mime_type: str = "application/octet-stream",
    ) -> tuple[DocumentRecord, IngestionJob]:
        storage_uri = self.storage.save_upload(filename, content)
        document = DocumentRecord(
            owner_id=owner_id,
            title=filename,
            source_type=source_type,
            storage_uri=storage_uri,
            mime_type=mime_type,
            file_size=len(content),
            content_hash=hashlib.sha256(content).hexdigest(),
        )
        saved_document = self.documents.create_document(document)
        job = self.queue.enqueue_ingestion(saved_document.id)
        return saved_document, job
