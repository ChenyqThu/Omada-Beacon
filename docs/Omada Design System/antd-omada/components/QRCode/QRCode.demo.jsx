/* components/QRCode/QRCode.demo.jsx — window.OmadaDemos.QRCode */
(function () {
  const { QRCode } = window.Omada;
  const { useState } = React;

  function Cell({ label, children }) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
        {children}
        <span style={{ fontSize: 12, color: 'var(--fg-secondary)' }}>{label}</span>
      </div>
    );
  }

  function QRCodeDemo() {
    const { t } = window.useOmada();
    const [status, setStatus] = useState('expired');

    return (
      <>
        <div className="row"><span className="label">add device</span></div>
        <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap', alignItems: 'flex-start' }}>
          <Cell label={t('qr.addDevice')}>
            <QRCode value="https://omada.tplinkcloud.com/adopt?token=EAP670-9C5322" size={150} />
          </Cell>
          <Cell label={t('qr.pairing')}>
            <QRCode value="omada://pair/controller/acme-hq" size={150}
              icon="../assets/omada-app-icon.png" iconSize={36} />
          </Cell>
          <Cell label={status === 'expired' ? t('qr.expired') : t('qr.refresh')}>
            <QRCode value="https://omada.tplinkcloud.com/adopt?token=expiring"
              size={150} status={status}
              onRefresh={() => { setStatus('loading'); setTimeout(() => setStatus('active'), 900); }} />
          </Cell>
          <Cell label={t('qr.loading')}>
            <QRCode value="loading" size={150} status="loading" />
          </Cell>
          <Cell label={t('qr.scanned')}>
            <QRCode value="scanned" size={150} status="scanned" />
          </Cell>
        </div>

        <div className="row" style={{ marginTop: 22 }}><span className="label">neutral ink</span></div>
        <div style={{ display: 'flex', gap: 28 }}>
          <Cell label="brand={false}">
            <QRCode value="https://omada.tplinkcloud.com" brand={false} size={130} />
          </Cell>
        </div>
      </>
    );
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.QRCode = QRCodeDemo;
})();
