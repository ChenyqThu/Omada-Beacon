# 设计提案 · 自定义表单

> 状态：**规划中** ｜ 关联路线图：P1c

## 一、现状与目标

Quackback 目前支持 Tags 和 Segments，但不支持在发帖时填写自定义的结构化字段（如产品线、国家、优先级等）。
我们的目标是扩展 Quackback，使其支持基于 Board 配置的动态表单字段。

## 二、数据模型扩展

在 `packages/db/src/schema/` 中新增表：

```typescript
// packages/db/src/schema/custom-fields.ts
import { pgTable, text, boolean, jsonb, integer } from 'drizzle-orm/pg-core';
import { typeIdWithDefault, typeIdColumn } from '@quackback/ids/drizzle';
import { boards } from './boards';
import { posts } from './posts';

export const customFields = pgTable('custom_fields', {
  id: typeIdWithDefault('field')('id').primaryKey(),
  boardId: typeIdColumn('board_id').references(() => boards.id).notNull(),
  key: text('key').notNull(),
  label: text('label').notNull(),
  fieldType: text('field_type').notNull(), // 'text', 'select', 'number'
  options: jsonb('options').$type<string[]>(),
  isRequired: boolean('is_required').default(false).notNull(),
  position: integer('position').default(0).notNull(),
});

export const postFieldValues = pgTable('post_field_values', {
  postId: typeIdColumn('post_id').references(() => posts.id).notNull(),
  fieldId: typeIdColumn('field_id').references(() => customFields.id).notNull(),
  value: jsonb('value').notNull(),
});
```

## 三、API 与前端扩展

1. **Admin 路由**：在 `apps/web/src/routes/admin/settings/boards/` 增加 Custom Fields 配置页。
2. **Portal 路由**：修改 `apps/web/src/components/portal/feedback/create-post-form.tsx`，在渲染时拉取当前 Board 的 Custom Fields 并动态渲染 Shadcn 表单控件。
3. **Server Functions**：修改 `createPost` (在 `post.service.ts` 中) 以接收并验证自定义字段值，写入 `postFieldValues` 表。

## 四、Notion 同步说明

Quackback 已经内置了 Notion 集成（`lib/server/integrations/notion/`）。
自定义字段开发完成后，需要修改 `buildNotionPage` (在 `notion/message.ts` 中)，将 `postFieldValues` 的数据映射到 Notion 数据库的对应属性中。
