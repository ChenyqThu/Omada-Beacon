/* ────────────────────────────────────────────────────────────────────────
   components/BarChart/BarChart.jsx — OmadaBarChart

   Token-driven ECharts bar chart matching Figma "Chart 图表（类型）柱状图/条形图"
   (node 536:13574): slim flat bars, accent-ramp fills, horizontal dashed
   grid, no axis line on the value side. Covers:
     · variant 'column' → vertical bars (default)
     · variant 'bar'    → horizontal bars
     · stack            → stacked segments (boolean)
   Single / grouped / stacked all from one `series` array. Slightly rounded
   outer corners; bar width clamped so a single series doesn't look heavy.

   Props: xData, series:[{name,data,color?}], variant, stack, legend, height,
          barWidth, yAxis. Figma node: 536:13574 · lib: ECharts.
   Exports: window.Omada.BarChart
   ──────────────────────────────────────────────────────────────────────── */
(function () {
  const { useMemo } = React;
  const { EChart } = window.Omada;

  function OmadaBarChart({
    xData = [], series = [], variant = 'column', stack = false,
    legend = true, height = 260, barWidth, yAxis, option: extra,
  }) {
    const { mode, lang } = window.useOmada();

    const option = useMemo(() => {
      const ramp = window.OMADA_CHART_RAMP[mode];
      const horizontal = variant === 'bar';
      const base = window.omadaChartBase(mode, lang, {
        legend: legend === false ? false : {},
        boundaryGap: true,
        tooltipTrigger: 'axis',
        axisPointer: 'shadow',
      });

      // Build category + value axes, swapping orientation for horizontal bars.
      const c = window.omadaChartColors(mode);
      const family = "'Manrope', -apple-system, 'PingFang SC', 'Microsoft YaHei', sans-serif";
      const catAxis = {
        type: 'category', data: xData, boundaryGap: true,
        axisLine: { lineStyle: { color: c.axisLine } },
        axisTick: { show: false },
        axisLabel: { color: c.textTer, fontSize: 12, fontFamily: family },
        splitLine: { show: false },
      };
      const valAxis = Object.assign({
        type: 'value',
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { color: c.textTer, fontSize: 12, fontFamily: family },
        splitLine: { show: true, lineStyle: { color: c.splitLine, type: 'dashed' } },
      }, yAxis || {});

      if (horizontal) { base.xAxis = valAxis; base.yAxis = catAxis; }
      else { base.xAxis = catAxis; base.yAxis = valAxis; }

      const radius = horizontal ? [0, 3, 3, 0] : [3, 3, 0, 0];
      base.series = series.map((s, i) => {
        const color = s.color || ramp[i % ramp.length];
        return {
          name: s.name,
          type: 'bar',
          data: s.data,
          stack: stack ? 'total' : undefined,
          barMaxWidth: barWidth || (series.length > 2 ? 14 : 18),
          barGap: '30%',
          itemStyle: { color, borderRadius: stack ? 0 : radius },
          emphasis: { focus: 'series' },
        };
      });
      // round only the top-most stacked segment lightly
      if (stack && base.series.length) {
        const last = base.series[base.series.length - 1];
        last.itemStyle.borderRadius = radius;
      }

      return Object.assign(base, extra || {});
    }, [mode, lang, xData, series, variant, stack, legend, barWidth, yAxis, extra]);

    return <EChart option={option} height={height} />;
  }

  window.Omada = window.Omada || {};
  window.Omada.BarChart = OmadaBarChart;
})();
