# Omada × antd 6 — Component Landing Spec

This is the **standard every component must follow** when implementing the Omada component library on top of Ant Design 6. Read this before writing any component. It is the contract between batches so that work done in separate sessions stays consistent.

> TL;DR — We do **not** fork antd components. We wrap them thinly, drive all visuals through `omada-theme.js` tokens, add only the CSS that tokens can't express, and ship every component with **light + dark + i18n (en/zh)** working from day one.

---

## 0. Golden rules

1. **Token-first.** If a visual can be set via an antd theme token, set it in `omada-theme.js` — never hard-code it in a component or with a one-off CSS rule.
2. **No component forks.** Wrap antd. A wrapper adds Omada defaults, sensible prop presets, and (rarely) an extra element. It must still accept and forward all antd props.
3. **Dark mode is not optional.** Every component must render correctly in both `light` and `dark`. If you add custom CSS, add its `[data-omada-theme="dark"]` counterpart in the same commit.
4. **i18n is not optional.** No hard-coded user-facing English in a component. All strings come from the locale dictionary (`omada-i18n.js`) keyed by `en` / `zh`. antd's own strings come from `ConfigProvider locale`.
5. **Match the Figma, then the token.** When the Figma spec and an antd default disagree, the Figma wins — encode the difference as a token override.
6. **Accessibility floor.** 44 px min hit target for primary actions, visible focus ring (3 px green @ 12% / 22% in dark), `aria-*` forwarded.

---

## 1. File & folder layout

Each component (or tight cluster) is one folder under `antd-omada/components/`:

```
antd-omada/
  omada-theme.js          ← tokens (light + dark)  [exists]
  omada-overrides.css     ← global CSS layer       [exists]
  omada-i18n.js           ← string dictionary       [create in batch 1]
  components/
    Button/
      Button.jsx          ← the wrapper
      Button.demo.jsx     ← all states, both themes
      Button.md           ← prop table + usage notes + Figma node id
    DataTable/
      DataTable.jsx
      DataTable.demo.jsx
      DataTable.md
    …
  index.html              ← gallery that mounts every *.demo.jsx  [exists, extend]
```

- **`*.jsx`** — the component. Exports to `window.Omada.<Name>` (UMD-style) so the Babel-in-browser gallery can use it without a bundler. In a real build these become normal ES exports.
- **`*.demo.jsx`** — a self-contained showcase: every variant, size, state, plus a dark-mode row. The gallery imports these.
- **`*.md`** — props, do/don't, and the **Figma node id** the component is derived from (so the next session can `fig_screenshot` it).

---

## 2. The wrapper pattern

```jsx
/* components/Button/Button.jsx */
const { Button: AntButton } = window.antd;

function OmadaButton({ variant, children, ...rest }) {
  // 'variant' is an Omada convenience that maps to antd's type/danger combo.
  const map = {
    primary:   { type: 'primary' },
    secondary: { type: 'default' },
    outline:   { type: 'default', ghost: false },   // outline handled via token
    text:      { type: 'text' },
    link:      { type: 'link' },
    danger:    { type: 'primary', danger: true },
    'danger-ghost': { danger: true },
  }[variant] || {};
  return <AntButton {...map} {...rest}>{children}</AntButton>;
}

window.Omada = window.Omada || {};
window.Omada.Button = OmadaButton;
```

Rules for wrappers:
- **Forward everything.** `{...rest}` last so callers can always override.
- **Add, don't replace.** A wrapper may add a prop (`variant`, `tone`, `status`) but must not remove an antd prop.
- **Keep them tiny.** If a wrapper exceeds ~60 lines, it's probably doing too much — push visuals into tokens or a small CSS class.
- **Name the convenience prop consistently:** `variant` for buttons/tags, `tone` for semantic colour (success/warning/error/info), `status` for connectivity (connected/pending/disconnected/adopting).

---

## 3. Theming — what goes where

| Need | Where it lives |
|---|---|
| Brand colour, hover/active, semantic colours | `omada-theme.js` → `token` |
| Component metrics (radius, height, padding, font) | `omada-theme.js` → `components.<Name>` |
| Light vs dark colour values | the two theme objects in `omada-theme.js` |
| Pill shape, accent bars, header weight — things tokens can't do | `omada-overrides.css` (+ a `[data-omada-theme="dark"]` rule) |
| One-off layout inside a demo | inline style in the `.demo.jsx` only |

**Never** put brand colours as literals inside a component. Pull from `window.OMADA` if you truly need a value in JS (e.g. an inline SVG stroke), and pull the *dark* value when `mode === 'dark'`.

### Dark mode mechanics
- The app root carries `data-omada-theme="light|dark"` on `<html>`.
- antd side: `<ConfigProvider theme={getOmadaTheme(mode, theme.darkAlgorithm)}>`.
- Custom CSS side: every rule that hard-codes a light colour needs a `[data-omada-theme="dark"] …` twin in `omada-overrides.css`.
- Test BOTH before marking a component done. A screenshot of each is required in the PR/handoff.

---

## 4. i18n — the contract

Create `omada-i18n.js` in batch 1:

```js
window.OmadaI18n = {
  en: {
    'common.apply': 'Apply',
    'common.cancel': 'Cancel',
    'device.reboot': 'Reboot',
    'device.forget': 'Forget',
    'status.connected': 'Connected',
    'status.pending': 'Pending',
    'status.disconnected': 'Disconnected',
    // …
  },
  zh: {
    'common.apply': '应用',
    'common.cancel': '取消',
    'device.reboot': '重启',
    'device.forget': '移除',
    'status.connected': '在线',
    'status.pending': '待接入',
    'status.disconnected': '已断开',
    // …
  },
};
window.t = (key, lang) => (window.OmadaI18n[lang] || window.OmadaI18n.en)[key] || key;
```

