from app.domain.models import (
    DocumentChunk,
    DocumentStatus,
    IngestionJob,
    JobStatus,
    KnowledgeCandidate,
)
from app.ports import (
    DocumentRepositoryPort,
    GraphRepositoryPort,
    QueuePort,
    StoragePort,
    VectorRepositoryPort,
)


class IngestionResourceNotFoundError(ValueError):
    """Raised when a job or document required for ingestion does not exist."""


class IngestionValidationError(ValueError):
    """Raised when uploaded content cannot be parsed or chunked."""


class TextParser:
    supported_mime_types = {
        "text/plain",
        "text/markdown",
        "application/octet-stream",
    }

    def parse(self, *, content: bytes, mime_type: str) -> str:
        if mime_type not in self.supported_mime_types:
            raise IngestionValidationError(f"Unsupported ingestion mime type: {mime_type}")
        try:
            text = content.decode("utf-8")
        except UnicodeDecodeError as error:
            raise IngestionValidationError("Uploaded text must be valid UTF-8.") from error
        normalized = text.replace("\r\n", "\n").replace("\r", "\n").strip()
        if not normalized:
            raise IngestionValidationError("Parsed document text is empty.")
        return normalized


class TextChunker:
    def __init__(self, chunk_size: int = 1200, overlap: int = 160) -> None:
        if overlap >= chunk_size:
            raise ValueError("Chunk overlap must be smaller than chunk size.")
        self.chunk_size = chunk_size
        self.overlap = overlap

    def chunk(self, *, document_id: str, text: str) -> list[DocumentChunk]:
        chunks: list[DocumentChunk] = []
        start = 0
        seq = 0
        while start < len(text):
            end = min(start + self.chunk_size, len(text))
            content = text[start:end].strip()
            if content:
                category, tags = classify_agent_technology(content)
                chunks.append(
                    DocumentChunk(
                        document_id=document_id,
                        seq=seq,
                        start_pos=start,
                        end_pos=end,
                        content=content,
                        category=category,
                        tags=tags,
                    )
                )
                seq += 1
            if end == len(text):
                break
            start = end - self.overlap
        return chunks


def classify_agent_technology(text: str) -> tuple[str, tuple[str, ...]]:
    normalized = text.lower()
    categories = [
        ("rag", ("rag", "retrieval", "chunk", "rerank", "hybrid search")),
        ("memory", ("memory", "memories", "long-term", "profile")),
        ("mcp", ("mcp", "model context protocol")),
        ("tool_calling", ("tool", "function calling", "tool calling")),
        ("planning", ("planner", "planning", "plan-and-execute")),
        ("evaluation", ("evaluation", "eval", "benchmark", "score")),
        ("vector_db", ("vector", "embedding", "pgvector", "chromadb")),
        ("deployment", ("deploy", "docker", "kubernetes", "aliyun", "cloud")),
        ("observability", ("trace", "metric", "logging", "observability")),
        ("multi_agent", ("multi-agent", "swarm", "agent team")),
        ("safety", ("safety", "guardrail", "policy", "risk")),
        ("cost_latency", ("latency", "cost", "token", "throughput")),
    ]
    matched_tags: list[str] = []
    for category, keywords in categories:
        if any(keyword in normalized for keyword in keywords):
            matched_tags.extend(keyword.replace(" ", "_") for keyword in keywords if keyword in normalized)
            return category, tuple(sorted(set(matched_tags or [category])))
    return "uncategorized", ("uncategorized",)


def candidate_from_chunk(chunk: DocumentChunk) -> KnowledgeCandidate:
    title = f"{chunk.category.replace('_', ' ').title()} Candidate"
    summary = chunk.content[:240]
    return KnowledgeCandidate(
        title=title,
        summary=summary,
        candidate_type="ai_agent_tech",
        confidence=0.55 if chunk.category == "uncategorized" else 0.75,
        tags=chunk.tags,
        evidence=(
            {
                "sourceType": "document_chunk",
                "documentId": chunk.document_id,
                "chunkId": chunk.id,
                "location": f"{chunk.start_pos}-{chunk.end_pos}",
            },
        ),
    )


class IngestionWorkerService:
    def __init__(
        self,
        *,
        storage: StoragePort,
        documents: DocumentRepositoryPort,
        queue: QueuePort,
        vector: VectorRepositoryPort,
        graph: GraphRepositoryPort,
        parser: TextParser | None = None,
        chunker: TextChunker | None = None,
    ) -> None:
        self.storage = storage
        self.documents = documents
        self.queue = queue
        self.vector = vector
        self.graph = graph
        self.parser = parser or TextParser()
        self.chunker = chunker or TextChunker()

    def process_job(self, job_id: str) -> tuple[IngestionJob, list[DocumentChunk], list[KnowledgeCandidate]]:
        job = self.queue.get_job(job_id)
        if job is None:
            raise IngestionResourceNotFoundError(f"Job not found: {job_id}")
        document = self.documents.get_document(job.document_id)
        if document is None:
            raise IngestionResourceNotFoundError(f"Document not found for job: {job_id}")

        try:
            self.queue.update_job_status(job.id, JobStatus.running, "parsing")
            self.documents.update_document_status(document.id, DocumentStatus.processing)
            raw_content = self.storage.read_uri(document.storage_uri)
            text = self.parser.parse(content=raw_content, mime_type=document.mime_type)
            chunks = self.chunker.chunk(document_id=document.id, text=text)
            if not chunks:
                raise IngestionValidationError("No chunks produced from document.")

            self.queue.update_job_status(job.id, JobStatus.running, "indexing")
            self.vector.upsert_chunks(chunks)

            self.queue.update_job_status(job.id, JobStatus.running, "candidate_generation")
            candidates = [self.graph.add_candidate(candidate_from_chunk(chunk)) for chunk in chunks]

            self.documents.update_document_status(document.id, DocumentStatus.completed)
            completed_job = self.queue.update_job_status(job.id, JobStatus.completed, "completed")
            return completed_job, chunks, candidates
        except Exception:
            self.documents.update_document_status(document.id, DocumentStatus.failed)
            self.queue.update_job_status(job.id, JobStatus.failed, "failed")
            raise
