# Deep Interview Summary: Agent System Planning

## Round 0: Preflight

Inspected current project structure, README, `.omx/ultragoal`, and architecture docs.

Findings:

- Current project is a Vite + React + TypeScript AI knowledge graph frontend.
- Windows local verification succeeded after `npm ci`.
- Tests passed: `npm test -- --run`.
- Build passed: `npm run build`.
- Dev server responded at `http://127.0.0.1:5173/`.
- Existing docs require LearningAgent/Python runtime to stay decoupled behind REST/MCP/adapters.
- Existing invariant requires all agent-generated knowledge to pass human review before entering approved graph data.

## Round 1: Product Path

Question:

Should first version be local-first personal system, cloud-ready personal service, SaaS platform, or developer agent workbench?

Answer synthesis:

- User prefers starting with Path A to save money, then moving to Path B later.
- User wants to understand whether A -> B is difficult.
- User wants an upload area where documents can be parsed, AI Agent-related technology stack extracted/classified, and written into the knowledge base.
- User also wants GitHub high-star project research incorporated into the plan.

## Crystallized Direction

Start local-first, but use cloud-shaped service boundaries:

- React frontend
- FastAPI backend
- PostgreSQL + pgvector locally through Docker
- Upload/document parsing pipeline
- RAG retrieval layer
- Agent classification and synthesis pipeline
- Candidate review queue
- Alibaba Cloud deployment later

## Pressure Pass

Assumption challenged: starting local-first might make cloud migration hard.

Resolution:

It is not hard if storage, retrieval, model calls, file storage, and agent writes are behind adapters and APIs from the beginning. It becomes hard only if local mode bypasses backend APIs or stores everything in frontend constants/files with no migration boundary.

## Resulting Spec

See `.omx/specs/deep-interview-agent-system-planning.md`.
