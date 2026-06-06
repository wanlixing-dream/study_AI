from typing import Any

import httpx


class LearningAgentRestAdapter:
    def __init__(self, base_url: str, timeout_seconds: float = 10.0) -> None:
        self.base_url = base_url.rstrip("/")
        self.timeout_seconds = timeout_seconds

    def create_plan(self, topic: str) -> str:
        raise NotImplementedError("LearningAgent plan creation endpoint is not finalized yet.")

    def summarize_domain(self, domain: str) -> str:
        url = f"{self.base_url}/api/domains/{domain}/plan"
        response = httpx.get(url, timeout=self.timeout_seconds)
        response.raise_for_status()
        payload: dict[str, Any] = response.json()
        return str(payload.get("content") or payload.get("plan") or "")

    def weak_concepts(self, domain: str) -> list[dict]:
        url = f"{self.base_url}/api/domains/{domain}/mastery"
        response = httpx.get(url, timeout=self.timeout_seconds)
        response.raise_for_status()
        payload: dict[str, Any] = response.json()
        weak = payload.get("weak") or payload.get("weak_concepts") or []
        return weak if isinstance(weak, list) else []

