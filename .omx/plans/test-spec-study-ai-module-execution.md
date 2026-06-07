# Test Spec: Study AI Modular Execution System

## Verification Strategy

Each module must define the smallest command or inspection that proves the module is ready for the next dependency.

## M0: Project Execution Memory

Validation:
- Inspect `docs/architecture/module-task-map.md`.
- Inspect `.omx/plans/prd-study-ai-module-execution.md`.
- Inspect `.omx/plans/test-spec-study-ai-module-execution.md`.
- Inspect `.omx/state/study-ai/ralph-progress.json`.

Pass criteria:
- M0-M11 are listed.
- Each module has global role, deliverables, dependencies, verification, and next actions.

## M1: Backend API Contracts

Validation commands:

```powershell
cd C:\Users\WU\Desktop\1\study_AI\backend
python -m compileall -q app tests
python -m unittest discover -s tests
```

Pass criteria:
- Upload API still returns document and job.
- `GET /v1/uploads/{document_id}` returns uploaded document metadata.
- Unknown document returns 404.
- Existing health and job tests remain green.

## M2: PostgreSQL Persistence

Future validation:
- Run migrations against local PostgreSQL with pgvector.
- Run repository integration tests using a test database.
- Verify documents, jobs, chunks, candidates, memories can round-trip.

## M3: Ingestion Worker

Future validation:
- Upload markdown/txt fixture.
- Worker updates job stage from queued to completed.
- Chunks are stored with sequence and positions.
- Empty or invalid file moves job to failed with error.

## M4: Retrieval And RAG

Future validation:
- Seed chunks.
- Query returns hybrid retrieval results.
- Dense, text, and fused score paths are covered.

## M5: Memory System

Future validation:
- Candidate memory can be created, judged, approved, rejected, and event-logged.

## M6: LearningAgent Adapter

Future validation:
- Contract tests mock LearningAgent REST/MCP responses.
- Adapter failures do not crash ingestion job; they produce retryable or reviewable status.

## M7: Candidate Review And Graph Writeback

Future validation:
- Candidate list, approve, reject endpoints work.
- Approved candidates update graph repository.
- Rejected candidates never enter approved graph.

## M8: Frontend Workflows

Future validation:
- Upload center can upload a file and display document/job status.
- Review UI can approve/reject candidates.
- Existing graph tests and Vite build pass.

## M9: Deployment And Ops

Future validation:
- Local Docker compose starts frontend/backend/PostgreSQL.
- Health checks pass.
- Backup/restore procedure is documented.

## M10: Scale Practice Lab

Future validation:
- Load test scripts generate concurrent upload/search/job traffic.
- Reports include bottleneck, fix, and before/after measurement.

## M11: JVM Companion Learning

Future validation:
- Java/Spring Boot lab connects to PostgreSQL.
- Lab demonstrates one backend concept used by Study AI.
- Lesson is captured as a candidate knowledge record, not auto-approved.
