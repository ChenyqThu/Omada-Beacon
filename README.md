<p align="center">
  <strong>Omada Beacon</strong>
</p>

<p align="center">
  Omada 多产品线（Controller / Fusion / VIGI / MSP）内部产品反馈平台<br/>
  基于开源项目 <a href="https://fider.io/">Fider</a> 改造 · 内部自部署自用
</p>

---

## 这是什么

**Omada Beacon** 是 [Fider](https://github.com/getfider/fider)（AGPL-3.0）的 fork，目标是 Omada 多产品线的内部产品反馈 / 需求采集平台：让 Fider 承担「反馈采集 + 投票 + 多租户 + 权限」基建，把精力投到差异化价值 —— **AI 舆情 / 分类 / 摘要 + 内部系统打通**（Notion 需求池 / 标案池双向同步）。

## 文档

完整的项目文档在 [`docs/`](./docs/README.md)：

- [项目总览](./docs/01-overview.md) · [技术架构](./docs/02-architecture.md) · [路线图](./docs/03-roadmap.md)
- [本地开发指南](./docs/07-local-development.md) · [部署方案](./docs/06-deployment.md) · [数据库方案](./docs/04-database.md)
- [设计提案](./docs/design/)：可配置表单 + 双 Site + Notion 同步、内容站架构

## 快速开始

```bash
cp .example.env .env
docker compose up -d pgdev smtp
npm install
make build && make migrate && make run   # → http://localhost:3000
```

详见 [本地开发指南](./docs/07-local-development.md)（含国内网络 GOPROXY / Docker 镜像源配置）。

## 技术栈

Go（CQRS + Bus，无 ORM，直写 SQL）· React 18 + TypeScript（SSR）· PostgreSQL · SCSS（自建组件 + utility，**无 Tailwind**）· LinguiJS i18n。

## 致谢

本项目基于 [**Fider**](https://github.com/getfider/fider) 构建，遵循 **AGPL-3.0** 许可证。感谢 Fider 团队与社区提供了优秀的开源反馈平台基座。上游开发指南见仓库内 `CLAUDE.md`。
