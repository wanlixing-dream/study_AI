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

Repository backend selection:

```bash
# Default, no PostgreSQL required.
set STUDY_AI_REPOSITORY_BACKEND=memory

# Use PostgreSQL after migrations have been applied.
set STUDY_AI_REPOSITORY_BACKEND=postgres
set STUDY_AI_DATABASE_URL=postgresql+psycopg://study_ai:study_ai@127.0.0.1:5432/study_ai
```

Live PostgreSQL integration tests are opt-in because they need local credentials:

```bash
set STUDY_AI_TEST_DATABASE_URL=postgresql+psycopg://study_ai:study_ai@127.0.0.1:5432/study_ai
python -m unittest tests.test_postgres_integration
```

Useful Phase A endpoints:

```http
GET  /health
GET  /v1/health
POST /v1/uploads
GET  /v1/uploads/{document_id}
GET  /v1/jobs/{job_id}
POST /v1/jobs/{job_id}/run
GET  /v1/knowledge/candidates
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
- PostgreSQL document and ingestion-job repositories behind the same ports.
- Upload acceptance service that stores bytes, creates document metadata, and enqueues ingestion.
- Local ingestion worker for markdown/txt parsing, chunking, AI Agent category classification, chunk indexing, and candidate generation.
- Upload, document lookup, and job API routes backed by development adapters.

## Next Backend Steps

Use `C:\Users\WU\Desktop\1\study_AI\docs\architecture\module-task-map.md` as the module execution map.

1. Run live PostgreSQL integration tests after local database credentials are available.
2. Add durable chunk and candidate repositories when M3 needs PostgreSQL-backed worker output.
3. Add PDF parsing, embedding generation, and async queue execution as the next M3 hardening pass.
4. Add M6 LearningAgent REST adapter with mocked tests first.
5. Add M4 retrieval service with full-text recall, pgvector recall, and RRF fusion.
6. Add M8 frontend upload center UI that calls the backend upload/job endpoints.
