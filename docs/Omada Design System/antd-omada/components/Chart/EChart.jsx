/* ────────────────────────────────────────────────────────────────────────
   components/Chart/EChart.jsx — OmadaEChart (Batch 6 chart base)

   The single React↔ECharts bridge every Omada chart wrapper renders into.
   It is NOT a charting fork — it just owns the imperative ECharts lifecycle
   (init · setOption · resize · dispose) so the chart wrappers above it stay
   tiny and declarative: they build a styled option object (from
   omadaChartBase + the accent ramp) and pass it down.

   - renderer 'svg' (crisp at any DPR, plays nice with the gallery)
   - re-applies option with notMerge=true whenever option/mode/lang change,
     so a theme switch fully re-paints with the new token colours
   - ResizeObserver keeps the chart sized to its flex/grid cell
   - single calm 400ms draw comes from the option (animationDuration), here
     we only suppress the re-theme flicker by reusing the same instance

   Exports: window.Omada.EChart
   ──────────────────────────────────────────────────────────────────────── */
(function () {
  const { useRef, useEffect } = React;

  function OmadaEChart({ option, height = 260, className = '', style, onInit }) {
    const elRef = useRef(null);
    const chartRef = useRef(null);

    // init once
    useEffect(() => {
      if (!window.echarts || !elRef.current) return undefined;
      const chart = window.echarts.init(elRef.current, null, { renderer: 'svg' });
      chartRef.current = chart;
      if (onInit) onInit(chart);

      const ro = new ResizeObserver(() => chart.resize());
      ro.observe(elRef.current);

      return () => {
        ro.disconnect();
        chart.dispose();
        chartRef.current = null;
      };
      // eslint-disable-next-line
    }, []);

    // (re)apply option — notMerge so a token/lang/data change fully repaints
    useEffect(() => {
      const chart = chartRef.current;
      if (!chart || !option) return;
      chart.setOption(option, true);
    }, [option]);

    return (
      <div
        ref={elRef}
        className={('omada-chart ' + className).trim()}
        style={Object.assign({ width: '100%', height }, style)}
      />
    );
  }

  /* ChartCard — the Figma "CHART TITLE" container: titled surface card with an
     optional right-hand slot (legend / range switch). Keeps every chart demo
     consistent with the Figma chart frames. */
  function OmadaChartCard({ title, sub, right, children, className = '', style }) {
    return (
      <div className={('omada-chartcard ' + className).trim()} style={style}>
        {(title || right) && (
          <div className="omada-chartcard-head">
            <div className="omada-chartcard-titles">
              {title && <span className="omada-chartcard-title">{title}</span>}
              {sub && <span className="omada-chartcard-sub">{sub}</span>}
            </div>
            {right && <div className="omada-chartcard-right">{right}</div>}
          </div>
        )}
        {children}
      </div>
    );
  }

  window.Omada = window.Omada || {};
  window.Omada.EChart = OmadaEChart;
  window.Omada.ChartCard = OmadaChartCard;
})();
