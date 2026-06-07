# Study AI Long-Term Plan: PostgreSQL, LearningAgent, JVM Learning, And Scale Practice

## Requirements Summary

Study AI should become a deployable personal AI knowledge system rather than a demo. PostgreSQL is the long-term primary database. The system should keep using the existing React graph frontend and FastAPI backend while gradually adding upload ingestion, RAG retrieval, memory, candidate review, LearningAgent integration, public deployment, and realistic scale training.

Current repo evidence:

- `README.md:23` defines Study AI and LearningAgent as separate services joined by backend adapters.
- `README.md:91` selects PostgreSQL/pgvector as the service-grade storage path while borrowing retrieval and memory ideas from BestCowork-GA.
- `README.md:239` recommends local-first Phase A before Alibaba Cloud Phase B.
- `README.md:252` lists backend foundation, LearningAgent adapter, upload/ingestion, RAG/vector storage, candidate workflow, review UI, and production hardening.
- `README.md:318` documents the backend Phase A local startup path.
- `backend/migrations/001_phase_a_pgvector.sql:1` already defines the PostgreSQL/pgvector schema draft.
- `backend/app/main.py:1` already exposes the FastAPI app.
- `backend/app/api/routes.py:1` already exposes upload and job APIs.
- `backend/app/services/ingestion.py:1` already accepts uploads, stores document metadata, and queues ingestion.
- `backend/app/adapters/dev.py:1` already provides local development storage, repositories, queue, and keyword vector-repo smoke behavior.

## Core Answer

Do not wait until the whole system is complete before learning JVM/backend. Also do not try to learn JVM by rewriting the main backend immediately.

Best path:

```text
Build Study AI in small production-shaped backend increments
  + learn JVM/backend through targeted companion modules and load experiments
  + write what you learn into Study AI as candidate knowledge
```

This gives both real product progress and real learning. The project itself becomes the learning lab.

## Principles

1. PostgreSQL is the system of record for product data, memory, graph candidates, jobs, chunks, and vectors.
2. LearningAgent is reused through adapters, not copied into the frontend or allowed to mutate approved graph data directly.
3. Every generated knowledge item remains candidate-only until human review.
4. JVM learning should be attached to real backend problems: concurrency, transactions, queues, caching, observability, and load testing.
5. High-traffic practice should be created intentionally through test data, load generators, failure injection, and measurable SLOs.

## Architecture Decision

Use:

```text
Frontend: React + Vite graph app
Backend: FastAPI first
Database: PostgreSQL + pgvector
Storage: local adapter first, Alibaba Cloud OSS later
Queue: in-process/dev queue first, Redis/Celery/RQ or cloud queue later
Learning engine: LearningAgent adapter
JVM learning lane: separate Spring Boot companion services/labs, not main rewrite at first
```

Why PostgreSQL:

- It stores normal relational data and vector data together.
- It supports transactions for candidate review, job state, memory events, graph updates, and audit logs.
- It can run locally, on ECS, or on managed cloud database.
- It postpones dedicated vector DB complexity until the system proves it needs one.

## Long-Term Phases

### Phase 0: Current Baseline

Status: mostly done.

Current capabilities:

- React knowledge graph app.
- README architecture and PostgreSQL/pgvector planning.
- FastAPI backend foundation.
- Upload and job APIs.
- Local dev storage and in-memory adapter tests.
- PostgreSQL/pgvector migration draft.

Exit criteria:

- `npm test -- --run` passes.
- `npm run build` passes.
- `python -m compileall -q app tests` passes.
- `python -m unittest discover -s tests` passes.
- `POST /v1/uploads` returns a document and queued job.

### Phase 1: Real Ingestion Worker

Goal: uploaded materials become searchable chunks and candidate knowledge.

Implementation steps:

1. Add parser interfaces for Markdown, TXT, and PDF.
2. Add chunking service with `seq`, `start_pos`, `end_pos`, `content`, category, and tags.
3. Add worker service that moves jobs through `queued -> running -> completed/failed`.
4. Persist chunks through repository ports.
5. Generate first candidate knowledge objects from extracted material.
6. Add API endpoints for document status, job status, chunks, and candidates.

Acceptance criteria:

- Uploading a Markdown file creates a job.
- Running the worker creates chunks.
- Search over dev vector repository can return matching chunks.
- Candidate knowledge is created with `review_status = candidate`.
- Failed parse jobs record error and can be retried.

### Phase 2: PostgreSQL Persistence

