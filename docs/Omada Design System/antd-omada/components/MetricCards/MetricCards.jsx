/* ────────────────────────────────────────────────────────────────────────
   components/MetricCards/MetricCards.jsx — OmadaMetricCards

   A KPI-card CLUSTER for a dashboard header strip: a responsive grid of metric
   tiles, each a leading tone icon + label, a big value(+unit), a comparison
   delta (green up / red down + "vs last period"), an optional inline Sparkline,
   and an optional range footer (min–max or a target). A shared, optional range
   Segmented control ("24h / 7d / 30d") sits above the grid and reports changes.

   Behaviour:
     · `metrics`: { key, label, value, unit?, icon?, tone?, delta?{dir,value},
       vs?, spark?[n], range?{min,max,unit?} | rangeText? }. Delta colour comes
       from the semantic success/error tokens (dark follows automatically); a
       neutral delta (dir:'flat') reads grey. `goodWhenDown` flips the colour
       sense for metrics where lower is better (latency, errors).
     · `ranges` + `range` + `onRangeChange`: render the Segmented switcher and
       echo the active range; omit `ranges` to hide it.
     · Sparkline tone tracks the delta direction unless overridden.
     · Grid auto-fits (min tile width) and reflows to 1 column on narrow; RTL-safe.

   Thin composition over OmadaCard surface conventions + Segmented + Sparkline +
   OmadaIcon + the Statistic trend-delta colour logic. All chrome theme-var
   driven with a dark twin.

   Figma: KPI tile language — Statistic 统计数值 (no dedicated node; value =
   fontSizeHeading2, label = colorTextSecondary) extended into a comparison card.
   Exports: window.Omada.MetricCards (+ .Card)
   ──────────────────────────────────────────────────────────────────────── */
(function () {
  const { Segmented, theme: mcTheme } = window.antd;
  const Icon = window.Omada.Icon;
  const Sparkline = window.Omada.Sparkline;

  function Delta(props) {
    const { token } = mcTheme.useToken();
    const d = props.delta;
    if (!d) return null;
    const flat = d.dir === 'flat';
    const up = d.dir === 'up';
    // good/bad: up is usually good; goodWhenDown flips it (latency/errors)
    const good = flat ? null : (props.goodWhenDown ? !up : up);
    const color = flat ? token.colorTextTertiary : (good ? token.colorSuccess : token.colorError);
    const icon = flat ? 'minus' : (up ? 'trending-up' : 'trending-down');
    return (
      <span className="omada-mc-delta" style={{ color }}>
        <Icon name={icon} size={15} />
        <span>{d.value}</span>
      </span>
    );
  }

  function MetricCard(props) {
    const m = props.metric;
    const sparkTone = m.spark
      ? (m.delta ? (m.delta.dir === 'flat' ? 'neutral' : ((props.goodWhenDown ? m.delta.dir === 'down' : m.delta.dir === 'up') ? 'up' : 'down')) : 'brand')
      : null;
    const rangeText = m.rangeText || (m.range
      ? (m.range.min + ' – ' + m.range.max + (m.range.unit ? ' ' + m.range.unit : ''))
      : null);
    return (
      <div className={'omada-mc-card' + (props.compact ? ' is-compact' : '')}>
        <div className="omada-mc-top">
          <span className="omada-mc-label">
            {m.icon && <span className={'omada-mc-ic is-' + (m.tone || 'brand')}><Icon name={m.icon} size={15} /></span>}
            {m.label}
          </span>
          {m.delta && <Delta delta={m.delta} goodWhenDown={m.goodWhenDown} />}
        </div>
        <div className="omada-mc-valuerow">
          <span className="omada-mc-value">{m.value}{m.unit && <span className="omada-mc-unit">{m.unit}</span>}</span>
          {m.spark && Sparkline && (
            <span className="omada-mc-spark"><Sparkline data={m.spark} tone={sparkTone} height={34} width={84} /></span>
          )}
        </div>
        {(m.vs || rangeText) && (
          <div className="omada-mc-foot">
            {m.vs && <span className="omada-mc-vs">{m.vs}</span>}
            {rangeText && <span className="omada-mc-range">{rangeText}</span>}
          </div>
        )}
      </div>
    );
  }

  function OmadaMetricCards(props) {
    const className = props.className || '';
    const rest = Object.assign({}, props);
    delete rest.className; delete rest.metrics; delete rest.ranges; delete rest.range;
    delete rest.onRangeChange; delete rest.minTile; delete rest.compact; delete rest.title; delete rest.style;

    const ctx = window.useOmada ? window.useOmada() : null;
    const t = ctx ? ctx.t : (k) => k;

    const metrics = props.metrics || [];
    const minTile = props.minTile || 210;

    return (
      <div className={('omada-mc ' + className).trim()} style={props.style} {...rest}>
        {(props.title || props.ranges) && (
          <div className="omada-mc-bar">
            {props.title && <span className="omada-mc-title">{props.title}</span>}
            {props.ranges && (
              <Segmented
                size="small"
                value={props.range}
                onChange={props.onRangeChange}
                options={props.ranges}
              />
            )}
          </div>
        )}
        <div className="omada-mc-grid" style={{ '--om-mc-min': minTile + 'px' }}>
          {metrics.map((m) => (
            <MetricCard key={m.key} metric={m} compact={props.compact} goodWhenDown={m.goodWhenDown} />
          ))}
        </div>
      </div>
    );
  }

  window.Omada = window.Omada || {};
  window.Omada.MetricCards = OmadaMetricCards;
  window.Omada.MetricCards.Card = MetricCard;
})();
