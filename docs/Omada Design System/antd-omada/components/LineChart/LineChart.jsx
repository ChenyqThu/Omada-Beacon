/* ────────────────────────────────────────────────────────────────────────
   components/LineChart/LineChart.jsx — OmadaLineChart

   Token-driven ECharts line / area / stacked-area chart matching Figma
   "Chart 图表–折线图" (node 13973:7050):
     · variant 'line'  → solid 2px lines, no fill  (use for ≥3 series)
     · variant 'area'  → gradient fill color@top→0  (use for ≤2 series)
     · variant 'stack' → stacked areas, solid color@20%/24% fill
   Straight segments (smooth=false) per the Figma; horizontal dashed grid,
   no y-axis line; accent ramp green→lime→blue→magenta→orange→red. Legend,
   axis labels and tooltip inherit omadaChartBase; series names are passed
   pre-localized by the caller via window.t().

   Props: xData, series:[{name,data,color?}], variant, smooth, legend,
          height, yAxis, area (alias), plus any ECharts option via `option`.
   Figma node: 13973:7050 · lib: ECharts (see Charts.md)
   Exports: window.Omada.LineChart
   ──────────────────────────────────────────────────────────────────────── */
(function () {
  const { useMemo } = React;
  const { EChart } = window.Omada;

  function OmadaLineChart({
    xData = [], series = [], variant = 'line', smooth = false,
    legend = true, height = 260, yAxis, option: extra,
  }) {
    const { mode, lang } = window.useOmada();

    const option = useMemo(() => {
      const ramp = window.OMADA_CHART_RAMP[mode];
      const base = window.omadaChartBase(mode, lang, {
        xData,
        legend: legend === false ? false : {},
        axisY: yAxis,
      });
      const fillKind = variant === 'stack' ? 'stack' : variant === 'area' ? 'gradient' : 'none';

      base.series = series.map((s, i) => {
        const color = s.color || ramp[i % ramp.length];
        const fill = window.omadaLineFill(color, mode, fillKind);
        return {
          name: s.name,
          type: 'line',
          data: s.data,
          smooth,
          symbol: 'circle',
          symbolSize: 6,
          showSymbol: false,
          stack: variant === 'stack' ? 'total' : undefined,
          lineStyle: { width: 2, color },
          itemStyle: { color },
          emphasis: { focus: 'series' },
          areaStyle: fill ? { color: fill, origin: 'start' } : undefined,
        };
      });

      return Object.assign(base, extra || {});
    }, [mode, lang, xData, series, variant, smooth, legend, yAxis, extra]);

    return <EChart option={option} height={height} />;
  }

  window.Omada = window.Omada || {};
  window.Omada.LineChart = OmadaLineChart;
})();
