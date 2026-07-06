# 01 · 项目总览

## 概述

Omada Beacon 是基于开源项目 **Fider**(AGPL-3.0) 改造的 **Omada 多产品线内部产品反馈 / 需求采集平台**，内部自部署自用。

目标是让 Fider 承担「反馈采集 + 投票 + 评论 + 多租户 + 权限」这层通用基建，把研发精力集中投入到 Fider 原生不具备、且构成我们差异化价值的能力上——**AI 舆情 / 分类 / 摘要，以及与 Notion 需求池 / 标案池的双向同步**。

平台面向 Omada 各产品线（Controller / Fusion / VIGI / MSP 等），每条产品线以独立的反馈站点（site）运营，站点之间数据与用户相互隔离。

> 🏷️ **命名约束**: 仅**展示名**由 Fider 改为 **Omada Beacon**；Go module path 保留 `github.com/getfider/fider`（约 302 处 import 不动），严格区分「上游 Fider」与「本产品」，禁止全局替换。

## 目标

### 短期目标
- 本地跑通 Fider fork，验证多租户、OAuth / 企业 SSO、中英双语、公开/私有站点等核心能力
- 完成品牌化定制，按产品线建立独立反馈站点，支持内部试用
- 明确并落地身份与权限体系，满足「内部建站 + 访客提反馈 + 官方答复」闭环

### 长期目标
- 打通反馈数据与 Notion（需求池 / 标案池）双向同步，形成「外部反馈 → 内部需求」的自动流转
- 叠加 AI 能力层：反馈自动分类 / 摘要 / 舆情聚合，构建差异化的产品反馈中枢
- 沉淀为可迁移的内部产品运营方法论与工具资产

## 核心系统与技术栈

| 层 | 技术 | 说明 |
|---|---|---|
| 后端 | Go (CQRS + Bus，无 ORM，直写 SQL) | 需 Go 1.22+；`app/cmd/routes.go` 集中定义路由 |
| 前端 | React 18 + TypeScript (SSR + hydration) | 懒加载代码分割，全量 TS 类型；需 Node 21/22 |
| 国际化 | LinguiJS | 中英双语开箱即用 |
| 样式 | SCSS (BEM + 自建 utility，**无 Tailwind**) | 改样式优先复用 utility 类 |
| 数据库 | PostgreSQL 12+ | 编号 SQL 迁移文件，`make migrate` 执行 |
| 构建 | esbuild + webpack + Makefile | `make watch` / `make build` / `make lint` / `make test` |

## 仓库分层（源码导航）

- `app/handlers/` — HTTP 处理器 ｜ `app/services/` — 业务逻辑 ｜ `app/models/`（`entity` / `action` / `cmd` / `query` / `dto` 严格分层）
- `app/cmd/routes.go` — 所有路由集中定义（追踪请求入口）
- `migrations/` — 数据库迁移（仅 up migration，命名 `YYYYMMDDHHMMSS_desc.sql`）
- `public/pages/` — 页面组件 ｜ `public/components/` — 复用组件 ｜ `public/assets/styles/` — 样式

## 多租户架构核心

- **一个 site 完全等价于一个 tenant**。每个 tenant 拥有独立的：用户表、站点设置、品牌化、OAuth 配置、标签、隐私策略、posts / votes / comments。
- **子域名区分**：多租户模式下，每个 tenant 通过子域名区分（如 `controller.beacon.example.com`）。
- **逻辑隔离**：共享数据库 + 共享 schema + 行级租户隔离（每张表带 `tenant_id`）。靠 tenant 中间件在查询层按 `tenant_id` 过滤。

## 身份与权限体系

三级角色（按 site 隔离）：
1. **Visitor（访客）**：提反馈 / 投票 / 评论讨论
2. **Collaborator（协作者）**：改 ticket 状态 / 以官方身份回复（Response）/ 编辑 post / 管理标签
3. **Administrator（管理员）**：管理成员、分配角色、改 site 设置 / OAuth / 隐私、删除

> 🎯 **平台层 Owner/SuperAdmin 与 Site Admin 分离**：Site Administrator 只是「某个具体 site 的最高权限」，不能创建 site、删除 site、跨 site 查看数据或管理其他 site。Site 创建 / 管理 / 删除属于平台层 Owner/SuperAdmin 权限。