Goal: replace in-memory dev state with durable PostgreSQL.

Implementation steps:

1. Add migration runner.
2. Add PostgreSQL connection settings and repository implementations.
3. Implement `DocumentRepositoryPort`.
4. Implement `QueuePort` backed by `ingestion_jobs`.
5. Implement chunk persistence in `document_chunks`.
6. Implement `KnowledgeCandidate` persistence.
7. Add transaction boundaries for upload + document creation + job creation.

Acceptance criteria:

- Backend can restart without losing documents/jobs/candidates.
- Migration applies to a fresh database.
- Upload API works against PostgreSQL repositories.
- Tests cover repository behavior against a test database or isolated integration database.

### Phase 3: pgvector Retrieval

Goal: move from keyword smoke search to real RAG retrieval.

Implementation steps:

1. Add embedding provider port.
2. Add local/simple embedding adapter for tests.
3. Add production embedding adapter later.
4. Store embeddings in `chunk_embeddings`.
5. Implement PostgreSQL full-text search over `document_chunks.search_vector`.
6. Implement pgvector similarity search.
7. Add RRF fusion for full-text + vector results.
8. Add reranker port but keep reranker optional.

Acceptance criteria:

- `POST /v1/retrieval/search` returns scored chunks.
- Full-text-only mode works when embeddings are unavailable.
- Vector mode works when embeddings exist.
- Hybrid mode records per-source scores.
- p95 retrieval latency is measured in tests or smoke benchmark.

### Phase 4: Memory System

Goal: build durable agent memory that is useful and not noisy.

Implementation steps:

1. Add memory extraction service inspired by BestCowork-GA's guard concept.
2. Add memory judgment rules: reject questions, temporary context, procedural commands, and one-off tasks.
3. Store accepted or candidate memories in `agent_memories`.
4. Store lifecycle in `memory_events`.
5. Add `memory_index` for layered memory lookup.
6. Connect LearningAgent summaries and weak concepts into candidate memories.
7. Add review UI for memories that can become graph knowledge.

Acceptance criteria:

- A stable user learning preference can become candidate memory.
- A temporary request does not become durable memory.
- Memory creation records a `memory_event`.
- Memory search can retrieve by scope/type.
- Memory never writes approved graph nodes directly.

### Phase 5: LearningAgent Integration

Goal: make LearningAgent useful to Study AI without coupling runtimes.

Implementation steps:

1. Fix or bypass known LearningAgent API blockers before relying on live endpoints.
2. Add mocked tests for `LearningAgentRestAdapter`.
3. Add endpoints for plan creation, weak concepts, and domain summary.
4. Convert LearningAgent outputs into candidate knowledge.
5. Add evidence records for every LearningAgent-derived candidate.

Acceptance criteria:

- Study AI backend can call LearningAgent locally.
- If LearningAgent is down, Study AI upload/review still works.
- LearningAgent output becomes candidate knowledge only.
- Adapter tests do not require a live LearningAgent process.

### Phase 6: Review Queue UI

Goal: make the browser app useful for actual knowledge curation.

Implementation steps:

1. Add upload center UI.
2. Add job status display.
3. Add candidate review queue.
4. Add candidate detail with evidence, source document, confidence, and proposed edges.
5. Add approve/reject/edit actions.
6. Add graph refresh from approved backend data.

Acceptance criteria:

- User can upload a document from the UI.
- User can see job state.
- User can review candidates.
- Approved candidate becomes visible in the graph.
- Rejected candidate does not pollute graph data.

### Phase 7: Public Deployment

Goal: make it a personal public website that others can access.

Implementation steps:

1. Buy a domain only after local upload/review flow works end to end.
2. Deploy frontend.
3. Deploy backend on ECS or similar low-cost server.
4. Add HTTPS through Nginx/Caddy.
5. Add PostgreSQL backup.
6. Add basic auth or invite-only login before public access.
7. Add rate limits and request size limits before allowing broad uploads.

Acceptance criteria:

- Domain resolves to HTTPS site.
- Backend health endpoint is reachable through HTTPS.
- Upload size limit works.
- Database backup exists.
- Anonymous users cannot abuse upload endpoints.

### Phase 8: Scale Practice Lab

Goal: create high-traffic problems in a controlled personal project.

Implementation steps:

1. Add synthetic data generator for documents, chunks, candidates, users, and jobs.
2. Add load tests with Locust, k6, or a Python/httpx load script.
3. Test key paths:
   - upload bursts
   - job queue backlog
   - retrieval QPS
   - candidate review list pagination
   - login/session checks when auth exists
