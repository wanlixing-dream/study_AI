from fastapi import APIRouter, File, HTTPException, Query, UploadFile
from pydantic import BaseModel, Field

from app.dependencies import AppContainer
from app.domain.models import AgentMemory, DocumentRecord, IngestionJob, KnowledgeCandidate, MemoryEvent, RetrievalResult, ReviewStatus
from app.services.ingestion_worker import IngestionResourceNotFoundError, IngestionValidationError
from app.services.memory import MemoryNotFoundError, MemoryValidationError


class MemoryCreateRequest(BaseModel):
    content: str = Field(min_length=1)
    scope: str = Field(default="learning", min_length=1)
    memoryType: str = Field(default="insight", min_length=1)
    entities: list[str] = Field(default_factory=list)
    importance: float = Field(default=0.5, ge=0.0, le=1.0)
    confidence: float = Field(default=0.5, ge=0.0, le=1.0)
    sourceText: str = ""
    actor: str = "system"


class MemoryReviewRequest(BaseModel):
    status: ReviewStatus
    reason: str = ""
    actor: str = "system"


def serialize_document(document: DocumentRecord) -> dict:
    return {
        "id": document.id,
        "ownerId": document.owner_id,
        "title": document.title,
        "sourceType": document.source_type,
        "storageUri": document.storage_uri,
        "mimeType": document.mime_type,
        "fileSize": document.file_size,
        "contentHash": document.content_hash,
        "status": document.status.value,
        "createdAt": document.created_at.isoformat(),
    }


def serialize_job(job: IngestionJob) -> dict:
    return {
        "id": job.id,
        "ownerId": job.owner_id,
        "documentId": job.document_id,
        "status": job.status.value,
        "stage": job.stage,
        "retryCount": job.retry_count,
        "createdAt": job.created_at.isoformat(),
    }


def serialize_candidate(candidate: KnowledgeCandidate) -> dict:
    return {
        "id": candidate.id,
        "title": candidate.title,
        "summary": candidate.summary,
        "candidateType": candidate.candidate_type,
        "confidence": candidate.confidence,
        "reviewStatus": candidate.review_status.value,
        "tags": list(candidate.tags),
        "evidence": list(candidate.evidence),
        "createdAt": candidate.created_at.isoformat(),
    }


def serialize_retrieval_result(result: RetrievalResult) -> dict:
    return {
        "chunkId": result.chunk_id,
        "documentId": result.document_id,
        "content": result.content,
        "score": result.score,
        "source": result.source,
        "metadata": result.metadata,
    }


def serialize_memory(memory: AgentMemory) -> dict:
    return {
        "id": memory.id,
        "ownerId": memory.owner_id,
        "scope": memory.scope,
        "memoryType": memory.memory_type,
        "content": memory.content,
        "entities": list(memory.entities),
        "importance": memory.importance,
        "confidence": memory.confidence,
        "status": memory.status.value,
        "createdAt": memory.created_at.isoformat(),
    }


def serialize_memory_event(event: MemoryEvent) -> dict:
    return {
        "id": event.id,
        "memoryId": event.memory_id,
        "action": event.action.value,
        "reason": event.reason,
        "actor": event.actor,
        "sourceText": event.source_text,
        "createdAt": event.created_at.isoformat(),
    }


def create_router(container: AppContainer) -> APIRouter:
    router = APIRouter()

    @router.post("/uploads")
    async def upload_material(file: UploadFile = File(...)) -> dict:
        content = await file.read()
        if not content:
            raise HTTPException(status_code=400, detail="Uploaded file is empty.")
        document, job = container.ingestion.accept_upload(
            filename=file.filename or "upload.bin",
            content=content,
            mime_type=file.content_type or "application/octet-stream",
        )
        return {
            "document": serialize_document(document),
            "job": serialize_job(job),
        }

    @router.get("/jobs/{job_id}")
    def get_job(job_id: str) -> dict:
        job = container.queue.get_job(job_id)
        if not job:
            raise HTTPException(status_code=404, detail="Job not found.")
        return {"job": serialize_job(job)}

    @router.post("/jobs/{job_id}/run")
    def run_job(job_id: str) -> dict:
        try:
            job, chunks, candidates = container.ingestion_worker.process_job(job_id)
        except IngestionResourceNotFoundError as error:
            raise HTTPException(status_code=404, detail=str(error)) from error
        except IngestionValidationError as error:
            raise HTTPException(status_code=422, detail=str(error)) from error
        return {
            "job": serialize_job(job),
            "chunkCount": len(chunks),
            "candidateCount": len(candidates),
        }

    @router.get("/uploads/{document_id}")
    def get_upload(document_id: str) -> dict:
        document = container.documents.get_document(document_id)
        if not document:
            raise HTTPException(status_code=404, detail="Document not found.")
        return {"document": serialize_document(document)}

    @router.get("/knowledge/candidates")
    def list_candidates() -> dict:
        return {"candidates": [serialize_candidate(candidate) for candidate in container.graph.list_candidates()]}

    @router.get("/retrieval/search")
    def search_knowledge(query: str = Query(..., min_length=1), top_k: int = Query(10, ge=1, le=50)) -> dict:
        try:
            results = container.retrieval.search(query=query, top_k=top_k)
        except ValueError as error:
            raise HTTPException(status_code=422, detail=str(error)) from error
        return {
            "query": query,
            "results": [serialize_retrieval_result(result) for result in results],
        }

    @router.post("/memories")
    def create_memory(request: MemoryCreateRequest) -> dict:
        try:
            memory, event = container.memory.propose_memory(
                content=request.content,
                scope=request.scope,
                memory_type=request.memoryType,
                entities=tuple(request.entities),
                importance=request.importance,
                confidence=request.confidence,
                source_text=request.sourceText,
                actor=request.actor,
            )
        except MemoryValidationError as error:
            raise HTTPException(status_code=422, detail=str(error)) from error
        return {"memory": serialize_memory(memory), "event": serialize_memory_event(event)}

    @router.get("/memories")
    def list_memories() -> dict:
        return {"memories": [serialize_memory(memory) for memory in container.memories.list_memories()]}

    @router.post("/memories/{memory_id}/review")
    def review_memory(memory_id: str, request: MemoryReviewRequest) -> dict:
        try:
            memory, event = container.memory.review_memory(
                memory_id=memory_id,
                status=request.status,
                reason=request.reason,
                actor=request.actor,
            )
        except MemoryNotFoundError as error:
            raise HTTPException(status_code=404, detail=str(error)) from error
        except MemoryValidationError as error:
            raise HTTPException(status_code=422, detail=str(error)) from error
        return {"memory": serialize_memory(memory), "event": serialize_memory_event(event)}

    @router.get("/memories/events")
    def list_memory_events(memory_id: str | None = None) -> dict:
        return {"events": [serialize_memory_event(event) for event in container.memories.list_events(memory_id)]}

    return router
