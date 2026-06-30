# 设计提案 · 用户调研投票（Poll / 设计方案 PK 投票）

> 状态：**已定稿（待实现）** ｜ 关联路线图：**P2 · 产品功能增强线**（MVP 可在 P1 平台就绪后启动，不依赖 P2 数据集成与 P3 AI 层）
> 目标：在现有「反馈帖 + 点赞投票」之外，新增一类「**多方案 PK 投票**」（Poll）——产品/设计把一个需求的两个或几个设计/交互方案抛给用户**单选投票 + 讨论**，并可**关联到对应的反馈帖（需求）**，把投票结果作为设计决策依据。
> 命名：技术实体 `entity.Poll`，产品中文名「设计调研 / 方案投票」。

---

## 决策记录（2026-06-30，与 @chenyqthu 讨论定稿）

| # | 决策点 | 结论 |
|---|---|---|
| 1 | 关系模型 | **独立实体 + 可选关联 Post**（`poll.post_id` 可空），对现有代码零侵入 |
| 2 | 投票形式 | **单选**（每人选 1 个方案），预留 `max_votes_per_user` 给未来多选 |
| 3 | 结果可见性 | **投票后才可见**，预留 `always` / `on_close` 两种模式 |
| 4 | 命名 | **Poll**（`entity.Poll`），中文「设计调研 / 方案投票」 |
| 5 | 评论复用 | **方案 A**：`comments` 表加 `poll_id` 列，复用全部评论能力 |
| 6 | 截止时间 | MVP **仅手动关闭**，不做 `closed_at` 自动关闭 |
| 7 | 版本阶段 | **P2 产品功能增强线**，MVP 可在 P1 后启动 |
| 8 | 独立列表入口 | MVP **不做**独立 `/polls` 列表页，仅通过关联反馈帖进入 + 极简入口；列表页留待增强期 |

> 本轮范围：需求梳理 + 文档 + 版本规划，**不写代码**。实现待项目按路线图推进到 P2 时，走 Trellis 任务流（`task.py create` → brainstorm → 实现）。

---

## 一、为什么需要它：与现有「反馈投票」的本质区别

Fider 现有的投票是**单帖点赞（upvote）**：一个想法，用户 +1 表达支持度，是「一维支持度计数」。本提案要的是**多方案之间的选择（poll）**，两者是不同的交互，**不改造现有投票，而是新增一类实体**。

| | 现有「反馈帖投票」 | 本提案「调研投票 Poll」 |
|---|---|---|
| 投票对象 | 一个想法/帖子（Post） | 一个 Poll 下的**多个方案**（Option A/B/C） |
| 投票动作 | 点赞 +1 / 取消（幂等） | 在多个方案间**单选** |
| 数据本质 | `post_votes` 计数 | `poll_votes` 单选记录 |
| 结果 | 总票数排序 | 各方案票数 / 占比分布 |
| 讨论 | 帖子评论区 | Poll 讨论区（复用评论体系） |
| 发起人 | 任意登录用户 | Collaborator+（产品/设计） |
| 典型场景 | 「希望支持深色模式」收集呼声 | 「设置页改版，A/B 两版交互你选哪个」 |

> 现有 `post_votes`（`tenant_id, user_id, post_id` 复合主键 + `ON CONFLICT DO NOTHING`）保持不变。

---

## 二、需求定义

### 2.1 一句话

> Collaborator 针对某个设计问题（可关联一个反馈帖）发起一个 Poll，上传若干**图文方案**；登录用户**单选**投出最认可的方案并参与讨论；投票后看到结果分布。

### 2.2 典型流程

1. 产品/设计在「需求 X」的反馈帖下，或独立地，**发起 Poll**：填标题、说明，添加 2–N 个方案（每个方案：标题 + 描述 + 设计稿图片）。
2. Poll 进入 `open` 状态，登录用户进入详情页：看到各方案的图文卡片。
3. 用户**单选**一个方案投票（可改票/撤票）。**投票后**结果区解锁，显示各方案票数与占比。
4. 用户在讨论区留言（复用现有评论：富文本 / 图片 / emoji 反应）。
5. Collaborator 可随时**关闭** Poll（`closed`），关闭后停止投票，结果对所有人可见。

