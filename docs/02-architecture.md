# 02 · 技术架构

本篇是「读懂这套代码」的地图。基于 Quackback 的全栈 TypeScript 架构。

## 核心架构模式

- **全栈 TypeScript**：前端 React 组件和后端 Server Functions 共享同一套类型定义。
- **Domain-Driven Design (DDD)**：业务逻辑按领域（如 `posts`, `boards`, `users`）组织在 `lib/server/domains/` 下。
- **Server Functions**：TanStack Start 的特性，允许前端组件直接调用后端函数，无需手动编写 REST API 胶水代码。
- **类型安全 ORM**：使用 Drizzle ORM，Schema 定义在 `packages/db/src/schema/`，数据库迁移由 Drizzle 管理。

## 目录结构详解

### Apps 层 (`apps/web/src/`)
- `routes/`：路由层
  - `_portal/`：面向用户的前台页面（反馈列表、详情、Roadmap）
  - `admin/`：管理员后台页面
  - `__root.tsx`：根路由布局
- `components/`：UI 组件
  - `ui/`：Shadcn 基础组件库
  - `portal/`：前台业务组件
  - `admin/`：后台业务组件
- `lib/server/`：后端逻辑
  - `domains/`：核心业务领域（见下文）
  - `integrations/`：第三方系统对接
  - `policy/`：权限控制与授权策略

### Packages 层 (`packages/`)
- `db/`：数据库 Schema 和迁移
- `email/`：邮件模板
- `ids/`：TypeID 生成与验证

## 核心领域 (Domains)

| 领域目录 | 职责说明 | 关键实体 |
|---|---|---|
| `posts` | 反馈帖子的核心 CRUD、状态流转、合并 | `posts`, `postTags`, `votes` |
| `boards` | Board（板块）管理、配置、可见性 | `boards` |
| `users` / `principals` | 用户身份、角色、属性管理 | `user`, `principal` |
| `segments` | 用户分群（基于规则或手动分配） | `segments`, `userSegments` |
| `ai` | OpenAI 兼容接口调用、重试、Token 统计 | `ai_usage_log` |
| `changelog` | 更新日志发布与展示 | `changelogEntries` |
| `roadmaps` | 产品路线图管理 | `roadmaps`, `postRoadmaps` |
| `settings` | 门户配置、认证配置、品牌化配置 | `settings` (JSONB) |

## 权限与授权 (Policy)

Quackback 采用**纯函数策略模式**进行权限控制。核心逻辑在 `lib/server/policy/`：

- **Actor 模型**：所有请求被抽象为 `Actor`（包含 principalId, role, segmentIds 等）。
- **能力判断**：如 `canViewPost(actor, post, board)`，返回显式的 `Decision`（allow/deny 及原因）。
- **执行拦截**：在 Server Functions 中，调用 domain service 前必须先通过 policy 检查。

## 扩展策略与分期总览

基于 Quackback，我们获得了极高的起点（AI、Notion 集成已就绪）。工程执行重点转向定制化扩展：

| 模块 | 阶段 | 核心改动策略 | 侵入性 |
|---|---|---|---|
| Omada 品牌化 | P1 | 覆盖 `globals.css` 中的 Shadcn token，替换 Logo | 纯配置，零侵入 |
| 内部 Board 权限配置 | P1 | 配置 Segments（邮箱后缀）+ Board Access Tiers | 纯配置，零侵入 |
| 可配置表单引擎 | P1 | `packages/db` 新增 custom_fields 表；扩展 `posts` 提交逻辑 | 新增实体，中度侵入 |
| Poll 调研投票 | P2 | 新增 `polls` domain 和路由；复用 comments | 新增为主，轻度侵入 |
| 声望体系 (Karma) | P3 | 扩展 `users` / `principals` 统计字段，添加定时计算任务 | 轻度侵入 |
| 徽章体系 | P3 | 新增 `badges` domain | 新增实体，零侵入 |

### 加功能的三步套路

在 Quackback 架构下，新增一个业务功能通常需要：
1. **Schema**：在 `packages/db/src/schema/` 定义数据表，运行 `bun run db:generate` 生成迁移。
2. **Domain Service**：在 `lib/server/domains/` 创建业务逻辑（如 `xxx.service.ts`）和权限策略（`xxx.access.ts`）。
3. **Route & UI**：在 `routes/` 添加页面，在 Server Function 中调用 Domain Service。
