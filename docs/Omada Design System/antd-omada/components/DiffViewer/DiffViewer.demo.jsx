/* components/DiffViewer/DiffViewer.demo.jsx — window.OmadaDemos.DiffViewer */
(function () {
  const DiffViewer = window.Omada.DiffViewer;

  const OLD_CFG = [
    'network "Guest Wi-Fi" {',
    '  ssid      = "Omada-Guest"',
    '  vlan      = 30',
    '  band      = 2.4GHz',
    '  security  = wpa2-personal',
    '  rate-limit {',
    '    download = 10 Mbps',
    '    upload   = 5 Mbps',
    '  }',
    '  portal    = disabled',
    '  schedule  = always',
    '  isolation = off',
    '  dns       = 192.168.0.1',
    '  lease     = 86400',
    '  igmp      = off',
    '  multicast = off',
    '  bonjour   = off',
    '  log       = warn',
    '}',
  ].join('\n');

  const NEW_CFG = [
    'network "Guest Wi-Fi" {',
    '  ssid      = "Omada-Guest"',
    '  vlan      = 30',
    '  band      = dual',
    '  security  = wpa3-transition',
    '  rate-limit {',
    '    download = 25 Mbps',
    '    upload   = 5 Mbps',
    '  }',
    '  portal    = voucher',
    '  portal-timeout = 480',
    '  schedule  = always',
    '  isolation = on',
    '  dns       = 192.168.0.1',
    '  lease     = 86400',
    '  igmp      = off',
    '  multicast = off',
    '  bonjour   = off',
    '  log       = warn',
    '}',
  ].join('\n');

  function DiffViewerDemo() {
    const ctx = window.useOmada();
    const t = ctx.t;
    return (
      <div className="omada-diffv-demo">
        <div className="omada-diffv-block">
          <div className="omada-diffv-blocktitle">{t('diffv.b.config')}</div>
          <DiffViewer
            old={OLD_CFG}
            new={NEW_CFG}
            oldLabel={t('diffv.d.running')}
            newLabel={t('diffv.d.pending')}
          />
        </div>
        <div className="omada-diffv-block">
          <div className="omada-diffv-blocktitle">{t('diffv.b.split')}</div>
          <DiffViewer
            old={OLD_CFG}
            new={NEW_CFG}
            defaultMode="split"
            oldLabel={t('diffv.d.running')}
            newLabel={t('diffv.d.pending')}
          />
        </div>
        <p className="omada-diffv-pagehint">{t('diffv.hint')}</p>
      </div>
    );
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.DiffViewer = DiffViewerDemo;
})();
