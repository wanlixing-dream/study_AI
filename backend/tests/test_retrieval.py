import unittest

from app.adapters.dev import InMemoryVectorRepository
from app.domain.models import DocumentChunk
from app.services.retrieval import RetrievalService


class RetrievalServiceTests(unittest.TestCase):
    def test_search_returns_indexed_chunks(self) -> None:
        vector = InMemoryVectorRepository()
        chunk = DocumentChunk(
            document_id="doc-1",
            seq=0,
            start_pos=0,
            end_pos=40,
            content="Hybrid retrieval connects keyword and vector recall.",
            category="rag",
        )
        vector.upsert_chunks([chunk])
        retrieval = RetrievalService(vector=vector)

        results = retrieval.search("vector", top_k=5)

        self.assertEqual(len(results), 1)
        self.assertEqual(results[0].chunk_id, chunk.id)
        self.assertEqual(results[0].source, "dev-keyword")

    def test_search_rejects_blank_query(self) -> None:
        retrieval = RetrievalService(vector=InMemoryVectorRepository())

        with self.assertRaises(ValueError):
            retrieval.search("   ")


if __name__ == "__main__":
    unittest.main()
