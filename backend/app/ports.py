from typing import Protocol

from app.domain.models import (
    AgentMemory,
    DocumentChunk,
    DocumentRecord,
    IngestionJob,
    KnowledgeCandidate,
    MemoryEvent,
    RetrievalResult,
)


class StoragePort(Protocol):
    def save_upload(self, filename: str, content: bytes) -> str:
        """Persist raw uploaded bytes and return a storage URI."""


class QueuePort(Protocol):
    def enqueue_ingestion(self, document_id: str) -> IngestionJob:
        """Queue ingestion work for a stored document."""


class VectorRepositoryPort(Protocol):
    def upsert_chunks(self, chunks: list[DocumentChunk]) -> None:
        """Persist chunks and their searchable metadata."""

    def search(self, query: str, top_k: int = 10) -> list[RetrievalResult]:
        """Search indexed chunks."""


class GraphRepositoryPort(Protocol):
    def list_candidates(self) -> list[KnowledgeCandidate]:
        """Return knowledge candidates waiting for review."""

    def approve_candidate(self, candidate_id: str) -> KnowledgeCandidate:
        """Promote a candidate through the product review workflow."""


class MemoryRepositoryPort(Protocol):
    def add_memory(self, memory: AgentMemory) -> AgentMemory:
        """Persist accepted or candidate memory."""

    def append_event(self, event: MemoryEvent) -> MemoryEvent:
        """Persist memory lifecycle events."""


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

