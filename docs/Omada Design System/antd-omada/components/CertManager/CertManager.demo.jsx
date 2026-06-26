/* components/CertManager/CertManager.demo.jsx — window.OmadaDemos.CertManager */
(function () {
  const CertManager = window.Omada.CertManager;
  const DAY = 86400000;

  const CERTS = [
    {
      id: 'c1', name: 'controller.acme.local.pem', cn: 'controller.acme.local',
      issuer: "Let's Encrypt R11", type: 'server',
      expires: new Date(Date.now() + 212 * DAY).toISOString(),
      fp: '7A:33:C1:0E:9D:42:B8:F5:16:6B:E0:2C:A9:74:D3:58',
    },
    {
      id: 'c2', name: 'portal.acme.local.pem', cn: 'portal.acme.local',
      issuer: "Let's Encrypt R11", type: 'server',
      expires: new Date(Date.now() + 19 * DAY).toISOString(),
      fp: 'C4:88:2F:b1:55:0A:E7:93:DD:31:7E:C6:48:9F:A2:0B'.toUpperCase(),
    },
    {
      id: 'c3', name: 'acme-internal-ca.crt', cn: 'ACME Internal CA',
      issuer: 'ACME Internal CA (self-signed)', type: 'ca',
      expires: new Date(Date.now() + 1460 * DAY).toISOString(),
      fp: '19:E5:7B:30:CC:84:F2:6D:A1:48:0F:B9:53:D7:2E:96',
    },
    {
      id: 'c4', name: 'legacy-vpn-client.p12', cn: 'vpn-user-2019',
      issuer: 'ACME Internal CA', type: 'client',
      expires: new Date(Date.now() - 41 * DAY).toISOString(),
      fp: 'F0:1C:69:D4:27:AB:83:5E:92:46:B7:0D:CE:61:38:A5',
    },
  ];

  function CertManagerDemo() {
    const ctx = window.useOmada();
    const t = ctx.t;
    return (
      <div className="omada-b27-demo">
        <div className="omada-b27-blocktitle">{t('cert.b.inventory')}</div>
        <CertManager defaultCerts={CERTS} />
        <p className="omada-b27-pagehint">{t('cert.hint')}</p>
      </div>
    );
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.CertManager = CertManagerDemo;
})();
