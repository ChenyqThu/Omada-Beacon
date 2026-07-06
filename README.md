<p align="center">
  <strong>Omada Beacon</strong>
</p>

<p align="center">
  Omada 多产品线（Controller / Fusion / VIGI / MSP）内部产品反馈平台<br/>
  基于开源项目 <a href="https://github.com/QuackbackIO/quackback">Quackback</a> 改造 · 内部自部署自用
</p>

---

## 这是什么

**Omada Beacon** 是 [Quackback](https://github.com/QuackbackIO/quackback)（AGPL-3.0）的 fork，目标是 Omada 多产品线的内部产品反馈 / 需求采集平台。

> ⚠️ **上游切换说明**: 本项目已从原 Fider (Go+React) 架构全面切换至 Quackback (全栈 TypeScript)。原 Fider 代码已归档至 `fider-archive` 分支。

Quackback 提供了我们所需的现代化技术栈和核心基建：
- **TanStack Start + React 18 + Tailwind v4 + Shadcn UI**（极简风格，高度可定制）
- **Board 隔离与权限矩阵**（支持外部客户与内部 Sales 的隔离）
- **内置 AI 能力**（重复检测、摘要、情感分析）
- **丰富的第三方集成**（Notion、Slack、Jira 等）

我们将在此基础上，集中精力开发 Omada 差异化功能：**自定义表单字段、Poll 调研投票、以及 Omada 品牌化定制**。

## 文档

完整的项目文档在 [`docs/`](./docs/README.md)：

- [项目总览](./docs/01-overview.md) · [技术架构](./docs/02-architecture.md) · [路线图](./docs/03-roadmap.md)
- 设计提案：[自定义表单](./docs/design/custom-forms.md)

## 快速开始

```bash
bun run setup              # 一次性初始化 (依赖, Docker, migrations, seed)
bun run dev                # 启动本地开发服务器 http://localhost:3000
```

详见 `CLAUDE.md` 中的开发指南。

## 技术栈

- **全栈框架**: TanStack Start + React 18
- **路由**: TanStack Router
- **数据库 & ORM**: PostgreSQL (需 pgvector) + Drizzle ORM
- **样式**: Tailwind CSS v4 + Shadcn UI
- **认证**: Better Auth
- **后台任务**: BullMQ + Redis

## 许可证

本项目基于 [**Quackback**](https://github.com/QuackbackIO/quackback) 构建，遵循 **AGPL-3.0** 许可证。
