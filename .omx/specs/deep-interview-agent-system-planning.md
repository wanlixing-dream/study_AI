# Study AI Agent System Planning Spec

## Metadata

- Profile: standard
- Context type: brownfield
- Context snapshot: `.omx/context/agent-system-planning-20260606T191853Z.md`
- Final direction: start with Path A, design for later Path B
- Date: 2026-06-07

## Decision Summary

Start with a local-first personal knowledge system, but structure it as a cloud-ready full-stack app from the beginning. This avoids early Alibaba Cloud cost while keeping the later migration to ECS/Docker/PostgreSQL/OSS straightforward.

The key design choice is to run cloud-shaped services locally:

- Web: existing Vite/React frontend
- API: FastAPI backend
- Database: PostgreSQL + pgvector in local Docker
- Object storage: local filesystem first, MinIO optional for OSS-compatible testing
- Jobs: local worker process first, Redis/RQ or Celery later
- Agent orchestration: small typed workflow first, LangGraph later when durable multi-step state is needed

## Why A -> B Is Not Hard If Designed Correctly

A to B becomes hard when local mode uses a totally different storage model, writes files directly from frontend code, or lets agents mutate approved data without review.

A to B stays manageable when:

- All writes go through backend APIs.
- Files are stored behind a storage adapter.
- Vector search is behind a retrieval adapter.
- LLM/model calls are behind a provider adapter.
- Agent output always writes to candidate records, not approved graph records.
- Docker Compose is used locally so the cloud deployment has the same service boundaries.

## Cost Strategy

Do not start Alibaba Cloud until the local workflow proves useful.

Cloud cost begins once paid resources are created, especially ECS/RDS/OSS/networking. Alibaba Cloud ECS bills occupied compute resources even if idle for pay-as-you-go instances, and OSS bills storage, traffic, and API operations. Use local Docker and local object storage during A.

Recommended cost stages:

1. Local only: no cloud fee.
2. Local plus optional model API: only pay token/API usage if using paid providers.
3. Trial cloud: one small ECS, Docker Compose, self-hosted Postgres + pgvector, local disk or OSS.
4. Production cloud: managed RDS PostgreSQL, OSS, backups, monitoring, HTTPS, domain.

## Product Scope

### In Scope

- Upload area for AI Agent-related material.
- Parse files into structured text and metadata.
- Chunk and embed parsed text.
- Classify content into AI Agent technology categories.
- Generate candidate knowledge nodes and edges.
- Store extracted evidence, citations, source file references, and confidence.
- Human review queue before approved knowledge graph mutation.
- RAG question answering over approved knowledge and uploaded sources.
- Agent workflow for ingestion, classification, synthesis, and review preparation.
- Later Alibaba Cloud deployment.

### Out of Scope For First Version

- Multi-user SaaS.
- Team permissions.
- Fully autonomous approved-knowledge writes.
- Kubernetes/ACK.
- GPU hosting.
- Fine-tuning.
- Large-scale distributed vector database.

## Recommended Architecture

```text
React Web
  | upload / graph / review / search
FastAPI API
  | REST contracts
PostgreSQL + pgvector
  | documents, chunks, embeddings, graph nodes, candidates, audit
Local file storage or MinIO
  | original uploaded files
Worker
  | parse -> chunk -> embed -> classify -> synthesize candidate
Agent Orchestrator
  | ingestion agent, classifier agent, synthesis agent, retrieval agent
Model Provider Adapter
  | OpenAI / Qwen / local model later
```

## Upload And Parsing Flow

1. User uploads PDF, Markdown, TXT, DOCX, PPTX, HTML, or code archive.
2. Backend creates a `source_document` row with status `uploaded`.
3. File is saved to storage adapter.
4. Worker parses file using document parser.
5. Parsed text is normalized into sections.
6. Text is chunked with metadata:
   - source id
   - file path
   - page / section
   - chunk index
   - title
   - detected language
7. Embeddings are generated.
8. Chunks are written to `knowledge_chunks` with pgvector embeddings.
9. Classifier maps chunks to AI Agent categories.
10. Synthesis agent proposes candidate nodes and relationships.
11. Candidates appear in review queue.
12. Approved items update graph tables and frontend graph view.

## AI Agent Technology Classification Taxonomy

Initial categories:

- Agent Frameworks: LangGraph, CrewAI, AutoGen-style systems, OpenHands-style coding agents
- Agent Orchestration: planning, state machines, multi-agent coordination, tool routing
- RAG: indexing, chunking, retrieval, reranking, hybrid search, citation grounding
- Vector Databases: pgvector, Qdrant, Milvus, Weaviate, Chroma
- Memory: short-term memory, long-term memory, entity memory, episodic memory
- Tools And MCP: tool calling, MCP servers, API adapters, browser/code/file tools
- Evaluation: golden datasets, retrieval metrics, answer faithfulness, agent trajectory evals
- Deployment: Docker, ECS, OSS, RDS, observability, backups
- Security: API keys, access control, prompt injection, source trust
- Model Providers: OpenAI, Qwen, local models, routing and fallback
- Knowledge Graph: nodes, edges, evidence, confidence, review status

## Data Model First Cut

- `source_documents`
  - id, filename, mime_type, storage_uri, sha256, status, created_at
- `document_sections`
  - id, document_id, title, page_start, page_end, text
- `knowledge_chunks`
  - id, document_id, section_id, text, embedding, token_count, metadata
- `agent_categories`
  - id, slug, label, description
- `chunk_classifications`
  - chunk_id, category_id, confidence, rationale
- `candidate_nodes`
  - id, title, type, summary, tags, confidence, source_document_id, status
