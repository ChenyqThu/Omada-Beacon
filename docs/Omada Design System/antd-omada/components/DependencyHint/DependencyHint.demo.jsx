/* components/DependencyHint/DependencyHint.demo.jsx — window.OmadaDemos.DependencyHint */
(function () {
  const DependencyHint = window.Omada.DependencyHint;
  const { Switch } = window.antd;

  function DependencyHintDemo() {
    const { useState } = React;
    const ctx = window.useOmada();
    const t = ctx.t;

    const [log, setLog] = useState(false);
    const [cloud, setCloud] = useState(false);
    const [ips, setIps] = useState(true);

    const settingRow = (label, checked, onChange) => (
      <div className="omada-dep-setting">
        <span className="omada-dep-settinglabel">{label}</span>
        <Switch size="small" checked={checked} onChange={onChange} />
      </div>
    );

    return (
      <div className="omada-dep-demo">
        <div className="omada-dep-block">
          <div className="omada-dep-blocktitle">{t('dep.b.single')}</div>
          <div className="omada-dep-panel">
            {settingRow(t('dep.d.dpi'), false, () => {})}
            <DependencyHint
              feature={t('dep.d.dpi')}
              requires={[{ key: 'log', label: t('dep.d.log'), enabled: log, onEnable: () => setLog(true) }]}
            />
            {settingRow(t('dep.d.log'), log, setLog)}
          </div>
        </div>

        <div className="omada-dep-block">
          <div className="omada-dep-blocktitle">{t('dep.b.multi')}</div>
          <div className="omada-dep-panel">
            <DependencyHint
              feature={t('dep.d.alerts')}
              requires={[
                { key: 'log', label: t('dep.d.log'), enabled: log, onEnable: () => setLog(true) },
                { key: 'cloud', label: t('dep.d.cloud'), enabled: cloud, onEnable: () => setCloud(true) },
              ]}
            />
          </div>
        </div>

        <div className="omada-dep-block">
          <div className="omada-dep-blocktitle">{t('dep.b.disable')}</div>
          <div className="omada-dep-panel">
            {settingRow(t('dep.d.ips'), ips, setIps)}
            {ips && (
              <DependencyHint
                mode="disable"
                feature={t('dep.d.ips')}
                requires={[
                  { key: 'dpi', label: t('dep.d.dpi'), enabled: true },
                  { key: 'alerts', label: t('dep.d.alerts'), enabled: true },
                ]}
              />
            )}
          </div>
        </div>
        <p className="omada-dep-pagehint">{t('dep.hint')}</p>
      </div>
    );
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.DependencyHint = DependencyHintDemo;
})();
