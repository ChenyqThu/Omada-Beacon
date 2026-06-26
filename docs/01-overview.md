# 01 · 项目总览

## 最终技术选型

> ✅ **基于开源项目 Fider 改造，内部自部署自用。**
> - **部署方式**：`git clone` + 本地 build（放弃官方 Docker 镜像，换取完整可定制性）。
> - **数据库**：PostgreSQL 12+（本地 Postgres 容器 或 自托管 Supabase 二选一，详见 [04 · 数据库方案](./04-database.md)）。
> - **许可证**：AGPL-3.0 — 内部自用无障碍，无商用限制。

## 为什么选 Fider

- **成熟可靠**：2017 年起步，约 4.4k stars、近 2000 次提交，社区活跃，是经过验证的反馈/投票平台。
- **省基建**：自带反馈采集、投票、评论、标签、用户/权限、**多租户**、OAuth、REST API，免去大量从零搭地基的工作。
- **多租户天然契合 Omada 多产品线**（Controller / Fusion / VIGI / MSP 等），可一套实例分租户运营。
- **二开友好**：Go + TypeScript 全量类型覆盖，代码分层约定严格，仓库自带 `CLAUDE.md` 开发指南，适合 AI 辅助开发。

## 技术栈

| 层 | 技术 | 说明 |
|---|---|---|
| 后端 | **Go**（约 65%） | CQRS 读写分离 + Bus 依赖注入分发；**无 ORM，直写 SQL**；需 Go 1.22+ |
| 前端 | **React 18 + TypeScript**（约 29%） | SSR + hydration、懒加载代码分割、全量 TS 类型；需 Node 21/22 |
| 国际化 | **LinguiJS** | 多语言开箱即用，适合中英双语 |
| 样式 | **SCSS**（BEM + 自有 utility classes） | **未使用 Tailwind**，改样式优先复用 utility 类 |
| 数据库 | **PostgreSQL 12+** | 编号 SQL 迁移文件，`make migrate` 执行 |
| 构建 | esbuild + webpack + Makefile | `make watch`（热重载）/ `make build`（生产构建）/ `make lint` / `make test` |

技术架构的详细解读见 [02 · 技术架构](./02-architecture.md)。

## 许可证说明（已确认可接受）

> 📜 Fider 采用 **AGPL-3.0**（强 Copyleft）。AGPL 的义务是「**对外提供网络服务时需开源衍生代码**」，**对商用没有任何限制**。本项目为**内部自用**，即使衍生代码开源也可接受，因此**许可证不构成约束**。

## 核心策略

> 🎯 让 Fider 承担「反馈采集 + 投票 + 多租户 + 权限」这层基建，把精力集中投到它没有、且正是我们差异化价值的 **AI 舆情 / 分类 / 摘要 + 内部系统打通** 上，ROI 最高。

可定制范围的细分（哪些零代码、哪些需二开、哪些要自建）见 [05 · 可定制范围](./05-customization.md)；分阶段落地见 [03 · 路线图](./03-roadmap.md)。
