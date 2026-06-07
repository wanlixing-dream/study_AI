import unittest

from app.adapters.dev import InMemoryMemoryRepository
from app.domain.models import ReviewStatus
from app.services.memory import MemoryNotFoundError, MemoryService, MemoryValidationError


class MemoryServiceTests(unittest.TestCase):
    def test_propose_memory_creates_candidate_and_event(self) -> None:
        repository = InMemoryMemoryRepository()
        service = MemoryService(memories=repository)

        memory, event = service.propose_memory(
            content="Use pgvector for early Study AI retrieval.",
            scope="backend",
            memory_type="technical_decision",
            entities=("pgvector", "Study AI"),
            importance=0.9,
            confidence=0.8,
            source_text="PostgreSQL can store vectors and product data.",
            actor="tester",
        )

        self.assertEqual(memory.status, ReviewStatus.candidate)
        self.assertEqual(memory.entities, ("pgvector", "Study AI"))
        self.assertEqual(event.memory_id, memory.id)
        self.assertEqual(len(repository.list_events(memory.id)), 1)

    def test_review_memory_updates_status_and_appends_event(self) -> None:
        repository = InMemoryMemoryRepository()
        service = MemoryService(memories=repository)
        memory, _event = service.propose_memory(
            content="Keep generated knowledge behind review.",
            scope="quality",
            memory_type="guardrail",
        )

        reviewed, review_event = service.review_memory(
            memory_id=memory.id,
            status=ReviewStatus.approved,
            reason="Useful durable rule.",
            actor="tester",
        )

        self.assertEqual(reviewed.status, ReviewStatus.approved)
        self.assertEqual(review_event.reason, "Useful durable rule.")
        self.assertEqual(len(repository.list_events(memory.id)), 2)

    def test_review_missing_memory_raises_not_found(self) -> None:
        service = MemoryService(memories=InMemoryMemoryRepository())

        with self.assertRaises(MemoryNotFoundError):
            service.review_memory(
                memory_id="missing",
                status=ReviewStatus.approved,
                reason="missing",
            )

    def test_rejects_blank_content(self) -> None:
        service = MemoryService(memories=InMemoryMemoryRepository())

        with self.assertRaises(MemoryValidationError):
            service.propose_memory(content=" ", scope="backend", memory_type="insight")


if __name__ == "__main__":
    unittest.main()
