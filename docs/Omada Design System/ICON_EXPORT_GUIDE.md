# 图标 / 插画 SVG 导出清单（给你的操作指南）

> 目标：把 fig 源文件里的**真实矢量图标和插画**导出为 SVG，我接入组件库后即为
> 矢量、可跟随 `currentColor` 换色、任意尺寸清晰。设备图标已用 PNG 渲染图接入，无需你导出（除非要补全整套）。

---

## 为什么需要你从 Figma 导出（而不是我自动提取）

你文件里的图标是用**布尔运算合并形状**（Union / 形状结合）画的。自动化把 .fig 转
SVG 时，布尔运算解不出几何路径（会降级成空方块），多线条图标还会被塌缩丢线。
**而 Figma 自带的「Export → SVG」会在导出瞬间把布尔运算烘焙成干净的 path** —— 这是
拿到忠实矢量的唯一可靠途径，对你只是几次框选 + 导出。

---

## 一、要导出的 4 组（SVG）

| 组 | 在 Figma 里找 | 数量级 |
|---|---|---|
| **主 UI 图标** | 图标库页里的 `icon` 集（action / table / arrow / status…） | ~80+ |
| **侧边栏导航图标** | 组件集 **`Sidebar导航栏icon`**（每个变体 `icon=Client, 选中=On/Off` 这种，两态） | ~79 |
| **Client 终端类型图标** | **`Client 终端用户`** / `clients` 集（iphone / laptop / camera / IoT…） | ~20+ |
| **插画 Illustration** | **`状态插图(300*160)`**、**`功能插图_300*160`**、`Illustration 插画规范` | ~50+ |

## 二、设备图标（PNG，可选补全）

我已接入 6 个型号。要补全整套（~17 型号 + 拓扑变体），导出 **`Product 设备`** 与
**`topo设备`** 帧为 **PNG @2x、透明背景**。

---

## 导出步骤（Figma）

### 单色图标（SVG）
1. **选中单个图标组件**（不要选区块 / section / 带紫框的整组——否则会导出整框）。
2. 右侧面板最下方 **Export** → `+` 添加 → 格式选 **SVG**。
3. **Preset 选 `default`**（保留真实颜色）。**不要用 monochrome**——它会把所有图标压成一个色，语义色（删除=红、成功=绿、警告=橙）信息就丢了，我反而判断不出。也不要 `layer name → classes`。
4. 点 **Export**。批量导出会按图层名生成多个 .svg 文件。
5. 设置建议：**「Include "id" attribute」关掉**。
   保留 default 真实颜色——我靠颜色区分中性图标（→ currentColor 跟随主题）和语义图标（→ 映射到危险/成功/警告 token）。

> 想一次导整套：用 **「SVG Export」** 插件，选中一批**单个图标**一键批量；但别把区块外框一起选进去。

### 插画（SVG）
同上选 SVG。若插画里有文字，导出设置勾上 **「Outline Text」**（把文字转曲，避免缺字体）。

### 设备（PNG）
Export → 格式 **PNG**、**2x**，背景透明（产品图本就是透明 PNG）。

---

## 文件命名 + 放哪里

请用**英文语义名 + 短横线**命名，放进对应文件夹（我已建好）：

```
inbox/
  icons/        ← 主 UI 图标 svg，如  search.svg  refresh.svg  trash.svg
  sidebar/      ← 侧边栏图标 svg，如  client-on.svg  client-off.svg  insight-on.svg
  clients/      ← 终端类型 svg，如    iphone.svg  laptop.svg  camera.svg
  illustrations/← 插画 svg，如        no-data.svg  offline.svg  success.svg
  devices/      ← 设备 png（可选），如 eap670.png  es330.png
```

- Figma 默认会用图层名当文件名（可能带中文/斜杠），**不用手动改名也行** —— 直接把
  整批扔进对应文件夹，我来按图标含义重命名并归类。
- 中文图层名（如 `icon=掉线`）也没关系，我能对照含义映射成英文 key。

---

## 你导出后我会做什么

1. 读取每个 SVG，把 fill/stroke 统一规范成 `currentColor`（实现主题换色）。
2. 用真实路径重建 `OMADA_ICONS` / 插画注册表，**替换掉我手画的那套**。
3. 侧边栏图标做成 On/Off 两态映射，接进 Sidebar / AppShell。
4. 更新预览卡（IconsSidebar / IconsBrand / 新增 Illustrations 卡），跑验收。

**只要把文件丢进 `inbox/` 并告诉我「导好了」，我就开始接入。** 哪怕先导一组（比如先导
侧边栏图标）也行，我可以分批接。
