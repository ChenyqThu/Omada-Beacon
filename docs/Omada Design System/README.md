# Omada Design System

A design system for **TP-Link Omada** — the enterprise networking and surveillance platform from TP-Link. Omada is a unified product family that includes:

- **Omada Cloud / Cloud-Based System** — multi-site network operations from the browser
- **On-premises Systems** — self-hosted controller for SMB/enterprise networks
- **Omada PRO** — managed-service-provider tier (white-label, multi-tenant)
- **VIGI** — networked video surveillance, surfaced inside the same shell
- **Account Manager / SD-WAN** — auxiliary tools that share the chrome

The shell is browser-first, runs on desktop resolutions (≥1280 wide), and is used by network admins and IT managers — not consumers. The visual language is **utilitarian, dense, and data-forward**, anchored by a single signature green.

## Sources used to build this system

- **Figma**: `🌟 商用WEB组件库.fig` — TP-Link internal Omada Web Component Library, mounted to the agent VFS during build. The library has ~90 pages covering Color, Type, Buttons, Forms, Tables, Charts, Sidebars, Top-Bars, Sample Layouts, Dashboard mocks, Iconography, Illustrations and Logo. ~167k nodes total.
- **Uploaded asset**: `uploads/Omada logo_圆角.png` — Omada app icon (rounded square, 384×384).
- **Public reference**: tp-link.com / omada-product pages, used only for sanity-checking the product context. Not redistributed here.

You don't need access to those sources to use this system — everything has been distilled into the foundations and assets in this folder.

---

## Visual Foundations

The Omada visual language is built around one strong colour, a tight neutral palette, and Manrope. Density is high but breathing room exists between cards. There is **no glassmorphism, no gradient backgrounds, no bouncy motion, no playful illustration**.

### Colour vibe

- **Single hero colour**: a saturated, slightly cool **brand green `#00A870`** carries the entire identity. It paints the top bar, the brand mark, every primary button, every chart line that represents "good" / online / healthy state, and active sidebar items.
- **Dark teal `#0A5A5A`** is the original logo plate — used on the rounded app icon and on dark marketing surfaces.
- A **flat 256-step ramp** generated from the brand green (mix toward `#FFFFFF` to lighten by 20% per step, toward `#000000` to darken by 10% per step) is the recommended way to build hover, press, tint and disabled states. See `colors_and_type.css`.
- **Secondary accents** (Omada Lime `#A6EF00`, Blue `#0069CB`, Magenta `#F476FF`, Orange `#FF8C27`, Red `#EE385C`) are reserved for charts and category tags. They are *never* used as page-level chrome.
- **Neutrals** are warm-grey, not blue-grey. Body text is `#2B2B2B` ("Soft Black"), secondary `#636363`, tertiary `#999999`. In accessible mode `#999` is upgraded to `#636363` per the Figma rule.
- Backgrounds are flat `#F7F7F7` (app) and `#FFFFFF` (surface). No noise, no gradients, no patterns.
- Dark mode collapses the surface to `#1A1A1A` — same green, same accents, neutrals inverted.

### Typography

