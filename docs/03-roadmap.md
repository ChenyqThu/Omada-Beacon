# 03 · 路线图

由于上游从 Fider 切换至 Quackback，大量原定于 P2 和 P4 阶段的功能（Notion 同步、AI 摘要、Changelog）已由上游提供。路线图已重新调整，聚焦于 Omada 专属的定制化能力。

## 阶段大主题与价值

| 阶段 | 大主题 | 概要价值 |
|---|---|---|
| P1 | 品牌化与结构化基座 | 适配 Omada Design System，落地多 Board 权限，实现自定义表单字段 |
| P2 | 调研与决策增强 | 增加 Poll 调研投票实体，支持多方案 PK |
| P3 | 用户成长与社区互动 | 用声望（Karma）与徽章激励用户，沉淀活跃社区 |

## 执行分期收敛（Milestones）

| Milestone | 目标 | 范围 | 状态 |
|---|---|---|---|
| **P0 · Quackback Smoke** | 验证新底座可运行 | 本地 setup / Postgres+pgvector / Redis / 基础发帖闭环 | 🟢 已完成 |
| **P1a · Omada Branding** | 品牌化定制 | 替换 Shadcn CSS Token / 引入 Omada 字体 / 替换 Logo / 调整欢迎文案 | 🟡 规划中 |
| **P1b · Board Access Control** | 站点准入与权限闭环 | 配置 Internal Segments (tp-link.com 邮箱) / 设置 Public 与 Private Boards 权限矩阵 | 🟡 规划中 |
| **P1c · Structured Feedback** | 结构化反馈基座 | 新增 custom_fields 实体 / 修改发帖表单支持动态字段 / 扩展详情页展示 | 🟡 规划中 |
| **P2 · Poll Collaboration** | 调研投票协同 | Poll 列表 / 详情 / 单选投票 / 评论复用 | ⚪ 待定 |
| **P3 · Community Growth** | 用户成长体系 | Karma 积分计算 / 徽章发放规则 / 用户公开主页展示 | ⚪ 待定 |

## 已由 Quackback 提供的能力（无需开发）
- **Notion 双向同步**：通过内置 Integration 实现
- **AI 能力层**：重复检测、自动摘要、情感分析（配置 OpenAI key 即可）
- **MCP Server**：AI Agent 接入能力
- **Changelog 与 Roadmap**：内置模块