### 2.3 角色与权限（对齐 [05 · 可定制范围](../05-customization.md) 的三档角色）

| 操作 | 所需角色 |
|---|---|
| 查看 Poll 列表 / 详情（含未投票时的方案，但**不含**结果） | 公开（无需登录） |
| 投票 / 撤票 / 改票 | `visitor`+（已登录） |
| 评论讨论 | `visitor`+（已登录） |
| 发起 / 编辑 / 关闭 Poll、增删方案 | `collaborator`+ |
| 删除 Poll | `administrator` |

> 发起权限定为 Collaborator+，与「发官方答复 / 改状态 / 改 Post」同级——发起设计调研是产品/运营行为。

---

## 三、数据模型

Fider 无 ORM、直写 SQL，沿用 `tenant_id` 多租户隔离与 `post_votes` 的幂等模式。新增 **3 张表** + 评论复用（方案 A，改 `comments`）：

```sql
-- 1. Poll 主体
CREATE TABLE polls (
  id                 SERIAL PRIMARY KEY,
  tenant_id          INT NOT NULL REFERENCES tenants(id),
  number             INT NOT NULL,                 -- per-tenant 序号，做 URL（同 posts.number 机制）
  title              VARCHAR(200) NOT NULL,
  description        TEXT,
  post_id            INT NULL REFERENCES posts(id),-- 关联反馈帖（可选）
  user_id            INT NOT NULL REFERENCES users(id), -- 发起人
  status             SMALLINT NOT NULL DEFAULT 0,  -- 0=open, 1=closed
  results_visibility SMALLINT NOT NULL DEFAULT 0,  -- 0=after_vote(默认), 1=always, 2=on_close
  max_votes_per_user SMALLINT NOT NULL DEFAULT 1,  -- 预留多选；1=单选
  created_at         TIMESTAMPTZ NOT NULL,
  closed_at          TIMESTAMPTZ NULL,
  UNIQUE (tenant_id, number)
);

-- 2. Poll 方案（选项）
CREATE TABLE poll_options (
  id          SERIAL PRIMARY KEY,
  tenant_id   INT NOT NULL REFERENCES tenants(id),
  poll_id     INT NOT NULL REFERENCES polls(id),
  title       VARCHAR(200) NOT NULL,
  description TEXT,
  image_url   TEXT,                                -- 方案设计稿（复用 Fider 现有图片/附件上传）
  position    SMALLINT NOT NULL DEFAULT 0          -- 展示排序
);

-- 3. 投票记录（单选：一人一 Poll 一票）
CREATE TABLE poll_votes (
  tenant_id  INT NOT NULL REFERENCES tenants(id),
  user_id    INT NOT NULL REFERENCES users(id),
  poll_id    INT NOT NULL REFERENCES polls(id),
  option_id  INT NOT NULL REFERENCES poll_options(id),
  created_at TIMESTAMPTZ NOT NULL,
  PRIMARY KEY (tenant_id, user_id, poll_id)        -- ★ 单选的关键：每人每 Poll 只一行
);

-- 评论复用（决策 5 · 方案 A）：comments 表加 poll_id，post_id 改可空
ALTER TABLE comments ADD COLUMN poll_id INT NULL REFERENCES polls(id);
ALTER TABLE comments ALTER COLUMN post_id DROP NOT NULL;
-- 约束：评论必须挂在 post 或 poll 之一上
ALTER TABLE comments ADD CONSTRAINT comments_parent_chk
  CHECK (post_id IS NOT NULL OR poll_id IS NOT NULL);
```

### 设计要点

