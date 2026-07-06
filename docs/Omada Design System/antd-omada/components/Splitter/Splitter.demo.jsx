/* components/Splitter/Splitter.demo.jsx — window.OmadaDemos.Splitter */
(function () {
  const { Splitter } = window.Omada;
  const { Icon } = window.Omada;

  function Pane({ title, children }) {
    return (
      <div className="omada-split-pane">
        <h4>{title}</h4>
        {children}
      </div>
    );
  }

  function DeviceRow({ name, model, on }) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', fontSize: 13, color: 'var(--fg-secondary)' }}>
        <span style={{ width: 7, height: 7, borderRadius: 999, background: on ? '#00A870' : '#CCC', flexShrink: 0 }} />
        <Icon name="ap" size={16} />
        <span style={{ fontWeight: 500, color: 'var(--fg-primary)' }}>{name}</span>
        <span style={{ marginInlineStart: 'auto', fontSize: 11, color: 'var(--fg-tertiary)' }}>{model}</span>
      </div>
    );
  }

  function SplitterDemo() {
    const { t } = window.useOmada();
    return (
      <>
        <div className="row"><span className="label">master / detail</span>
          <span style={{ fontSize: 12, color: 'var(--fg-tertiary)' }}>{t('split.hint')}</span>
        </div>
        <div style={{ border: '1px solid var(--border-default)', borderRadius: 8, overflow: 'hidden' }}>
          <Splitter style={{ height: 240 }}>
            <Splitter.Panel defaultSize="38%" min="22%" max="60%">
              <Pane title={t('split.deviceList')}>
                <DeviceRow name="EAP670" model="Wi-Fi 6E" on />
                <DeviceRow name="EAP660" model="Wi-Fi 6" on />
                <DeviceRow name="SG2428P" model="Switch" on />
                <DeviceRow name="ER7206" model="Gateway" />
              </Pane>
            </Splitter.Panel>
            <Splitter.Panel>
              <Pane title={t('split.detail')}>
                <p style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--fg-secondary)', margin: 0 }}>
                  {t('type.body')}
                </p>
              </Pane>
            </Splitter.Panel>
          </Splitter>
        </div>

        <div className="row" style={{ marginTop: 22 }}><span className="label">vertical</span></div>
        <div style={{ border: '1px solid var(--border-default)', borderRadius: 8, overflow: 'hidden' }}>
          <Splitter layout="vertical" style={{ height: 240 }}>
            <Splitter.Panel defaultSize="46%">
              <Pane title={t('split.topology')}>
                <p style={{ fontSize: 13, color: 'var(--fg-tertiary)', margin: 0 }}>{t('image.topology')}</p>
              </Pane>
            </Splitter.Panel>
            <Splitter.Panel>
              <Pane title={t('split.inspector')}>
                <p style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--fg-secondary)', margin: 0 }}>{t('type.body')}</p>
              </Pane>
            </Splitter.Panel>
          </Splitter>
        </div>
      </>
    );
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.Splitter = SplitterDemo;
})();
