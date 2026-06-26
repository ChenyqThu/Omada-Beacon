# 06 · 部署方案

## 部署架构总览

**开发与生产用不同方式，这是刻意的**：

| | 开发（国内） | 生产（美国 mac mini） |
|---|---|---|
| Fider 本体 | 宿主机 `make run` / `make watch`（热重载） | **自构建 Docker 镜像** |
| 容器运行时 | Docker Desktop（本机够用） | **OrbStack**（已选定，无商业授权顾虑，比 Docker Desktop 更快省内存） |
| 编排 | `docker-compose` 只起依赖（pgdev/smtp） | `docker-compose` 编排 Fider + Postgres（+ 未来 AI 服务） |
| 入口 | localhost:3000 | **Cloudflare Tunnel**（免公网 IP、自带 TLS + CDN） |

> 为什么生产用 Docker：大量二开 → 需要可复现构建 + 版本化回滚；P3 要加 AI 层 → 多服务编排；未来可能迁 Linux/云 → 零成本迁移。详细权衡见本仓库决策记录。

## 生产：自构建镜像

仓库自带 `Dockerfile`，是**三阶段构建**：

1. `golang:1.25-bookworm` → 编译 Go 二进制 `fider`
2. `node:22-bookworm` → `make build-ssr` + `make build-ui`（SSR + 前端资源）
3. `debian:bookworm-slim` → 最终运行镜像，`EXPOSE 3000`，`CMD ./fider migrate && ./fider`（启动即自动迁移 + 运行）

因为我们大量二开，**用这个 Dockerfile 构建自己 fork 的镜像**（而非拉官方 `getfider/fider`）：

```bash
# 在 mac mini(ARM, OrbStack) 上构建原生 arm64 镜像
docker build -t omada-fider:<版本号> .
```

> 开发用的 `docker-compose.yml` 只含 `pgdev`/`pgtest`/`smtp`/`s3test` 等依赖，**不含 fider 服务**。生产需另写一份含 fider 的 compose，形如：

```yaml
services:
  fider:
    image: omada-fider:<版本号>      # 或 build: .
    restart: always
    environment:
      DATABASE_URL: postgres://fider:***@db:5432/fider?sslmode=disable
      BASE_URL: https://feedback.内部域名
      JWT_SECRET: ***
      # OAuth / SMTP / 邮件等按需
    depends_on: [db]
  db:
    image: postgres:17
    restart: always
    environment:
      POSTGRES_USER: fider
      POSTGRES_PASSWORD: ***
    volumes:
      - pgdata:/var/lib/postgresql/data
volumes:
  pgdata:
```

回滚 = 切镜像 tag 重新 `up -d`；升级 = 构建新 tag → 替换。

## 容量评估：Mac mini + CF Tunnel

> ✅ **数百并发用户 + 万级以内反馈条目，Mac mini + CF Tunnel 绰绰有余。**

- Fider 是 **Go 单二进制 + Postgres**，极度轻量，该量级属很轻的负载。
- **CF Tunnel 很合适**：免公网 IP / 端口暴露，自带 TLS + CDN 边缘缓存，内网穿透稳定。

## ⚠️ 单点风险与备份

mac mini 单机部署是单点。**务必做好 Postgres 定时备份**：

- `pg_dump` 定时导出（cron / launchd）异地存一份
- OrbStack 卷快照
- 关键配置（`.env` / 生产 compose / JWT_SECRET）纳入安全的密钥管理

## 为什么不上 Vercel

> 🚫 **Vercel 架构对不上，不建议。**

- Vercel 的 Go 支持是 **Serverless Functions**（函数式 handler），不是跑常驻服务的。
- Fider 是**有状态常驻服务**：SSR 渲染引擎 + CQRS Bus + 后台任务（发邮件等）+ 中间件链，塞进 Serverless 需大改架构，得不偿失。

## 托管替代（若日后不想自管 mac mini）

对路的选择是 **Fly.io / Railway / Render / VPS**（可跑常驻容器/二进制），配 Supabase 当库亦可。既然我们已用 Docker 镜像化，迁移到这些平台成本极低。
