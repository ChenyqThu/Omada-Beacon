# 项目文档 · Omada 反馈平台（基于 Fider Fork）

本目录是**我们这个 Fider fork 的项目知识库**：记录我们为什么 fork、要做成什么、架构怎么理解、如何本地开发与部署。

> 一句话定位：基于开源反馈平台 **Fider** 改造，做 **Omada 多产品线（Controller / Fusion / VIGI / MSP）内部自部署自用**的用户反馈平台；让 Fider 承担「反馈采集 + 投票 + 多租户 + 权限」基建，把精力投到差异化价值 **AI 舆情 / 分类 / 摘要 + 内部系统打通**。

## 文档导航

| 文档 | 内容 |
|---|---|
| [01 · 项目总览](./01-overview.md) | 为什么 fork Fider、技术选型、AGPL 许可证、核心策略 |
| [02 · 技术架构](./02-architecture.md) | 后端 CQRS+Bus、前端 SSR、多租户、模型分层、请求流、加端点套路 |
| [03 · 路线图](./03-roadmap.md) | P0–P4 分阶段落地计划与当前进度 |
| [04 · 数据库方案](./04-database.md) | 纯 Postgres vs 自托管 Supabase、连接铁律、本地端口约定 |
| [05 · 可定制范围](./05-customization.md) | 配置级/代码级/需自建、角色与权限、评论与官方答复机制 |
| [06 · 部署方案](./06-deployment.md) | Mac mini + CF Tunnel、备份、为什么不上 Vercel、托管替代 |
| [07 · 本地开发指南](./07-local-development.md) | 依赖清单、从零跑起来、make 命令速查、常见坑（含国内网络） |
| [08 · 原始改造方案存档](./08-original-proposal.md) | Notion 技术选型方案原文留痕 |

## 设计提案（docs/design/）

进行中的功能设计文档，供 review 与后续落地跟进：

| 文档 | 内容 |
|---|---|
| [自定义表单 + 双 Site + Notion 双向同步](./design/custom-forms-and-notion-sync.md) | 可配置表单字段系统、对内(sales)/对外(customer)双租户、Notion 需求池/标案池字段映射与 comment 同步方案 |
| [内容站架构（Landing + 101 文档 + Blog）](./design/content-site-architecture.md) | 独立 Astro + Starlight 内容站，与反馈应用分离；landing / 文档 / blog 规划 |

## 与其他文档的关系

本仓库有几套并存的「文档/规范」，职责不同，不要混淆：

- **`docs/`（本目录）** — 面向**我们这个 fork** 的战略、架构、运维知识库。人和 AI 都读。
- **`CLAUDE.md`** — Fider 官方的**代码开发指南**（怎么写 Fider 的 Go/React 代码、目录约定、命令）。保持上游风格，本次未改动。
- **`AGENTS.md` + `.trellis/`** — [trellis](https://docs.trytrellis.app/) 引入的 **spec-driven AI 协作开发骨架**。`.trellis/spec/` 放编码约定，`.trellis/tasks/` 放任务级 PRD，`.trellis/workspace/` 放项目记忆。聚焦「开发流程」，与本目录的「项目战略」互补。

## 上游信息

- 上游仓库：[github.com/getfider/fider](https://github.com/getfider/fider)（AGPL-3.0）
- 本 fork：[github.com/ChenyqThu/fider](https://github.com/ChenyqThu/fider)
- 官方文档：[docs.fider.io](https://docs.fider.io) ｜ 自部署：[docs.fider.io/hosting-instance](https://docs.fider.io/hosting-instance) ｜ API：[docs.fider.io/api/overview](https://docs.fider.io/api/overview)
