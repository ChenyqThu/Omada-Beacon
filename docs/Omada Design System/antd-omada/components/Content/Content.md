# Content — `Omada.Content`

A **voice & tone / content board** — the writing-fundamentals counterpart to the
Accessibility and Spacing spec boards. It renders the COMPONENT_SPEC §4 writing
rules as live **do / don't** specimens, so the product voice stays anchored to
real, rendered strings instead of a style doc that drifts.

## What it shows

| Rule | Do | Don't |
|---|---|---|
| **Casing** | `Add device` (sentence case) · `Device Details` (Title Case title) | `Add Device` · `Device details` |
| **Product terms** | `Wi-Fi · SSID · MAC address` | `wifi · Ssid · Mac Address` |
| **Numbers & units** | `90 s · 64 MB · 2.4 GHz · 1,250 clients` | `90s · 64mb · 2.4ghz · 1250 clients` |
| **Empty / error microcopy** | names what's missing + next step; blameless & actionable | `Nothing here.` · `Error: operation failed (code 500).` |

Each specimen is a card with a green-check **Do** row, a red-ban **Don't** row
in the real type tokens, and a one-line rationale.

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `className` | `string` | — | Extra class on the root. |

No configuration by design — it's a specimen of the writing rules.

## i18n

Every label, description and specimen string is keyed under `content.*` and
read through `window.t()`. The specimens themselves localize — the casing pair
shows the **Chinese rule** (no case, no trailing punctuation) when `lang=zh`,
not a translated English example.

## Theming

Marks, sample rows, rationale and note come from theme CSS vars in
`omada-overrides.css` (`.omada-content*`) with `[data-omada-theme="dark"]`
twins. No brand hex in the JSX; the do-green and don't-red are the semantic
tokens.

## Rule

Voice is **calm, plain and specific.** Sentence case by default, canonical
product terms, spaced units, and blameless / actionable microcopy — never a raw
status code in front of a user.

**Figma:** no single voice frame; the rules are COMPONENT_SPEC §4 plus the
scattered copy notes in the source (Button `文案过长`, Toast-Message length,
Empty `文案长度限制 560px`). Original synthesis — no branded copy lifted.
