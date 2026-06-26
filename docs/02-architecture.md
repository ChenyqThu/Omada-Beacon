# 02 · 技术架构

本篇是「读懂这套代码」的地图。详细的代码范式与示例见仓库根目录 `CLAUDE.md`，本篇做架构层面的提炼。

## 后端（Go）

- **CQRS**：命令（写）与查询（读）分离 —— `cmd.*`（写）与 `query.*`（读）走不同路径。
- **Bus 系统**：依赖注入 + 服务分发。Handler 通过 `bus.Dispatch(ctx, msg)` 派发，service 在 `Init()` 里用 `bus.AddHandler` 注册。
- **无 ORM**：直接写 SQL（`trx.Select` / `trx.Execute`），不引入 ORM 抽象。
- **中间件链**：认证、租户解析（tenant resolution）、CORS 等通过路由挂载。
- 需 **Go 1.22+**。

## 前端（React）

- **SSR + hydration**：服务端渲染 + React 18 客户端注水。
- **代码分割**：页面组件懒加载。
- **i18n**：LinguiJS。
- **类型安全**：全量 TypeScript。
- 样式 **SCSS**（BEM + utility classes），**未用 Tailwind**——改样式优先复用 `public/assets/styles/utility/` 下的 utility 类。

## 多租户

内置多租户能力，通过 **tenant resolution 中间件** 在请求入口解析当前租户。这正是契合 Omada 多产品线的关键——一套实例按产品线分租户运营。

## 模型分层（`app/models/`）

严格的命名前缀，各司其职：

| 前缀 | 含义 | 场景 |
|---|---|---|
| `entity.*` | 数据库表实体 | `entity.User`、`entity.Post` |
| `action.*` | POST/PUT/PATCH 的用户输入 | 与 command 1:1 映射 |
| `cmd.*` | 要执行的命令（可能有返回值） | `cmd.SendEmail` |
| `query.*` | 数据查询 | `query.GetPostByID` |
| `dto.*` | 包间数据传输 | `dto.PostInfo` |

## 仓库结构速查

**后端**
- `app/handlers/` — HTTP 处理器
- `app/services/` — 业务逻辑与外部集成（bus handler 在各 service 的 `Init()` 注册）
- `app/models/` — `entity` / `action` / `cmd` / `query` / `dto` 严格分层
- `app/pkg/bus/` — 服务注册与分发系统
- `app/cmd/routes.go` — **所有 HTTP 路由集中定义**（追踪请求从这里开始）
- `migrations/` — 数据库迁移（仅 up migration，命名 `YYYYMMDDHHMMSS_desc.sql`）

**前端**
- `public/pages/` — 页面组件（懒加载）
- `public/components/` — 复用 UI 组件
- `public/services/` — 客户端服务与 API 调用
- `public/hooks/` — 自定义 React hooks
- `public/assets/styles/` — SCSS 样式

## 请求流 & 加端点四步套路

一个请求的典型链路：`routes.go`（路由 + 中间件）→ `handler`（解析参数、派发）→ `query`/`cmd`（消息）→ `service`（bus handler 执行 SQL）。

**新增一个 API 端点** = 固定四步：
1. **定义路由**（`app/cmd/routes.go`）：挂中间件（`IsAuthenticated` / `IsAuthorized(role)`）。
2. **写 handler**（`app/handlers/`）：构造 query/cmd，`bus.Dispatch`，`c.Ok(result)`。
3. **定义 query/cmd**（`app/models/query|cmd/`）：带 `Result` 字段。
4. **实现 service**（`app/services/`）：`bus.AddHandler` 注册，内部直写 SQL。

> 代码示例（含前端 `http.get` 调用、CSS BEM 约定、迁移写法）详见根目录 `CLAUDE.md`。
