# Popconfirm — `Omada.Popconfirm`

Thin wrapper over **antd `Popconfirm`** — the inline "are you sure?" bubble that hangs off its trigger (distinct from `Popover`'s rich card and `Modal`'s centered dialog). Omada swaps antd's default glyph for an OmadaIcon and adds a `tone` convenience; OK / Cancel labels come from antd `ConfigProvider locale`. Bubble radius (8px) + shadow inherit the shared Popover tokens.

**Figma:** Popover 气泡卡片 (confirm variant) — node `3:25129`.

| `tone` | Glyph / colour | OK button | Use for |
|---|---|---|---|
| `danger` | warning · red | danger | Delete / forget — destructive. |
| `warning` *(default)* | warning · orange | normal | Reversible risk. |
| `info` | info · blue | normal | Low-stakes confirm. |

| Prop | Type | Notes |
|---|---|---|
| `tone` | `danger\|warning\|info` | Picks glyph + OK styling. |
| `title` | `node` | The question. |
| `description` | `node` | Optional supporting line. |
| `icon` | `node` | Override the auto glyph. |
| *(all antd Popconfirm props)* | | `onConfirm`, `placement`, `okText`, … forwarded. |

## Do / Don't
- ✅ Use `tone="danger"` for row-level delete / forget — quicker than a full Modal for a single record.
- ❌ Don't use Popconfirm when the consequence needs explanation across multiple lines or a form — escalate to `useModal().confirmDelete`.
