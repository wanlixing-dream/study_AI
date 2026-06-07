import unittest
from datetime import datetime, timezone

from app.adapters.postgres import (
    PostgresDocumentRepository,
    PostgresQueueAdapter,
    document_from_row,
    job_from_row,
    normalize_database_url,
)
from app.domain.models import DocumentRecord, DocumentStatus, IngestionJob, JobStatus


class FakeCursor:
    def __init__(self, rows: list[dict | None]) -> None:
        self.rows = rows
        self.executed: list[tuple[str, dict]] = []

    def __enter__(self) -> "FakeCursor":
        return self

    def __exit__(self, *_args: object) -> None:
        return None

    def execute(self, sql: str, params: dict) -> None:
        self.executed.append((sql, params))

    def fetchone(self) -> dict | None:
        return self.rows.pop(0)


class FakeConnection:
    def __init__(self, cursor: FakeCursor) -> None:
        self._cursor = cursor

    def __enter__(self) -> "FakeConnection":
        return self

    def __exit__(self, *_args: object) -> None:
        return None

    def cursor(self) -> FakeCursor:
        return self._cursor


class FakeConnectionFactory:
    def __init__(self, rows: list[dict | None]) -> None:
        self.cursor = FakeCursor(rows)

    def connect(self) -> FakeConnection:
        return FakeConnection(self.cursor)


def document_row() -> dict:
    return {
        "id": "doc-1",
        "owner_id": "local-user",
        "title": "agent-rag.md",
        "source_type": "upload",
        "storage_uri": "local://agent-rag.md",
        "mime_type": "text/markdown",
        "file_size": 42,
        "content_hash": "hash",
        "status": "pending",
        "created_at": datetime(2026, 6, 7, tzinfo=timezone.utc),
    }


def job_row() -> dict:
    return {
        "id": "job-1",
        "owner_id": "local-user",
        "document_id": "doc-1",
        "status": "queued",
        "stage": "created",
        "retry_count": 0,
        "created_at": datetime(2026, 6, 7, tzinfo=timezone.utc),
    }


class PostgresAdapterTests(unittest.TestCase):
    def test_normalize_database_url_supports_pydantic_default(self) -> None:
        normalized = normalize_database_url("postgresql+psycopg://user:pass@localhost/db")

        self.assertEqual(normalized, "postgresql://user:pass@localhost/db")

    def test_document_row_maps_to_domain_model(self) -> None:
        document = document_from_row(document_row())

        self.assertEqual(document.id, "doc-1")
        self.assertEqual(document.status, DocumentStatus.pending)
        self.assertEqual(document.file_size, 42)

    def test_job_row_maps_to_domain_model(self) -> None:
        job = job_from_row(job_row())

        self.assertEqual(job.id, "job-1")
        self.assertEqual(job.status, JobStatus.queued)
        self.assertEqual(job.stage, "created")

    def test_postgres_document_repository_round_trips_through_connection(self) -> None:
        factory = FakeConnectionFactory([document_row(), None])
        repository = PostgresDocumentRepository(factory)
        document = DocumentRecord(
            id="doc-1",
            title="agent-rag.md",
            source_type="upload",
            storage_uri="local://agent-rag.md",
            mime_type="text/markdown",
            file_size=42,
            content_hash="hash",
        )

        created = repository.create_document(document)
        missing = repository.get_document("missing-doc")

        self.assertEqual(created.id, "doc-1")
        self.assertIsNone(missing)
        self.assertIn("INSERT INTO documents", factory.cursor.executed[0][0])
        self.assertIn("FROM documents", factory.cursor.executed[1][0])

    def test_postgres_queue_adapter_round_trips_through_connection(self) -> None:
        factory = FakeConnectionFactory([job_row(), None])
        queue = PostgresQueueAdapter(factory)

        created = queue.enqueue_ingestion("doc-1")
        missing = queue.get_job("missing-job")

        self.assertEqual(created.document_id, "doc-1")
        self.assertIsNone(missing)
        self.assertIn("INSERT INTO ingestion_jobs", factory.cursor.executed[0][0])
        self.assertIn("FROM ingestion_jobs", factory.cursor.executed[1][0])


if __name__ == "__main__":
    unittest.main()
