from pathlib import Path
from uuid import uuid4

from app.domain.models import (
    AgentMemory,
    DocumentChunk,
    DocumentRecord,
    IngestionJob,
    KnowledgeCandidate,
    MemoryEvent,
    RetrievalResult,
)


class LocalFileStorageAdapter:
    def __init__(self, root: Path) -> None:
        self.root = root

    def save_upload(self, filename: str, content: bytes) -> str:
        safe_name = Path(filename).name or "upload.bin"
        upload_dir = self.root / "uploads"
        upload_dir.mkdir(parents=True, exist_ok=True)
        target = upload_dir / f"{uuid4()}-{safe_name}"
        target.write_bytes(content)
        return f"local://{target.as_posix()}"


class InMemoryDocumentRepository:
    def __init__(self) -> None:
        self.documents: dict[str, DocumentRecord] = {}

    def create_document(self, document: DocumentRecord) -> DocumentRecord:
        self.documents[document.id] = document
        return document

    def get_document(self, document_id: str) -> DocumentRecord | None:
        return self.documents.get(document_id)


class InMemoryQueueAdapter:
    def __init__(self) -> None:
        self.jobs: dict[str, IngestionJob] = {}

    def enqueue_ingestion(self, document_id: str) -> IngestionJob:
        job = IngestionJob(document_id=document_id)
        self.jobs[job.id] = job
        return job

    def get_job(self, job_id: str) -> IngestionJob | None:
        return self.jobs.get(job_id)


class InMemoryVectorRepository:
    def __init__(self) -> None:
        self.chunks: dict[str, DocumentChunk] = {}

    def upsert_chunks(self, chunks: list[DocumentChunk]) -> None:
        for chunk in chunks:
            self.chunks[chunk.id] = chunk

    def search(self, query: str, top_k: int = 10) -> list[RetrievalResult]:
        normalized = query.lower().strip()
        results: list[RetrievalResult] = []
        for chunk in self.chunks.values():
            if normalized and normalized in chunk.content.lower():
                results.append(
                    RetrievalResult(
                        chunk_id=chunk.id,
                        document_id=chunk.document_id,
                        content=chunk.content,
                        score=1.0,
                        source="dev-keyword",
                    )
                )
        return results[:top_k]


class InMemoryGraphRepository:
    def __init__(self) -> None:
        self.candidates: dict[str, KnowledgeCandidate] = {}

    def list_candidates(self) -> list[KnowledgeCandidate]:
        return list(self.candidates.values())

    def approve_candidate(self, candidate_id: str) -> KnowledgeCandidate:
        candidate = self.candidates[candidate_id]
        return candidate


class InMemoryMemoryRepository:
    def __init__(self) -> None:
        self.memories: dict[str, AgentMemory] = {}
        self.events: list[MemoryEvent] = []

    def add_memory(self, memory: AgentMemory) -> AgentMemory:
        self.memories[memory.id] = memory
        return memory

    def append_event(self, event: MemoryEvent) -> MemoryEvent:
        self.events.append(event)
        return event
