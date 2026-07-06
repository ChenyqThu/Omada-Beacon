/* ────────────────────────────────────────────────────────────────────────
   components/Timeline/Timeline.jsx — OmadaTimeline

   The vertical activity / event feed (device adopted → provisioned → online,
   firmware rollout, audit log). antd <Timeline> draws the rail + dots; we add:
     - a `tone` convenience per item (success / warning / error / info /
       processing / muted) that maps to the antd semantic `color` so dots pick
       up the themed colours, plus a `processing` pulse via a CSS hook
     - optional OmadaIcon dots via `iconName`
   Pass `items` (antd 6 preferred) or children. All antd props forwarded.
   Dot colours come from tokens; the pulse + rail tint live in
   omada-overrides.css with a dark twin. No brand hex in the JSX.

   Figma: audit-log / event-feed pattern (icon/sidebar/audit log 5547:54059).
   Exports: window.Omada.Timeline
   ──────────────────────────────────────────────────────────────────────── */
(function () {
  const { Timeline: AntTimeline } = window.antd;
  const OmadaIcon = window.OmadaIcon;

  // tone → antd Timeline `color` keyword (themed) ; 'muted' → grey
  const TONE = {
    success: 'green', processing: 'blue', info: 'blue',
    warning: 'orange', error: 'red', muted: 'gray',
  };

  function mapItem(it) {
    if (!it || typeof it !== 'object') return it;
    const tone = it.tone, iconName = it.iconName, color = it.color, dot = it.dot, className = it.className;
    const out = Object.assign({}, it);
    delete out.tone; delete out.iconName; delete out.className; delete out.dot; delete out.color;
    if (color) out.color = color;
    else if (tone && TONE[tone]) out.color = TONE[tone];
    if (iconName && !dot) out.dot = <OmadaIcon name={iconName} size={15} />;
    else if (dot) out.dot = dot;
    out.className = ['omada-tl-item', tone === 'processing' ? 'is-processing' : '', className]
      .filter(Boolean).join(' ');
    return out;
  }

  function OmadaTimeline(props) {
    const items = props.items, className = props.className || '';
    const rest = Object.assign({}, props);
    delete rest.items; delete rest.className;
    const cls = ['omada-timeline', className].filter(Boolean).join(' ');
    const mapped = Array.isArray(items) ? items.map(mapItem) : items;
    return <AntTimeline items={mapped} className={cls} {...rest} />;
  }

  OmadaTimeline.Item = AntTimeline.Item;

  window.Omada = window.Omada || {};
  window.Omada.Timeline = OmadaTimeline;
})();
