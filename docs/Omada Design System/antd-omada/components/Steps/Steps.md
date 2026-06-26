# Steps — `Omada.Steps`

Thin wrapper over antd `Steps`. Matches the Figma "Steps 步骤条" node states.

**Figma:** Steps 步骤条 node `3:15992` — process circle `#00A870` / white index, wait circle `#F4F4F4` / `#636363` index, connector `#E7E9ED`, finished = check, plus a loading node. 24px status nodes; horizontal + vertical.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `current` | `number` | `0` | Active step index. |
| `items` | `Step[]` | — | `{ title, description?, icon?, status? }`. |
| `direction` | `'horizontal' \| 'vertical'` | `'horizontal'` | |
| `size` | `'default' \| 'small'` | `'default'` | |
| `status` | `'wait' \| 'process' \| 'finish' \| 'error'` | `'process'` | Status of the `current` step. |
| `onChange` | `fn` | — | Pass to make steps clickable. |

Plus all antd `Steps` props.

## Visuals

`colorPrimary` (green) drives the process / finish nodes via `omada-theme.js → components.Steps` (titleLineHeight 1.4). No custom CSS needed beyond the shared `.omada-spin` keyframe used for the loading node.

## Loading step

```jsx
{ title: t('steps.configure'),
  icon: <OmadaIcon name="refresh" size={22} className="omada-spin" /> }
```

## Do / Don't

- ✅ Drive a wizard with `current` + Prev/Next buttons (see demo).
- ✅ `status="error"` on the current step turns its node red (semantic token).
- ❌ Don't hand-colour the nodes — they follow `colorPrimary`.