- Primary face: **Manrope** (400 / 500 / 600 / 700 / 800).
- System fallback order from Figma: `Manrope → Arial → Sans-Serif → Geneva → Verdana`.
- Chinese fallback: **PingFang SC** (used for all 中文 strings in product chrome and marketing pages).
- TP-Link's proprietary **TP-Link Aktiv** ships with parts of the Figma — *we substitute Manrope for it* (see Caveats).
- Headings use `line-height: 100%` (the Figma's convention) with letter-spacing 0 to slightly negative on large display sizes (-0.08px @ 28–48px).
- Body text is 14px (rare to see 16) and very rarely below 12. Form labels are 14/Medium.

### Spacing & layout

- 8-point base scale. Most padding lands on 8, 16 or 24. Card body padding is **24px**.
- Page content grid: 12 columns, **16px gutter**, 24px outer padding.
- Sidebar A-zone (Dashboard overview side panel) is **fixed at 300px**, Topology side panel is **fixed at 260px**, all other left rails are auto.
- Top-bar height **56px**. Sidebar collapsed width **48px**, expanded **220px**.

### Corner radii

- Buttons: **3px** (very slight). Icon buttons (circular FABs): full pill.
- Inputs / tags: **4px**.
- Cards / dropdowns / popovers: **8px**.
- Drawers / modals: **16px**.
- Brand icons (rounded app icon): **20% of side length** (e.g. 192×192 → 38px radius).

### Borders & dividers

- Default border `1px solid #ECECEC`. Stronger `1px solid #CCCCCC`. Focus uses the brand green at 1px.
- Dividers inside panels are `1px solid rgba(0,0,0,0.06)` — almost invisible.
- No double borders, no shadow-as-border combos.

### Shadows / elevation

Three named elevations are defined on the **Shadow** page of the Figma:

| Token | Use | Spec |
|---|---|---|
| `--shadow-sm` (dropdown / popover) | menus | `0 4px 10px rgba(43,43,43,0.10)` |
| `--shadow-md` (drawer) | side sheets | `-4px 2px 24px rgba(43,43,43,0.10)` |
| `--shadow-lg` (tooltip) | tooltips, hover cards | `0 2px 16px rgba(43,43,43,0.14)` |

Dark variants exist for inverse surfaces. **Cards do not carry a default shadow** — they sit on the white surface and are defined by their internal padding and a single hairline border.

### Hover / press states

- Hover: lighten or darken by ~10% of the source colour. Primary green button hover is `#18B782`, press is `#009765`.
- Outline buttons fill with `--omada-green-50` on hover.
- Sidebar item hover: `--grey-100` background, no colour change to text.
- Icon-only buttons hover with a subtle `rgba(0,0,0,0.04)` plate.
- Disabled: 40% opacity on the filled variant, neutral grey on outline/text variants. *Never* greyscale-and-strikethrough.
- No press-scale ("squish") effects.

### Backgrounds & imagery

- The product chrome itself uses **no imagery**.
- Login / empty-state illustrations exist in `/Illustration-UI/` — they are colourful, flat, isometric line drawings of routers, APs and cameras. Always on a white background.
- Marketing screenshots of devices are photographed dead-front on white with a subtle drop shadow.
- No full-bleed hero imagery in the product. No backgrounds with grain, gradient, or pattern.

### Motion

- Durations: 120ms (micro), 180ms (default), 240ms (drawer/dialog).
- Easing: `cubic-bezier(0.16, 1, 0.3, 1)` (out) for entrance, smooth in-out for state toggles.
- Modals/drawers fade and slide in; popovers fade only.
- Charts redraw with a single, calm `draw-line` over ~400ms — no per-point staggering, no bounce.
- Loading spinners are a single rotating Omada-mark.

### Transparency / blur

- Used very sparingly. The only places transparency appears are:
  - `rgba(0,0,0,0.04)` icon-button hover plate
  - `rgba(255,255,255,0.9)` tertiary-on-coloured swatches
  - `rgba(43,43,43,X)` for shadows
- **No backdrop-filter blurs anywhere.** Modal scrims are flat `rgba(0,0,0,0.45)`.

### Iconography summary (see ICONOGRAPHY section below)

- 24×24 / 20×20 / 16×16 stroke icons, ~1.5–2px stroke, rounded line caps, optical-aligned to the pixel grid.
- Filled glyph variants exist for product-type markers (AP/Switch/Gateway/Camera) and for nav-active states.

---

## Content Fundamentals

Omada's voice is **technical, neutral, and direct**. Network admins read fast and don't want adjectives.

### Voice characteristics

- **Second person, imperative.** "Apply", "Reboot", "Move to Site", "Choose a site", "Select clients to reconnect". Almost never "Please". Almost never "We".
- **No exclamation marks. No emoji.** A single celebratory `!` would feel out of place. Emoji is not part of the brand. The Figma file uses 🌟 only as the file-name decoration — never in product copy.
- **Sentence case** for buttons, menu items, table cells, toasts. Title Case is used for page titles, table column headers, and tab labels ("Site Health Trend", "All Network Activity", "Pending Alarm").
- **Tech terms uppercase** when they're acronyms: WAN, LAN, VLAN, IP, MAC, SNMP, DPI, 802.1X, EoGRE, SSID, PoE, AP, DNS, UPnP. Don't smart-case them.
- **Numbers carry units inline, no space**: `132.60W`, `23.1W/132.60W`, `12/20`, `5GHz`. Time uses 24h with `:` and `am/pm` lowercase: `16:57:04`, `11:00 am`.
- **Status words are short, present tense**: Connected, Disconnected, Pending, Adopting, Adopt, Forget, Reboot, Skip, Disable, Online, Offline.
- **Settings descriptions are one sentence** that finishes the thought. Example: "Advanced wireless settings for your device are displayed on this page."

### Things that DO appear

- Crisp imperatives: "Apply", "Cancel", "Refresh", "Save", "Log Out", "Sign Out".
- Lower-cased filler in helper text: "Please select…" (the *only* place "please" is allowed — placeholder text).
- Beta/Preview tags on new features (small pill, `--omada-orange` background, white "BETA").
- Bilingual hint strings in the Figma (e.g. "Top Bar 顶部栏") because it's a Chinese internal file — *do not ship bilingual copy*.

### Things to AVOID

- Marketing-speak ("seamlessly", "powerful", "intelligent" — except in the product name "IntelliRecover").
- Emoji of any kind.
- "Awesome", "Oops", "Whoops", "Hey".
- Walls of helper text. If a setting needs two paragraphs of explanation, link to docs instead.
- Sentence-final punctuation on labels and button text. ("Apply" not "Apply.")

### Sample microcopy from the real product

> Site Name 1231231231231
> Site Health Score: 76
> Pending Alarm 12
> PoE power drop event - Port 1 - Nov 7. 4:00 pm
> Switch dropped - Nov 8. 5:01 pm
> Wireless network offline
> Last test 11/20, 9:00 pm
> Used Port 12 / 20
> Remaining PoE Power 23.1W / 132.60W
> AA:BB:CC:DD:EE:FF
> Connected | 10 days 16:57:04

That's the register. Stay in it.

---

## Iconography

Omada uses a **bespoke line-icon set** drawn at 16, 20 and 24 px on a 1.5–2px stroke with rounded caps. Categories that appear most:

- **Sidebar nav** — Settings, Devices, Clients, Map, Insights, Alerts & Logs, Network Config, Device Config, Hotspot, Tools, IntelliRecover, Maintenance. Each has a 20×20 outline variant; active state is the same outline coloured with the brand green (no fill swap).
- **Status markers** — Adopted, Pending Adoption, Disconnected, Reboot, Forget, Move to Site (filled glyphs).
- **Device-type markers** — Gateway, Switch, AP, Camera (semi-filled isometric glyphs in the top-bar product picker and topology nodes).
- **Inline informational** — Info `ⓘ`, Warning, Error/Ban (`⊘`-style), Loading, Refresh, Search, Drawer collapse, Sun (theme toggle), kebab/more.
- **Brand mark** — the **Omada O** is a circle with white spokes on a teal field. It doubles as a loading spinner.

Icon copy strategy in this design system:

- The brand mark and full Omada wordmark **have been copied as SVGs** into `assets/` from the Figma. Use these instead of redrawing.
- For everything else (sidebar, table actions, inline) the system **substitutes Lucide icons via CDN**. Lucide matches Omada's stroke style (1.5-2px, rounded caps, 24px artboard) closely enough to feel native. The substitution is flagged because the real shipping icons in the Figma are bespoke variants — pixel-perfect work should pull them out one-by-one with `fig_copy_files`.
- Unicode characters are **never** used as icon stand-ins. No `→`, `✓`, `✗`, `≡` in production copy — always an SVG.
- Emoji is never used anywhere.

```html
<!-- The CDN substitute: -->
<script src="https://unpkg.com/lucide@latest"></script>
<i data-lucide="settings"></i>
```

For brand marks, prefer the local SVGs:

| File | Use |
|---|---|
| `assets/omada-logo.svg` | Wordmark on light surfaces (login, About, dark sidebar header). Teal `#0A5A5A`. |
| `assets/omada-logo-dark.svg` | Wordmark for inverse surfaces — white on dark. |
| `assets/omada-pro-logo.svg` | "Omada PRO by tp-link" wordmark (MSP tier). |
| `assets/omada-mark.svg` / `assets/omada-mark-pro.svg` | Just the O. Loading-spinner source. |
| `assets/omada-app-icon.png` | 384×384 rounded-corner app icon. |

---

## CAVEATS — flagged substitutions

- **TP-Link Aktiv → Manrope**. The Figma references TP-Link's proprietary corporate face (`TP-Link Aktiv Regular/Medium/Light/Bold`) in ~900 nodes. We don't have the font files. Manrope is the next family in the Figma's documented fallback order and was used for ~10,000 nodes already, so substituting it preserves the system's intent. **If you have TP-Link Aktiv .woff2 files, drop them in `fonts/` and add an `@font-face` block at the top of `colors_and_type.css`.**
- **PingFang SC** is also referenced (~3500 nodes) for Chinese strings. It is Apple-licensed and not freely embeddable; on non-Apple platforms it falls back via the `--font-cn` stack to Microsoft YaHei.
- **Icons → Lucide CDN.** Most product icons are Omada-bespoke. We pull from Lucide for breadth; brand marks and product-type glyphs (router/switch/AP/camera) are the real Omada SVGs.
- **Imagery**: a couple of small QR-code stamps and the Topology-node images live in the Figma and were not copied — they're not part of the design system per se, they're production data.

---

## Index — what's in this folder

```
README.md                ← you are here
SKILL.md                 ← Agent Skill manifest (also works in Claude Code)
colors_and_type.css      ← All design tokens (colors, type, spacing, radii, shadows, motion)

assets/                  ← Logos & brand marks (SVG + PNG)
  omada-logo.svg               wordmark, colour
  omada-logo-dark.svg          wordmark, inverse
  omada-pro-logo.svg           PRO wordmark
  omada-pro-logo-dark.svg      PRO wordmark, inverse
  omada-mark.svg               O-mark, used as spinner
  omada-mark-pro.svg           PRO O-mark
  omada-app-icon.png           384×384 rounded app icon

preview/                 ← Design System tab cards (registered as assets)
  ColorsPrimary.html
  ColorsAccents.html
  ColorsNeutrals.html
  ColorsSemantic.html
  TypeScale.html
  TypeFamilies.html
  Spacing.html
  Radii.html
  Shadows.html
  ButtonsPrimary.html
  ButtonsSecondary.html
  ButtonsOutline.html
  ButtonsDestructive.html
  FormInputs.html
  Tags.html
  IconsBrand.html
  IconsSidebar.html
  Logos.html

ui_kits/
  omada-console/         ← Single UI kit: the Omada cloud console
    README.md
    index.html                 ← interactive click-through (login → dashboard → devices)
    TopBar.jsx
    Sidebar.jsx
    Dashboard.jsx
    DevicesTable.jsx
    LoginScreen.jsx
    components.jsx             ← Buttons, Card, StatusPill, etc.
```

---

Next: read `colors_and_type.css` for the token surface, then `preview/` for visual specimens, then `ui_kits/omada-console/index.html` for a working product mock.
