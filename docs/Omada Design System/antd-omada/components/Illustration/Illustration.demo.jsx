/* components/Illustration/Illustration.demo.jsx — window.OmadaDemos.Illustration */
(function () {
  const { Illustration, Button, Icon } = window.Omada;
  const { Empty } = window.antd;

  const EMPTY = ['no-data', 'no-results', 'no-devices', 'offline', 'world', 'report', 'inbox-empty'];
  const FEATURE = ['dns', 'email', 'bind-list', 'email-sent', 'download-failed', 'firmware-update'];
  const STATE = ['success', 'error', 'notice', 'lock-failed', 'power-failed', 'maintenance', 'no-permission', 'timeout'];

  function IllustrationDemo() {
    const { t, lang } = window.useOmada();
    const L = (en, zh) => (lang === 'zh' ? zh : en);

    return (
      <>
        <div className="row"><span className="label">{L('empty-state scenes', '空状态插图')}</span></div>
        <div className="omada-illus-grid">
          {EMPTY.map((name) => (
            <div key={name} className="omada-illus-cell">
              <Illustration name={name} size={108} />
              <code className="omada-illus-name">{name}</code>
            </div>
          ))}
        </div>

        <div className="row" style={{ marginTop: 26 }}><span className="label">{L('function & status scenes', '功能与状态插图')}</span></div>
        <div className="omada-illus-grid">
          {FEATURE.concat(STATE).map((name) => (
            <div key={name} className="omada-illus-cell">
              <Illustration name={name} size={108} />
              <code className="omada-illus-name">{name}</code>
            </div>
          ))}
        </div>

        <div className="row" style={{ marginTop: 26 }}><span className="label">empty states</span></div>
        <div className="grid-2">
          {/* no devices → adopt CTA */}
          <div className="omada-illus-empty">
            <Illustration name="no-devices" size={120} />
            <div className="omada-illus-title">{t('empty.noDevices')}</div>
            <div className="omada-illus-hint">{t('empty.noDevices.hint')}</div>
            <Button variant="primary" icon={<Icon name="plus" size={16} />}>{t('device.addDevice')}</Button>
          </div>

          {/* no results → reset */}
          <div className="omada-illus-empty">
            <Illustration name="no-results" size={120} />
            <div className="omada-illus-title">{t('empty.noResults')}</div>
            <div className="omada-illus-hint">{L('Try a different name, MAC or IP.', '尝试其他名称、MAC 或 IP。')}</div>
            <Button variant="secondary" icon={<Icon name="refresh" size={16} />}>{t('common.reset')}</Button>
          </div>
        </div>

        <div className="row" style={{ marginTop: 26 }}><span className="label">{L('feature states', '功能状态')}</span></div>
        <div className="grid-2">
          {/* download failed → retry */}
          <div className="omada-illus-empty">
            <Illustration name="download-failed" size={120} />
            <div className="omada-illus-title">{t('illus.downloadFailed')}</div>
            <div className="omada-illus-hint">{t('illus.downloadFailed.hint')}</div>
            <Button variant="secondary" icon={<Icon name="refresh" size={16} />}>{t('common.retry')}</Button>
          </div>

          {/* email sent → confirmation */}
          <div className="omada-illus-empty">
            <Illustration name="email-sent" size={120} />
            <div className="omada-illus-title">{t('illus.emailSent')}</div>
            <div className="omada-illus-hint">{t('illus.emailSent.hint')}</div>
            <Button variant="primary" icon={<Icon name="check" size={16} />}>{t('common.ok')}</Button>
          </div>
        </div>

        <div className="row" style={{ marginTop: 26 }}><span className="label">{L('status states', '状态场景')}</span></div>
        <div className="grid-2">
          {/* access denied → back */}
          <div className="omada-illus-empty">
            <Illustration name="no-permission" size={120} />
            <div className="omada-illus-title">{t('illus.noPermission')}</div>
            <div className="omada-illus-hint">{t('illus.noPermission.hint')}</div>
            <Button variant="secondary" icon={<Icon name="arrow-right" size={16} />}>{t('result.backHome')}</Button>
          </div>

          {/* firmware update → install */}
          <div className="omada-illus-empty">
            <Illustration name="firmware-update" size={120} />
            <div className="omada-illus-title">{t('illus.firmwareUpdate')}</div>
            <div className="omada-illus-hint">{t('illus.firmwareUpdate.hint')}</div>
            <Button variant="primary" icon={<Icon name="download" size={16} />}>{t('alert.update')}</Button>
          </div>
        </div>

        <div className="row" style={{ marginTop: 26 }}><span className="label">in antd Empty</span></div>
        <Empty
          image={<Illustration name="no-data" size={132} />}
          styles={{ image: { height: 132, display: 'flex', justifyContent: 'center' } }}
          description={<span style={{ color: 'var(--fg-tertiary,#999)' }}>{t('empty.default')}</span>}
        />

        <div className="row" style={{ marginTop: 26 }}><span className="label">accent override</span></div>
        <div className="omada-illus-grid">
          {['#00E194', '#0069CB', '#F476FF', '#FFC730'].map((c) => (
            <div key={c} className="omada-illus-cell">
              <Illustration name="success" size={92} accent={c} />
              <code className="omada-illus-name">{c}</code>
            </div>
          ))}
        </div>
      </>
    );
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.Illustration = IllustrationDemo;
})();
