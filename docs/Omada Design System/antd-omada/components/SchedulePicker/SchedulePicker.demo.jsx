/* components/SchedulePicker/SchedulePicker.demo.jsx — window.OmadaDemos.SchedulePicker */
(function () {
  const SchedulePicker = window.Omada.SchedulePicker;

  function SchedulePickerDemo() {
    const { useState } = React;
    const ctx = window.useOmada();
    const t = ctx.t;

    // start with a believable access policy: work hours allowed, evenings limited
    const [grid, setGrid] = useState(() => {
      const g = Array.from({ length: 7 }, () => Array.from({ length: 24 }, () => null));
      for (let d = 0; d < 5; d++) {
        for (let h = 9; h < 18; h++) g[d][h] = 'allow';
        for (let h = 18; h < 22; h++) g[d][h] = 'limit';
      }
      for (let d = 5; d < 7; d++) for (let h = 0; h < 24; h++) g[d][h] = 'block';
      return g;
    });

    const painted = grid.reduce((s, row) => s + row.filter(Boolean).length, 0);

    return (
      <div className="omada-schedp-demo">
        <div className="omada-schedp-block">
          <div className="omada-schedp-blocktitle">{t('schedp.b.access')}</div>
          <SchedulePicker value={grid} onChange={setGrid} />
          <div className="omada-schedp-count">{t('schedp.painted').replace('{n}', painted)}</div>
        </div>
        <div className="omada-schedp-block">
          <div className="omada-schedp-blocktitle">{t('schedp.b.single')}</div>
          <SchedulePicker
            states={[{ key: 'maint', label: t('schedp.s.maint'), cls: 'limit' }]}
            defaultValue={(function () {
              const g = Array.from({ length: 7 }, () => Array.from({ length: 24 }, () => null));
              for (let h = 2; h < 5; h++) { g[5][h] = 'maint'; g[6][h] = 'maint'; }
              return g;
            })()}
          />
        </div>
        <p className="omada-schedp-pagehint">{t('schedp.hint')}</p>
      </div>
    );
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.SchedulePicker = SchedulePickerDemo;
})();