- `candidate_edges`
  - id, from_candidate_id, to_candidate_id, relation_type, rationale
- `approved_nodes`
  - mirrors current `KnowledgeNode`
- `approved_edges`
  - mirrors current `KnowledgeEdge`
- `evidence`
  - id, source_type, document_id, chunk_id, url_or_path, quote, date
- `review_audit`
  - id, reviewer, action, target_type, target_id, timestamp, diff

## Technology Stack Recommendation

### Backend

- FastAPI
- Pydantic
- SQLAlchemy or SQLModel
- Alembic
- PostgreSQL + pgvector
- pytest + httpx

### Parsing

- Docling for PDF/DOCX/structured document parsing research baseline
- Lightweight fallbacks: markdown, plain text, BeautifulSoup/readability for HTML
- Later: OCR only when needed

### RAG

- Start with a small custom retrieval layer over pgvector.
- Add LlamaIndex when ingestion/query workflows become broad enough to justify a framework.
- Use hybrid retrieval later: vector similarity + keyword/BM25.

### Agent Orchestration

- Start with explicit Python services/functions for:
  - IngestionAgent
  - ClassifierAgent
  - SynthesisAgent
  - RetrievalAgent
  - ReviewPrepAgent
- Introduce LangGraph when the workflow needs durable state, retries, pause/resume, or human-in-the-loop checkpoints.
- CrewAI can be studied as a reference for role-based multi-agent design, but should not be the first dependency unless role-playing agent teams become central.

### Vector Store

- Default: PostgreSQL + pgvector.
- Reason: easiest A -> B migration, one database for metadata + vectors, simpler backups.
- Alternative later: Qdrant if vector search becomes the central workload or needs better standalone vector operations.
- Avoid Milvus for first version unless scale demands it; it is strong but heavier.

### Cloud Deployment

Path B minimal:

- ECS instance
- Docker Compose
- Nginx or Caddy for HTTPS/reverse proxy
- Postgres + pgvector container initially
- File volume or OSS
- Domain + TLS

Path B production:

- ECS for web/API/worker
- ApsaraDB RDS PostgreSQL if pgvector support/extension policy is acceptable in chosen region, otherwise self-host Postgres
- OSS for uploaded files
- Redis for job queue
- CloudMonitor/logging
- Backup policy

## Roadmap

### Phase 0: Stabilize Current Frontend

- Keep current graph working.
- Add lazy loading/code splitting for 3D graph if bundle warning matters.
- Fix npm audit issue after checking dependency impact.

### Phase 1: Backend Contract

- Create `backend/`.
- Add FastAPI app and OpenAPI contract.
- Mirror current graph node/edge/path schemas.
- Add health endpoint.

### Phase 2: Storage And Local Compose

- Add `docker-compose.yml`.
- Add Postgres + pgvector.
- Add migration files.
- Seed current TypeScript graph data into database.
- Frontend fetches from API with fallback to local constants.

### Phase 3: Upload Center

- Add Upload page/surface in frontend.
- Add `/api/uploads`.
- Save original files.
- Track parsing status.
- Show parse progress and errors.

### Phase 4: Parsing And Chunking

- Add worker.
- Parse PDF/MD/TXT/DOCX/HTML first.
- Normalize sections and chunks.
- Store source-document evidence.

### Phase 5: Embeddings And RAG

- Add model provider config.
- Add embeddings.
- Store vectors in pgvector.
- Add `/api/search` and `/api/rag/query`.
- Return answers with citations and source chunks.

### Phase 6: Agent Classification

- Add classifier agent.
- Classify chunks into AI Agent taxonomy.
- Add synthesis agent to create candidate nodes and candidate edges.
- Never write approved graph directly.

### Phase 7: Review Queue

- Add candidate review UI.
- Approve/reject/edit candidates.
- Write audit trail.
- Approved candidates update graph tables.

### Phase 8: GitHub Research Agent

- Add curated GitHub project watchlist.
- Fetch repo metadata, README summaries, release info, and topics.
- Convert findings into candidates with web evidence.
- Keep human review gate.

### Phase 9: Alibaba Cloud Trial

- Deploy web/API/worker/database with Docker Compose on a small ECS.
- Use local disk first.
- Add backups.
- Add HTTPS/domain.
- Move files to OSS only when uploads grow or remote access is needed.

### Phase 10: Production Hardening

- Auth.
- Rate limits.
- Secret management.
- Observability.
- Backup restore tests.
- RAG evaluation set.
- Prompt-injection defense for uploaded and web content.

## GitHub Research Baseline

Use high-star projects as both learning sources and seed categories:

- LangGraph: stateful, durable, human-in-the-loop agent orchestration.
- CrewAI: role-based autonomous agent orchestration reference.
- LlamaIndex: document agent/OCR/RAG data framework reference.
- pgvector: default vector search inside PostgreSQL.
- Qdrant: stronger standalone vector database alternative.
- Milvus: large-scale cloud-native vector database reference.
- Docling: document parsing for gen-AI pipelines.
- Crawl4AI: web crawling/scraping for LLM-friendly extraction.

## Acceptance Criteria

- Windows local dev still works.
- `npm test -- --run` and `npm run build` stay green.
- Backend tests pass.
- User can upload at least Markdown/TXT/PDF.
- Parsed chunks are stored with source metadata.
- Embeddings are searchable.
- AI Agent categories are assigned with confidence.
- Candidate nodes/edges appear in review queue.
- Approved graph changes require human action.
- Local Docker Compose can start the stack.
- Cloud deployment plan does not require paid resources before the user chooses Path B.
