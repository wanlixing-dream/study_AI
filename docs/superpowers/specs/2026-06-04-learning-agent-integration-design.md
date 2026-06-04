# LearningAgent Integration Design

## Goal

Connect the existing `learningAgent/` project to the Study AI knowledge graph without merging its Python runtime into the React graph app.

## Integration Principle

The integration uses a decoupled workspace architecture:

- `src/` remains the 3D knowledge graph frontend and local graph data layer.
- `learningAgent/` remains an independent Python learning engine with CLI, REST API, MCP server, RAG, memory, mastery tracking, and tracing.
- Future `integrations/learning-agent/` code should act as an adapter layer. It may read stable public outputs from LearningAgent or call its REST/MCP interfaces, but it should not import private Python internals into the frontend.

## Boundaries

### Study AI Knowledge Graph

Responsibilities:

- Visualize AI concepts, engineering lessons, and learning-system architecture as graph nodes.
- Provide a map of how LearningAgent relates to RAG, MCP, memory, evaluation, and agent workflows.
- Keep the graph usable even when the Python LearningAgent service is not running.

Non-responsibilities:

- Running Python agent loops inside the React app.
- Owning LearningAgent storage, vector indexes, mastery files, or trace logs.

### LearningAgent

Responsibilities:

- Create learning plans.
- Add knowledge notes.
- Run adaptive learning and quiz workflows.
- Manage RAG, memory retrieval, mastery tracking, and observability.
- Expose capabilities through CLI, REST API, and MCP server.

Non-responsibilities:

- Owning Study AI graph visualization.
- Mutating the knowledge graph directly without a review or adapter boundary.

### Adapter Layer

Responsibilities:

- Translate LearningAgent capabilities into graph nodes, relationships, and future approved updates.
- Call LearningAgent REST or MCP interfaces when runtime integration is added.
- Keep contracts stable and small.

Non-responsibilities:

- Reimplementing LearningAgent core logic.
- Coupling the React frontend to Python file layouts.

## V1 Scope

V1 is architecture-level integration:

- Add graph nodes for LearningAgent and its major capabilities.
- Link those nodes to existing concepts such as RAG, MCP, Agent Workflow, Evaluation, Embedding, and Vector Database.
- Add a README architecture figure in a scientific paper style.
- Keep LearningAgent as an unmerged module boundary.

## Later Runtime Integration

Future phases can add:

- A `LearningAgent` sidebar panel that opens its dashboard or REST endpoint.
- A candidate-update queue where LearningAgent summaries can propose graph nodes.
- MCP client support so the graph app can request learning summaries through standardized tools.
- Contract tests for adapter responses.

