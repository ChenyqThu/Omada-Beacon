# DatePicker · RangePicker · TimePicker — `Omada.DatePicker` / `Omada.RangePicker` / `Omada.TimePicker`

Thin wrappers over **antd `DatePicker`**, **`DatePicker.RangePicker`** and **`TimePicker`**. Omada defaults: the OmadaIcon **calendar** suffix (a **clock** for TimePicker, an **arrow-right** range separator), 4px radius + green active border from `omada-theme.js → components.DatePicker`, and the tightened dropdown shadow in `omada-overrides.css`.

All locale-bearing strings — month/weekday names, "Today", the OK button, AM/PM — come from **antd `ConfigProvider locale`** (zhCN | enUS), wired by `OmadaThemeProvider`. Only chrome placeholders (`date.select.ph`, etc.) route through `window.t()`.

`Omada.DatePicker.RangePicker` is attached, and `RangePicker` / `TimePicker` are also exported standalone.

**Figma:** DatePicker 日期选择框 — node `2985:100466` (day / week / month / range; dark twin `3:20068`) · TimePicker 时间选择器 — node `2985:104401`.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `picker` | `date\|week\|month\|quarter\|year` | `date` | DatePicker mode. |
| `showTime` | `boolean \| object` | `false` | Adds the time column (date+time). |
| `suffixIcon` | `node` | calendar / clock | Pass `null` to drop it. |
| `separator` | `node` | arrow-right | RangePicker only. |
| `use12Hours` / `format` | | — | Standard antd time formatting. |
| *(all antd picker props)* | | | `value`, `disabledDate`, `onChange`, … forwarded. |

## Do / Don't
- ✅ Rely on `ConfigProvider locale` for date names — switch language and the calendar reflows automatically.
- ❌ Don't hard-code `format` strings that bake in English month names; let the locale drive display.