- **单选去重靠主键**：`poll_votes` 主键是 `(tenant_id, user_id, poll_id)`（**不是 option_id**），天然保证「一人一 Poll 一票」。**改票** = `INSERT ... ON CONFLICT (tenant_id, user_id, poll_id) DO UPDATE SET option_id = ...`（一次 upsert）。**撤票** = `DELETE`。这套幂等模式直接对标现有 `post_votes`。
  - 将来要支持**多选**：主键改为 `(tenant_id, user_id, option_id)`，并用 `polls.max_votes_per_user` 在应用层限制票数。表结构已为此预留。
- **投票后才可见**：结果接口按 `results_visibility` + 当前用户 `HasVoted` 决定是否返回票数。`after_vote` 模式下，未投票用户拿到的方案数据**不含** `votes_count`（避免前端泄露）。
- **关联反馈帖**：`post_id` 非空 → Poll 卡片嵌入该 Post 详情页；为空 → 出现在独立 Poll 入口。
- **URL 标识**：用 per-tenant `number`（复用 Fider posts 的序号生成逻辑），URL 形如 `/polls/:number`，与 `/posts/:number` 一致。
- **评论复用（方案 A）**：`comments` 加 `poll_id`、`post_id` 改可空 + CHECK 约束。现有按 `post_id` 查询的评论逻辑不受影响（poll 评论是新增的查询路径）；这是唯一侵入核心表的点，需在上游 merge 时留意。

---

## 四、后端实现（CQRS「加端点四步套路」）

参照 [02 · 技术架构](../02-architecture.md) 的四步套路与 `app/services/sqlstore/postgres/vote.go` 的实现模式。

**模型分层（`app/models/`）**

```
entity.Poll          { ID, Number, Title, Description, Post, User, Status,
                       ResultsVisibility, Options []*PollOption, HasVoted, MyOptionID }
entity.PollOption    { ID, Title, Description, ImageURL, Position, VotesCount }  // VotesCount 受可见性控制
entity.PollResult    { OptionID, VotesCount, Percentage }                        // 聚合结果

action.CreatePoll / action.UpdatePoll        // 含 options（带 Validate）
cmd.CreatePoll / cmd.ClosePoll / cmd.AddOrUpdatePollVote / cmd.RemovePollVote
query.GetPollByNumber / query.ListPolls / query.ListPollsByPost / query.GetPollResults
```

**新增 service**：`app/services/sqlstore/postgres/poll.go`，在 `Init()` 里 `bus.AddHandler` 注册——**不改动任何现有代码**（Bus 插件式注册）。

**路由（`app/cmd/routes.go`，沿用 vote 路由的中间件分层）**

```
GET    /api/v1/polls                       公开        列表
GET    /api/v1/polls/:number               公开        详情（方案；结果按可见性裁剪）
GET    /api/v1/polls/:number/results       公开        聚合结果（按可见性 + HasVoted 决定可见）
POST   /api/v1/polls                        Collaborator+  发起
PUT    /api/v1/polls/:number                Collaborator+  编辑
POST   /api/v1/polls/:number/close          Collaborator+  关闭
POST   /api/v1/polls/:number/votes          IsAuthenticated 投票（body: optionId；upsert）
DELETE /api/v1/polls/:number/votes          IsAuthenticated 撤票
```

> 关联关系靠 `poll.post_id` 字段表达，独立的 `/polls` 命名空间比挂为 Post 子资源更清晰。

---

## 五、前端实现

**新页面**（`public/pages/`，懒加载，参照 `ShowPost`）

- `ShowPoll/`：Poll 详情页 `/polls/:number` —— 方案卡片栅格、单选投票、投票后结果条形图、讨论区。

**新组件**（`public/components/` 或页面内 `components/`）

- `PollOptionCard`：方案卡片（图片 + 标题 + 描述 + 选择态 + 投票后票数/占比）。
- `PollResultBar`：结果可视化（横向占比条）。
- `PollVotePanel`：单选投票交互（提交 / 改票 / 撤票）。

**直接复用现有组件/能力**

