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

## Next Backend Steps

1. Add PostgreSQL + pgvector migrations.
2. Implement local file storage adapter.
3. Implement ingestion job creation and worker execution.
4. Add LearningAgent REST adapter with mocked tests first.
5. Add retrieval service with full-text recall, pgvector recall, and RRF fusion.
