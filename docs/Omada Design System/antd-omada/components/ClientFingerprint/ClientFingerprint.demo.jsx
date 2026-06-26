/* components/ClientFingerprint/ClientFingerprint.demo.jsx — window.OmadaDemos.ClientFingerprint */
(function () {
  const ClientFingerprint = window.Omada.ClientFingerprint;

  function ClientFingerprintDemo() {
    const { useState } = React;
    const ctx = window.useOmada();
    const t = ctx.t;

    const [ov1, setOv1] = useState(null);
    const [ov2, setOv2] = useState(null);
    const [ov3, setOv3] = useState('camera');

    return (
      <div className="omada-cfp-demo">
        <div className="omada-cfp-grid">
          <div className="omada-cfp-block">
            <div className="omada-cfp-blocktitle">{t('cfp.b.high')}</div>
            <ClientFingerprint
              client={{ name: 'MacBook Pro 16', mac: '3C:22:FB:8A:01:9E', os: 'macOS 15.3',
                        vendor: 'Apple, Inc.', category: 'laptop', confidence: 96, method: 'dhcp' }}
              override={ov1} onOverride={setOv1}
            />
          </div>
          <div className="omada-cfp-block">
            <div className="omada-cfp-blocktitle">{t('cfp.b.low')}</div>
            <ClientFingerprint
              client={{ name: 'ESP_DC4F22', mac: 'A4:CF:12:DC:4F:22', os: '—',
                        vendor: 'Espressif Inc.', category: 'unknown', confidence: 34, method: 'mdns' }}
              override={ov2} onOverride={setOv2}
            />
          </div>
          <div className="omada-cfp-block">
            <div className="omada-cfp-blocktitle">{t('cfp.b.override')}</div>
            <ClientFingerprint
              client={{ name: 'LOBBY-CAM-02', mac: '54:AF:97:11:B3:60', os: 'Embedded Linux',
                        vendor: 'Hangzhou Ezviz', category: 'iot', confidence: 61, method: 'ua' }}
              override={ov3} onOverride={setOv3}
            />
          </div>
        </div>
        <p className="omada-cfp-pagehint">{t('cfp.hint')}</p>
      </div>
    );
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.ClientFingerprint = ClientFingerprintDemo;
})();
