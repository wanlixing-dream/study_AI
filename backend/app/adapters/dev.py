from dataclasses import replace
from pathlib import Path
from uuid import uuid4

from app.domain.models import (
    AgentMemory,
    DocumentChunk,
    DocumentRecord,
    DocumentStatus,
    IngestionJob,
    JobStatus,
    KnowledgeCandidate,
    MemoryEvent,
    RetrievalResult,
    ReviewStatus,
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

    def read_uri(self, storage_uri: str) -> bytes:
        if not storage_uri.startswith("local://"):
            raise ValueError(f"Unsupported local storage URI: {storage_uri}")
        return Path(storage_uri.removeprefix("local://")).read_bytes()


class InMemoryDocumentRepository:
    def __init__(self) -> None:
        self.documents: dict[str, DocumentRecord] = {}

    def create_document(self, document: DocumentRecord) -> DocumentRecord:
        self.documents[document.id] = document
        return document

    def get_document(self, document_id: str) -> DocumentRecord | None:
        return self.documents.get(document_id)

    def update_document_status(self, document_id: str, status: DocumentStatus) -> DocumentRecord:
        document = self.documents[document_id]
        updated = replace(document, status=status)
        self.documents[document_id] = updated
        return updated


class InMemoryQueueAdapter:
    def __init__(self) -> None:
        self.jobs: dict[str, IngestionJob] = {}

    def enqueue_ingestion(self, document_id: str) -> IngestionJob:
        job = IngestionJob(document_id=document_id)
        self.jobs[job.id] = job
        return job

    def get_job(self, job_id: str) -> IngestionJob | None:
        return self.jobs.get(job_id)

    def update_job_status(self, job_id: str, status: JobStatus, stage: str) -> IngestionJob:
        job = self.jobs[job_id]
        updated = replace(job, status=status, stage=stage)
        self.jobs[job_id] = updated
        return updated


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

    def add_candidate(self, candidate: KnowledgeCandidate) -> KnowledgeCandidate:
        self.candidates[candidate.id] = candidate
        return candidate

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

    def get_memory(self, memory_id: str) -> AgentMemory | None:
        return self.memories.get(memory_id)

    def list_memories(self) -> list[AgentMemory]:
        return list(self.memories.values())

    def update_memory_status(self, memory_id: str, status: ReviewStatus) -> AgentMemory:
        memory = self.memories[memory_id]
        updated = replace(memory, status=status)
        self.memories[memory_id] = updated
        return updated

    def append_event(self, event: MemoryEvent) -> MemoryEvent:
        self.events.append(event)
        return event

    def list_events(self, memory_id: str | None = None) -> list[MemoryEvent]:
        if memory_id is None:
            return list(self.events)
        return [event for event in self.events if event.memory_id == memory_id]
