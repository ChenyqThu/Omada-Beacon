# 设计提案 · 自定义表单 + 双 Site + Notion 双向同步

> 状态：**规划中（待 review）** ｜ 关联路线图：P1（双 site + 可配置表单）、P2（Notion 同步）、P3（AI 层复用已有字段）
> 目标：让 Fider 实例既能承接对内（sales）/对外（customer）两套不同的需求采集表单，又能与现有 Notion 需求池/标案池双向打通，逐步取代 PDfeedback(Jira) 这一提交入口。

---

## 决策记录（2026-06-26）

**已确认**：
1. **同步方向** → 首期 **Fider → Notion 单向**；双向回写后置。
2. **可配置表单存储** → **独立表 `post_field_values`**（后续要做 dashboard 多维筛选/统计）。
3. **标案提交** → 对内 site 的一种 **`post_type=case`**，不开第三个 site。
4. **状态机** → **不硬编码 Fider↔Notion 映射**。Fider 侧状态做成**可配置字段**：手动配置，或**从配好的 Notion 状态字段导入/同步定义**。衍生需求（见 §3.7）：
   - **Roadmap 可配置显示哪些状态列**；
   - **每个 ticket（post）可配置是否隐藏**（不展示到 roadmap）。

**待定**（见第六节 5–6）：Notion 通用账号 token、产品线/国家字典是否与 Notion 严格对齐。

**关联架构决策**：对外内容（landing / 101 文档 / blog）用**独立 Astro 站**承载（Starlight 文档主题 + Markdown），**不并入 Fider 前端**——保持 fork 前端干净、便于 merge 上游。内容以 Astro repo Markdown 为准，Notion 作协作草稿；如需「Notion 写作→自动上站」再加 Notion-as-CMS 层。拓扑：`feedback.*`→Fider，`www/docs.*`→Astro。

---

## 一、现状盘点

### 1.1 现有提交入口：PDfeedback（Jira Service Management）

「Product Feature Demand」表单字段（`*` 为必填）：

| # | 字段 | 类型 | 必填 |
|---|---|---|---|
| 1 | Demand Type | 下拉 | ✅ |
| 2 | Region of Business | 下拉 | ✅ |
| 3 | Country/Region | 下拉 | ✅ |
| 4 | Requirement Source | 下拉 | |
| 5 | Brief Description of The Demand | 单行文本 | ✅ |
| 6 | Product categorization | 下拉 | ✅ |
| 7 | Combination Product Categories | 多选 | |
| 8 | Detailed Requirement Description | 富文本 | ✅ |
| 9 | Customer Company Name | 单行文本 | |
| 10 | Brief Description of Customer | 多行文本 | |
| 11 | Projected Volume | 多行文本 | |
| 12 | Expected Delivery Date | 日期 | |
| 13 | Attachment | 附件 | |
| 14 | 共享对象（可见范围） | 下拉 | ✅ |

这套字段 ≈ Notion Backlog 的提交子集，是「对内 sales site」表单的现成模板。

### 1.2 Notion 需求池 Backlog（通用需求管理，40+ 字段）

- data source: `19a15375-830d-818e-a586-000b7367994a`
- 核心字段：`Function Name`(title) / `Description` / `功能类别 Feature Type` / `Requirement Source` / `Country/Region` / `其他产品线` / `Module`/`Submodule` / `Priority` / `Status`(完整状态机) / `场景规模 Scale` / `Competitor` / `JIRA Card`(url) / `Sync2JIRA`(button) / `关联标案`(relation) / `Comment` / `Owner` / `ID`(unique_id)

### 1.3 Notion 标案池 Cases（标案定制需求）

- data source: `19a15375-830d-8102-85e4-000be2c49cba`
- 核心字段：`需求简述 Requirements`(title) / `客户 Customer Name` / `客户类型 Customer Type`(ISP/SI/MSP/End User) / `反馈大区` / `需求国家` / `标案场景 Case Scenarios` / `需求类型`(通用版本/标案定制) / `反馈类型`(Feature/Bug/Optimization) / `优先级评估` / `需求阶段`(status) / `涉及系统` / `POC deadline` / `AI 摘要` / `AI Desc` / `需求池`(relation)