4. Add metrics:
   - p50/p95/p99 latency
   - error rate
   - queue lag
   - worker throughput
   - DB CPU/connection count
   - slow queries
5. Intentionally create and solve failures:
   - missing DB index
   - N+1 query
   - too many DB connections
   - large upload blocking request handler
   - no pagination
   - embedding worker backlog
   - cache stampede
   - retry storm

Acceptance criteria:

- A local load test can create at least 100 concurrent users.
- The system has a baseline p95 for upload, job lookup, and retrieval.
- At least three bottlenecks are reproduced and documented as knowledge candidates.
- Every performance fix has before/after measurements.

## JVM And Backend Learning Plan

Do JVM learning alongside the project, but do it as targeted companion work.

### What Not To Do First

Do not rewrite the FastAPI backend in Java/Spring Boot now. That would slow product progress and create architecture churn before the product workflow is proven.

### What To Do Instead

Use JVM learning modules that map to real backend problems:

1. Java basics and JVM model
   - threads, heap, GC, class loading, exceptions
   - connect learning to Python/FastAPI equivalents

2. Spring Boot mini-service
   - build a small service with `/health`, `/metrics`, and one CRUD resource
   - connect it to the same PostgreSQL database in a separate schema

3. PostgreSQL from Java
   - JDBC/HikariCP
   - transactions
   - indexes
   - connection pool tuning

4. Concurrency lab
   - implement a Java worker that consumes ingestion jobs
   - compare it with Python worker behavior
   - measure throughput and failure handling

5. Observability lab
   - Micrometer metrics
   - Prometheus-style metrics endpoint
   - logs with request IDs

6. Optional later migration decision
   - if Java service proves useful, keep it as a sidecar worker
   - only consider rewriting parts of backend after Study AI has stable APIs and real bottlenecks

### Study Schedule

Weekly rhythm:

- 3 days: build Study AI feature work.
- 2 days: JVM/backend learning tied to the current feature.
- 1 day: load testing and observability.
- 1 day: write lessons into Study AI as candidate knowledge.

Example:

```text
Week feature: ingestion worker
JVM topic: thread pools and job queues
Scale lab: 500 queued jobs and worker throughput
Knowledge output: candidate node about queue backpressure
```

## How To Get Real Scale Experience In A Personal Project

You do not need thousands of real users to learn high-traffic backend problems. You need realistic failure modes.

Create them deliberately:

1. Data scale
   - generate 10k, 100k, then 1M chunks
   - measure search latency and indexing time

2. Request concurrency
   - simulate 50, 100, 300, 1000 concurrent users
   - measure p95/p99 and error rate

3. Queue pressure
   - upload many documents at once
   - worker cannot keep up
   - learn retry, backoff, queue lag, and worker scaling

4. Database pressure
   - remove an index and watch slow queries
   - add the index and measure improvement
   - tune connection pool size

5. Memory pressure
   - parse large PDFs
   - avoid reading everything into memory
   - stream or chunk work

6. Abuse pressure
   - large files
   - repeated uploads
   - too many search requests
   - add rate limits and request limits

7. Production-style incidents
   - database unavailable
   - LearningAgent unavailable
   - embedding provider slow
   - queue worker crashes
   - restart recovery

Each incident should produce:

```text
problem -> root cause -> fix -> test -> measurement -> knowledge candidate
```

## Recommended Timeline

### Month 1: Product Skeleton And PostgreSQL

- Finish ingestion worker.
- Add PostgreSQL repositories.
- Apply migration locally.
- Add upload/job/candidate APIs.
- Start JVM basics and Spring Boot health service.

### Month 2: Retrieval And Memory

- Add pgvector embeddings.
- Add full-text + vector hybrid search.
- Add memory extraction/judgment.
- Add first review queue UI.
- JVM: JDBC, transactions, HikariCP, indexes.

### Month 3: LearningAgent And Review Workflow

- Add LearningAgent mocked adapter tests.
- Add live local LearningAgent adapter.
- Convert summaries/weak concepts into candidate knowledge.
- Add approve/reject/edit UI.
- JVM: worker service prototype for ingestion jobs.

### Month 4: Deployment

- Buy domain after end-to-end local workflow works.
- Deploy frontend/backend/PostgreSQL.
- Add HTTPS, auth, backups, limits.
- JVM: observability and metrics.

