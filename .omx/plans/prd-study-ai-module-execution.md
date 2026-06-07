# PRD: Study AI Modular Execution System

## Objective

把 Study AI 从“已有 demo + 若干规划”推进成一个可以持续开发、可部署、可扩展、可复用 LearningAgent 的模块化 Agent 系统。每个模块都必须说明全局作用、输入输出、交付物、验收标准和依赖关系。

## Product Direction

Study AI 是个人优先、未来可公开访问的 AI Agent 技术学习与知识库系统。它需要支持上传资料、解析资料、分类 AI Agent 技术栈、写入 PostgreSQL/pgvector 知识库、生成候选知识节点、人工审核、接入 LearningAgent，并通过压测和故障演练学习真实后端问题。

## Module List

| ID | Module | Global Role | First Deliverable |
| --- | --- | --- | --- |
| M0 | Project Execution Memory | 保存全局结构、任务拆分、验收标准，防止上下文丢失 | 模块任务地图、PRD、测试规格、进度台账 |
| M1 | Backend API Contracts | 给前端、worker、数据库 repository、LearningAgent adapter 提供稳定 HTTP 边界 | 上传/文档/任务 API |
| M2 | PostgreSQL Persistence | 把 demo 内存状态升级为可部署、可恢复的系统状态 | repositories + migrations + integration tests |
| M3 | Ingestion Worker | 把上传文件转成可检索 chunk 和候选知识 | parse/chunk/classify/embed/job lifecycle |
| M4 | Retrieval And RAG | 用 pgvector + text search 支撑问答和学习检索 | hybrid search + RRF + retrieval API |
| M5 | Memory System | 管理长期记忆、学习状态、候选记忆和审核 | memory event log + memory review workflow |
| M6 | LearningAgent Adapter | 复用旧学习 Agent 能力，保持服务边界解耦 | REST/MCP adapter + contract tests |
| M7 | Candidate Review And Graph Writeback | 防止 AI 直接污染正式知识库 | candidate queue + approve/reject + graph update |
| M8 | Frontend Workflows | 让用户真正使用上传、检索、审核和图谱 | upload center + job status + review UI |
| M9 | Deployment And Ops | 支撑公网访问、域名、日志、备份、监控 | local Docker -> cloud deploy plan |
| M10 | Scale Practice Lab | 主动制造高并发、慢 SQL、队列堆积等实战问题 | load test scripts + incident playbooks |
| M11 | JVM Companion Learning | 通过 Java/Spring Boot 小模块学习后端底层能力 | JVM labs tied to Study AI backend problems |

## User Stories

### US-001: 模块上下文不丢失

As the project owner, I want every major module to have a stable task description, so that future implementation does not depend on remembering chat history.

Acceptance criteria:
- A tracked module roadmap exists in `docs/architecture/`.
- Ralph planning artifacts exist under `.omx/`.
- Each module has global role, deliverables, dependencies, verification, and next actions.

### US-002: 上传后的文档可以被查询

As the frontend and future upload center, I want to fetch uploaded document metadata by ID, so that the UI can render upload result and later poll processing status.

Acceptance criteria:
- `GET /v1/uploads/{document_id}` exists.
- Missing document returns 404.
- Backend tests cover success and missing cases.

### US-003: 后续模块可以按顺序执行

As the developer, I want a progress ledger, so that each execution can pick the next module without re-planning from zero.

Acceptance criteria:
- Progress ledger lists M0-M11.
- Completed items are marked with evidence.
- Next executable module is clear.

## Current Sprint

1. Finish M0 planning artifacts.
2. Start M1 by adding `GET /v1/uploads/{document_id}`.
3. Pin M1 error behavior with missing upload and missing job tests.
4. Verify backend tests.
5. Leave candidate review endpoints to M7 instead of mixing them into M1.

## Out Of Scope For Current Sprint

- Live PostgreSQL repository implementation.
- Candidate review endpoints.
- Cloud deployment.
- JVM service rewrite.
- Production auth.
- Embedding provider selection.
