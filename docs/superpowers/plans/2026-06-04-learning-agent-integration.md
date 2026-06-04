# LearningAgent Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Integrate LearningAgent into the Study AI knowledge graph as a decoupled learning-engine module.

**Architecture:** Keep LearningAgent as an independent Python runtime. Represent its capabilities in the graph data and document the integration through a scientific-style architecture SVG in the README.

**Tech Stack:** React, TypeScript, local graph data, SVG documentation, Vitest.

---

### Task 1: Architecture Spec

**Files:**
- Create: `docs/superpowers/specs/2026-06-04-learning-agent-integration-design.md`
- Create: `docs/superpowers/plans/2026-06-04-learning-agent-integration.md`

- [ ] Define boundaries between `src/`, `learningAgent/`, and future adapter code.
- [ ] Commit with `docs: define learning agent integration architecture`.

### Task 2: Graph Semantics

**Files:**
- Modify: `src/data/knowledgeGraph.ts`
- Modify: `tests/graph.test.ts`

- [ ] Add LearningAgent graph nodes and relationships.
- [ ] Add tests for LearningAgent search and integration path.
- [ ] Commit with `feat: map learning agent into knowledge graph`.

### Task 3: README Figure

**Files:**
- Create: `docs/images/fig7-learning-agent-integration.svg`
- Modify: `README.md`

- [ ] Add a scientific-style SVG integration diagram.
- [ ] Reference the diagram in README.
- [ ] Commit with `docs: add learning agent integration diagram`.

