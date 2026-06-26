/* components/NotificationCenter/NotificationCenter.demo.jsx — window.OmadaDemos.NotificationCenter */
(function () {
  const { useState } = React;
  const Icon = window.Omada.Icon;
  const Button = window.Omada.Button;
  const NotificationCenter = window.Omada.NotificationCenter;

  function NotificationCenterDemo() {
    const ctx = window.useOmada();
    const t = ctx.t;
    const min = 60000;

    const seed = () => ([
      { id: 'n1', tone: 'alert',   read: false, ts: Date.now() - 2 * min,   title: t('nc.x.offlineT'),  body: t('nc.x.offlineB') },
      { id: 'n2', tone: 'success', read: false, ts: Date.now() - 18 * min,  title: t('nc.x.adoptedT'),  body: t('nc.x.adoptedB') },
      { id: 'n3', tone: 'info',    read: false, ts: Date.now() - 55 * min,  title: t('nc.x.fwT'),       body: t('nc.x.fwB') },
      { id: 'n4', tone: 'alert',   read: true,  ts: Date.now() - 3 * 60 * min, title: t('nc.x.blockT'),  body: t('nc.x.blockB') },
      { id: 'n5', tone: 'success', read: true,  ts: Date.now() - 26 * 60 * min, title: t('nc.x.backupT'), body: t('nc.x.backupB') },
    ]);

    const [items, setItems] = useState(seed);
    let counter = 0;

    const push = () => {
      const samples = [
        { tone: 'alert',   title: t('nc.x.offlineT'), body: t('nc.x.offlineB') },
        { tone: 'info',    title: t('nc.x.fwT'),      body: t('nc.x.fwB') },
        { tone: 'success', title: t('nc.x.adoptedT'), body: t('nc.x.adoptedB') },
      ];
      const s = samples[Math.floor(Math.random() * samples.length)];
      counter += 1;
      setItems((prev) => [{ id: 'live-' + Date.now(), tone: s.tone, read: false, ts: Date.now(), title: s.title, body: s.body }].concat(prev));
    };

    return (
      <div className="omada-nc-demo">
        <div className="omada-nc-demobar">
          <NotificationCenter items={items} onChange={setItems} />
          <Button variant="text" icon={<Icon name="plus" size={16} />} onClick={push}>
            {t('nc.simulate')}
          </Button>
          <Button variant="text" icon={<Icon name="refresh" size={16} />} onClick={() => setItems(seed())}>
            {t('nc.reset')}
          </Button>
        </div>
        <div className="omada-nc-note">{t('nc.note')}</div>
      </div>
    );
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.NotificationCenter = NotificationCenterDemo;
})();
