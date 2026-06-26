/* ────────────────────────────────────────────────────────────────────────
   components/PieChart/PieChart.jsx — OmadaPieChart

   Token-driven ECharts pie / donut matching Figma "Chart 图表（类型）饼/环图"
   (node 536:13574): flat accent-ramp slices separated by a thin surface-
   coloured stroke, optional centred total for the donut, signature
   right-hand legend list (rendered by the caller — see the demo). Slice
   labels are off by default (the legend carries them), tooltip shows
   name · value · percent.

   Props: data:[{name,value,color?}], variant 'donut'|'pie', height,
          centerTitle, centerSub, showLegend ('bottom'|false), height.
   Figma node: 536:13574 · lib: ECharts.
   Exports: window.Omada.PieChart
   ──────────────────────────────────────────────────────────────────────── */
(function () {
  const { useMemo } = React;
  const { EChart } = window.Omada;

  function OmadaPieChart({
    data = [], variant = 'donut', height = 240,
    centerTitle, centerSub, showLegend = false, option: extra,
  }) {
    const { mode, lang } = window.useOmada();

    const option = useMemo(() => {
      const ramp = window.OMADA_CHART_RAMP[mode];
      const c = window.omadaChartColors(mode);
      const family = "'Manrope', -apple-system, 'PingFang SC', 'Microsoft YaHei', sans-serif";
      const donut = variant === 'donut';

      const opt = {
        color: ramp,
        textStyle: { fontFamily: family },
        animation: true,
        animationDuration: 400,
        animationEasing: 'cubicOut',
        animationDelay: 0,
        tooltip: {
          trigger: 'item',
          backgroundColor: c.tipBg,
          borderColor: c.tipBorder,
          borderWidth: 1,
          padding: [8, 12],
          textStyle: { color: c.tipText, fontSize: 12, fontFamily: family },
          extraCssText:
            'border-radius:8px;box-shadow:' +
            (mode === 'dark' ? '0 4px 16px rgba(0,0,0,0.55)' : '0 4px 16px rgba(43,43,43,0.12)') + ';',
          formatter: '{b}: <b>{c}</b> ({d}%)',
        },
        series: [{
          type: 'pie',
          radius: donut ? ['58%', '84%'] : ['0%', '82%'],
          center: ['50%', '50%'],
          avoidLabelOverlap: true,
          padAngle: donut ? 1.5 : 0,
          itemStyle: {
            borderColor: c.surface,
            borderWidth: 2,
            borderRadius: donut ? 4 : 2,
          },
          label: { show: false },
          labelLine: { show: false },
          emphasis: { scaleSize: 6, itemStyle: { shadowBlur: 10, shadowColor: window.omadaHexA('#000000', mode === 'dark' ? 0.4 : 0.12) } },
          data: data.map((d, i) => ({
            name: d.name, value: d.value,
            itemStyle: d.color ? { color: d.color } : undefined,
          })),
        }],
      };

      if (showLegend === 'bottom') {
        opt.legend = {
          bottom: 0, left: 'center',
          icon: 'circle', itemWidth: 8, itemHeight: 8, itemGap: 16,
          textStyle: { color: c.textSec, fontSize: 12, fontFamily: family },
        };
        opt.series[0].center = ['50%', '46%'];
      }

      if (donut && centerTitle) {
        opt.graphic = [
          { type: 'text', left: 'center', top: '42%',
            style: { text: centerTitle, fill: c.text, fontSize: 26, fontWeight: 700, fontFamily: family, textAlign: 'center' } },
          { type: 'text', left: 'center', top: '57%',
            style: { text: centerSub || '', fill: c.textTer, fontSize: 11, fontFamily: family, textAlign: 'center', letterSpacing: 1 } },
        ];
      }

      return Object.assign(opt, extra || {});
    }, [mode, lang, data, variant, centerTitle, centerSub, showLegend, extra]);

    return <EChart option={option} height={height} />;
  }

  window.Omada = window.Omada || {};
  window.Omada.PieChart = OmadaPieChart;
})();
