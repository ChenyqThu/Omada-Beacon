/* ────────────────────────────────────────────────────────────────────────
   components/Statistic/Statistic.jsx — OmadaStatistic

   Thin wrapper over antd Statistic. Omada adds two conveniences on top of the
   plain antd value display:
   - `icon`  — a leading OmadaIcon shown before the title (KPI tiles)
   - `trend` — { dir: 'up'|'down', value: '12%' } renders a coloured delta
               (green up / red down) using OmadaIcon trending-{up,down}
   Value/title colours come from antd tokens; the trend colours come from the
   semantic success/error tokens so dark mode follows automatically.

   antd has no dedicated Figma node here; metrics follow the type scale
   (value = fontSizeHeading2 24, title = colorTextSecondary 14).

   Exports: window.Omada.Statistic, window.Omada.Statistic.Countdown
   ──────────────────────────────────────────────────────────────────────── */

const { Statistic: AntStatistic, theme: omStatTheme } = window.antd;

function TrendDelta({ trend }) {
  const { useToken } = omStatTheme;
  const { token } = useToken();
  const up = trend.dir === 'up';
  const color = up ? token.colorSuccess : token.colorError;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, color, fontSize: 13, fontWeight: 600 }}>
      <window.OmadaIcon name={up ? 'trending-up' : 'trending-down'} size={16} />
      {trend.value}
    </span>
  );
}

function OmadaStatistic({ icon, iconTone, trend, title, ...rest }) {
  delete rest.icon; delete rest.iconTone; delete rest.trend;
  const composedTitle = (icon || trend)
    ? (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, width: '100%' }}>
        {icon && (
          <window.OmadaIcon name={icon} size={16}
            style={{ color: iconTone || 'inherit', opacity: iconTone ? 1 : 0.8 }} />
        )}
        <span>{title}</span>
        {trend && <span style={{ marginLeft: 'auto' }}><TrendDelta trend={trend} /></span>}
      </span>
    )
    : title;
  return <AntStatistic title={composedTitle} {...rest} />;
}

OmadaStatistic.Countdown = AntStatistic.Countdown;

window.Omada = window.Omada || {};
window.Omada.Statistic = OmadaStatistic;
