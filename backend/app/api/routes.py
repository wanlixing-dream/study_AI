from fastapi import APIRouter, File, HTTPException, UploadFile

from app.dependencies import AppContainer
from app.domain.models import DocumentRecord, IngestionJob


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

    @router.get("/uploads/{document_id}")
    def get_upload(document_id: str) -> dict:
        document = container.documents.get_document(document_id)
        if not document:
            raise HTTPException(status_code=404, detail="Document not found.")
        return {"document": serialize_document(document)}

    return router