### Month 5: Scale Lab

- Add load test suite.
- Add synthetic data generator.
- Run concurrency tests.
- Fix bottlenecks.
- Record every incident as Study AI knowledge.

### Month 6: Hardening And Portfolio

- Improve UI polish.
- Add docs and architecture diagrams.
- Publish selected lessons.
- Prepare resume/portfolio case study:
  - PostgreSQL/pgvector RAG system
  - upload ingestion pipeline
  - memory/candidate review system
  - load testing and incident reports
  - JVM companion worker/lab

## Acceptance Criteria

The long-term plan is successful when:

1. A user can upload AI Agent materials from the web UI.
2. The backend persists documents, chunks, jobs, candidates, and memories in PostgreSQL.
3. Retrieval uses PostgreSQL full-text plus pgvector.
4. LearningAgent contributes learning summaries through an adapter.
5. Generated knowledge remains candidate-only until review.
6. A public domain serves the frontend and backend over HTTPS.
7. Load tests can reproduce queue backlog, slow queries, and retrieval latency problems.
8. At least ten real engineering lessons are captured into Study AI from building the system.
9. JVM learning produces at least one Spring Boot service or worker connected to PostgreSQL.
10. Every major backend feature has tests and a measurable verification path.

## Risks And Mitigations

| Risk | Impact | Mitigation |
| --- | --- | --- |
| Rewriting too early in Java | Slows product and creates duplicate backend logic | Keep FastAPI main backend; use JVM as companion labs first. |
| PostgreSQL schema churn | Rework migrations and adapters | Keep repository ports stable and change implementations behind ports. |
| Agent-generated noise | Knowledge base becomes low quality | Candidate-only workflow and evidence requirements. |
| Cloud cost grows early | Budget pressure | Stay local until end-to-end workflow works; deploy small staging only after Phase 6. |
| Personal project does not see real traffic | Misses scale learning | Use synthetic load, failure injection, and incident drills. |
| LearningAgent coupling | Fragile integration | Adapter boundary, mocked tests, graceful fallback when LearningAgent is down. |
| Retrieval quality is hard to evaluate | RAG feels unreliable | Track hit rate, context precision, citation coverage, and candidate approval rate. |

## Verification Plan

Unit:

- Domain model defaults.
- Memory judgment rules.
- Chunking offsets.
- RRF fusion ordering.
- Repository contract behavior.

Integration:

- Upload -> document -> job.
- Job -> parse -> chunks.
- Chunks -> embeddings -> retrieval.
- LearningAgent adapter mocked responses -> candidates.
- Candidate approve/reject workflow.

E2E:

- Browser upload.
- Job status polling.
- Candidate review.
- Approved node appears in graph.

Performance and observability:

- p95/p99 latency for upload, job lookup, retrieval, review queue.
- Queue lag.
- Worker throughput.
- DB slow query log.
- Error rate.
- Recovery after backend restart.

## ADR

Decision:

Use PostgreSQL/pgvector as the primary database and build JVM/backend learning as a companion track while continuing the main backend in FastAPI for now.

Drivers:

- Need a deployable project soon.
- Need real backend learning, not only tutorials.
- Need memory/RAG/candidate review in one consistent product database.
- Need realistic high-concurrency practice without waiting for real users.

Alternatives considered:

1. Finish the whole system first, then learn JVM.
   - Rejected because learning becomes detached from real problems.

2. Learn JVM first, then build the system.
   - Rejected because product progress stalls and motivation may drop.

3. Rewrite backend in Spring Boot immediately.
   - Rejected because current FastAPI foundation already exists and the product workflow is not proven yet.

4. Use a dedicated vector DB immediately.
   - Rejected because PostgreSQL/pgvector is simpler, cheaper, and enough for early scale.

Why chosen:

The chosen path maximizes real project progress and learning density. PostgreSQL supports the product's relational, memory, job, audit, and vector needs. JVM learning attaches to concrete backend concerns without destabilizing the main product.

Consequences:

- FastAPI remains the main backend in the near term.
- PostgreSQL migrations and repository implementations become high priority.
- JVM work is intentionally scoped to companion services, workers, and scale labs.
- Dedicated vector databases are postponed until measurable need appears.

Follow-ups:

- Implement ingestion worker.
- Add PostgreSQL repository layer.
- Add pgvector retrieval.
- Start JVM companion lab with a Spring Boot health/metrics service.
- Add load test suite and synthetic data generator.
