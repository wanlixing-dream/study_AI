# Deep Interview Context Snapshot: Agent System Planning

## Task Statement

User asked to inspect `C:\Users\WU\Desktop\1\study_AI`, confirm whether it can start on Windows, analyze README and `.omx`, and produce a complete project plan for evolving the project into an agent system with backend, RAG, vector database, and cloud deployment such as Alibaba Cloud.

## Desired Outcome

A complete project planning artifact that respects the existing Study AI knowledge graph boundaries and extends them toward a backend/RAG/agent system architecture.

## Stated Solution

Add backend capabilities, RAG, vector database, agent workflow, data storage later, and deployment to cloud servers such as Alibaba Cloud.

## Probable Intent Hypothesis

The user likely wants to turn the current static/local-first AI knowledge graph into a production-capable personal AI learning and knowledge-management platform. The system should ingest future data, retrieve and synthesize knowledge through agents, preserve human review, and be deployable beyond the local machine.

## Known Facts / Evidence

- Project is a Vite + React + TypeScript app with `react-force-graph-3d`, Three.js, Vitest, and local TypeScript graph data.
- README describes a local-first AI application knowledge graph with 3D graph, filters, learning paths, detail panel, typed local data, and future agent-assisted updates.
- README states `learningAgent/` should be an independent Python learning engine connected through REST/MCP adapter boundaries.
- `docs/architecture/project-boundaries.md` defines Study AI as a personal AI industry and engineering knowledge system.
- Existing boundaries require approved knowledge and candidate knowledge to remain separate.
- Existing review invariant: no automated agent may directly write approved knowledge; generated insight must pass collect evidence -> synthesize candidate -> human review -> approved graph update.
- Existing `.omx/ultragoal/goals.json` already plans FastAPI backend, SQLite seed, frontend API adapter, review queue, candidate write API/audit, git analyzer, web research agent, LearningAgent adapter, docker-compose deployment, and e2e tests.
- Current repo does not yet contain backend source files, `learningAgent/`, or `integrations/`; they are planned/reserved boundaries.
- Windows verification performed:
  - `node --version` returned `v24.13.0`.
  - `npm --version` returned `11.6.2`.
  - `npm ci` succeeded.
  - `npm test -- --run` passed: 1 test file, 10 tests.
  - `npm run build` passed.
  - Vite dev server started at `http://127.0.0.1:5173/` and returned HTTP 200.
- npm audit reported 1 critical severity vulnerability after dependency install; no forced fix was applied.
- Vite build warned that the main JS chunk is larger than 500 kB after minification, likely due to 3D/Three dependencies.

## Constraints

- Deep-interview mode should clarify requirements and produce planning/spec artifacts, not implement directly.
- Keep frontend decoupled from Python and long-lived agent loops.
- Preserve human review before approved knowledge mutation.
- Avoid automatic direct writes from agents to approved graph data.
- Windows local development must remain viable.
- Cloud deployment should be planned but not assumed to require one exact provider unless user chooses.

## Unknowns / Open Questions

- Primary product mode: personal local-first knowledge system, multi-user SaaS-style knowledge platform, or developer-facing agent workbench.
- Whether RAG should primarily serve the Study AI graph, LearningAgent tutoring, code/project retrospectives, or all of these.
- Whether initial backend should use SQLite/PostgreSQL, and whether vector storage should be embedded/local or managed/cloud.
- Whether Alibaba Cloud is a hard requirement or one target among several.
- Which model providers should be supported first.
- Whether the user wants a full production roadmap only, or an implementation-ready sprint plan that rewrites `.omx/ultragoal`.

## Decision-Boundary Unknowns

- Can the agent choose backend framework and storage defaults without further approval?
- Can the plan recommend PostgreSQL + pgvector as the production baseline, with SQLite/local fallback?
- Can the plan treat Alibaba Cloud deployment as ECS/Docker-first instead of adopting managed ACK/Kubernetes immediately?
- Can the plan preserve the existing human-review invariant as non-negotiable?

## Likely Codebase Touchpoints

- `README.md`
- `.omx/ultragoal/brief.md`
- `.omx/ultragoal/goals.json`
- `docs/architecture/project-boundaries.md`
- `docs/superpowers/plans/*.md`
- `docs/superpowers/specs/*.md`
- Future: `backend/`, `integrations/`, `knowledge/`, `docker-compose.yml`, deployment docs.

## Relevant Repo Docs / Rules / Context Inspected

- `C:\Users\WU\Desktop\1\AGENTS.md` from user prompt.
- `README.md`
- `package.json`
- `.omx/ultragoal/brief.md`
- `.omx/ultragoal/goals.json`
- `docs/architecture/project-boundaries.md`
- `docs/superpowers/plans/2026-06-03-ai-knowledge-graph.md`
- `docs/superpowers/plans/2026-06-04-learning-agent-integration.md`
- `docs/superpowers/specs/2026-06-04-learning-agent-integration-design.md`

## Terminology / Doc-Code Conflicts Found

- README and docs mention `learningAgent/` and `integrations/`, but those directories are not present in the current repository.
- README project structure mentions future boundaries that are planned rather than implemented.
- Existing `.omx` plan covers backend and web research but does not yet explicitly define RAG/vector database/cloud production architecture.

## Prompt-Safe Initial-Context Summary Status

not_needed
