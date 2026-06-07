from typing import Protocol

from app.domain.models import (
    AgentMemory,
    DocumentChunk,
    DocumentStatus,
    DocumentRecord,
    IngestionJob,
    JobStatus,
    KnowledgeCandidate,
    MemoryEvent,
    RetrievalResult,
    ReviewStatus,
)


class StoragePort(Protocol):
    def save_upload(self, filename: str, content: bytes) -> str:
        """Persist raw uploaded bytes and return a storage URI."""

    def read_uri(self, storage_uri: str) -> bytes:
        """Read raw bytes from a storage URI."""


class QueuePort(Protocol):
    def enqueue_ingestion(self, document_id: str) -> IngestionJob:
        """Queue ingestion work for a stored document."""

    def get_job(self, job_id: str) -> IngestionJob | None:
        """Read ingestion job metadata."""

    def update_job_status(self, job_id: str, status: JobStatus, stage: str) -> IngestionJob:
        """Update job lifecycle state."""


class VectorRepositoryPort(Protocol):
    def upsert_chunks(self, chunks: list[DocumentChunk]) -> None:
        """Persist chunks and their searchable metadata."""

    def search(self, query: str, top_k: int = 10) -> list[RetrievalResult]:
        """Search indexed chunks."""


class GraphRepositoryPort(Protocol):
    def add_candidate(self, candidate: KnowledgeCandidate) -> KnowledgeCandidate:
        """Persist a generated knowledge candidate."""

    def list_candidates(self) -> list[KnowledgeCandidate]:
        """Return knowledge candidates waiting for review."""

    def approve_candidate(self, candidate_id: str) -> KnowledgeCandidate:
        """Promote a candidate through the product review workflow."""


class MemoryRepositoryPort(Protocol):
    def add_memory(self, memory: AgentMemory) -> AgentMemory:
        """Persist accepted or candidate memory."""

    def get_memory(self, memory_id: str) -> AgentMemory | None:
        """Read memory by ID."""

    def list_memories(self) -> list[AgentMemory]:
        """Return stored memories."""

    def update_memory_status(self, memory_id: str, status: ReviewStatus) -> AgentMemory:
        """Update memory review status."""

    def append_event(self, event: MemoryEvent) -> MemoryEvent:
        """Persist memory lifecycle events."""

    def list_events(self, memory_id: str | None = None) -> list[MemoryEvent]:
        """Return memory lifecycle events."""


class LearningAgentPort(Protocol):
    def create_plan(self, topic: str) -> str:
        """Create a learning plan through LearningAgent."""

    def summarize_domain(self, domain: str) -> str:
        """Return a LearningAgent domain summary."""

    def weak_concepts(self, domain: str) -> list[dict]:
        """Return weak concepts from LearningAgent mastery tracking."""


class DocumentRepositoryPort(Protocol):
    def create_document(self, document: DocumentRecord) -> DocumentRecord:
        """Persist document metadata."""

    def get_document(self, document_id: str) -> DocumentRecord | None:
        """Read document metadata."""

    def update_document_status(self, document_id: str, status: DocumentStatus) -> DocumentRecord:
        """Update document lifecycle state."""
