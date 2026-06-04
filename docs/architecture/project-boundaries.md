# Study AI Project Boundaries

This document preserves the core project intent and module boundaries so future work does not lose context.

## Product Goal

Study AI is a personal AI industry and engineering knowledge system. It should connect abstract AI concepts with real project experience, current AI Agent research, and human-reviewed learning notes.

The system must support:

- A 3D knowledge graph for browsing concepts and project lessons.
- Rich node details that explain problems, root causes, solutions, evidence, and reusable engineering patterns.
- Git-history analysis across the user's projects.
- Future web research about AI Agent, RAG, MCP, model selection, deployment, evaluation, and operations.
- Human approval before any agent-generated knowledge enters the personal knowledge base.

## Current Main Project

Path: `/Users/wlx/Desktop/wlx/study_AI`

Responsibilities:

- Render the 3D knowledge graph.
- Store approved local graph data for V1.
- Show rich details for each node.
- Show project retrospectives and LearningAgent architecture in the graph.
- Provide the future review queue surface.

Non-responsibilities:

- Running long-lived Python agent loops inside the React frontend.
- Automatically mutating the approved graph without human review.
- Hiding evidence behind opaque LLM summaries.

## Source Projects To Analyze

### BestCowork-GA

Path: `/Users/wlx/Desktop/wlx/BestCowork-GA`

Main knowledge themes:

- Skill Builder and Skill lifecycle.
- Group chat agents, room isolation, presence, and message routing.
- Agent memory, worker memory inheritance, and summaries.
- LAN DEP discovery, model routing, local model behavior, and runtime packaging.
- Regression tests for agent/chat behavior.

### BestDEP-Lib

Path: `/Users/wlx/Desktop/wlx/BestDEP-Lib`

Main knowledge themes:

- Enterprise auth, departments, roles, permissions, and OAuth-like flows.
- Knowledge base access, SSO, per-user tokens, and tiered permissions.
- Wiki/help-center CRUD, soft delete, uploads, and seed data.
- Model gateway, Hermes, OpenClaw, MCP-like integration points.
- Deployment hardening, health checks, high-concurrency load, clean deploy seeds.

### learningAgent

Path: `/Users/wlx/Desktop/wlx/learningAgent`

Main knowledge themes:

- Personalized learning agent.
- Hybrid RAG: dense embeddings plus BM25 retrieval.
- Multi-scope memory, entity extraction, recency, and fallback retrieval.
- Mastery tracking, weak concepts, spaced review, and adaptive learning.
- MCP server, REST API, tracing, and deterministic evaluation.

Boundary:

- Keep this as an independent Python learning engine.
- Connect it through REST/MCP/adapters, not by merging Python internals into the React graph app.

### BestCowork

Path: `/Users/wlx/Desktop/wlx/BestCowork`

Main knowledge themes:

- Earlier enterprise cowork application.
- Browser automation, AI classroom, PPT/Office runtime, task decomposition.
- Goal management, digital employees, skill groups, user management.
- Development versus production packaging issues.

## Future Analysis Pipeline

The future automatic analysis system should be split into these units:

1. **Source Collector**
   - Reads git logs, diffs, file trees, and selected source files.
   - Accepts uploaded code archives in later versions.

2. **Project Analyzer**
   - Clusters commits into engineering problems.
   - Detects repeated patterns such as state sync, auth, deployment, RAG, memory, and evaluation.

3. **Web Research Agent**
   - Searches current AI Agent and infrastructure references.
   - Prefers official docs and primary sources.
   - Adds citations and timestamps.

4. **Synthesis Agent**
   - Produces structured candidate knowledge:
     - problem
     - root cause
     - solution
     - reusable lesson
     - related AI concepts
     - evidence
     - confidence

5. **Review Queue**
   - Stores candidates separately from approved graph data.
   - Allows approve, reject, or edit.
   - Only approved items are written into the personal knowledge graph.

6. **Graph Mapper**
   - Converts approved knowledge into nodes and edges.
   - Keeps evidence and source traceability attached.

## Data Boundary

Approved knowledge and candidate knowledge must stay separate.

```text
knowledge/
├── approved/       # reviewed personal knowledge
├── candidates/     # agent-generated drafts waiting for approval
└── sources/        # git/web evidence records
```

V1 can keep data in TypeScript/JSON files. Later versions can move to SQLite, a graph database, or a document store after the workflow stabilizes.

## Review Invariant

No automated agent may directly write approved knowledge.

Every generated insight must pass through:

```text
collect evidence -> synthesize candidate -> human review -> approved graph update
```

## UI Boundary

The frontend should have three distinct surfaces:

- **Graph Map:** spatial overview of concepts and relationships.
- **Detail Drawer:** selected node detail with problem, root cause, solution, and evidence.
- **Review Queue:** candidate knowledge waiting for approval.

These surfaces should share data contracts but not hide review state.

## Implementation Order

1. Fix rich details for clicked nodes.
2. Add candidate knowledge data contracts.
3. Add review queue UI with static candidates.
4. Add local git analyzer.
5. Add configurable model API.
6. Add web research agent.
7. Add approval-to-graph writeback.

