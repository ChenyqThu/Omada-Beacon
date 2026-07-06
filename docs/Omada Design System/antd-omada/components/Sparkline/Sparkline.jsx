/* ────────────────────────────────────────────────────────────────────────
   components/Sparkline/Sparkline.jsx — OmadaSparkline

   A tiny inline trend line for tables / stat tiles — no axes, grid, legend
   or labels, just a 2px accent line with an optional gradient wash and an
   end dot. Tone maps to the accent ramp (brand green / up green / down red /
   neutral grey) or pass an explicit colour. Same calm 400ms draw.

   Props: data:[n], tone 'brand'|'up'|'down'|'neutral', color, area, dot,
          height(=36), width, smooth.
   Figma node: 536:13574 (legend glyph / mini trend) · lib: ECharts.
   Exports: window.Omada.Sparkline
   ──────────────────────────────────────────────────────────────────────── */
(function () {
  const { useMemo } = React;
  const { EChart } = window.Omada;

  const TONE = { brand: 'green', up: 'green', down: 'red', neutral: 'grey' };

  function OmadaSparkline({
    data = [], tone = 'brand', color, area = true, dot = true,
    height = 36, width = 120, smooth = true,
  }) {
    const { mode } = window.useOmada();

    const option = useMemo(() => {
      const byName = window.OMADA_CHART_RAMP.byName;
      const stroke = color || byName[TONE[tone] || 'green'] || byName.green;
      const fill = window.omadaLineFill(stroke, mode, 'gradient');
      const last = data.length - 1;

      return {
        animation: true, animationDuration: 400, animationEasing: 'cubicOut', animationDelay: 0,
        grid: { left: 2, right: 4, top: 4, bottom: 2 },
        xAxis: { type: 'category', show: false, boundaryGap: false, data: data.map((_, i) => i) },
        yAxis: { type: 'value', show: false, scale: true },
        tooltip: { show: false },
        series: [{
          type: 'line', data, smooth, symbol: 'none',
          lineStyle: { width: 2, color: stroke },
          areaStyle: area && fill ? { color: fill, origin: 'start' } : undefined,
          markPoint: dot && last >= 0 ? {
            symbol: 'circle', symbolSize: 6, silent: true,
            data: [{ coord: [last, data[last]], itemStyle: { color: stroke } }],
            label: { show: false },
          } : undefined,
        }],
      };
    }, [mode, data, tone, color, area, dot, smooth]);

    return <EChart option={option} height={height} style={{ width }} />;
  }

  window.Omada = window.Omada || {};
  window.Omada.Sparkline = OmadaSparkline;
})();
