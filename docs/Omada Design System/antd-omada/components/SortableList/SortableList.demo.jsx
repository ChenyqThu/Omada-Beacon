/* components/SortableList/SortableList.demo.jsx — window.OmadaDemos.SortableList */
(function () {
  const { useState } = React;
  const { Switch, Tag } = window.antd;
  const Icon = window.Omada.Icon;
  const SortableList = window.Omada.SortableList;

  function SortableListDemo() {
    const ctx = window.useOmada();
    const t = ctx.t;

    const seed = [
      { key: 'w1', icon: 'insights',  label: t('srt.w.traffic'),  meta: t('srt.w.metaChart') },
      { key: 'w2', icon: 'devices',   label: t('srt.w.devices'),  meta: t('srt.w.metaTable') },
      { key: 'w3', icon: 'clients',   label: t('srt.w.clients'),  meta: t('srt.w.metaStat') },
      { key: 'w4', icon: 'alerts',    label: t('srt.w.alerts'),   meta: t('srt.w.metaList') },
      { key: 'w5', icon: 'gateway',   label: t('srt.w.uptime'),   meta: t('srt.w.metaGauge') },
    ];
    const ssids = [
      { key: 's1', label: 'Omada-Corp' },
      { key: 's2', label: 'Omada-Guest' },
      { key: 's3', label: 'Omada-IoT' },
      { key: 's4', label: 'Omada-Lab' },
    ];

    const [widgets, setWidgets] = useState(seed);
    const [order, setOrder] = useState(ssids);
    const [rowDrag, setRowDrag] = useState(false);

    return (
      <div className="omada-srt-demo">
        <div className="omada-srt-cols">

          {/* ── rich widget list (handle-drag) ── */}
          <div className="omada-srt-panel">
            <div className="omada-srt-paneltop">
              <div className="omada-srt-panelhd">
                <span className="omada-srt-panelix"><Icon name="dashboard" size={16} /></span>
                {t('srt.widgetsTitle')}
              </div>
              <label className="omada-srt-rowtoggle">
                <Switch size="small" checked={rowDrag} onChange={setRowDrag} />
                {t('srt.dragWhole')}
              </label>
            </div>
            <SortableList
              items={widgets}
              onChange={setWidgets}
              handle={!rowDrag}
              renderItem={(it) => (
                <span className="omada-srt-rich">
                  <span className="omada-srt-richix"><Icon name={it.icon} size={18} /></span>
                  <span className="omada-srt-richtxt">
                    <span className="omada-srt-richlabel">{it.label}</span>
                    <span className="omada-srt-richmeta">{it.meta}</span>
                  </span>
                </span>
              )}
            />
            <div className="omada-srt-order">
              <span className="omada-srt-orderlabel">{t('srt.resultOrder')}</span>
              <code>{widgets.map((w) => w.key).join(' → ')}</code>
            </div>
          </div>

          {/* ── compact SSID priority (with index badges) ── */}
          <div className="omada-srt-panel">
            <div className="omada-srt-paneltop">
              <div className="omada-srt-panelhd">
                <span className="omada-srt-panelix"><Icon name="wifi" size={16} /></span>
                {t('srt.ssidTitle')}
              </div>
              <Tag className="omada-srt-prioritytag">{t('srt.priority')}</Tag>
            </div>
            <SortableList items={order} onChange={setOrder} />
            <div className="omada-srt-kbd">
              <Icon name="keyboard" size={14} />
              <span>{t('srt.kbdHint')}</span>
            </div>
          </div>

        </div>
        <div className="omada-srt-note">{t('srt.note')}</div>
      </div>
    );
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.SortableList = SortableListDemo;
})();
