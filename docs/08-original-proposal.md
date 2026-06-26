# 08 · 原始改造方案存档

> 本篇是 Notion 上《用户反馈平台技术选型 · Fider 改造方案》的留痕存档，作为决策依据的原始出处。**本目录其他文档是它的结构化拆分与落地延伸**，如有冲突以拆分后的专题文档为准（它们包含了实操更新）。
>
> Notion 源：`https://app.notion.com/p/omadanetworks/Fider-bd8bad3df00a4d4f997941a4df46d34d`

## 最终技术选型

- 基于开源项目 **Fider** 改造，**内部自部署自用**。
- 部署方式：`git clone` + 本地 build（放弃官方 Docker 镜像，换取完整可定制性）。
- 数据库：PostgreSQL 12+（本地 Postgres 容器 或 自托管 Supabase 二选一）。
- 许可证：AGPL-3.0 — 内部自用无障碍，无商用限制。

## 一、为什么选 Fider

- 成熟可靠：2017 年起步，约 4.4k stars、近 2000 次提交，社区活跃。
- 省基建：自带反馈采集、投票、评论、标签、用户/权限、多租户、OAuth、REST API。
- 多租户天然契合 Omada 多产品线（Controller / Fusion / VIGI / MSP）。
- 二开友好：Go + TypeScript 全量类型覆盖，分层约定严格，自带 `CLAUDE.md`。

## 二、技术栈

后端 Go（~65%，CQRS + Bus，无 ORM 直写 SQL，Go 1.22+）；前端 React 18 + TS（~29%，SSR + hydration，Node 21/22）；i18n LinguiJS；样式 SCSS（BEM + utility，无 Tailwind）；DB PostgreSQL 12+；构建 esbuild + webpack + Makefile。详见 [02 · 技术架构](./02-architecture.md)。

## 三、数据库：本地 build + Supabase 可行性

Fider 通过标准 `DATABASE_URL` 接 Postgres，Supabase 本质即 Postgres。方案 A（纯 Postgres，推荐起步）vs 方案 B（自托管 Supabase）。Supabase 铁律见 [04 · 数据库方案](./04-database.md)。

## 四、可定制范围

🟢 配置级（品牌化/OAuth/多语言/多租户）｜🟡 代码级（API v1、加端点四步、前端改造）｜🔴 需自建（AI 能力、实时、Roadmap、第三方集成）。详见 [05 · 可定制范围](./05-customization.md)。

## 五、分阶段落地计划

P0 可行性验证 → P1 基础定制 → P2 数据与集成 → P3 AI 能力层 → P4 上线运营。详见 [03 · 路线图](./03-roadmap.md)。

> 核心策略：让 Fider 承担「反馈采集 + 投票 + 多租户 + 权限」基建，把精力集中投到差异化价值 **AI 舆情/分类/摘要 + 内部系统打通** 上，ROI 最高。

## 六、关键能力与部署确认

- **评论与角色机制**：普通评论（任何登录用户）+ 官方答复（仅 collaborator/administrator，带状态）；角色三档 visitor/collaborator/administrator。详见 [05 · 可定制范围](./05-customization.md)。
- **部署容量评估**：数百并发 + 万级以内反馈条目，Mac mini + CF Tunnel 绰绰有余（Go 单二进制 + Postgres，极轻量）。详见 [06 · 部署方案](./06-deployment.md)。
- **为什么不上 Vercel**：Vercel 的 Go 是 Serverless Functions，不适合 Fider 这种有状态常驻服务（SSR + CQRS Bus + 后台任务 + 中间件链）。

## 参考

- 仓库：[github.com/getfider/fider](https://github.com/getfider/fider)（AGPL-3.0）
- 自部署文档：[docs.fider.io/hosting-instance](https://docs.fider.io/hosting-instance)（要求 PostgreSQL 12+）
- API 文档：[docs.fider.io/api/overview](https://docs.fider.io/api/overview)
- OAuth 配置：[docs.fider.io/configuring-oauth](https://docs.fider.io/configuring-oauth)
