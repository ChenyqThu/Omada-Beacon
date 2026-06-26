/* ────────────────────────────────────────────────────────────────────────
   omada-chart-theme.js — ECharts theming for the Omada chart set (Batch 6)

   Why ECharts (not @ant-design/charts): ECharts ships ONE clean UMD bundle
   (echarts.min.js) with zero React / peer-dependency entanglement, themes
   cleanly through a single option/token object — exactly the §3 "token-first"
   contract — and coexists with the pinned React+Babel+antd UMD setup without
   version conflicts. @ant-design/charts' UMD drags in G2/lodash/React-version
   constraints that fight the pinned React here.

   This file is the SINGLE source of chart styling. It exposes:
     window.OMADA_CHART_RAMP   accent ramp (light + dark + by-name)
     window.omadaChartColors(mode)  axis/grid/text/tooltip token colours
     window.omadaChartBase(mode, lang, opts)  a styled ECharts option skeleton
     window.omadaLineFill(color, mode, kind)  area gradient/solid fill per spec

   Ramp + rules transcribed from Figma "Chart 图表–折线图" (node 13973:7050) and
   "Chart 图表（类型）" (node 536:13574):
     · line ramp (identical light/dark): green→lime→blue→magenta→orange→red
       #05C178 · #A6EF00 · #0069CB · #F476FF · #FF8C27 · #EE385C  (+grey #CCCCCC)
     · ≤2 lines  → gradient fill  color@8%→0% (light) / @12%→0% (dark)
     · ≥3 lines  → solid 1.2px lines, no fill
     · stacked   → solid fill  color@20% over #FFF (light) / @24% over #1A1A1A (dark)
     · horizontal dashed gridlines only, no vertical grid; no y-axis line
   ──────────────────────────────────────────────────────────────────────── */
