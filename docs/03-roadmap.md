# 03 · 路线图

本产品路线图分为四大阶段（P1-P4），但在工程执行上，为了避免 P1 过重，拆分成了更小的 Milestone（P0, P1a-c, P2a-c, P3, P4）。

## 阶段大主题与价值

| 阶段 | 大主题 | 概要价值 |
|---|---|---|
| P1 | 可配置化基座 | 一套代码撑多形态 site，把「配置」变成产品能力；同时落地基础用户档案与帖子指标 |
| P2 | 同步与协同 | 打通外部反馈 → 内部需求流转（Notion 双向）+ 群体决策（Poll） |
| P3 | 用户成长与社区互动 | 用声望（karma）与徽章 / 等级激励用户，沉淀活跃社区，为 AI 备好数据 |
| P4 | AI 能力层 | 在活跃社区与高质量数据上叠加分类 / 摘要 / 舆情，构建差异化反馈中枢 |

## 执行分期收敛（Milestones）

| Milestone | 目标 | 范围 | 明确不做 |
|---|---|---|---|
| **P0 · Feasibility Smoke** | 验证 Fider fork 可运行 | 本地 build / Postgres / migration / HOST_MODE=multi / 原生反馈闭环 | 不做自定义字段、Notion 同步、Poll、AI |
| **P1a · Omada Beacon Minimum Runtime** | 最小可用子站 | 展示名 / 品牌化 / 主域名注册关闭 / 创建测试 site / 原生角色验证 | 不做平台 UI、不做动态表单 |
| **P1b · Tenant Access Control** | 站点准入与权限闭环 | public/private、邀请制、邮箱后缀白名单、SSO、权限测试矩阵 | 不做跨 site dashboard |
| **P1c · Structured Feedback Foundation** | 结构化反馈基座 | 动态字段、字段生命周期、状态展示配置、Roadmap 显隐、基础 profile / view_count | 不做完整自定义状态机、不做 karma |
| **P2a · Notion Sync MVP** | 反馈进入 Notion | 手动 / 半自动 Fider→Notion 单向、sync_links、sync_events、失败可诊断 | 不做自动双向同步、不做入站轮询 |
| **P2b · Poll Collaboration** | 调研投票协同 | Poll 列表 / 详情 / 单选投票 / 评论复用 | 不与 P2a 强耦合 |
| **P2c · Platform Admin Lite** | 平台 Owner 管站 | Owner/SuperAdmin 创建 / 管理 / 删除 site、分配域名、指定 Site Admin | 跨 site 总览可继续后置 |
| **P3 · Community Growth** | 用户成长体系 | karma、徽章、等级；internal site 默认可关闭或弱化 | 不阻塞 P1/P2 主链路 |
| **P4 · AI Layer** | 智能分类 / 摘要 / 舆情 | 基于已沉淀的结构化反馈与评论数据做异步 AI 能力 | 不在数据基座成熟前抢跑 |
