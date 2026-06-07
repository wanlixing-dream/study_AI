import unittest
from pathlib import Path
from tempfile import TemporaryDirectory

from app.adapters.dev import (
    InMemoryDocumentRepository,
    InMemoryGraphRepository,
    InMemoryQueueAdapter,
    InMemoryVectorRepository,
    LocalFileStorageAdapter,
)
from app.domain.models import DocumentStatus, JobStatus
from app.services.ingestion import IngestionService
from app.services.ingestion_worker import (
    IngestionValidationError,
    IngestionWorkerService,
    TextParser,
    classify_agent_technology,
)


class IngestionWorkerTests(unittest.TestCase):
    def test_classifies_ai_agent_categories(self) -> None:
        category, tags = classify_agent_technology("RAG uses chunk retrieval and reranking.")

        self.assertEqual(category, "rag")
        self.assertIn("rag", tags)

    def test_worker_processes_markdown_into_chunks_and_candidates(self) -> None:
        with TemporaryDirectory() as tmp:
            storage = LocalFileStorageAdapter(Path(tmp))
            documents = InMemoryDocumentRepository()
            queue = InMemoryQueueAdapter()
            vector = InMemoryVectorRepository()
            graph = InMemoryGraphRepository()
            ingestion = IngestionService(storage=storage, documents=documents, queue=queue)
            worker = IngestionWorkerService(
                storage=storage,
                documents=documents,
                queue=queue,
                vector=vector,
                graph=graph,
            )
            document, job = ingestion.accept_upload(
                filename="agent-rag.md",
                content=b"# RAG\nHybrid retrieval uses chunks and reranking.",
                mime_type="text/markdown",
            )

            completed_job, chunks, candidates = worker.process_job(job.id)
            completed_document = documents.get_document(document.id)

            self.assertEqual(completed_job.status, JobStatus.completed)
            self.assertEqual(completed_job.stage, "completed")
            self.assertEqual(completed_document.status, DocumentStatus.completed)
            self.assertEqual(len(chunks), 1)
            self.assertEqual(chunks[0].category, "rag")
            self.assertEqual(len(candidates), 1)
            self.assertEqual(candidates[0].candidate_type, "ai_agent_tech")
            self.assertEqual(graph.list_candidates(), candidates)
            self.assertEqual(vector.search("hybrid")[0].chunk_id, chunks[0].id)

    def test_parser_rejects_malformed_utf8_as_validation_error(self) -> None:
        parser = TextParser()

        with self.assertRaises(IngestionValidationError):
            parser.parse(content=b"\xff\xfe\x00", mime_type="text/plain")


if __name__ == "__main__":
    unittest.main()
