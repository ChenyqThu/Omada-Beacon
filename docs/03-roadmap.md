# 03 · 路线图

分阶段落地计划。核心策略：先让 Fider 把基建撑起来，再把资源投到差异化的 AI 能力层。

## 阶段总览

| 阶段 | 目标 | 关键动作 | 产出 |
|---|---|---|---|
| **P0 · 可行性验证** | 本地跑通 | `git clone` → 配 `.env` → `make migrate` → `make watch`；接本地 Postgres；验证中文体验、OAuth、多租户 | 本地可运行实例 + 可行性结论 |
| **P1 · 基础定制** | 「像我们自己的产品」 | 品牌化（Logo/配色/域名）、企业 SSO 接入、中英双语、按产品线建租户 | 可内部试用的定制版 |
| **P2 · 数据与集成** | 打通内部系统 | 梳理 API v1 能力；反馈数据与 Notion / Jira 等内部系统打通；按需切换 Supabase 方案 | 数据流打通 + 集成方案 |
| **P3 · AI 能力层** | 差异化价值 | 在 Fider 之上叠加 AI：反馈自动分类 / 摘要 / 舆情聚合；评估实时/Roadmap 视图需求 | AI 增强版反馈平台 |
| **P4 · 上线运营** | 稳定运行 | 生产部署、备份与监控、迭代机制、内部推广 | 正式投入使用 |

## 当前进度

- **P0 进行中** ✅ —— 本地环境已搭建并跑通（详见 [07 · 本地开发指南](./07-local-development.md)）。
  - 已完成：Go/Node/Docker 环境就绪、本地 Postgres 容器、`.env` 配置、`make build` / `make migrate` / `make run` 走通。
  - 待验证：中文体验、OAuth 登录、多租户分站点。

> 下一步进入 P1 前，先把 P0 的「中文 + OAuth + 多租户」三项体验验证完整。品牌化与 SSO 属 P1，不在 P0 范围。

## 功能模块规划

P0–P4 是「平台能力演进主线」；下面是横切多个阶段的**功能模块**，各有独立设计提案，按依赖关系挂靠阶段：

| 功能模块 | 建议阶段 | 依赖 | 设计提案 |
|---|---|---|---|
| 自定义表单 + 双 Site + Notion 同步 | P1（双 site/表单）→ P2（同步）→ P3（AI 复用字段） | 平台就绪 | [custom-forms-and-notion-sync](./design/custom-forms-and-notion-sync.md) |
| **用户调研投票（Poll / 方案 PK）** | **P2 · 产品功能增强**（MVP 可在 P1 后启动） | 平台就绪，不依赖集成/AI | [poll-voting](./design/poll-voting.md) |

> 调研投票与「反馈帖点赞」是不同交互（多方案单选 PK vs 单帖支持度），为**新增独立实体**，对现有代码零侵入。详见设计提案。

## 品牌改名（Fider → Omada Beacon）

属 P1「品牌化」的一部分。GitHub 仓库已更名 `ChenyqThu/Omada-Beacon`，README/docs 已用 Omada Beacon；代码层的品牌展示名替换、构建标识、本地路径/remote 同步等执行清单见 [rename-to-omada-beacon](./design/rename-to-omada-beacon.md)。

**已确认决策**：品牌展示名 = Omada Beacon；Go module path `github.com/getfider/fider` **保留不改**（仅内部 import 标识，避免改动 302 个文件）；本地文件夹 + git remote 同步为 Omada-Beacon。
