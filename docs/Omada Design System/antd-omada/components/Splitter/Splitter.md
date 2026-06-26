# Splitter — `Omada.Splitter` (`.Panel`)

Resizable master/detail panel group (device list ↔ detail, topology ↔ inspector). antd `<Splitter>` + `<Splitter.Panel>` own the drag mechanics; the wrapper re-skins the drag bar to a hairline that turns brand-green on hover/drag (`omada-overrides.css`, dark twin included).

| Prop | Type | Default | Notes |
|---|---|---|---|
| `layout` | `'horizontal' \| 'vertical'` | `'horizontal'` | Forwarded. |
| `Panel.defaultSize` | `number \| string` | — | Initial size (`%` or px). |
| `Panel.min` / `Panel.max` | `number \| string` | — | Resize bounds. |

The Splitter needs an explicit height (set on the `style`). All antd props forwarded. **Figma:** master/detail layout from `/Layout` (node `3:64434`).
