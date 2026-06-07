# Study AI Module Execution Context

## Task Statement

把 Study AI 规划成多个长期稳定的模块，明确每个模块要做什么、对全局系统的作用、验收方式和执行顺序，并开始按模块执行，避免后续开发时上下文丢失。

## Desired Outcome

- 项目有一个可追踪的模块任务地图。
- 每个子任务都能说明它服务于哪个全局能力。
- 后续执行按模块推进，而不是零散修改。
- Ralph 执行有 PRD、测试规格和进度台账作为上下文锚点。
- 先从一个低风险、能补齐现有后端契约的模块任务开始执行。

## Known Facts And Evidence

- 项目路径: `C:\Users\WU\Desktop\1\study_AI`
- 当前主分支已与远程同步，`.omx/` 为未跟踪本地规划目录。
- 前端是 React/Vite 3D knowledge graph。
- 后端已有 FastAPI Phase A 基础。
- 已有接口:
  - `GET /health`
  - `GET /v1/health`
  - `POST /v1/uploads`
  - `GET /v1/jobs/{job_id}`
- 已有 PostgreSQL/pgvector migration draft: `backend/migrations/001_phase_a_pgvector.sql`
- 后端当前仍使用 local file storage + in-memory repositories。
- 用户希望 PostgreSQL 作为主数据库，并在项目中同步学习 JVM/后端高并发知识。

## Constraints

- 采用 PostgreSQL + pgvector 作为长期主库方向。
- LearningAgent 通过 adapter 复用，不能把旧项目代码直接混进 React 前端。
- 先做可上线项目结构，再逐步接入云服务和高并发训练。
- 任务要模块化、可验收、可恢复上下文。
- 不做破坏性 git 操作。

## Unknowns / Open Questions

- PostgreSQL 本机服务是否已经安装并可用。
- 后续生产环境具体选择 Alibaba Cloud RDS PostgreSQL 还是 ECS 自建 PostgreSQL。
- 具体 embedding 模型、LLM provider、认证方式后续再定。

## Likely Codebase Touchpoints

- `README.md`
- `docs/architecture/module-task-map.md`
- `backend/README.md`
- `backend/app/api/routes.py`
- `backend/app/dependencies.py`
- `backend/app/domain/models.py`
- `backend/app/ports.py`
- `backend/app/adapters/dev.py`
- `backend/app/services/ingestion.py`
- `backend/tests/`
- `backend/migrations/`
- `src/` frontend upload center and graph review UI in later modules
