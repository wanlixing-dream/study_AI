import unittest

from fastapi.testclient import TestClient

from app.main import create_app


class ApiRouteTests(unittest.TestCase):
    def test_upload_material_returns_document_and_job(self) -> None:
        client = TestClient(create_app())

        response = client.post(
            "/v1/uploads",
            files={"file": ("agent-rag.md", b"# RAG\nHybrid retrieval", "text/markdown")},
        )

        self.assertEqual(response.status_code, 200)
        payload = response.json()
        self.assertEqual(payload["document"]["title"], "agent-rag.md")
        self.assertEqual(payload["document"]["status"], "pending")
        self.assertEqual(payload["job"]["status"], "queued")
        self.assertEqual(payload["job"]["documentId"], payload["document"]["id"])

        job_response = client.get(f"/v1/jobs/{payload['job']['id']}")
        self.assertEqual(job_response.status_code, 200)
        self.assertEqual(job_response.json()["job"]["id"], payload["job"]["id"])

    def test_empty_upload_is_rejected(self) -> None:
        client = TestClient(create_app())

        response = client.post(
            "/v1/uploads",
            files={"file": ("empty.md", b"", "text/markdown")},
        )

        self.assertEqual(response.status_code, 400)


if __name__ == "__main__":
    unittest.main()
