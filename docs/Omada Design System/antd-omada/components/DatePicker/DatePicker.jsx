/* ────────────────────────────────────────────────────────────────────────
   components/DatePicker/DatePicker.jsx — OmadaDatePicker / RangePicker / TimePicker

   Thin wrappers over antd DatePicker, DatePicker.RangePicker and TimePicker.
   Omada defaults: the OmadaIcon calendar / clock suffix (brand consistency),
   4px radius + green active border from omada-theme.js → components.DatePicker,
   and the tightened dropdown shadow from omada-overrides.css. Month names,
   "Today", week headers etc. come from antd ConfigProvider locale (zhCN|enUS)
   — never re-translated here.

   Figma: DatePicker 日期选择框 node 2985:100466 (day / week / month / range,
   dark twin 3:20068) · TimePicker 时间选择器 node 2985:104401.

   Exports: window.Omada.DatePicker (with .RangePicker attached),
            window.Omada.RangePicker, window.Omada.TimePicker
   ──────────────────────────────────────────────────────────────────────── */

const { DatePicker: AntDatePicker, TimePicker: AntTimePicker } = window.antd;
const AntRangePicker = AntDatePicker.RangePicker;

function calIcon()   { return window.OmadaIcon ? <window.OmadaIcon name="calendar" size={15} style={{ color: 'var(--om-ph,#999)' }} /> : undefined; }
function clockIcon() { return window.OmadaIcon ? <window.OmadaIcon name="clock"    size={15} style={{ color: 'var(--om-ph,#999)' }} /> : undefined; }

function OmadaDatePicker({ suffixIcon, ...rest }) {
  delete rest.suffixIcon;
  return <AntDatePicker suffixIcon={suffixIcon !== undefined ? suffixIcon : calIcon()} {...rest} />;
}

function OmadaRangePicker({ suffixIcon, separator, ...rest }) {
  delete rest.suffixIcon;
  const sep = separator !== undefined ? separator
    : (window.OmadaIcon ? <window.OmadaIcon name="arrow-right" size={14} style={{ color: 'var(--om-ph,#999)' }} /> : undefined);
  return <AntRangePicker suffixIcon={suffixIcon !== undefined ? suffixIcon : calIcon()} separator={sep} {...rest} />;
}

function OmadaTimePicker({ suffixIcon, ...rest }) {
  delete rest.suffixIcon;
  return <AntTimePicker suffixIcon={suffixIcon !== undefined ? suffixIcon : clockIcon()} {...rest} />;
}

OmadaDatePicker.RangePicker = OmadaRangePicker;

window.Omada = window.Omada || {};
window.Omada.DatePicker  = OmadaDatePicker;
window.Omada.RangePicker = OmadaRangePicker;
window.Omada.TimePicker  = OmadaTimePicker;
