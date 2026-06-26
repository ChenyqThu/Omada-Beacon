/* components/Segmented/Segmented.demo.jsx — window.OmadaDemos.Segmented */
(function () {
  const { Segmented } = window.Omada;

  function SegmentedDemo() {
    const { t } = window.useOmada();
    const { useState } = React;
    const [view, setView] = useState('grid');
    const [range, setRange] = useState('week');

    const viewOpts = [
      Segmented.iconOption('list', t('seg.list'), 'dashboard'),
      Segmented.iconOption('grid', t('seg.grid'), 'devices'),
      Segmented.iconOption('map', t('seg.map'), 'map'),
    ];
    const rangeOpts = [
      { value: 'day', label: t('seg.day') },
      { value: 'week', label: t('seg.week') },
      { value: 'month', label: t('seg.month') },
    ];

    return (
      <>
        <div className="row">
          <span className="label">range</span>
          <Segmented options={rangeOpts} value={range} onChange={setRange} />
        </div>
        <div className="row">
          <span className="label">icons</span>
          <Segmented options={viewOpts} value={view} onChange={setView} />
        </div>
        <div className="row">
          <span className="label">sizes</span>
          <Segmented size="small" options={rangeOpts} defaultValue="day" />
          <Segmented options={rangeOpts} defaultValue="week" />
          <Segmented size="large" options={rangeOpts} defaultValue="month" />
        </div>
        <div className="row">
          <span className="label">block</span>
          <div style={{ width: 360 }}>
            <Segmented block options={rangeOpts} defaultValue="week" />
          </div>
        </div>
        <div className="row">
          <span className="label">disabled</span>
          <Segmented options={rangeOpts} defaultValue="week" disabled />
        </div>
      </>
    );
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.Segmented = SegmentedDemo;
})();
