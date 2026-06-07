from collections.abc import Mapping
from typing import Any

from app.domain.models import DocumentRecord, DocumentStatus, IngestionJob, JobStatus


def normalize_database_url(database_url: str) -> str:
    if database_url.startswith("postgresql+psycopg://"):
        return database_url.replace("postgresql+psycopg://", "postgresql://", 1)
    return database_url


def document_from_row(row: Mapping[str, Any]) -> DocumentRecord:
    return DocumentRecord(
        id=str(row["id"]),
        owner_id=str(row["owner_id"]),
        title=str(row["title"]),
        source_type=str(row["source_type"]),
        storage_uri=str(row["storage_uri"]),
        mime_type=str(row["mime_type"]),
        file_size=int(row["file_size"]),
        content_hash=str(row["content_hash"]),
        status=DocumentStatus(str(row["status"])),
        created_at=row["created_at"],
    )


def job_from_row(row: Mapping[str, Any]) -> IngestionJob:
    return IngestionJob(
        id=str(row["id"]),
        owner_id=str(row["owner_id"]),
        document_id=str(row["document_id"]),
        status=JobStatus(str(row["status"])),
        stage=str(row["stage"]),
        retry_count=int(row["retry_count"]),
        created_at=row["created_at"],
    )


class PostgresConnectionFactory:
    def __init__(self, database_url: str) -> None:
        self.database_url = normalize_database_url(database_url)

    def connect(self):
        import psycopg
        from psycopg.rows import dict_row

        return psycopg.connect(self.database_url, row_factory=dict_row)


class PostgresDocumentRepository:
    def __init__(self, connection_factory: PostgresConnectionFactory) -> None:
        self.connection_factory = connection_factory

    def create_document(self, document: DocumentRecord) -> DocumentRecord:
        sql = """
            INSERT INTO documents (
              id, owner_id, title, source_type, storage_uri, mime_type,
              file_size, content_hash, status, created_at
            )
            VALUES (
              %(id)s, %(owner_id)s, %(title)s, %(source_type)s, %(storage_uri)s,
              %(mime_type)s, %(file_size)s, %(content_hash)s, %(status)s,
              %(created_at)s
            )
            RETURNING id, owner_id, title, source_type, storage_uri, mime_type,
              file_size, content_hash, status, created_at
        """
        params = {
            "id": document.id,
            "owner_id": document.owner_id,
            "title": document.title,
            "source_type": document.source_type,
            "storage_uri": document.storage_uri,
            "mime_type": document.mime_type,
            "file_size": document.file_size,
            "content_hash": document.content_hash,
            "status": document.status.value,
            "created_at": document.created_at,
        }
        return document_from_row(self._fetch_one(sql, params))

    def get_document(self, document_id: str) -> DocumentRecord | None:
        row = self._fetch_optional(
            """
            SELECT id, owner_id, title, source_type, storage_uri, mime_type,
              file_size, content_hash, status, created_at
            FROM documents
            WHERE id = %(document_id)s
            """,
            {"document_id": document_id},
        )
        if row is None:
            return None
        return document_from_row(row)

    def update_document_status(self, document_id: str, status: DocumentStatus) -> DocumentRecord:
        return document_from_row(
            self._fetch_one(
                """
                UPDATE documents
                SET status = %(status)s, updated_at = now()
                WHERE id = %(document_id)s
                RETURNING id, owner_id, title, source_type, storage_uri, mime_type,
                  file_size, content_hash, status, created_at
                """,
                {"document_id": document_id, "status": status.value},
            )
        )

    def _fetch_one(self, sql: str, params: Mapping[str, Any]) -> Mapping[str, Any]:
        row = self._fetch_optional(sql, params)
        if row is None:
            raise RuntimeError("PostgreSQL document query returned no row.")
        return row

    def _fetch_optional(self, sql: str, params: Mapping[str, Any]) -> Mapping[str, Any] | None:
        with self.connection_factory.connect() as connection:
            with connection.cursor() as cursor:
                cursor.execute(sql, params)
                return cursor.fetchone()


class PostgresQueueAdapter:
    def __init__(self, connection_factory: PostgresConnectionFactory, owner_id: str = "local-user") -> None:
        self.connection_factory = connection_factory
        self.owner_id = owner_id

    def enqueue_ingestion(self, document_id: str) -> IngestionJob:
        job = IngestionJob(document_id=document_id, owner_id=self.owner_id)
        sql = """
            INSERT INTO ingestion_jobs (
              id, owner_id, document_id, status, stage, retry_count, created_at
            )
            VALUES (
              %(id)s, %(owner_id)s, %(document_id)s, %(status)s, %(stage)s,
              %(retry_count)s, %(created_at)s
            )
            RETURNING id, owner_id, document_id, status, stage, retry_count, created_at
        """
        params = {
            "id": job.id,
            "owner_id": job.owner_id,
            "document_id": job.document_id,
            "status": job.status.value,
            "stage": job.stage,
            "retry_count": job.retry_count,
            "created_at": job.created_at,
        }
        return job_from_row(self._fetch_one(sql, params))

    def get_job(self, job_id: str) -> IngestionJob | None:
        row = self._fetch_optional(
            """
            SELECT id, owner_id, document_id, status, stage, retry_count, created_at
            FROM ingestion_jobs
            WHERE id = %(job_id)s
            """,
            {"job_id": job_id},
        )
        if row is None:
            return None
        return job_from_row(row)

    def update_job_status(self, job_id: str, status: JobStatus, stage: str) -> IngestionJob:
        return job_from_row(
            self._fetch_one(
                """
                UPDATE ingestion_jobs
                SET status = %(status)s, stage = %(stage)s,
                  started_at = CASE
                    WHEN %(status)s = 'running' AND started_at IS NULL THEN now()
                    ELSE started_at
                  END,
                  finished_at = CASE
                    WHEN %(status)s IN ('completed', 'failed', 'cancelled') THEN now()
                    ELSE finished_at
                  END
                WHERE id = %(job_id)s
                RETURNING id, owner_id, document_id, status, stage, retry_count, created_at
                """,
                {"job_id": job_id, "status": status.value, "stage": stage},
            )
        )

    def _fetch_one(self, sql: str, params: Mapping[str, Any]) -> Mapping[str, Any]:
        row = self._fetch_optional(sql, params)
        if row is None:
            raise RuntimeError("PostgreSQL ingestion job query returned no row.")
        return row

    def _fetch_optional(self, sql: str, params: Mapping[str, Any]) -> Mapping[str, Any] | None:
        with self.connection_factory.connect() as connection:
            with connection.cursor() as cursor:
                cursor.execute(sql, params)
                return cursor.fetchone()