### 1.4 关键洞察

1. **两库双向关联**：`Backlog.关联标案` ↔ `Cases.需求池`，「需求 ↔ 标案」关系已建好。
2. **已有 AI 字段**：Cases 的 `AI 摘要`/`AI Desc` ——与路线图 P3(AI 舆情/摘要) 直接咬合。
3. **已有 Jira 同步**：Backlog 的 `JIRA Card`+`Sync2JIRA`——Fider 不必重做 Jira 集成，沿用现有链路即可。
4. **来源/客户类型字段天然区分内外**：`Requirement Source`(TP-Link Internal / Distributor / End User…)、`Customer Type`(ISP/SI/MSP/End User) 正是「对内 vs 对外」的判别维度。

---

## 二、双 Site 架构

**结论：对内/对外 = 两个 Fider 租户（tenant），不是一个站点里切换。** Fider 原生多租户，字段配置、用户、权限、品牌都按 tenant 天然隔离，零额外隔离成本。

| | 对内 · Sales Site | 对外 · Customer Site |
|---|---|---|
| 受众 | 内部销售/产品/区域团队 | 外部客户/合作伙伴 |
| 准入 | 企业 SSO + 邮箱白名单（已做 P1） | 开放注册 / 客户账号 |
| 表单 | 完整（含国家、客户、标案、Projected Volume 等内部字段） | 精简（标题 + 描述 + 产品 + 少量分类） |
| 标案表单 | ✅ 专门的「标案/Case」提交类型 | ❌ |
| 同步目标 | Backlog + Cases | Backlog（标记 source=external） |

> 两个 site 共用同一套**可配置表单引擎**（见第三节），只是各自配置不同的字段集合。

---

## 三、可配置表单字段系统（核心改动）

让 admin 在 site settings 里自定义提交表单的字段——这是本提案改动量最大、价值最高的部分。

### 3.1 数据模型（推荐方案）

Fider 无 ORM、直写 SQL，新增两张表 + 沿用 tenant 隔离：

```
custom_fields                          -- 字段定义（per tenant）
  id, tenant_id, key, label, help_text,
  field_type,                          -- text|textarea|richtext|select|multiselect|date|number|country|product
  is_required bool, position int,
  options jsonb,                       -- select/multiselect 的选项
  post_type text,                      -- 'demand' | 'case'，支持一个 site 多种提交类型
  enabled bool

post_field_values                      -- 提交值（可筛选/统计）
  post_id, field_id, value             -- value 文本/JSON；多选存 JSON
```

> 为什么用独立 `post_field_values` 表而非 `posts.custom_fields jsonb`：需求池要**按国家/产品线/来源筛选与统计**（这是核心运营诉求），独立表 + 索引比 JSONB 更利于查询；展示侧 join 即可。两方案都可行，倾向独立表。

### 3.2 字段类型

text / textarea / richtext / select / multiselect / date / number / **country**（特殊：可与账号关联自动带入）/ **product**（关联产品线分类，可做成受控字典）/ file（复用 Fider 现有附件）。

### 3.3 配置 UI（admin）

`/admin` 下新增「Form Fields」页：增删字段、拖拽排序、设必填、配下拉选项、选 post_type、启停。参照现有 `ManageTags.page.tsx` 的增删改模式。

### 3.4 提交页动态渲染

改造 `public/components/PostInput`（或新建 `DynamicPostForm`）：按当前 site 的 `custom_fields` 配置动态渲染控件 + 前端必填校验；后端 `action.CreateNewPost.Validate` 读字段定义做服务端校验（必填/类型）。

### 3.5 「国家跟账号关联」

