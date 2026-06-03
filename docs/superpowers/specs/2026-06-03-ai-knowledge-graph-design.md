# AI Knowledge Graph Design

## Goal

Build a local-first AI application knowledge graph for learning, technical selection, and future agent-assisted updates.

## Product Shape

The first version is a Vite + React web app with a 3D graph as the primary workspace. It prioritizes learning clarity over visual spectacle while still providing a polished, spatial interface: users can rotate, zoom, drag nodes, click a node to inspect details, filter by category, and follow curated learning paths.

## Information Architecture

Knowledge is represented as typed graph data:

- `company`: AI vendors and labs.
- `model`: foundation models and model families.
- `technique`: application and agent technologies.
- `scenario`: enterprise use cases.
- `engineering`: production engineering, operations, testing, deployment, cost, and security.

Each node includes title, summary, tags, sources, review status, learning status, and update metadata. Each edge includes a relationship label and an explanation so the graph remains useful for study instead of becoming a decorative network.

## Interface

The app has four main regions:

- Left rail: search, category filters, and learning path selection.
- Center: interactive 3D node-link graph.
- Right panel: selected node details, tags, sources, status, and directly connected concepts.
- Header: project identity and high-level counters.

## Agent Update Readiness

V1 does not automate web crawling. It reserves fields for future agent workflows: `source`, `confidence`, `reviewStatus`, and `updatedAt`. Future agents can propose candidate nodes and relationships, but human approval remains required before graph insertion.

## V1 Scope

V1 includes seed data across companies, models, techniques, scenarios, and engineering practices; graph filtering; node selection; connected-node inspection; curated learning paths; tests for graph helpers; and a production build.