- 讨论区：`ShowPost/components/ShowComment.tsx` + `CommentInput.tsx`（富文本、图片、emoji 反应、审核）。
- 方案图上传：Fider 现有图片/附件上传组件。
- `Button`、状态 lozenge、头像面板等通用 UI。
- API 封装：新增 `public/services/actions/poll.ts`，对标现有 `public/services/actions/post.ts`。

**关联入口**：在 `ShowPost/components/` 加「关联调研」卡片——当某 Post 有关联 Poll 时，于详情页侧栏/底部展示入口。

---

## 六、与现有系统的集成

### 6.1 关联反馈帖（Post ↔ Poll）

- `poll.post_id` 是唯一关联点。一个 Post 可挂 0..N 个 Poll（一对多）；一个 Poll 最多关联一个 Post。
- 与现有 `posts.original_id`（Duplicate 链接）是不同维度，互不影响。

### 6.2 讨论复用（决策 5 · 方案 A）

- `comments` 表加 nullable `poll_id`，`post_id` 改 nullable + CHECK 约束（见 §3）。**复用评论的全部能力**（编辑 / 删除 / emoji 反应 / 内容审核）。
- 现有按 `post_id` 的评论查询路径不变；新增按 `poll_id` 的查询路径。

### 6.3 权限与多租户

- 权限：复用 `middlewares.IsAuthenticated` / `IsAuthorized(enum.RoleCollaborator, enum.RoleAdministrator)`。
- 多租户：所有新表带 `tenant_id`，service 走 `using(ctx, ...)` 模式，与现有表完全一致。
- 内容审核（2025-11 的 `is_approved` 机制）：Poll 讨论沿用现有评论审核流。

### 6.4 上游 merge 友好性（fork 维护关键）

- **零侵入部分**：新增 3 张表、新 service（`bus.AddHandler` 注册）、新路由、新前端页面/组件——均为**新增文件**，不改现有逻辑。
- **唯一侵入点**：方案 A 的 `comments` 表加列 + `post_id` 改可空。merge 时需关注 `comments` 相关迁移与查询。

### 6.5 与 AI 层（P3）的接口

- Poll 结果 + 讨论文本可作为 P3 AI 层的输入：自动摘要「用户为什么更偏好方案 A」、聚合讨论中的反对意见。本提案只需保证数据结构清晰，AI 层后置叠加。

---

## 七、改动评估与分期

**整体规模**：中型二开。迁移（3 表 + `comments` 改列）+ 后端 CQRS 四步 ×（poll / option / vote / results）+ 前端 1 个新页面 + 3 个新组件 + Post 详情页嵌入。无 ORM，照搬 `vote.go` 模式，复杂度可控。

| 阶段 | 范围 | 产出 |
|---|---|---|
| **MVP** | 3 表；单选；投后可见；关联 Post；Collaborator 发起；图文方案；结果条形图；复用评论（方案 A）；手动关闭 | 可用的「设计方案 PK 投票」 |
| **增强 v2** | 多选 / 打分（`max_votes_per_user`）；截止时间自动关闭；独立 `/polls` 列表页 + 筛选；结果导出；匿名投票 | 完整调研能力 |
| **增强 v3（接 P3）** | AI 摘要投票理由、聚合讨论意见、与 Notion 需求池联动 | AI 增强调研 |

---

## 八、实现期注意事项（进入 P2 时复核）

- **迁移顺序**：先建 `polls` / `poll_options`，再 `poll_votes`（依赖 options），最后改 `comments`。
- **number 生成**：复用 Fider posts 的 per-tenant 序号生成逻辑，避免并发重复。
- **结果可见性裁剪**：务必在 **service / handler 层**裁剪未投票用户的票数，不能只靠前端隐藏。
- **`comments` 改动回归**：方案 A 动了核心表，实现后需回归现有 Post 评论的全部用例（增删改、反应、审核）。
- **上游 merge**：每次 merge 上游后重点验证 `comments` 相关变更未与本功能冲突。
