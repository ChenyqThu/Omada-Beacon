# 执行清单 · 品牌改名 Fider → Omada Beacon

> 状态：**决策已定，待执行** ｜ 关联路线图：P1 品牌化
> 背景：本仓库是 Fider fork，定位 Omada 内部反馈平台。GitHub 仓库已更名 `ChenyqThu/Omada-Beacon`。本文记录改名决策与分层执行清单。

## 决策记录（2026-06-30）

| 维度 | 决策 | 说明 |
|---|---|---|
| 品牌展示名 | **Omada Beacon** | UI、邮件文案、文档、构建注释里指代「本产品」的 Fider → Omada Beacon |
| npm package name | 已是 `omada-beacon` ✅ | 此前已改 |
| Go module path | **保留 `github.com/getfider/fider`** | 仅内部 import 标识、不对外展示；改动涉及 302 个 .go 文件 import，高风险零收益，fork 通用做法是保留 |
| GitHub 仓库 | 已更名 `ChenyqThu/Omada-Beacon` ✅ | 旧 `fider` URL 自动重定向 |
| git remote | 同步为新地址（待执行） | `https://github.com/ChenyqThu/Omada-Beacon` |
| 本地文件夹 | `/Documents/fider` → `Omada-Beacon`（待执行） | 当前工作目录，改后需重开 IDE/会话 |

## ⚠️ 关键原则：区分「上游 Fider」与「本产品」

docs 与代码里大量出现的 "Fider" 指代**上游开源项目**（如「基于 Fider 改造」「上游 Fider 仓库」「Fider 官方文档」），这些是**正确的、必须保留**。只有指代**我们这个产品**的地方才替换为 Omada Beacon。**禁止全局无脑替换。**

## 分层执行清单

### 层 1 · 品牌展示名（UI / 邮件 / 文案）
- [ ] `locale/*/server.json` 邮件文案里指代本产品的 "Fider 网站" → "Omada Beacon"（20+ 语言；逐条判断，保留指代上游的含义）
- [ ] 前端 UI 中展示给最终用户的 "Fider" 字样
- [ ] `Makefile` 注释 `run: ## Run Fider`（展示性，可改）

### 层 2 · 构建 / 部署标识
- [ ] binary 名 `fider`（Makefile `-o fider`、Dockerfile `COPY ... /server/fider`、`CMD ./fider migrate && ./fider`）—— 改名需同步全部引用并通过 `make build` 验证
- [ ] `docker-compose.yml` container 名 `fider_pgdev / fider_pgtest / fider_s3test`（可改；本地已有容器需重建）
- [ ] `jean.json` 里 `~/dev/fider/` 路径（与层 3 文件夹改名联动）

### 层 3 · 仓库 / 本地环境
- [ ] `git remote set-url origin https://github.com/ChenyqThu/Omada-Beacon`
- [ ] 本地文件夹改名（**最后执行**，改后当前会话/IDE 工作目录失效，需重开）

### 不改（明确保留）
- Go module path `github.com/getfider/fider` 及 302 处 import
- 所有指代上游开源项目 Fider 的文字
- 根目录 `CLAUDE.md`（Fider 官方代码开发指南，保持上游风格便于 merge）

## 执行建议
- 品牌展示名（层 1）可随时安全执行；
- 构建标识（层 2）需配 `make build` / `make test` 验证；
- 本地环境（层 3）建议在终端手动执行（涉及当前工作目录），可提供精确命令。
