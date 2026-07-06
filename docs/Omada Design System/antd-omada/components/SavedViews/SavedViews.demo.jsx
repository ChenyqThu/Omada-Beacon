/* components/SavedViews/SavedViews.demo.jsx — window.OmadaDemos.SavedViews */
(function () {
  const { useState } = React;
  const SavedViews = window.Omada.SavedViews;
  const Icon = window.Omada.Icon;

  function SavedViewsDemo() {
    const ctx = window.useOmada();
    const t = ctx.t;

    const fields = [
      { key: 'type', label: t('fb.f.type'), type: 'enum', options: [
        { label: t('ws.t.ap'), value: 'ap' },
        { label: t('ws.t.switch'), value: 'switch' },
        { label: t('ws.t.gateway'), value: 'gateway' },
      ] },
      { key: 'status', label: t('fb.f.status'), type: 'enum', options: [
        { label: t('status.connected'), value: 'connected' },
        { label: t('status.pending'), value: 'pending' },
        { label: t('status.disconnected'), value: 'disconnected' },
      ] },
      { key: 'name', label: t('fb.f.name'), type: 'text' },
      { key: 'clients', label: t('fb.f.clients'), type: 'number' },
    ];

    const views = [
      { id: 'all', name: t('sv.v.all'), icon: 'list', rows: [] },
      { id: 'offline', name: t('sv.v.offlineAps'), icon: 'bookmark', rows: [
        { field: 'type', op: 'is', value: 'ap' },
        { field: 'status', op: 'is', value: 'disconnected' },
      ] },
      { id: 'busy', name: t('sv.v.busy'), icon: 'star', rows: [
        { field: 'clients', op: 'gt', value: 50 },
      ] },
    ];

    const [active, setActive] = useState(t('sv.v.all'));
    const [count, setCount] = useState(0);

    return (
      <div className="omada-sv-demo">
        <SavedViews
          fields={fields}
          views={views}
          storageKey="omada.demo.savedViews"
          onChange={function (p) { setActive(p.view ? p.view.name : ''); setCount((p.rows || []).length); }}
        />
        <div className="omada-sv-readout">
          <Icon name="devices" size={14} />
          <span>{t('sv.showing')} <strong>{active}</strong> · {count} {t('sv.conditions')}</span>
        </div>
      </div>
    );
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.SavedViews = SavedViewsDemo;
})();
