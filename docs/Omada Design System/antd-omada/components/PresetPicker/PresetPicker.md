# PresetPicker

The time-window control that sits atop dashboards, log views and charts: a `Segmented` row of quick presets (**Last 24h · 7d · 30d · 90d**) plus a **Custom** option that reveals a `RangePicker`. Picking a preset resolves a concrete `[start, end]` (relative to *now*) and emits it; picking a custom range flips the segment to Custom and keeps those dates. The resolved window is summarised inline so the user always sees the literal span.

Controlled via `value` (the preset key) or uncontrolled via `defaultValue`. Emits `onChange({ preset, range: [dayjs, dayjs] })`. The preset list is fully overridable.

**Figma:** derived from DatePicker 日期选择器 RangePicker + Segmented 分段控制器. Original dashboard time-window composite.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `value` | `string` | — | controlled preset key (`'24h'`…`'custom'`) |
| `defaultValue` | `string` | first preset | uncontrolled seed |
| `presets` | `{ key, amount, unit }[]` | `DEFAULT_PRESETS` | `unit` is a dayjs unit (`'hour'`, `'day'`…) |
| `defaultRange` | `[dayjs, dayjs]` | — | seed for the custom picker |
| `showTime` | `boolean` | `false` | RangePicker + summary include time |
| `showSummary` | `boolean` | `true` | the resolved-span readout below |
| `size` | `'small' \| 'middle' \| 'large'` | `'middle'` | Segmented density |
| `onChange` | `({ preset, range }) => void` | — | `range` is a dayjs pair |

Helpers: `OmadaPresetPicker.DEFAULT_PRESETS`, `OmadaPresetPicker.resolve(key, presets?)` → `[dayjs, dayjs]`.

- Light + dark + i18n (en/zh, preset labels via `t()`) + RTL verified.
- Requires `window.dayjs` (already loaded as antd's date dependency).
