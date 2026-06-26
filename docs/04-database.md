# 04 · 数据库方案

Fider 通过标准 `DATABASE_URL` 连接串接 Postgres。Supabase 本质就是 Postgres，因此也可直接作为 Fider 的库——但**本地 build 场景下有几条铁律必须遵守**。

## 连接方式

`.env` 中的 `DATABASE_URL` 决定连库：

```
DATABASE_URL=postgres://fider:fider_pw@localhost:5555/fider?sslmode=disable
```

Fider 启动时会自动跑 migrations（`./fider migrate`，DDL + prepared statements）。

## 本地端口约定（docker-compose.yml）

| 容器 | 服务 | 宿主端口 → 容器 | 用途 |
|---|---|---|---|
| `fider_pgdev` | pgdev | `5555` → 5432 | 开发库（`DATABASE_URL` 指向它） |
| `fider_pgtest` | pgtest | `5566` → 5432 | 测试库（`.test.env` 用） |
| smtp(mailhog) | smtp | `8025`(UI) / `1025`(SMTP) | 开发邮件捕获 |

## 两个候选方案

| 方案 | 适用场景 | 优点 | 代价 |
|---|---|---|---|
| **A. 纯 Postgres 容器**（推荐起步） | 纯内部自用、追求简单 | 最轻量，与 Fider 官方配置一致，零额外组件 | 无现成数据 GUI |
| **B. 自托管 Supabase** | 想要 Studio 数据 GUI / 后期 AI 层复用 Supabase | 带 Studio 管理界面，为未来 AI 能力预留底座 | 组件多（Auth/Storage/Realtime 等用不上），配置更重 |

> **当前采用方案 A**（本地 `fider_pgdev` 容器）。若后期 AI 舆情/分类层确定要复用 Supabase，或需要数据 GUI，再切方案 B。

## ⚠️ 用 Supabase 时的铁律

1. **必须用直连端口 5432，禁用事务模式连接池**（Supavisor / pgBouncer 的 6543）。Fider 启动会跑 migrations（DDL + prepared statements），事务级连接池会导致迁移失败。
2. **给 Fider 单独建 database / schema + 专用角色**，与 Supabase 自带的 `auth` / `storage` 等 schema 隔离。
3. **不要对 Fider 的表启用 RLS**。
4. 自托管 Supabase 的 Studio **不直接提供连接串**，需手动拼接。

## 备份（生产关键）

mac mini 单机部署属单点风险，**务必做好 Postgres 定时备份**（`pg_dump` / 卷快照）。详见 [06 · 部署方案](./06-deployment.md)。
