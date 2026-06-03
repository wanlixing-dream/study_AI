# AI Knowledge Graph Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a polished local-first 3D AI knowledge graph app for learning and future agent-assisted updates.

**Architecture:** Vite + React renders a 3D graph from typed local data. Pure helper functions handle filtering, connection lookup, and learning path extraction so core behavior can be tested separately from the UI.

**Tech Stack:** Vite, React, TypeScript, react-force-graph-3d, three-spritetext, Vitest, Testing Library.

---

### Task 1: Project Scaffold

**Files:**
- Create: `package.json`
- Create: `index.html`
- Create: `vite.config.ts`
- Create: `tsconfig.json`
- Create: `tsconfig.node.json`

- [ ] Create a Vite React TypeScript app structure with Vitest enabled.
- [ ] Add dependencies for React, 3D graph rendering, testing, and build tooling.
- [ ] Run `npm install`.
- [ ] Commit with `chore: scaffold ai knowledge graph app`.

### Task 2: Graph Data Model

**Files:**
- Create: `src/data/knowledgeGraph.ts`
- Create: `src/lib/graph.ts`
- Create: `tests/graph.test.ts`

- [ ] Write tests for category filtering, search filtering, selected-node connections, and learning path resolution.
- [ ] Run `npm test -- --run tests/graph.test.ts` and verify the tests fail before implementation.
- [ ] Implement typed seed graph data and pure helper functions.
- [ ] Re-run the tests and verify they pass.
- [ ] Commit with `feat: add typed ai knowledge graph data`.

### Task 3: 3D Graph UI

**Files:**
- Create: `src/App.tsx`
- Create: `src/components/KnowledgeGraph3D.tsx`
- Create: `src/components/Sidebar.tsx`
- Create: `src/components/DetailPanel.tsx`
- Create: `src/styles/global.css`
- Create: `src/main.tsx`

- [ ] Render graph nodes and edges with type-based color.
- [ ] Add search, category filters, learning path selection, and node detail panel.
- [ ] Add responsive styling with a polished dark workspace.
- [ ] Run `npm run build`.
- [ ] Commit with `feat: add interactive 3d knowledge graph`.

### Task 4: Documentation and Delivery

**Files:**
- Create: `README.md`

- [ ] Document the purpose, setup commands, project structure, and future agent update flow.
- [ ] Run `npm test -- --run` and `npm run build`.
- [ ] Commit with `docs: document ai knowledge graph workflow`.

