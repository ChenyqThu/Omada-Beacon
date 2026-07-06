/* components/NotificationMatrix/NotificationMatrix.demo.jsx — window.OmadaDemos.NotificationMatrix */
(function () {
  const NotificationMatrix = window.Omada.NotificationMatrix;
  const Icon = window.Omada.Icon;
  const { Button } = window.antd;

  function NotificationMatrixDemo() {
    const { useState } = React;
    const ctx = window.useOmada();
    const t = ctx.t;
    const K = NotificationMatrix.key;

    const channels = [
      { key: 'email', label: t('nm.ch.email'), icon: 'inbox' },
      { key: 'push',  label: t('nm.ch.push'),  icon: 'bell' },
      { key: 'sms',   label: t('nm.ch.sms'),    icon: 'devices' },
      { key: 'webhook', label: t('nm.ch.webhook'), icon: 'cloud' },
    ];

    const events = [
      { key: 'offline', label: t('nm.ev.offline'), desc: t('nm.ev.offline.d') },
      { key: 'firmware', label: t('nm.ev.firmware'), desc: t('nm.ev.firmware.d') },
      { key: 'security', label: t('nm.ev.security'), desc: t('nm.ev.security.d') },
      { key: 'guest', label: t('nm.ev.guest'), desc: t('nm.ev.guest.d') },
      { key: 'report', label: t('nm.ev.report'), desc: t('nm.ev.report.d') },
    ];

    // SMS doesn't apply to weekly reports; webhook not for guest portal
    const locked = {
      [K('report', 'sms')]: true,
      [K('guest', 'webhook')]: true,
    };

    const seed = () => ({
      [K('offline', 'email')]: true, [K('offline', 'push')]: true, [K('offline', 'sms')]: true,
      [K('firmware', 'email')]: true, [K('firmware', 'push')]: true,
      [K('security', 'email')]: true, [K('security', 'push')]: true, [K('security', 'webhook')]: true,
      [K('guest', 'push')]: true,
      [K('report', 'email')]: true,
    });

    const [value, setValue] = useState(seed);

    return (
      <div className="omada-nm-demo">
        <span className="omada-nm-blocktitle">{t('nm.demo.title')}</span>
        <NotificationMatrix
          channels={channels}
          events={events}
          value={value}
          locked={locked}
          onChange={setValue}
        />
        <div className="omada-nm-demobar">
          <Button type="text" size="small" icon={<Icon name="refresh" size={14} />}
                  onClick={() => setValue(seed())}>
            {t('nm.demo.reset')}
          </Button>
          <Button type="text" size="small" icon={<Icon name="ban" size={14} />}
                  onClick={() => setValue({})}>
            {t('nm.demo.none')}
          </Button>
        </div>
        <p className="omada-nm-hint">{t('nm.demo.hint')}</p>
      </div>
    );
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.NotificationMatrix = NotificationMatrixDemo;
})();
