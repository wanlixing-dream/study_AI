import os
import unittest
from pathlib import Path

from app.adapters.postgres import (
    PostgresConnectionFactory,
    PostgresDocumentRepository,
    PostgresQueueAdapter,
)
from app.domain.models import DocumentRecord


TEST_DATABASE_URL = os.getenv("STUDY_AI_TEST_DATABASE_URL")


@unittest.skipUnless(TEST_DATABASE_URL, "Set STUDY_AI_TEST_DATABASE_URL to run live PostgreSQL tests.")
class PostgresIntegrationTests(unittest.TestCase):
    def setUp(self) -> None:
        self.connection_factory = PostgresConnectionFactory(TEST_DATABASE_URL or "")
        self._apply_migration()

    def tearDown(self) -> None:
        with self.connection_factory.connect() as connection:
            with connection.cursor() as cursor:
                cursor.execute("DELETE FROM documents WHERE id = %s", ("test-doc-1",))

    def test_document_and_job_round_trip_against_postgres(self) -> None:
        documents = PostgresDocumentRepository(self.connection_factory)
        queue = PostgresQueueAdapter(self.connection_factory)
        document = DocumentRecord(
            id="test-doc-1",
            title="agent-rag.md",
            source_type="upload",
            storage_uri="local://agent-rag.md",
            mime_type="text/markdown",
            file_size=42,
            content_hash="hash",
        )

        created_document = documents.create_document(document)
        created_job = queue.enqueue_ingestion(created_document.id)

        self.assertEqual(documents.get_document(created_document.id), created_document)
        self.assertEqual(queue.get_job(created_job.id), created_job)

    def _apply_migration(self) -> None:
        migration_path = Path(__file__).resolve().parents[1] / "migrations" / "001_phase_a_pgvector.sql"
        migration_sql = migration_path.read_text(encoding="utf-8")
        with self.connection_factory.connect() as connection:
            with connection.cursor() as cursor:
                cursor.execute(migration_sql)


if __name__ == "__main__":
    unittest.main()
