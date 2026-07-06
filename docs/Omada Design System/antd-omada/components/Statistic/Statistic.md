# Statistic — `Omada.Statistic`

Thin wrapper over **antd `Statistic`** with two Omada conveniences for KPI tiles:

- `icon` — a leading `OmadaIcon` before the title
- `trend` — `{ dir: 'up'|'down', value: '3.2%' }` renders a coloured delta (green up / red down) using `OmadaIcon trending-{up,down}`. Colours come from the semantic `colorSuccess` / `colorError` tokens, so dark mode follows automatically.

Value uses tabular figures + weight 600 (`omada-overrides.css`). No dedicated Figma node — metrics follow the type scale (value = `fontSizeHeading2` 24, title = `colorTextSecondary`).

| Prop | Type | Default | Notes |
|---|---|---|---|
| `icon` | `string` | — | `OmadaIcon` name shown before the title. |
| `iconTone` | `string` | `inherit` | CSS colour for the icon. |
| `trend` | `{dir, value}` | — | `dir: 'up'\|'down'`; renders the coloured delta on the right. |
| `loading` | `boolean` | — | antd-native skeleton. |
| *(all antd Statistic props)* | | | `value`, `precision`, `prefix`, `suffix`, `title`, … forwarded. |

`Statistic.Countdown` re-exposed.

## Do / Don't
- ✅ `<Statistic icon="cloud" title={t('stat.online')} value={231} trend={{dir:'up',value:'3.2%'}} />`
- ❌ Don't hard-code the trend green/red — they're semantic tokens.
