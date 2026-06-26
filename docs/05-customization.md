# 05 · 可定制范围

按改动成本分三档，帮助判断「某个需求是配置就能搞定，还是要写代码，还是 Fider 根本没有」。

## 🟢 配置级（后台 / 环境变量，零代码）

- **品牌化**：Logo、主题色、自定义域名
- **认证**：原生支持 Google / Facebook / GitHub，**可接任意 OAuth2 Provider（含企业 SSO）**
- 多语言、标签、自定义状态
- 内置**多租户**（tenant resolution 中间件）

## 🟡 代码级（范式清晰，二开友好）

- **REST API v1**（Posts / Votes / Comments / Users / Tags）可程序化集成
- 加端点 = 路由 → handler → query → service 四步固定套路（见 [02 · 技术架构](./02-architecture.md)）；加页面、加表均有模板
- 前端组件与样式可深度改造

## 🔴 需自建（Fider 原生没有）

- **AI 能力（分类 / 摘要 / 舆情聚合）** — 与内部 AI 舆情监控诉求强相关，**核心差异化价值所在**（路线图 P3）
- 实时协作（架构为传统 SSR，无实时）
- 原生 Roadmap / Changelog 视图
- 与 Jira / Linear / Notion 的开箱集成（需走 API 自接）

---

## 关键能力：评论与角色机制

支持「留言讨论」+「区分官方答复者」。Fider 在 vote 之外提供**两层独立互动**：

- **普通评论（Comments）**：每条需求（Post）都可评论讨论，任何登录用户可参与。
- **官方答复（Response）**：与评论物理隔离的「正式回应」，**仅 Collaborator / Administrator 可发**，置顶展示并同时打上状态（planned / started / completed / declined / duplicate）。

### 角色三档

API 每个用户均带 `role` 字段，UI 上访客评论与官方答复**视觉区分**：

| 角色 | 能力 | 对应场景 |
|---|---|---|
| `visitor` | 提需求、投票、评论 | 访客 / 普通用户 |
| `collaborator` | 在 visitor 基础上：发官方答复、改状态、编辑 Post | 产品 / 运营答复者 |
| `administrator` | 在 collaborator 基础上：删除、管理成员 / 设置 | 管理员 |

> 这套现成的「评论 + 官方答复 + 三档角色」正是反馈平台的核心交互，不用自建。
