from app.domain.models import RetrievalResult
from app.ports import VectorRepositoryPort


class RetrievalService:
    def __init__(self, vector: VectorRepositoryPort) -> None:
        self.vector = vector

    def search(self, query: str, top_k: int = 10) -> list[RetrievalResult]:
        normalized_query = query.strip()
        if not normalized_query:
            raise ValueError("Search query is required.")
        bounded_top_k = max(1, min(top_k, 50))
        return self.vector.search(normalized_query, top_k=bounded_top_k)
