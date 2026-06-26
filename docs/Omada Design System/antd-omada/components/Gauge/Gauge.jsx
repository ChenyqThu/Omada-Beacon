/* ────────────────────────────────────────────────────────────────────────
   components/Gauge/Gauge.jsx — OmadaGauge

   Token-driven ECharts gauge. Two Omada styles:
     · variant 'progress' → a single rounded brand-green arc over a faint
       track, big centred value + caption (network health / utilisation)
     · variant 'zoned'    → graded bands (poor→fair→good→excellent) coloured
       from the accent ramp red→orange→lime→green, with a thin pointer
   270° sweep, no tick clutter, single 400ms draw.

   Props: value, max(=100), variant, label, unit(='%'), color, bands, height.
   Figma node: 536:13574 (Chart types) · lib: ECharts.
   Exports: window.Omada.Gauge
   ──────────────────────────────────────────────────────────────────────── */
(function () {
  const { useMemo } = React;
  const { EChart } = window.Omada;

  function OmadaGauge({
    value = 0, max = 100, variant = 'progress', label = '', unit = '%',
    color, bands, height = 240, option: extra,
  }) {
    const { mode, lang } = window.useOmada();

    const option = useMemo(() => {
      const ramp = window.OMADA_CHART_RAMP[mode];
      const byName = window.OMADA_CHART_RAMP.byName;
      const c = window.omadaChartColors(mode);
      const family = "'Manrope', -apple-system, 'PingFang SC', 'Microsoft YaHei', sans-serif";
      const arc = color || byName.green;

      const common = {
        type: 'gauge', min: 0, max,
        startAngle: 220, endAngle: -40,
        center: ['50%', '56%'], radius: '92%',
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: { show: false },
        anchor: { show: false },
        title: {
          offsetCenter: [0, '32%'],
          color: c.textTer, fontSize: 12, fontFamily: family,
        },
        detail: {
          valueAnimation: false,
          offsetCenter: [0, '2%'],
          color: c.text, fontSize: 32, fontWeight: 700, fontFamily: family,
          formatter: (v) => `${Math.round(v)}${unit}`,
        },
        data: [{ value, name: label }],
      };

      let series;
      if (variant === 'zoned') {
        const segs = bands || [
          [0.3, byName.red], [0.55, byName.orange], [0.8, byName.lime], [1, byName.green],
        ];
        series = Object.assign({}, common, {
          progress: { show: false },
          axisLine: { lineStyle: { width: 10, color: segs } },
          pointer: { show: true, length: '62%', width: 4, itemStyle: { color: c.text } },
          detail: Object.assign({}, common.detail, { offsetCenter: [0, '8%'] }),
        });
      } else {
        series = Object.assign({}, common, {
          pointer: { show: false },
          progress: { show: true, width: 12, roundCap: true, itemStyle: { color: arc } },
          axisLine: { lineStyle: { width: 12, color: [[1, c.splitLine]] } },
        });
      }

      return Object.assign({
        textStyle: { fontFamily: family },
        animation: true, animationDuration: 400, animationEasing: 'cubicOut', animationDelay: 0,
        series: [series],
      }, extra || {});
    }, [mode, lang, value, max, variant, label, unit, color, bands, extra]);

    return <EChart option={option} height={height} />;
  }

  window.Omada = window.Omada || {};
  window.Omada.Gauge = OmadaGauge;
})();