(function () {
  const O = window.OMADA || {};

  // Chart accent ramp — order per COMPONENT_SPEC §6: green→lime→blue→magenta→orange→red.
  // Line hue is identical across modes (Figma rule); mode only changes fills/axes/text.
  const RAMP = ['#05C178', '#A6EF00', '#0069CB', '#F476FF', '#FF8C27', '#EE385C'];
  const RAMP_BY_NAME = {
    green: '#05C178', lime: '#A6EF00', blue: '#0069CB',
    magenta: '#F476FF', orange: '#FF8C27', red: '#EE385C', grey: '#CCCCCC',
  };

  window.OMADA_CHART_RAMP = { light: RAMP, dark: RAMP, byName: RAMP_BY_NAME };

  /* Per-mode structural colours, all sourced from the design tokens. */
  window.omadaChartColors = function (mode) {
    const dark = mode === 'dark';
    return dark
      ? {
          text:      O.dark ? O.dark.text : '#E8E8E8',
          textSec:   O.dark ? O.dark.textSec : '#A6A6A6',
          textTer:   O.dark ? O.dark.textTer : '#737373',
          axisLine:  '#333333',
          splitLine: '#2A2A2A',
          surface:   O.dark ? O.dark.surface : '#1F1F1F',
          tipBg:     O.dark ? O.dark.elevated : '#262626',
          tipBorder: '#333333',
          tipText:   O.dark ? O.dark.text : '#E8E8E8',
          fillBase:  '#1A1A1A',
          fillTopPct: 0.12,   // single/dual line gradient top opacity (dark)
          stackPct:   0.24,   // stacked area solid fill opacity (dark)
        }
      : {
          text:      '#2B2B2B',
          textSec:   '#636363',
          textTer:   '#999999',
          axisLine:  '#ECECEC',
          splitLine: '#ECECEC',
          surface:   '#FFFFFF',
          tipBg:     '#FFFFFF',
          tipBorder: '#ECECEC',
          tipText:   '#2B2B2B',
          fillBase:  '#FFFFFF',
          fillTopPct: 0.08,   // single/dual line gradient top opacity (light)
          stackPct:   0.20,   // stacked area solid fill opacity (light)
        };
  };

  /* hex (#RRGGBB) → rgba(...) with alpha */
  function rgba(hex, a) {
    const h = hex.replace('#', '');
    const n = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16);
    return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
  }
  window.omadaHexA = rgba;

  /* Area fill per Figma colour rules.
     kind: 'gradient' (≤2 lines), 'stack' (stacked area), 'none' (≥3 lines). */
  window.omadaLineFill = function (color, mode, kind) {
    const c = window.omadaChartColors(mode);
    if (kind === 'none') return null;
    if (kind === 'stack') {
      // solid fill: color@stackPct composited over the canvas base
      return { type: 'solid', value: rgba(color, c.stackPct) };
    }
    // gradient: color@top → color@0 (vertical)
    return {
      type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
      colorStops: [
        { offset: 0, color: rgba(color, c.fillTopPct) },
        { offset: 1, color: rgba(color, 0) },
      ],
    };
  };

  /* The styled ECharts option skeleton every chart starts from.
     opts: { legend, grid, axisX, axisY, xData, title, hasGrid } */
  window.omadaChartBase = function (mode, lang, opts) {
    opts = opts || {};
    const c = window.omadaChartColors(mode);
    const family = "'Manrope', -apple-system, 'PingFang SC', 'Microsoft YaHei', sans-serif";

    const labelStyle = { color: c.textTer, fontSize: 12, fontFamily: family };

    const base = {
      color: RAMP,
      textStyle: { fontFamily: family, color: c.textSec },
      animation: true,
      animationDuration: 400,             // single calm draw
      animationEasing: 'cubicOut',
      animationDelay: 0,                  // NO per-point stagger
      animationDurationUpdate: 300,
      grid: Object.assign(
        { left: 8, right: 12, top: opts.legend === false ? 16 : 36, bottom: 6, containLabel: true },
        opts.grid || {}
      ),
      tooltip: {
        trigger: opts.tooltipTrigger || 'axis',
        backgroundColor: c.tipBg,
        borderColor: c.tipBorder,
        borderWidth: 1,
        padding: [8, 12],
        textStyle: { color: c.tipText, fontSize: 12, fontFamily: family },
        extraCssText:
          'border-radius:8px;box-shadow:' +
          (mode === 'dark'
            ? '0 4px 16px rgba(0,0,0,0.55)'
            : '0 4px 16px rgba(43,43,43,0.12)') +
          ';',
        axisPointer: {
          type: opts.axisPointer || 'line',
          lineStyle: { color: c.axisLine, width: 1 },
          crossStyle: { color: c.axisLine },
          shadowStyle: { color: rgba(mode === 'dark' ? '#FFFFFF' : '#2B2B2B', 0.04) },
        },
      },
    };

    if (opts.legend !== false) {
      base.legend = Object.assign(
        {
          top: 4, right: 4,
          icon: 'roundRect',
          itemWidth: 12, itemHeight: 4, itemGap: 18,
          textStyle: { color: c.textSec, fontSize: 12, fontFamily: family },
          inactiveColor: c.textTer,
        },
        opts.legend || {}
      );
    }

    if (opts.hasGrid !== false) {
      base.xAxis = Object.assign(
        {
          type: 'category',
          boundaryGap: opts.boundaryGap != null ? opts.boundaryGap : false,
          data: opts.xData || [],
          axisLine: { lineStyle: { color: c.axisLine } },
          axisTick: { show: false },
          axisLabel: labelStyle,
          splitLine: { show: false },
        },
        opts.axisX || {}
      );
      base.yAxis = Object.assign(
        {
          type: 'value',
          axisLine: { show: false },
          axisTick: { show: false },
          axisLabel: labelStyle,
          splitLine: { show: true, lineStyle: { color: c.splitLine, type: 'dashed' } },
        },
        opts.axisY || {}
      );
    }

    return base;
  };
})();