`users` 表加 `country`（注册/SSO 时带入，或个人设置里填）。提交时 country 字段默认填充用户的 country、允许改。SSO 接入后可从 IdP claims 自动映射。

### 3.6 改动评估

中-大型二开：迁移(2 表) + entity/cmd/query/service(CQRS 四步) + admin 配置页 + 提交页动态表单 + 详情页展示自定义字段。建议**分两步**：先做「字段定义 + 提交 + 展示」MVP，再做「筛选/统计/导出」。

### 3.7 可配置状态 + Roadmap 显示控制（决策 4 衍生）

- **状态定义可配置**：新增配置表（per tenant、per post_type）：
  ```
  post_statuses
    tenant_id, post_type, key, label, color,
    show_on_roadmap bool, position int, enabled bool
  ```
  来源：admin 手动维护，**或从对应 Notion 库的 `Status`/`需求阶段` 选项导入/增量同步**（按 key 对齐）。Fider 内置 5 态作为默认种子，可被覆盖。
- **Roadmap 列配置**：Roadmap 页只渲染 `show_on_roadmap=true` 的状态列，顺序按 `position`，admin 勾选哪些状态上 roadmap。
- **Ticket 级隐藏**：`posts` 加 `hide_from_roadmap bool`（默认 false）；collaborator/admin 可在某条 post 上标记隐藏，则它不出现在 roadmap（仍在 All Feedback 列表）。
- 改动点：现有 post status 是 enum 硬编码（`app/models/enum/post_status.go`）+ roadmap 前端按固定态分列；改为读配置表渲染，中等改动。

---

## 四、Notion ↔ Fider 双向同步

### 4.1 字段映射（Fider → Notion Backlog 为主）

| Fider | Notion Backlog | 备注 |
|---|---|---|
| post.title | `Function Name` | |
| post.description | `Description` | |
| post.status | `Status` | 状态机需建映射表（Fider 5 态 ↔ Notion 18 态，取子集对齐） |
| custom: Country/Region | `Country/Region` | select 选项需对齐 |
| custom: Requirement Source | `Requirement Source` | |
| custom: 产品线 | `其他产品线` | |
| custom: Feature Type | `功能类别 Feature Type` | |
| tags | `需求标签` / `Module` | |
| votes 数 | （Notion 无原生对应，存 number 字段或 rollup） | |
| post.id | `PDCard` / 新增「Fider ID」字段 | **关联键**，见 4.4 |
| 标案类提交（post_type=case） | → **Cases** 库（而非 Backlog），按 `需求类型=标案定制` | |

> **状态字段为可配置（决策 4）**：不写死上面这种固定映射。Fider 侧维护一份**可配置的状态定义**（每个状态：key / 显示名 / 颜色 / 是否上 roadmap / 排序），来源可以是①admin 手动配置，或②从对应 Notion 库的 `Status`/`需求阶段` 选项**导入/同步**。同步时按 key 对齐，新增/改名在 Notion 侧发生则增量拉回。这样 Fider 不被锁死在 5 态，可对齐任意 Notion 状态集。

### 4.2 同步方向与触发

- **Fider → Notion**：Fider 侧 webhook（post created/updated/status-changed/commented）→ 同步服务 → Notion API 写入/更新对应 page。Fider 已有 webhook 能力（`/admin/webhooks`）。
- **Notion → Fider**：Notion 无可靠 webhook，用**定时轮询**（按 `last_edited_time` 增量拉变更）→ 写回 Fider。或人工触发批量同步。
- **冲突处理**：字段级 ownership（如 Status 以 Notion 为准、votes 以 Fider 为准）或 last-write-wins + 时间戳。MVP 阶段可先**单向 Fider→Notion**，双向作为第二步。

### 4.3 Comment 同步（你提的「通用账号 + 固定格式」）

Fider 用户在 Notion 无账号，方案：

