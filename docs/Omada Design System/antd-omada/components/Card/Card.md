# Card — `window.Omada.Card`

Thin wrapper over antd `Card`. Adds an Omada `variant` convenience; forwards
every antd Card prop. All surface/radius/border/shadow values come from tokens
(`omada-theme.js` → `components.Card`, `colorBgContainer`, `colorBorder`,
`boxShadow`), so light + dark are automatic.

## Convenience prop

| prop | values | effect |
|---|---|---|
| `variant` | `outlined` (default) · `shadow` · `filled` | `outlined`: 1px hairline border, flat. `shadow`: borderless + Omada md shadow (`.omada-card-shadow`). `filled`: grey-50 surface, no border, for section grouping. |

## Forwarded antd props (common)

`title`, `extra`, `size` (`default`/`small`), `hoverable`, `loading`,
`actions`, `cover`, `tabList`, `type="inner"`, `styles={{ body, header }}`.
Statics re-exported: `Card.Grid`, `Card.Meta`.

```jsx
<Card variant="shadow" title="Throughput" extra={<a>More</a>}>…</Card>
<Card.Meta avatar={<Icon name="ap"/>} title="EAP670" description="…" />
```

## Do / Don't
- **Do** use `filled` to group related sub-cards; nest with `type="inner"`.
- **Don't** hard-code background/border hex — change the Card token instead.

## Figma
- `Card 卡片` — node **25331:86622** (light); dark region **25331:86633**.
- Spec: corner radius 8, surface #FFFFFF / #1A1A1A, border #ECECEC / rgba(255,255,255,0.1).
