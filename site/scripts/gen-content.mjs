// 构建期从主仓 docs/ 生成 Starlight 内容（复用原 sync-docs.sh 的 H1→title + 删 H1 逻辑）。
// 单一源头：只改主仓 docs/，build/dev 前自动重生成。生成物 gitignore，不入库。
import { readFile, writeFile, mkdir, readdir } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const SITE = path.resolve(__dirname, "..")
const SRC = path.resolve(SITE, "../docs") // 主仓 docs/
const DST = path.resolve(SITE, "src/content/docs")

// 把正文里指向 .md 的相对交叉链接重写为 Starlight 路由（构建期，不改源，保 GitHub 兼容）
// relDir: 源文件相对 docs/ 的目录（顶层传 ""，design 文件传 "design"）
function rewriteMdLinks(body, relDir) {
  // 先按 ``` 围栏切分，只重写代码块外的段落（奇数段是代码块，原样保留）
  return body
    .split(/(```[\s\S]*?```)/g)
    .map((seg, i) => {
      if (i % 2 === 1) return seg
      return seg.replace(/\]\(([^)\s#]+\.md)(#[^)\s]*)?\)/g, (m, target, anchor = "") => {
        if (/^(https?:|mailto:|\/)/.test(target)) return m // 外链/绝对，不动
        const absFromDocsRoot = path.posix.normalize(path.posix.join("/", relDir, target)).slice(1)
        const slug = absFromDocsRoot.replace(/\.md$/, "")
        return `](/${slug}/${anchor})`
      })
    })
    .join("")
}

// 提取首个 H1 作 title，删掉正文里的该 H1（Starlight 用 frontmatter title 渲染页头，避免重复）
function migrate(raw, fallback, relDir = "") {
  const m = raw.match(/^#[ \t]+(.+?)[ \t]*$/m)
  const title = (m ? m[1] : fallback).replace(/\\/g, "\\\\").replace(/"/g, '\\"')
  let body = m ? raw.replace(m[0], "").replace(/^\s*\n/, "") : raw
  body = rewriteMdLinks(body, relDir)
  return `---\ntitle: "${title}"\n---\n\n${body}`
}

async function run() {
  await mkdir(path.join(DST, "design"), { recursive: true })

  // 顶层 0*.md
  const entries = await readdir(SRC, { withFileTypes: true })
  const top = entries.filter((e) => e.isFile() && /^0.*\.md$/.test(e.name)).map((e) => e.name)
  for (const f of top) {
    const raw = await readFile(path.join(SRC, f), "utf8")
    await writeFile(path.join(DST, f), migrate(raw, f.replace(/\.md$/, ""), ""))
  }

  // design/*.md
  let design = []
  try {
    design = (await readdir(path.join(SRC, "design"))).filter((f) => f.endsWith(".md"))
  } catch {
    /* design/ 不存在则跳过 */
  }
  for (const f of design) {
    const raw = await readFile(path.join(SRC, "design", f), "utf8")
    await writeFile(path.join(DST, "design", f), migrate(raw, f.replace(/\.md$/, ""), "design"))
  }

  console.log(`✓ gen-content: ${top.length} 篇文档 + ${design.length} 篇 design → src/content/docs/`)
}

run().catch((e) => {
  console.error("✗ gen-content 失败:", e)
  process.exit(1)
})
