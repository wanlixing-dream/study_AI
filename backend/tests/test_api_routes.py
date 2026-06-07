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

        document_response = client.get(f"/v1/uploads/{payload['document']['id']}")
        self.assertEqual(document_response.status_code, 200)
        self.assertEqual(document_response.json()["document"]["id"], payload["document"]["id"])

    def test_run_job_processes_upload_and_exposes_candidates(self) -> None:
        client = TestClient(create_app())
        upload_response = client.post(
            "/v1/uploads",
            files={"file": ("agent-rag.md", b"# RAG\nHybrid retrieval chunks.", "text/markdown")},
        )
        job_id = upload_response.json()["job"]["id"]

        run_response = client.post(f"/v1/jobs/{job_id}/run")
        candidates_response = client.get("/v1/knowledge/candidates")

        self.assertEqual(run_response.status_code, 200)
        self.assertEqual(run_response.json()["job"]["status"], "completed")
        self.assertEqual(run_response.json()["chunkCount"], 1)
        self.assertEqual(run_response.json()["candidateCount"], 1)
        self.assertEqual(candidates_response.status_code, 200)
        self.assertEqual(len(candidates_response.json()["candidates"]), 1)

    def test_run_job_rejects_unsupported_mime_as_validation_error(self) -> None:
        client = TestClient(create_app())
        upload_response = client.post(
            "/v1/uploads",
            files={"file": ("agent.bin", b"binary-ish", "application/pdf")},
        )
        job_id = upload_response.json()["job"]["id"]

        run_response = client.post(f"/v1/jobs/{job_id}/run")

        self.assertEqual(run_response.status_code, 422)

    def test_empty_upload_is_rejected(self) -> None:
        client = TestClient(create_app())

        response = client.post(
            "/v1/uploads",
            files={"file": ("empty.md", b"", "text/markdown")},
        )

        self.assertEqual(response.status_code, 400)

    def test_missing_upload_returns_not_found(self) -> None:
        client = TestClient(create_app())

        response = client.get("/v1/uploads/missing-document")

        self.assertEqual(response.status_code, 404)

    def test_missing_job_returns_not_found(self) -> None:
        client = TestClient(create_app())

        response = client.get("/v1/jobs/missing-job")

        self.assertEqual(response.status_code, 404)


if __name__ == "__main__":
    unittest.main()
