/* components/Alert/Alert.demo.jsx — window.OmadaDemos.Alert */
(function () {
  const { Alert, Button } = window.Omada;

  function AlertDemo() {
    const { t } = window.useOmada();
    return (
      <>
        <div className="row" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 10 }}>
          <Alert tone="success" message={t('alert.applied')} />
          <Alert tone="info" message={t('alert.firmwareReady')} />
          <Alert tone="warning" message={t('status.warning') + ' · ' + t('alert.offline')} />
          <Alert tone="error" message={t('alert.offline')} />
        </div>
        <div className="row" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 10, marginTop: 4 }}>
          <span className="label">with description + action</span>
          <Alert
            tone="warning"
            message={t('alert.maintTitle')}
            description={t('alert.maintBody')}
            closable
            action={<Button size="small" variant="outline">{t('common.learnMore')}</Button>}
          />
          <Alert
            tone="info"
            message={t('notif.firmwareTitle')}
            description={t('alert.firmwareReady')}
            action={<Button size="small" variant="primary">{t('alert.update')}</Button>}
            closable
          />
        </div>
        <div className="row" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 10, marginTop: 4 }}>
          <span className="label">banner · no icon</span>
          <Alert banner tone="warning" message={t('alert.maintBody')} />
          <Alert tone="success" showIcon={false} message={t('alert.applied')} />
        </div>
      </>
    );
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.Alert = AlertDemo;
})();
