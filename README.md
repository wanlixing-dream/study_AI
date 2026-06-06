# Study AI Knowledge Graph

A local-first AI application knowledge graph for building a connected understanding of AI vendors, foundation models, agent technologies, enterprise use cases, and engineering practice.

## What This V1 Includes

- 3D rotatable, zoomable, draggable node-link graph.
- Search and category filters for companies, models, techniques, scenarios, and engineering topics.
- Learning paths for enterprise RAG, agent internship fundamentals, and model selection.
- Node detail panel with summary, tags, confidence, review status, sources, and relationship explanations.
- Typed local graph data designed for future agent-assisted updates.
- Project retrospective case studies extracted from BestCowork-GA and BestDEP-Lib git history.
- Decoupled LearningAgent integration map for the previous personalized learning agent project.

## LearningAgent Integration Architecture

`learningAgent/` is treated as an independent Python learning engine, not as code mixed into the React graph frontend. The graph records its capabilities and future integration contracts while keeping runtime coupling behind REST/MCP adapter boundaries.

<p align="center">
  <img src="docs/images/fig7-learning-agent-integration.svg" alt="Fig 7. Decoupled LearningAgent Integration Architecture" width="100%"/>
</p>

## LearningAgent Reuse And Production Plan

The existing sibling project at `../learningAgent` is reusable as a learning-agent domain engine, but it should not be copied into this frontend or deployed as-is. The reusable parts are learning-plan generation, adaptive learning sessions, quiz/mastery tracking, memory retrieval, RAG primitives, tracing/evaluation, and MCP wrappers. The production risks are local JSONL/Markdown/Chroma persistence, global API singletons, no auth/rate limit/worker queue, and a current API syntax blocker in `learningAgent/api/server.py`.

Study AI should integrate it through a backend adapter:

```text
Study AI React graph
  -> Study AI FastAPI backend
  -> LearningAgent REST/MCP adapter
  -> LearningAgent service
  -> PostgreSQL + pgvector / object storage / worker queue
```

Production planning docs:

- [LearningAgent production reuse plan](docs/architecture/learning-agent-production-reuse.md)
- [Production target architecture](docs/images/fig8-learningagent-production-architecture.svg)
- [High-concurrency ingestion flow](docs/images/fig9-high-concurrency-learning-flow.svg)
- [Module boundary map](docs/images/fig10-learningagent-module-boundaries.svg)

## Run Locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite.

## Verify

```bash
npm test -- --run
npm run build
```

## Project Structure

```text
src/data/knowledgeGraph.ts   Seed AI knowledge graph nodes, edges, and learning paths
src/lib/graph.ts             Pure graph helper functions
src/components/              Sidebar, 3D graph, and detail panel
src/styles/global.css        App styling
tests/graph.test.ts          Core graph behavior tests
docs/superpowers/            Design and implementation plan
learningAgent/               Independent Python learning engine: RAG, memory, MCP, API
integrations/                Reserved adapter boundary for future runtime coupling
```

## Future Agent Update Flow

The current data model already includes `source`, `confidence`, `reviewStatus`, and `updatedAt`.

A future agent workflow can:

1. Search trusted sources for new AI model, vendor, technique, and engineering updates.
2. Generate candidate nodes and relationships.
3. Mark them as `candidate` or `needs-review`.
4. Show the proposed change in an approval queue.
5. Write approved updates back into the graph data.

Human review remains the gate before the knowledge graph changes.

## Project Retrospectives

The graph includes a `case-study` layer for real engineering lessons. Current examples come from:

- `BestCowork-GA`: Skill Builder state bugs, skill lifecycle cleanup, group chat room isolation, agent memory, LAN DEP discovery.
- `BestDEP-Lib`: startup health-check hangs, high-concurrency CPU pressure, clean-deploy seed databases, Wiki soft-delete recreation, skill permission alignment.
