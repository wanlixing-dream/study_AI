import unittest

from app.config import Settings
from app.domain.models import (
    AgentMemory,
    DocumentChunk,
    DocumentRecord,
    DocumentStatus,
    IngestionJob,
    JobStatus,
    KnowledgeCandidate,
    ReviewStatus,
)
from app.services.health import get_health_status


class BackendContractTests(unittest.TestCase):
    def test_default_settings_keep_local_phase_a_shape(self) -> None:
        settings = Settings()

        self.assertEqual(settings.api_prefix, "/v1")
        self.assertIn("postgresql", settings.database_url)
        self.assertIn("127.0.0.1:8000", settings.learning_agent_base_url)

    def test_health_status_is_stable_contract(self) -> None:
        settings = Settings(app_name="Study AI Test", environment="test")
        status = get_health_status(settings)

        self.assertEqual(status.status, "ok")
        self.assertEqual(status.app, "Study AI Test")
        self.assertEqual(status.environment, "test")
        self.assertEqual(status.api_prefix, "/v1")

    def test_document_and_job_defaults_match_ingestion_flow(self) -> None:
        document = DocumentRecord(
            title="RAG Notes",
            source_type="upload",
            storage_uri="local://uploads/rag.md",
        )
        job = IngestionJob(document_id=document.id)

        self.assertEqual(document.status, DocumentStatus.pending)
        self.assertEqual(job.status, JobStatus.queued)
        self.assertEqual(job.stage, "created")

    def test_chunks_preserve_source_offsets(self) -> None:
        chunk = DocumentChunk(
            document_id="doc-1",
            seq=2,
            start_pos=10,
            end_pos=42,
            content="Agent memory retrieval",
            category="memory",
            tags=("agent", "memory"),
        )

        self.assertEqual(chunk.seq, 2)
        self.assertEqual(chunk.start_pos, 10)
        self.assertEqual(chunk.end_pos, 42)
        self.assertIn("memory", chunk.tags)

    def test_memory_and_candidates_are_review_gated(self) -> None:
        memory = AgentMemory(content="User is learning RAG evaluation.", scope="learning", memory_type="preference")
        candidate = KnowledgeCandidate(
            title="RAG Evaluation",
            summary="Evaluation protects retrieval quality.",
            candidate_type="ai_agent_tech",
            confidence=0.8,
        )

        self.assertEqual(memory.status, ReviewStatus.candidate)
        self.assertEqual(candidate.review_status, ReviewStatus.candidate)


if __name__ == "__main__":
    unittest.main()
