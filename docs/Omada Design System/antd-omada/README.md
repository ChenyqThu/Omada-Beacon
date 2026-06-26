# antd-omada — Omada × Ant Design 6

A standalone exploration: re-skinning **Ant Design 6** (released 22 Nov 2025) with Omada's design tokens to produce a drop-in component library.

v6 is a technical refresh: pure CSS-variables mode by default, React 19 first-class support, fully semantic `classNames` / `styles` props, smaller bundles. Most component APIs stay compatible with v5 — migration is mostly lift-and-shift.

## Why this exists

Omada's product team builds on Ant Design. Rather than re-implement every component, this folder provides:

1. **`omada-theme.js`** — light **and** dark Ant Design `ConfigProvider` theme configs that map Omada's colour ramp, radii, type and spacing onto antd's token surface. Use `getOmadaTheme(mode, theme.darkAlgorithm)`. Drop into any antd@6 app to get an Omada-skinned UI for free.
2. **`omada-overrides.css`** — a small CSS layer for places antd's token system doesn't cover (pill status tags, menu accent bar, switch sizing), with full **dark-mode twins** under `[data-omada-theme="dark"]`.
3. **`index.html`** — a live demo page showcasing every wired component, with a working **Light/Dark + EN/中文** toolbar. Open this to verify the look.
4. **`COMPONENT_SPEC.md`** — the binding standard for implementing the full library (token-first, thin wrappers, mandatory light+dark+i18n, Definition-of-Done, 6-batch plan).
5. **`HANDOFF_PROMPT.md`** — a ready-to-paste prompt for implementing one batch per fresh session.

## Built-in: dark mode + i18n

- **Dark mode** is first-class. `getOmadaTheme('dark', theme.darkAlgorithm)` returns the dark token set (Omada `#1A1A1A`-family surfaces, brightened brand `#16B981`, translucent semantic fills). Set `data-omada-theme="dark"` on `<html>` so the CSS layer's dark twins activate. The top bar stays Omada green in both modes for brand continuity.
- **i18n** is first-class. antd built-ins translate via `<ConfigProvider locale={zhCN | enUS}>`; product chrome strings go through a `window.t(key, lang)` dictionary (`omada-i18n.js`, created in Batch 1). The `fontFamily` token already carries the CJK fallback (`PingFang SC → Microsoft YaHei`).

## How the mapping works

Ant Design 5's design tokens are split into **seed → map → alias**. We only override seed tokens and a handful of component-specific ones:

| Omada token | antd seed token | Value |
|---|---|---|
| `--omada-green-500` | `colorPrimary` | `#00A870` |
| `--omada-green-600` (press) | `colorPrimaryActive` | `#009765` |
| `--omada-green-400` (hover) | `colorPrimaryHover` | `#18B782` |
| `--omada-red` | `colorError` | `#EE385C` |
| `--omada-orange` | `colorWarning` | `#FF8C27` |
| `--omada-blue` | `colorInfo` | `#0069CB` |
| `--font-sans` | `fontFamily` | `Manrope, …` |
| `--radius-sm` | `borderRadius` | `4` |
| `--radius-md` | `borderRadiusLG` | `8` |
| `--space-4` | `controlHeight` | `36` |
| neutrals | `colorTextBase`, `colorBgBase` | `#2B2B2B`, `#FFFFFF` |

Component-level overrides handle:
- `Button` — radius 3 instead of 4, no pillness on default
- `Tag` — radius 4, plus a `.omada-pill` modifier class for round status pills
- `Table` — denser cell padding to match the Figma's 10/14
- `Switch` — track height 20, knob 16 (antd defaults are 22/18)
- `Input` — focus ring 3 px @ 12% green (antd default is 4 px @ 6%)

## What's wired in this first batch

- ✅ **Button** — primary / default / dashed / text / link · all sizes · loading · icon · danger
- ✅ **Input / Input.Password / Input.Search / Input.TextArea**
- ✅ **Select** — single & multi · with search · with icons
- ✅ **Switch** · **Checkbox** · **Radio**
- ✅ **Tag** — solid · status · pill (custom)
- ✅ **Badge** · **Avatar**
- ✅ **Table** — sortable header · row selection · status cells · row actions
- ✅ **Modal** · **Drawer** · **Popconfirm** · **Tooltip**
- ✅ **Tabs** — line · card
- ✅ **Form** — with validation
- ✅ **Menu** — vertical sidebar
- ✅ **DatePicker** · **TimePicker**
- ✅ **Pagination** · **Steps** · **Breadcrumb**
- ✅ **Alert** · **message** · **notification**

## What's NOT in this first batch (ask if you want them)

- ProTable / EditableProTable (would need `@ant-design/pro-components`)
- Tree / TreeSelect / Cascader / Mentions
- ColorPicker / Slider / Rate
- Carousel / Collapse / Result / Empty
- Calendar (only DatePicker is wired)
- Statistic / Descriptions / List
- Upload (chrome only; needs server)
- App-shell composites: Layout.Sider / Layout.Header beyond the demo

## Using this in production

```jsx
// Anywhere your app boots:
import { ConfigProvider, theme } from 'antd';
import enUS from 'antd/locale/en_US';
import zhCN from 'antd/locale/zh_CN';
import { getOmadaTheme } from './omada-theme';
import './omada-overrides.css';

const [mode, setMode] = useState('light');   // 'light' | 'dark'
const [lang, setLang] = useState('en');      // 'en'    | 'zh'
useEffect(() => { document.documentElement.setAttribute('data-omada-theme', mode); }, [mode]);

<ConfigProvider theme={getOmadaTheme(mode, theme.darkAlgorithm)} locale={lang === 'zh' ? zhCN : enUS}>
  <YourApp/>
</ConfigProvider>
```

That's it. Every antd component you already use will adopt the Omada green, Manrope, the radii, the spacing — in light or dark, EN or 中文.

## Open questions for the team

1. **Density.** The Figma's table cells are 10 × 14 px (i.e. 40 px tall rows). Antd default is 16 × 16 (53 px). I matched the Figma. Confirm?
2. **Button radius.** Figma shows 3 px on buttons but 4 px on inputs. Antd has a single `borderRadius` token — we override per-component. Confirm the split is real?
3. **Pill tags.** Omada uses both rectangular tags (4 px radius, status text) and pill-shaped pills (999 px, with a leading dot) interchangeably. I exposed both as `<Tag>` (default) and `<Tag className="omada-pill">`. Want a dedicated `<StatusPill>` wrapper?
4. **Dark mode.** ✅ Wired — `getOmadaTheme('dark', …)` layers Omada's `#1A1A1A`-family surfaces over antd's `darkAlgorithm`, and the CSS layer has full dark twins. Confirm the dark brand-green lift (`#16B981`) and the always-green top bar read right to you.
