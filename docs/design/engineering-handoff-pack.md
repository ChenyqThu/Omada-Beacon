# Omada Beacon · Engineering Handoff Pack

> **定位**：交付工程执行契约。把 PRD 拆成可执行 milestone，明确 non-goals、权限测试、数据规则和验收边界。
> **上游**：基于 Quackback fork（全栈 TypeScript，TanStack Start + Drizzle ORM）。

## 0 · 使用方式

1. **先跑通 fork，再做扩展**。
2. **按 milestone 串行推进**，不要跨阶段抢跑。
3. 每个 milestone 必须输出：数据迁移、Server Function / API、前端页面、权限校验、测试。
4. 所有写操作必须经过 Actor + Role 校验（Quackback 的 Policy 层）。

## 1 · 执行原则

- 优先新增 domain 目录 / 新 schema / 新路由，减少改动原生核心逻辑。
- P1 不做 Poll、不做完整平台 dashboard。
- Board Access Tier 是权限的核心——`anonymous` / `authenticated` / `segments` / `team`。
- 所有 public/private 访问差异必须由服务端 Policy 层兜底，不能只靠前端隐藏。
- 每个 milestone 完成后必须有 smoke test 和权限测试。

## 2 · Milestone 总览

| Milestone | 目标 | 核心交付 | Non-goals |
|---|---|---|---|
| P0 | Fork Smoke Test | Quackback 本地跑通 | 不改业务逻辑 |
| P1a | Omada Branding | Design Token 替换、Logo、欢迎文案 | 不做动态字段 |
| P1b | Board Access Control | Segments 配置、Board 权限矩阵、SSO | 不做跨 Board dashboard |
| P1c | Structured Feedback | custom_fields schema、动态表单渲染、详情展示 | 不做 karma |
| P2 | Poll Collaboration | polls domain、单选投票、评论复用 | 不与 Notion 强耦合 |
| P3 | Community Growth | karma / badges / levels | 不阻塞 P1/P2 |

## 3 · P1c · Structured Feedback 详细说明

### Data Model（Drizzle Schema）

```typescript
// packages/db/src/schema/custom-fields.ts
export const customFields = pgTable('custom_fields', {
  id: typeIdWithDefault('field')('id').primaryKey(),
  boardId: typeIdColumn('board_id').references(() => boards.id).notNull(),
  key: text('key').notNull(),
  label: text('label').notNull(),
  helpText: text('help_text'),
  fieldType: text('field_type').notNull(),
  isRequired: boolean('is_required').default(false).notNull(),
  position: integer('position').default(0).notNull(),
  options: jsonb('options').$type<string[]>(),
  enabled: boolean('enabled').default(true).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const postFieldValues = pgTable('post_field_values', {
  postId: typeIdColumn('post_id').references(() => posts.id).notNull(),
  fieldId: typeIdColumn('field_id').references(() => customFields.id).notNull(),
  value: jsonb('value').notNull(),
});
```

### 字段类型白名单（P1c）
- short_text / long_text / single_select / multi_select / number / date / url / email / checkbox

### 字段生命周期规则
- `key` 创建后不可变。
- `field_type` 创建后不可变。
- 已被使用字段不物理删除，只 `enabled=false`。
- disabled 字段不出现在新提交表单，但历史详情继续展示。

## 4 · 权限测试矩阵

| 场景 | 必测点 | 阶段 |
|---|---|---|
| Public board 未登录 | 可浏览，不能投票/评论/提交 | P1b |
| Private board 未登录 | 不可见任何内容 | P1b |
| Segments 匹配用户 | 可访问 Private board | P1b |
| Segments 不匹配用户 | 不可见 Private board | P1b |
| Team member | 可改状态/官方回复/编辑 | P1b |
| Admin | 可配置 Board settings/fields | P1b |
| Non-admin 访问 admin 路由 | 被拦截 | P1b |
| custom field 非法 option | 服务端拒绝 | P1c |
| Poll vote | 单用户单次投票 | P2 |

## 5 · 禁止事项

- 不要在早期阶段做 AI 能力扩展（已由 Quackback 内置）
- 不要修改 Quackback 的 auth 核心逻辑（Better Auth）
- 不要只在前端隐藏权限按钮而不做服务端 Policy 校验
- 不要对已使用 custom field 做物理删除
- 不要把 API keys / tokens 暴露到前端
