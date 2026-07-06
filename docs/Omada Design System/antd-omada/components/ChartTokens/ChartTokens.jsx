/* ────────────────────────────────────────────────────────────────────────
   components/ChartTokens/ChartTokens.jsx — OmadaChartTokens

   A DATA-VIZ TOKEN board — the chart-side companion to ColorTokens / Elevation.
   It renders omada-chart-theme.js LIVE so the documented chart language can
   never drift from what ECharts actually paints:

     1. Accent ramp — window.OMADA_CHART_RAMP.byName, in spec order
        (green → lime → blue → magenta → orange → red, + grey), name + hex,
        click to copy. Identical across light/dark by Figma rule.
     2. Fill rules — the three area treatments as real ECharts mini-previews
        built from omadaChartBase + omadaLineFill: ≤2 lines → gradient,
        ≥3 lines → solid no-fill, stacked → solid @ stackPct.
     3. Structural tokens — axis / split / text / tooltip colours from
        omadaChartColors(mode), so the per-mode values are read, not guessed.

   NOT a primitive — it reads the chart-theme module + renders Omada.EChart.
   Surfaces are theme vars with dark twins in omada-overrides.css.

   Figma: chart ramp + rules transcribed in omada-chart-theme.js from
   "Chart 图表–折线图" (node 13973:7050) and "Chart 图表（类型）" (node 536:13574):
   ≤2 lines gradient color@8%→0% (light) / @12% (dark); ≥3 solid 1.2px no fill;
   stacked solid @20% (light) / @24% (dark); horizontal dashed grid only.
   Exports: window.Omada.ChartTokens
   ──────────────────────────────────────────────────────────────────────── */
(function () {
  const { useState } = React;

  const RAMP_ORDER = ['green', 'lime', 'blue', 'magenta', 'orange', 'red', 'grey'];

  // mini line option for a fill-rule specimen
  function specimenOption(mode, lang, kind) {
    const ramp = window.OMADA_CHART_RAMP.byName;
    const colors = kind === 'solid'
      ? [ramp.green, ramp.blue, ramp.magenta]
      : [ramp.green];
    const X = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const seed = [
      [12, 18, 15, 24, 20, 28],
      [8, 12, 10, 16, 14, 20],
      [5, 7, 6, 11, 9, 13],
    ];
    const fillKind = kind === 'gradient' ? 'gradient' : (kind === 'stack' ? 'stack' : 'none');
    const series = colors.map((c, i) => ({
      type: 'line',
      smooth: true,
      symbol: 'none',
      lineStyle: { width: kind === 'solid' ? 1.4 : 2, color: c },
      stack: kind === 'stack' ? 'all' : undefined,
      areaStyle: fillKind === 'none' ? undefined : { color: window.omadaLineFill(c, mode, fillKind) },
      data: seed[i],
    }));
    const base = window.omadaChartBase(mode, lang, {
      legend: false, xData: X,
      grid: { left: 4, right: 8, top: 10, bottom: 4, containLabel: true },
      axisY: { axisLabel: { show: false }, splitLine: { show: true } },
      axisX: { axisLabel: { show: false } },
    });
    base.series = series;
    return base;
  }

  function Chip(props) {
    const [copied, setCopied] = useState(false);
    const copy = () => {
      try { navigator.clipboard.writeText(props.value); } catch (e) { /* noop */ }
      setCopied(true); setTimeout(() => setCopied(false), 900);
    };
    return (
      <button type="button" className="omada-cvt-chip" onClick={copy}
              title={props.value} aria-label={props.name + ' ' + props.value}>
        <span className="omada-cvt-chipswatch" style={{ background: props.value }} />
        <span className="omada-cvt-chipmeta">
          <code className="omada-cvt-chipname">{props.name}</code>
          <code className="omada-cvt-chiphex">{copied ? props.copied : props.value}</code>
        </span>
      </button>
    );
  }

  function OmadaChartTokens(props) {
    const className = props.className || '';
    const rest = Object.assign({}, props);
    delete rest.className;

    const ctx = window.useOmada ? window.useOmada() : { t: (k) => k, lang: 'en', mode: 'light' };
    const t = ctx.t, lang = ctx.lang, mode = ctx.mode;

    const ramp = window.OMADA_CHART_RAMP.byName;
    const c = window.omadaChartColors(mode);
    const copied = t('cvt.copied');

    const STRUCT = [
      { key: 'cvt.tok.text',    val: c.text },
      { key: 'cvt.tok.textSec', val: c.textSec },
      { key: 'cvt.tok.axis',    val: c.axisLine },
      { key: 'cvt.tok.split',   val: c.splitLine },
      { key: 'cvt.tok.tipBg',   val: c.tipBg },
      { key: 'cvt.tok.tipBorder', val: c.tipBorder },
    ];

    const RULES = [
      { kind: 'gradient', titleKey: 'cvt.rule.gradient', descKey: 'cvt.rule.gradientDesc' },
      { kind: 'solid',    titleKey: 'cvt.rule.solid',    descKey: 'cvt.rule.solidDesc' },
      { kind: 'stack',    titleKey: 'cvt.rule.stack',    descKey: 'cvt.rule.stackDesc' },
    ];

    const EChart = window.Omada.EChart;

    return (
      <div className={('omada-cvt ' + className).trim()} {...rest}>

        {/* ── accent ramp ── */}
        <div className="omada-cvt-sub">{t('cvt.ramp')}</div>
        <div className="omada-cvt-desc">{t('cvt.rampDesc')}</div>
        <div className="omada-cvt-ramp">
          {RAMP_ORDER.map((n) => (
            <Chip key={n} name={n} value={ramp[n]} copied={copied} />
          ))}
        </div>

        {/* ── fill rules ── */}
        <div className="omada-cvt-sub">{t('cvt.rules')}</div>
        <div className="omada-cvt-desc">{t('cvt.rulesDesc')}</div>
        <div className="omada-cvt-rules">
          {RULES.map((r) => (
            <div key={r.kind} className="omada-cvt-rule">
              <div className="omada-cvt-ruleprev">
                <EChart option={specimenOption(mode, lang, r.kind)} height={108} />
              </div>
              <div className="omada-cvt-ruletitle">{t(r.titleKey)}</div>
              <div className="omada-cvt-ruledesc">{t(r.descKey)}</div>
            </div>
          ))}
        </div>

        {/* ── structural tokens ── */}
        <div className="omada-cvt-sub">{t('cvt.struct')}</div>
        <div className="omada-cvt-desc">{t('cvt.structDesc')}</div>
        <div className="omada-cvt-struct">
          {STRUCT.map((s) => (
            <Chip key={s.key} name={t(s.key)} value={s.val} copied={copied} />
          ))}
        </div>

        <div className="omada-cvt-note">{t('cvt.note')}</div>
      </div>
    );
  }

  window.Omada = window.Omada || {};
  window.Omada.ChartTokens = OmadaChartTokens;
})();
