# 设计提案 · 内容站架构（Landing + 101 文档 + Blog）

> 状态：**规划中（待 review，先不落地）** ｜ 关联：项目改名 **Omada Beacon**、[custom-forms-and-notion-sync](./custom-forms-and-notion-sync.md) 的架构决策
> 核心决策：对外内容（landing / 101 文档 / blog）用**独立 Astro 站**承载，**不并入 Beacon(Fider) 前端**。

## 一、目标与边界

- **承载**：landing page、101 文档库（产品使用/上手文档）、未来 blog。
- **不承载**：反馈应用本身（那是 Beacon 反馈站）。
- 独立 repo、独立技术栈、独立部署。

## 二、为什么独立（不塞 Beacon/Fider 前端）

1. Beacon 是 Fider fork，要长期 merge 上游——前端越干净，merge 越省心；塞 landing/docs/blog = 冲突地狱。
2. Fider 前端是为「反馈应用」服务的 SSR React，不是内容站引擎。
3. 关注点分离：内容站独立部署（CF Pages，近零成本零运维）、独立迭代、SEO/性能更好。

## 三、技术选型：Astro + Starlight

| 需求 | 方案 |
|---|---|
| 框架 | **Astro**（静态优先、内容驱动、零 JS 默认、SEO 友好） |
| 101 文档 | **Starlight**（Astro 官方文档主题）——侧边栏 / 全文搜索 / 多语言 / 暗色开箱即用 |
| landing | Astro 组件自由定制 |
| blog | MDX |
| 部署 | Cloudflare Pages（与 Beacon 的 CF Tunnel 同生态） |

> 组件体系与 Beacon **互不牵扯**：内容站用 Starlight/Astro 自带体系，Beacon 内部用自建组件 + SCSS。两个项目各自内部统一即可。

## 四、站点结构（草案）

```
omada-beacon-site/            (Astro，独立 repo)
├── src/pages/index.astro     # landing
├── src/content/docs/         # 101 文档（Starlight content collection）
├── src/content/blog/         # blog（MDX）
├── src/components/           # landing 用自定义组件
└── astro.config.mjs
```

路由：`/`→landing ｜ `/docs`→101 文档 ｜ `/blog`→blog。

## 五、内容来源

- **主**：Astro repo 的 Markdown/MDX（git 版本化、可 review、可回滚）。
- **Notion**：作协作草稿（可选）。
- **可选后期**：Notion-as-CMS（Astro 构建时拉 Notion API），给非技术同事「在 Notion 写、自动上站」——起步不上，Markdown 最可控。

## 六、与 Beacon 的关系（拓扑）

```
www.* / docs.*   → Astro 内容站（landing / 101 文档 / blog）
feedback.*       → Beacon 反馈应用（Fider fork）
```

互链：landing 的 CTA → feedback 站；101 文档引用 feedback 提交入口。

## 七、分期（先不落地）

| 阶段 | 内容 |
|---|---|
| **S1** | Astro + Starlight 骨架 + landing 雏形 + 把现有「对外」docs 搬入 |
| **S2** | 完善 101 文档库 |
| **S3** | blog |
| **S4（可选）** | Notion-as-CMS 接入 |

## 八、待决 / 待办

1. 域名规划（www / docs / feedback 子域）。
2. landing 设计方向（视觉、信息架构）。
3. 文档分流：哪些 docs 对外（搬 101）、哪些对内（留 Beacon repo `docs/`）。
4. 是否需要中英双语文档（Starlight 原生支持 i18n）。
