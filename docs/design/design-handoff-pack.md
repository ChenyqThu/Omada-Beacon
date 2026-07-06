# Omada Beacon · Design Handoff Pack

> **定位**：交付设计简报。以关键用户旅程驱动的信息架构 / wireframe / 视觉方向说明。
> **上游**：基于 Quackback fork，前端为 TanStack Start + React 18 + Tailwind v4 + Shadcn UI。

## 0 · 使用方式

设计工作应按以下顺序：
1. **先理解角色与旅程**：不要从页面列表直接开画。
2. **先画 Journey Flow**：每条旅程从入口、任务、关键决策点、完成态开始。
3. **再落页面结构**：页面只是旅程中的节点，不是孤立 screen。
4. **最后做视觉语言**：基于 Omada 专业可信的品牌调性（`#00A870` 绿色、Manrope 字体），形成低摩擦、清晰、高效的界面。
5. **第一批只做 P1a–P1c 高优先级页面**；P2/P3 只保留入口和占位。

## 1 · 产品设计目标

Omada Beacon 的设计目标是做一个 **专业、可信、低摩擦的产品反馈与需求协同入口**。

### 1.1 核心体验关键词
- **可信**：用户能清楚知道反馈是否被看到、处于什么状态、官方是否有回应。
- **低摩擦**：提交反馈、投票、评论、查看状态都应尽量短路径。
- **结构化**：内部 demand / case 需要被结构化收集。
- **权限清晰**：不同角色的边界在界面上要清楚。

### 1.2 不同 Board 的体验倾向

| Board 类型 | 体验重点 | 界面倾向 |
|---|---|---|
| 对外 Public Board | 浏览、投票、评论、官方回应 | 更强调可读性、引导、信任感 |
| 对内 Private Board | 结构化提交、处理效率、可追踪 | 信息密度更高，表单字段更完整 |
| 管理后台 | 批量处理、配置、权限 | 高信息密度、清晰分区 |

## 2 · 角色模型（映射到 Quackback）

| Quackback 角色 | 对应 PRD 角色 | 设计关注点 |
|---|---|---|
| Anonymous (未登录) | 未登录访客 | Public board 可浏览；Private board 被拦截 |
| Authenticated (portal user) | Visitor | 提交反馈、投票、评论 |
| Team member | Collaborator | 处理反馈、改状态、官方回复 |
| Admin | Administrator | 配置 Board、字段、状态、成员 |

## 3 · 关键用户旅程

### Journey 1 · 外部用户提交反馈
```
访问 Public Board → 浏览全部反馈 → 搜索/筛选 → 登录/注册 → 提交反馈 → 查看详情 → 投票/评论 → 跟踪状态
```

### Journey 2 · 内部用户提交 demand / case
```
访问 Private Board → 被拦截 → 白名单邮箱注册/登录 → 进入首页 → 选择 Board → 填写结构化字段 → 提交 → 跟踪状态
```

### Journey 3 · Team Member 处理反馈
```
进入反馈详情 → 查看内容与字段 → 判断优先级 → 改状态/编辑/合并 → 发布官方回复 → 触发 Notion 同步
```

### Journey 4 · Admin 配置 Board
```
进入 Admin 后台 → 配置 Board Access → 配置 Custom Fields → 配置 Statuses → 验证前台效果
```

## 4 · 视觉调性

- 专业、可信、清晰。不做 Reddit 式强娱乐化。
- 前台低摩擦，后台高效率。
- 与 Omada 品牌保持一致（绿色主色 `#00A870`、Manrope 字体）。
- 可使用 MagicUI / AceternityUI 等组件库增强动效和高级交互。

## 5 · 技术约束（给设计的）

- 所有 UI 组件基于 Shadcn UI（Radix + Tailwind），设计时参考 Shadcn 组件能力边界。
- 支持亮色/暗色主题切换。
- 支持中英双语（i18n）。
- SSR 首屏直出，交互增强在 hydration 后接管。
