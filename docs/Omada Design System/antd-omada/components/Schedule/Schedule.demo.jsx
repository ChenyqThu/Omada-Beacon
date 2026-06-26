/* components/Schedule/Schedule.demo.jsx — window.OmadaDemos.Schedule */
(function () {
  const { Schedule } = window.Omada;

  // seed a plausible "business hours" pattern
  const seed = () => {
    const g = Array.from({ length: 7 }, () => Array.from({ length: 24 }, () => false));
    for (let d = 0; d < 5; d++) for (let h = 8; h < 18; h++) g[d][h] = true; // weekday 08–18
    for (let h = 10; h < 15; h++) { g[5][h] = true; } // Sat 10–15
    return g;
  };

  function ScheduleDemo() {
    const [grid, setGrid] = React.useState(seed);
    const count = grid.reduce((a, row) => a + row.filter(Boolean).length, 0);

    return (
      <>
        <Schedule value={grid} onChange={setGrid} />
        <div style={{ marginTop: 12, fontSize: 12, color: 'var(--fg-tertiary)', fontFamily: 'var(--font-mono)' }}>
          {count} / 168 active hour-blocks
        </div>

        <div className="row" style={{ marginTop: 24 }}><span className="label">disabled</span></div>
        <Schedule value={seed()} disabled />
      </>
    );
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.Schedule = ScheduleDemo;
})();
