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

## 扩展策略与分期总览

基于 Fider fork（无 ORM / CQRS + Bus 插件式注册 / 行级多租户），**原生核心直接复用**，产品路线图保留 **P1 可配置化基座 → P2 同步与协同 → P3 用户成长 → P4 AI**，但工程执行收敛为 **P0 → P1a/P1b/P1c → P2a/P2b/P2c → P3 → P4**，避免 P1 过重。

| 模块 | 阶段 | 核心改动 | 侵入性 / merge 友好 |
|---|---|---|---|
| 可配置表单引擎 | P1 | 新增 custom_fields / post_field_values；提交页动态渲染 | 新增文件+新表，零侵入 |
| 可配置状态 + Roadmap 控制 | P1 | 状态改读配置表；posts 增列控制 roadmap 显隐 | 轻侵入（posts 加列） |
| Site 可配置能力 | P1 | 可见性 / 邮箱后缀 / 站点 URL / 自定义字段抽象为 site 级标准配置 | 纯配置，零侵入 |
| 邮箱后缀白名单自助注册 | P1 | 注册校验邮箱后缀（多值） | 新增校验，轻侵入 |
| 用户档案 · 帖子指标（基础） | P1 | users 加昵称 / 签名 / badge；posts.view_count；user_stats 基础统计 | 轻侵入（users / posts 加列） |
| Notion 同步服务 | P2 | 出站 webhook + 入站轮询 + sync_links 映射 | 新增文件+新表，零侵入 |
| Poll 调研投票 | P2 | 独立实体 + 3 表；comments 复用 | 新增为主，comments 加列（唯一侵入核心表点） |
| 声望体系（karma） | P3 | user_stats 综合计分 + 异步刷新 + 防刷 | 轻侵入（user_stats 加列） |
| 徽章 / 等级体系 | P3 | badges / user_badges / levels；按 karma 分层与激励 | 新增表，零侵入 |
| AI 能力层 | P4 | 分类 / 摘要 / 舆情；复用 Cases AI 字段 | 新增服务，异步旁路 |

### 加端点四步套路

一个请求的典型链路：`routes.go`（路由 + 中间件）→ `handler`（解析参数、派发）→ `query`/`cmd`（消息）→ `service`（bus handler 执行 SQL）。

**新增一个 API 端点** = 固定四步：
1. **定义路由**（`app/cmd/routes.go`）：挂中间件（`IsAuthenticated` / `IsAuthorized(role)`）。
2. **写 handler**（`app/handlers/`）：构造 query/cmd，`bus.Dispatch`，`c.Ok(result)`。
3. **定义 query/cmd**（`app/models/query|cmd/`）：带 `Result` 字段。
4. **实现 service**（`app/services/`）：`bus.AddHandler` 注册，内部直写 SQL。