- **Fider → Notion**：用一个 **Notion integration（通用 bot 账号）** 调 `POST /v1/comments` 代发，正文用**固定可解析格式**嵌入原作者：
  ```
  [Fider#<comment_id>] <作者名>(<角色>) · <ISO时间>
  <评论正文>
  ```
  `[Fider#id]` 前缀用于**去重 + 反向识别**（轮询时跳过自己发的）。
- **Notion → Fider**：读 page comments（`GET /v1/comments?block_id=<page>`），**过滤掉带 `[Fider#]` 前缀的**（避免回环），其余作为外部评论导入 Fider，作者标记为 `Notion: <name>`。
- 官方答复（Response）→ 可映射为 Notion 的状态变更 + 一条带 `[Fider#response]` 的 comment。

### 4.4 ID 关联（去重的根）

每条记录需要稳定双向键：
- Fider 侧：post 存 `notion_page_id`（custom field 或 post 元数据列）。
- Notion 侧：复用 Backlog 已有 `PDCard`/`ID`，或新增「Fider ID」属性存 post id。
- 首次同步建立映射表 `sync_links(fider_post_id, notion_page_id, last_synced_at)`。

### 4.5 技术实现选项

1. **Fider 内置同步服务**（Go，bus handler + 定时 job）——与主程序同进程，最简单，复用 Fider 的 webhook/job 框架。
2. **独立同步中间件**（单独服务，订阅 Fider webhook + 轮询 Notion）——解耦，未来接 Jira/其他系统更灵活，但多一个部署件。
- 倾向：MVP 用方案 1（内置），规模化再抽方案 2。

---

## 五、分期落地建议

| 阶段 | 内容 | 产出 |
|---|---|---|
| **P1.1** | 可配置表单 MVP：字段定义表 + admin 配置页 + 提交页动态渲染 + 必填校验 + 详情页展示 | 对内 site 能配出 PDfeedback 那套字段 |
| **P1.2** | 双 site：建对内/对外两 tenant，各配字段集；users.country + SSO 带入 | 内外分流跑通 |
| **P2.1** | 单向同步 Fider→Notion（Backlog/Cases）：字段映射 + ID 关联 + 状态映射表 | 新反馈自动进 Notion |
| **P2.2** | Comment 同步（通用账号 + 固定格式）+ Notion→Fider 增量回写 | 双向打通 |
| **P3** | 复用 Cases 已有 `AI 摘要`/`AI Desc`：Fider 侧自动分类/摘要写回 Notion AI 字段 | AI 增强 |

---

## 六、待决问题

> 1–4 已在「决策记录」确认（✅）；剩 5–6 待定（⬜）。

1. ✅ **值存储** → 独立 `post_field_values` 表（利于多维筛选统计）。
2. ✅ **同步方向** → 首期单向 Fider→Notion。
3. ✅ **标案** → 同 site 的 `post_type=case`。
4. ✅ **状态** → 可配置 / 可从 Notion 导入（见 §3.7），不硬编码映射。
5. ✅ **Notion 通用账号** → 建专用 integration「**Beacon Sync Bot**」，授权对 Backlog + Cases 两库的写权限；token 存 env `NOTION_SYNC_TOKEN`，comment 代发与字段同步均用它。comment 正文用 §4.3 的 `[Fider#id]` 格式标注原作者。
6. ✅ **字典对齐** → 以 **Notion 为权威源**：产品线 / 国家 / 状态等 select 选项由 Fider 从对应 Notion 字段**导入/增量同步**（见 §3.7），保证严格一致、便于映射对齐。

---

## 附：数据源 ID 速查

- Backlog 需求池 page: `19a15375830d80b6af4fcce9faf4b58b` ｜ 主 data source: `19a15375-830d-818e-a586-000b7367994a`
- Cases 标案池 page: `19a15375830d80b09454cb501c9b3f60` ｜ child db: `19a15375-830d-812c-b2fe-c9868dbd159e` ｜ data source: `19a15375-830d-8102-85e4-000be2c49cba`
