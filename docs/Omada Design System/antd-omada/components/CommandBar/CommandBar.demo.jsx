/* components/CommandBar/CommandBar.demo.jsx — window.OmadaDemos.CommandBar */
(function () {
  const CommandBar = window.Omada.CommandBar;
  const Icon = window.Omada.Icon;
  const { Checkbox, App } = window.antd;

  function CommandBarDemo() {
    const { useState } = React;
    const ctx = window.useOmada();
    const t = ctx.t;
    const appApi = App.useApp ? App.useApp() : null;
    const msg = appApi && appApi.message ? appApi.message : { success: () => {}, info: () => {} };

    const ROWS = [
      { id: 'd1', name: 'AP-Lobby-01', type: 'ap',      site: t('cmdbar.site.hq') },
      { id: 'd2', name: 'SW-Core-02',  type: 'switch',  site: t('cmdbar.site.hq') },
      { id: 'd3', name: 'GW-Edge-01',  type: 'gateway', site: t('cmdbar.site.branch') },
      { id: 'd4', name: 'AP-Cafe-03',  type: 'ap',      site: t('cmdbar.site.branch') },
      { id: 'd5', name: 'SW-Dist-04',  type: 'switch',  site: t('cmdbar.site.branch') },
    ];

    const [sel, setSel] = useState([]);
    const allChecked = sel.length === ROWS.length;
    const someChecked = sel.length > 0 && !allChecked;

    const toggle = (id) => setSel((s) => (s.includes(id) ? s.filter((x) => x !== id) : s.concat(id)));
    const toggleAll = () => setSel(allChecked ? [] : ROWS.map((r) => r.id));

    const actions = [
      { key: 'reboot',  label: t('cmdbar.act.reboot'),  icon: 'reboot' },
      { key: 'move',    label: t('cmdbar.act.move'),    icon: 'move-to-site' },
      { key: 'tag',     label: t('cmdbar.act.tag'),     icon: 'bookmark' },
      { key: 'export',  label: t('cmdbar.act.export'),  icon: 'export' },
      { key: 'forget',  label: t('cmdbar.act.forget'),  icon: 'trash', tone: 'danger' },
    ];

    const onAction = (key) => {
      const a = actions.find((x) => x.key === key);
      const n = sel.length;
      msg[key === 'forget' ? 'info' : 'success'](
        t('cmdbar.toast').replace('{action}', a.label).replace('{n}', n)
      );
      if (key === 'forget' || key === 'move') setSel([]);
    };

    return (
      <div className="omada-cmdbar-demo">
        {/* the floating bar anchors to this positioned stage */}
        <div className="omada-cmdbar-stage">
          <div className="omada-cmdbar-listhead">
            <Checkbox checked={allChecked} indeterminate={someChecked} onChange={toggleAll}>
              {t('cmdbar.selectall')}
            </Checkbox>
            <span className="omada-cmdbar-listcount">
              {t('cmdbar.total').replace('{n}', ROWS.length)}
            </span>
          </div>

          <div className="omada-cmdbar-rows" role="list">
            {ROWS.map((r) => {
              const on = sel.includes(r.id);
              return (
                <label key={r.id} className={'omada-cmdbar-row' + (on ? ' is-sel' : '')} role="listitem">
                  <Checkbox checked={on} onChange={() => toggle(r.id)} />
                  <span className="omada-cmdbar-rowic"><Icon name={r.type} size={18} /></span>
                  <span className="omada-cmdbar-rowname">{r.name}</span>
                  <span className="omada-cmdbar-rowsite">{r.site}</span>
                </label>
              );
            })}
          </div>

          <CommandBar
            count={sel.length}
            actions={actions}
            maxVisible={3}
            onAction={onAction}
            onClear={() => setSel([])}
          />
        </div>

        <p className="omada-cmdbar-hint">{t('cmdbar.hint')}</p>
      </div>
    );
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.CommandBar = CommandBarDemo;
})();
