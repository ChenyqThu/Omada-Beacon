# 04 · 前端页面框架

> 前端分为「Portal（用户前台）」与「Admin（管理后台）」两层。不同 Board 的差异靠 Access Tier 配置驱动，不 fork 代码。

## 0 · 层级与域名拓扑

| 层 | 路由前缀 | 技术栈 | 职责 |
|---|---|---|---|
| 内容站 | www / docs.* | 独立 Astro + Starlight (site/) | landing / 文档 / blog，不并入 Beacon |
| Portal 前台 | / | TanStack Start + Shadcn | 用户侧反馈、投票、Roadmap |
| Admin 后台 | /admin | TanStack Start + Shadcn | 管理员配置与运营 |

## 1 · Portal 前台页面

| 页面 | 路由 | 说明 | 阶段 |
|---|---|---|---|
| 反馈首页 | `/_portal/index` | Board 切换 + 反馈列表 + 搜索/筛选 | 原生 |
| 反馈详情 | `/_portal.b.$slug.posts.$postId` | Post 正文 + 评论 + 投票 + 状态 + 自定义字段 | 原生 + P1c |
| 提交反馈 | Portal 内弹窗/页面 | 据 custom_fields 配置动态渲染 | P1c 增强 |
| Roadmap 看板 | `/_portal/roadmap` | 按状态分列展示 | 原生 |
| Changelog | `/_portal/changelog` | 产品更新日志 | 原生 |
| 登录 / 注册 | `/admin.login` / `/admin.signup` | SSO / 邮箱 / OAuth | 原生 |
| 用户设置 | `/_portal/settings` | 个人资料 / 通知偏好 | 原生 |
| 通知中心 | `/_portal/notifications` | 订阅的帖子更新通知 | 原生 |
| Poll 列表 | 待定 | 调研投票入口 | P2 新增 |
| Poll 详情 | 待定 | 多方案 PK 投票 + 讨论 | P2 新增 |

## 2 · Admin 后台页面

| 页面 | 路由 | 说明 | 阶段 |
|---|---|---|---|
| 后台概览 | `/admin/analytics` | 统计与分析 | 原生 |
| 反馈管理 | `/admin/feedback` | 状态流转 / 标签 / 合并 / 官方回复 | 原生 |
| Board 设置 | `/admin/settings/boards` | Board 名称 / Access Tier / 描述 | 原生 |
| Custom Fields 配置 | 待定 | 按 Board 配置自定义字段 | P1c 新增 |
| 用户 & 角色 | `/admin/settings/team` | 成员管理 / 角色分配 | 原生 |
| 集成配置 | `/admin/settings/integrations` | Notion / Slack / Jira 等 | 原生 |
| 品牌设置 | `/admin/settings/branding` | Logo / 主题 / 自定义 CSS | 原生 |
| 安全设置 | `/admin/settings/security` | SSO / 认证方式 | 原生 |

## 3 · Board 配置与权限差异（配置驱动）

每个 Board 的形态由 Access Tier 矩阵决定：

| 配置项 | 对外 Public Board | 对内 Private Board |
|---|---|---|
| view | anonymous | segments |
| vote | authenticated | segments |
| comment | authenticated | segments |
| submit | authenticated | segments |
| 表单字段 | 精简（标题+描述） | 完整（含产品线/国家/优先级等） |
| 品牌 | 对外品牌化 | 内部风格 |

## 4 · 全局交互规范

### 4.1 四态通用约定

| 状态 | 要求 |
|---|---|
| 空态 | 说明为何为空 + 给出下一步动作 |
| 加载 | SSR 首屏直出；客户端二次加载给 Skeleton |
| 错误 | 可读错误信息 + 重试路径；表单错误保留已填输入 |
| 无权限 | 统一拦截态 + 引导（登录/申请），不泄露受限内容 |

### 4.2 国际化 (i18n)
- Quackback 内置多语言支持（EN / FR / DE / ES / AR + RTL）
- 需扩展中文支持（zh-CN）

### 4.3 SSR 与首屏
- TanStack Start 内置 SSR，首屏内容服务端直出
- 交互增强在 hydration 后接管

## 5 · 新增页面清单（相对 Quackback 原生）

- **P1c**：Custom Fields 配置页（Admin）、动态表单渲染增强（Portal）
- **P2**：Poll 列表 + Poll 详情（Portal）、Poll 管理（Admin）
- **P3**：用户公开主页 Profile、Karma/徽章展示