Rules:
- **Keys are namespaced** `area.thing` and stable forever. Never change a key's meaning; add a new one.
- **antd built-ins** (pagination "items per page", DatePicker month names, Table "No data") come from `ConfigProvider locale={zhCN | enUS}` — do NOT re-translate those yourself.
- **Product chrome strings** (our own labels) come from `window.t(key, lang)`.
- **CJK fallback font** is already in the `fontFamily` token (`PingFang SC → Microsoft YaHei`). Don't restyle per language.
- **Casing**: English follows the Content Fundamentals in the root README — sentence case for buttons/cells, Title Case for page/tab titles. Chinese uses no case and no trailing punctuation on labels.
- **Width**: Chinese strings are usually shorter; German/French (future) longer. Never fix a control's width to its English label — let it size to content, min-width only.

---

## 5. Per-component checklist (Definition of Done)

A component batch is **done** only when every item is true for each component:

- [ ] Wrapper forwards all antd props; convenience props documented in `.md`
- [ ] All visuals driven by tokens; zero hard-coded brand hex in the `.jsx`
- [ ] Renders correctly in **light** — screenshot attached
- [ ] Renders correctly in **dark** — screenshot attached
- [ ] All user-facing strings via `window.t()`; verified in **en** and **zh**
- [ ] antd `locale` respected (dates/pagination/empty states translate)
- [ ] Keyboard focus visible; hit targets ≥ 32 px (≥ 44 px for primary CTAs)
- [ ] `.demo.jsx` shows every variant / size / state incl. disabled & loading
- [ ] Added to `index.html` gallery TOC
- [ ] `.md` notes the Figma node id it was matched against
- [ ] No new console errors/warnings (Babel transformer warning is expected)

---

## 6. Batch plan (suggested order)

The first batch (this repo) already wires the **core 24** via tokens. Remaining work, grouped so each batch is shippable on its own:

**Batch 1 — Foundations & primitives** (do first; everything depends on it)
- **Icons:** copy the real Omada icon set out of the Figma into `antd-omada/assets/icons/` with `fig_copy_files` (do NOT redraw them). Build a tiny `OmadaIcon` component (`components/Icon/Icon.jsx`) that renders these SVGs by name, sized 16/20/24, `currentColor`-driven. **All later batches use `OmadaIcon`, not Lucide.** The Lucide CDN in `index.html` stays only as a fallback until the set is fully extracted; remove it once coverage is complete.
- `omada-i18n.js` dictionary + `window.t`
- `ThemeProvider` wrapper (owns mode + lang state, sets `data-omada-theme`, renders `ConfigProvider`)
- `Button`, `IconButton`, `Tag`/`StatusPill`, `Input`, `Select`, `Switch`, `Checkbox`, `Radio`

**Batch 2 — Data display**
- `DataTable` (sortable, selectable, dense, row actions, empty/loading)
- `Pagination`, `Descriptions`, `Statistic`, `Badge`, `Avatar`, `Tooltip`, `Popover`

**Batch 3 — Forms & overlays**
- `Form` + `Form.Item` presets, `DatePicker`/`RangePicker`/`TimePicker`, `InputNumber`, `TextArea`
- `Modal`, `Drawer`, `Popconfirm`, `message`, `notification`, `Alert`

**Batch 4 — Navigation & layout**
- `AppShell` (Layout + green TopBar + Sider), `Menu` (sectioned, accent bar), `Tabs`, `Breadcrumb`, `Steps`, `Dropdown`

**Batch 5 — Advanced / Pro**
- `Tree`, `TreeSelect`, `Cascader`, `Transfer`
- (optional) `@ant-design/pro-components` v6: `ProTable`, `ProForm`, `ProLayout` re-skinned
- `Upload`, `Collapse`, `Result`, `Empty`, `Segmented`, `Slider`, `ColorPicker`

**Batch 6 — Charts** (separate concern)
- Decide: AntV `@ant-design/charts` vs ECharts. Theme with the Omada accent ramp (`green → lime → blue → magenta → orange → red`). Single calm draw animation (~400 ms), no per-point stagger.

---

## 7. Things explicitly OUT of scope per component

- Real data fetching / state management (Redux, react-query) — components are presentational
- Server-dependent features (real Upload, real auth)
- Custom chart engines — use a charting lib, don't hand-roll SVG beyond sparklines
- Re-implementing antd internals — if antd can't do it via props+tokens, raise it before forking

---

## 8. Reference values (quick copy)

```
Brand green     #00A870   hover #18B782   press #009765   (dark: base #16B981, hover #33C495)
Radii           button 3 · input/tag 4 · card/menu 8 · modal 12 · drawer 16 · pill 999
Control height  sm 24 · default 32 · lg 40   (form control 36)
Focus ring      0 0 0 3px rgba(0,168,112,0.12)   (dark 0.22)
Shadow sm/md/lg 0 4 10 / -4 2 24 / 0 2 16  · #2B2B2B 10/10/14%   (dark: black 45/50/55%)
Dark surfaces   canvas #141414 · surface #1F1F1F · elevated #262626 · border #333
Font            Manrope → PingFang SC → Microsoft YaHei
Motion          120/180/240ms · ease-out cubic-bezier(0.16,1,0.3,1)
```

See `omada-theme.js` for the authoritative list and the root `colors_and_type.css` / `README.md` for the full design system.
