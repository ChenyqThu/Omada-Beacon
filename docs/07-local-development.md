# 07 · 本地开发指南

从零把 Fider 在本地（国内网络）跑起来。下面步骤就是我们实际走通的路径，含踩过的坑。

## 依赖清单

| 依赖 | 版本 | 用途 | 安装 |
|---|---|---|---|
| **Go** | 1.22+（实测 1.26） | 后端构建/运行 | `brew install go` |
| **Node** | 21/22（实测 26 亦可，有告警） | 前端构建 | 已装 / nvm |
| **Docker** | 任意（OrbStack 亦可） | 跑 Postgres / Mailhog | Docker Desktop 或 OrbStack |
| **godotenv** | latest | `make run`/`make migrate` 读 `.env` | `go install github.com/joho/godotenv/cmd/godotenv@latest` |
| **air**（可选） | latest | `make watch` 后端热重载 | `go install github.com/air-verse/air@latest` |

## ⚠️ 国内网络两个必做配置

1. **Go module 代理**（否则 `go install` / `go build` 拉依赖会超时 proxy.golang.org）：
   ```bash
   go env -w GOPROXY=https://goproxy.cn,direct
   ```
2. **Docker 镜像源**（否则拉 `postgres:17` / `mailhog` 会 auth.docker.io 失败）。可直接从国内源拉取再打 tag：
   ```bash
   docker pull docker.m.daocloud.io/library/postgres:17
   docker tag  docker.m.daocloud.io/library/postgres:17 postgres:17
   # mailhog 在 daocloud 被 403，改用 1panel 源：
   docker pull docker.1panel.live/mailhog/mailhog:v1.0.1
   docker tag  docker.1panel.live/mailhog/mailhog:v1.0.1 mailhog/mailhog:latest
   ```
   或在 OrbStack/Docker 设置里全局配 registry mirror（`docker.m.daocloud.io` 等）。

## 从零跑起来（实际步骤）

```bash
# 0. 前置：装 Go + godotenv，配好上面的 GOPROXY
go install github.com/joho/godotenv/cmd/godotenv@latest
export PATH="$HOME/go/bin:$PATH"          # 确保 godotenv 在 PATH

# 1. 配置环境变量
cp .example.env .env                       # DATABASE_URL 已指向 localhost:5555，JWT_SECRET 已内置

# 2. 起依赖容器（Postgres + 邮件捕获）
docker compose up -d pgdev smtp            # pgdev→5555, mailhog→8025(UI)/1025(SMTP)

# 3. 装前端依赖
npm install

# 4. 构建（go 二进制 + SSR + UI 资源）
make build                                 # 产出 ./fider, ssr.js, dist/

# 5. 建表
make migrate                               # 应用全部 migrations

# 6. 运行
make run                                    # http server started on :3000
```

打开 `http://localhost:3000` → 自动跳 `/signup`（首次创建站点/管理员），左上角有 `DEV` 标记。

## 日常开发：热重载

```bash
go install github.com/air-verse/air@latest
make watch        # = air(后端热重载) + webpack -w(前端热重载)，并自动 migrate
```

改 Go 代码 air 自动重启；改 React/SCSS webpack 自动重编。

## make 命令速查

| 命令 | 作用 |
|---|---|
| `make build` | 构建 server + SSR + UI |
| `make run` | 运行 `./fider`（需先 build） |
| `make migrate` | 执行数据库迁移 |
| `make watch` | 热重载开发（air + webpack -w） |
| `make test` | 跑 Go + Jest 测试 |
| `make lint` | Go（golangci-lint）+ UI（eslint）|

> 改完代码收尾务必跑 `make lint` 和 `make test`（见根目录 `CLAUDE.md`）。

## 常见坑

- **`godotenv: command not found`**：`~/go/bin` 不在 PATH。`export PATH="$HOME/go/bin:$PATH"` 或写进 shell profile。
- **端口 1025/8025 被占**：本机已有 SMTP/其他 mailhog。Fider 仍能连 localhost:1025；要起自带 mailhog 就先腾端口或改映射。
- **`curl -I localhost:3000` 返回 405**：正常。Fider 只允许 GET/OPTIONS，HEAD 被拒；用 `curl -sL` 即可。
- **Node 26 的 webpack 告警**：目前能正常构建；若 `npm install` 或 `make build` 失败，用 nvm 切到 Node 22。
- **Docker daemon 未起**：`open -a Docker`（或启动 OrbStack），等 `docker info` 就绪再起容器。

## 服务地址速查

| 服务 | 地址 |
|---|---|
| Fider | http://localhost:3000 |
| Mailhog（邮件捕获 UI） | http://localhost:8025 |
| Postgres（开发） | localhost:5555（fider / fider_pw / fider） |
