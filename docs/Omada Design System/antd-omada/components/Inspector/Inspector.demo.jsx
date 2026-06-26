/* components/Inspector/Inspector.demo.jsx — window.OmadaDemos.Inspector */
(function () {
  const Inspector = window.Omada.Inspector;
  const Icon = window.Omada.Icon;
  const { Segmented, App } = window.antd;

  function InspectorDemo() {
    const { useState } = React;
    const ctx = window.useOmada();
    const t = ctx.t;
    const appApi = App.useApp ? App.useApp() : null;
    const msg = appApi && appApi.message ? appApi.message : { success: () => {} };

    const DEVICE = {
      device: 'GW-Edge-01',
      model: 'ER7212PC',
      online: true,
      uptime: 1843204,
      firmware: { version: '1.3.2', channel: 'stable', autoUpdate: false },
      wan: {
        mode: 'pppoe',
        ipv4: '203.0.113.42',
        mtu: 1492,
        dns: ['1.1.1.1', '8.8.8.8'],
      },
      vlans: [
        { id: 1, name: 'Default', subnet: '192.168.0.0/24', tagged: false },
        { id: 20, name: 'IoT', subnet: '192.168.20.0/24', tagged: true },
        { id: 30, name: 'Guest', subnet: '192.168.30.0/24', tagged: true, captivePortal: { enabled: true, auth: 'voucher' } },
      ],
      clients: 142,
      lastSeen: null,
    };

    const THEME = {
      token: { colorPrimary: '#00A870', borderRadius: 8, fontFamily: 'Manrope' },
      semantic: { success: '#00A870', warning: '#E89C1C', error: '#EE385C', info: '#2A6FDB' },
      dark: { surface: '#1F1F1F', border: '#333', text: '#E8E8E8' },
    };

    const [src, setSrc] = useState('device');
    const data = src === 'device' ? DEVICE : THEME;

    return (
      <div className="omada-insp-demo">
        <div className="omada-insp-demobar">
          <Segmented
            value={src}
            onChange={setSrc}
            options={[
              { value: 'device', label: t('insp.src.device'), icon: <Icon name="gateway" size={14} /> },
              { value: 'theme',  label: t('insp.src.theme'),  icon: <Icon name="dashboard" size={14} /> },
            ]}
          />
          <span className="omada-insp-demohint">
            <Icon name="info" size={13} />
            {t('insp.demohint')}
          </span>
        </div>

        <div className="omada-insp-democard">
          <Inspector
            data={data}
            rootKey={src === 'device' ? 'config' : 'theme'}
            defaultExpandDepth={1}
            onCopyPath={(p) => msg.success(t('insp.copiedtoast').replace('{path}', p))}
          />
        </div>

        <p className="omada-insp-pagehint">{t('insp.hint')}</p>
      </div>
    );
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.Inspector = InspectorDemo;
})();
