/* components/FilterBuilder/FilterBuilder.demo.jsx — window.OmadaDemos.FilterBuilder */
(function () {
  const FilterBuilder = window.Omada.FilterBuilder;

  function FilterBuilderDemo() {
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
      { key: 'name',    label: t('fb.f.name'),    type: 'text' },
      { key: 'clients', label: t('fb.f.clients'), type: 'number' },
      { key: 'uptime',  label: t('fb.f.uptime'),  type: 'number', unit: t('fb.u.days') },
    ];

    return (
      <FilterBuilder
        fields={fields}
        defaultRows={[
          { field: 'type', op: 'is', value: 'ap' },
          { field: 'clients', op: 'gt', value: 10 },
        ]}
        onChange={function () { /* a table would filter here */ }}
      />
    );
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.FilterBuilder = FilterBuilderDemo;
})();
