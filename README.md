# Study AI Knowledge Graph

A local-first AI application knowledge graph for building a connected understanding of AI vendors, foundation models, agent technologies, enterprise use cases, and engineering practice.

## What This V1 Includes

- 3D rotatable, zoomable, draggable node-link graph.
- Search and category filters for companies, models, techniques, scenarios, and engineering topics.
- Learning paths for enterprise RAG, agent internship fundamentals, and model selection.
- Node detail panel with summary, tags, confidence, review status, sources, and relationship explanations.
- Typed local graph data designed for future agent-assisted updates.
- Project retrospective case studies extracted from BestCowork-GA and BestDEP-Lib git history.

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
