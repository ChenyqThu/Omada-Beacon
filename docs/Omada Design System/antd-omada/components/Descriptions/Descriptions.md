# Descriptions — `Omada.Descriptions`

Thin wrapper over **antd `Descriptions`** — the label/value fact list on device-detail panels. Two layouts from the Figma: side-by-side (`layout="horizontal"`, default) and stacked (`layout="vertical"`). Omada defaults: **no colon** (labels read as quiet headers), label colour = `colorTextSecondary` (via `.omada-desc` in `omada-overrides.css`, with a dark twin), value weight 500.

**Figma:** 描述列表 Descriptions — node `60:45920` (左右 / 上下 specimens, 14px).

| Prop | Type | Default | Notes |
|---|---|---|---|
| `colon` | `boolean` | `false` | Omada reads labels as headers, not `Label:`. |
| `layout` | `'horizontal' \| 'vertical'` | `horizontal` | Side-by-side vs stacked. |
| `bordered` | `boolean` | — | antd-native bordered grid. |
| *(all antd Descriptions props)* | | | `column`, `size`, `title`, `extra`, `items`, … forwarded. |

Use `Descriptions.Item` (re-exposed) for the children API, or the `items` prop.

## Do / Don't
- ✅ `<Descriptions bordered column={2}><Item label={t('desc.ip')}>…</Item></Descriptions>`
- ✅ Wrap MAC / IP values in `<span className="omada-mono">`.
- ❌ Don't hard-code the label grey — it's `.omada-desc` (light + dark).
