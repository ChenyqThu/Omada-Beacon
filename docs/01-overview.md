# 01 · 项目总览

## 概述

Omada Beacon 是基于开源项目 **Quackback** (AGPL-3.0) 改造的 **Omada 多产品线内部产品反馈 / 需求采集平台**，内部自部署自用。

目标是让 Quackback 承担「反馈采集 + 投票 + 评论 + Board 权限隔离 + AI 摘要 + Notion 集成」这层通用基建，把研发精力集中投入到定制化需求上——**自定义表单字段、Poll 调研投票、以及 Omada 品牌化定制**。

平台面向 Omada 各产品线（Controller / Fusion / VIGI / MSP 等），每条产品线以独立的 Board 运营，不同产品线通过 Access Tier（Segments / Team / Authenticated / Anonymous）实现权限隔离。

> 🏷️ **上游切换说明**: 本项目已从原 Fider (Go+React) 架构全面切换至 Quackback (全栈 TypeScript)。Quackback 提供了更契合的现代化技术栈和开箱即用的 AI/Notion 集成。原 Fider 代码已归档至 `fider-archive` 分支。

## 目标

### 短期目标
- 本地跑通 Quackback fork，验证 Board 隔离、SSO / 邮箱后缀注册（Segments）、中英双语等核心能力
- 完成 Omada Design System 品牌化定制（Shadcn / Tailwind token 映射）
- 落地内部 Sales（标案/需求）与外部客户的 Board 权限矩阵配置

### 长期目标
- 扩展 Quackback 数据模型，支持动态自定义表单字段（Custom Fields）
- 增加独立实体 Poll 调研投票，支持多方案 PK
- 完善用户成长体系（Karma、徽章），提升社区活跃度

## 核心系统与技术栈

| 层 | 技术 | 说明 |
|---|---|---|
| 框架 | TanStack Start + React 18 | 全栈 TypeScript，内置 SSR 与 Server Functions |
| 路由 | TanStack Router | 类型安全的路由系统 |
| 样式 | Tailwind CSS v4 + Shadcn UI | 极简风格，高度可定制 Design Token |
| 数据库 | PostgreSQL 18+ (需 pgvector) | 核心存储与向量检索 |
| ORM | Drizzle ORM | 类型安全的数据库访问 |
| 任务队列 | BullMQ + Redis | 处理异步任务（AI、邮件、同步） |
| 认证 | Better Auth | 支持 SSO、OAuth、邮箱等多种登录方式 |

## 仓库分层（源码导航）

Quackback 采用清晰的领域驱动（Domain-Driven）架构：

- `apps/web/src/routes/` — TanStack Router 路由定义（分 `_portal` 前台和 `admin` 后台）
- `apps/web/src/lib/server/domains/` — 核心业务逻辑，按领域内聚（如 `posts`, `boards`, `ai`, `settings`）
- `apps/web/src/lib/server/integrations/` — 第三方集成（含 Notion, Slack, Jira 等 24 个）
- `apps/web/src/components/ui/` — Shadcn UI 基础组件库
- `packages/db/src/schema/` — Drizzle ORM 数据模型定义
- `packages/db/drizzle/` — 数据库迁移文件

## Board 隔离与权限体系

本项目采用 **单入口 + 多 Board** 的隔离模型：

- **统一入口**：所有用户（外部客户、内部 Sales）共享同一个注册/登录入口和用户表。
- **Board 隔离**：每条产品线或需求类型对应一个 Board（如 `Customer Feedback`, `Internal Cases`）。
- **Access Tier 矩阵**：每个 Board 独立配置 `view` / `vote` / `comment` / `submit` 的权限层级：
  - `anonymous`: 所有人可见
  - `authenticated`: 登录用户
  - `segments`: 特定用户群（如基于邮箱后缀 `@tp-link.com` 自动划分的内部员工 Segment）
  - `team`: 仅管理员/协作者

这种模型天然支持内部员工在多个 Private Board 之间无缝切换，无需重复登录。
