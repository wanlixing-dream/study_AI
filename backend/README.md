# Study AI Backend

FastAPI backend foundation for Study AI.

This backend owns product-level contracts for uploads, ingestion jobs, retrieval, candidate review, graph data, memory, and the LearningAgent adapter. It should not import React code, and the React frontend should not call LearningAgent directly.

## Local Setup

```bash
cd C:\Users\WU\Desktop\1\study_AI\backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Open `http://127.0.0.1:8001/health`.

Useful Phase A endpoints:

```http
GET  /health
GET  /v1/health
POST /v1/uploads
GET  /v1/jobs/{job_id}
```

## Verify

```bash
python -m compileall -q app tests
python -m unittest discover -s tests
```

## Current Scope

- FastAPI app factory and health endpoint.
- Environment-driven settings.
- Domain models for uploads, jobs, retrieval, memory, and knowledge candidates.
- Port interfaces for storage, queue, vector repository, graph repository, memory repository, and LearningAgent adapter.
- Phase A PostgreSQL/pgvector migration draft in `migrations/001_phase_a_pgvector.sql`.
- Local development adapters for file storage, in-memory repositories, and ingestion queue.
- Upload acceptance service that stores bytes, creates document metadata, and enqueues ingestion.
- Upload and job API routes backed by development adapters.

## Next Backend Steps

1. Implement PostgreSQL repositories from the migration schema.
2. Add ingestion worker execution for parse, chunk, embedding, and candidate generation.
3. Add LearningAgent REST adapter with mocked tests first.
4. Add retrieval service with full-text recall, pgvector recall, and RRF fusion.
5. Add frontend upload center UI that calls the backend upload/job endpoints.
