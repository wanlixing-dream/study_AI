from dataclasses import dataclass, field
from datetime import datetime, timezone
from enum import Enum
from typing import Any
from uuid import uuid4


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


class DocumentStatus(str, Enum):
    pending = "pending"
    processing = "processing"
    completed = "completed"
    failed = "failed"


class JobStatus(str, Enum):
    queued = "queued"
    running = "running"
    completed = "completed"
    failed = "failed"
    cancelled = "cancelled"


class ReviewStatus(str, Enum):
    candidate = "candidate"
    needs_review = "needs-review"
    approved = "approved"
    rejected = "rejected"


class MemoryAction(str, Enum):
    add = "add"
    update = "update"
    delete = "delete"
    reject = "reject"


@dataclass(frozen=True)
class DocumentRecord:
    title: str
    source_type: str
    storage_uri: str
    owner_id: str = "local-user"
    id: str = field(default_factory=lambda: str(uuid4()))
    mime_type: str = "text/plain"
    file_size: int = 0
    content_hash: str = ""
    status: DocumentStatus = DocumentStatus.pending
    created_at: datetime = field(default_factory=utc_now)


@dataclass(frozen=True)
class DocumentChunk:
    document_id: str
    seq: int
    start_pos: int
    end_pos: int
    content: str
    id: str = field(default_factory=lambda: str(uuid4()))
    category: str = "uncategorized"
    tags: tuple[str, ...] = ()


@dataclass(frozen=True)
class IngestionJob:
    document_id: str
    owner_id: str = "local-user"
    id: str = field(default_factory=lambda: str(uuid4()))
    status: JobStatus = JobStatus.queued
    stage: str = "created"
    retry_count: int = 0
    created_at: datetime = field(default_factory=utc_now)


@dataclass(frozen=True)
class RetrievalResult:
    chunk_id: str
    document_id: str
    content: str
    score: float
    source: str
    metadata: dict[str, Any] = field(default_factory=dict)


@dataclass(frozen=True)
class AgentMemory:
    content: str
    scope: str
    memory_type: str
    owner_id: str = "local-user"
    id: str = field(default_factory=lambda: str(uuid4()))
    entities: tuple[str, ...] = ()
    importance: float = 0.5
    confidence: float = 0.5
    status: ReviewStatus = ReviewStatus.candidate
    created_at: datetime = field(default_factory=utc_now)


@dataclass(frozen=True)
class MemoryEvent:
    memory_id: str
    action: MemoryAction
    reason: str
    actor: str = "system"
    id: str = field(default_factory=lambda: str(uuid4()))
    source_text: str = ""
    created_at: datetime = field(default_factory=utc_now)


@dataclass(frozen=True)
class KnowledgeCandidate:
    title: str
    summary: str
    candidate_type: str
    confidence: float
    id: str = field(default_factory=lambda: str(uuid4()))
    review_status: ReviewStatus = ReviewStatus.candidate
    tags: tuple[str, ...] = ()
    evidence: tuple[dict[str, Any], ...] = ()
    created_at: datetime = field(default_factory=utc_now)

