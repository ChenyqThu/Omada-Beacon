/* components/Cheatsheet/Cheatsheet.demo.jsx — window.OmadaDemos.Cheatsheet */
(function () {
  const Cheatsheet = window.Omada.Cheatsheet;
  const Icon = window.Omada.Icon;
  const Button = window.Omada.Button;
  const { App } = window.antd;

  function CheatsheetDemo() {
    const { useState } = React;
    const ctx = window.useOmada();
    const t = ctx.t;
    const appApi = App.useApp ? App.useApp() : null;
    const msg = appApi && appApi.message ? appApi.message : { info: () => {}, success: () => {} };

    const [open, setOpen] = useState(false);
    const [lastBound, setLastBound] = useState(null);

    // a registered map — the legend is GENERATED from this, not hand-listed.
    // `run` entries are wired live via the bind option below.
    const MAP = [
      { id: 'k-search',  group: t('cheat.g.global'),  keys: 'mod+k',     label: t('cheat.sc.search'),  run: () => { setLastBound('search'); msg.info(t('cheat.fired').replace('{x}', t('cheat.sc.search'))); } },
      { id: 'k-new',     group: t('cheat.g.global'),  keys: 'mod+n',     label: t('cheat.sc.newdev'),  run: () => { setLastBound('new'); msg.success(t('cheat.fired').replace('{x}', t('cheat.sc.newdev'))); } },
      { id: 'k-save',    group: t('cheat.g.global'),  keys: 'mod+s',     label: t('cheat.sc.save') },
      { id: 'k-help',    group: t('cheat.g.global'),  keys: '?',         label: t('cheat.sc.help') },

      { id: 'k-next',    group: t('cheat.g.nav'),     keys: 'j',         label: t('cheat.sc.next') },
      { id: 'k-prev',    group: t('cheat.g.nav'),     keys: 'k',         label: t('cheat.sc.prev') },
      { id: 'k-goset',   group: t('cheat.g.nav'),     keys: 'g s',       label: t('cheat.sc.gosettings') },
      { id: 'k-godev',   group: t('cheat.g.nav'),     keys: 'g d',       label: t('cheat.sc.godevices') },

      { id: 'k-sel',     group: t('cheat.g.table'),   keys: 'x',         label: t('cheat.sc.select') },
      { id: 'k-selall',  group: t('cheat.g.table'),   keys: 'mod+a',     label: t('cheat.sc.selectall') },
      { id: 'k-reboot',  group: t('cheat.g.table'),   keys: 'mod+shift+r', label: t('cheat.sc.reboot') },
      { id: 'k-del',     group: t('cheat.g.table'),   keys: 'mod+backspace', label: t('cheat.sc.forget') },
    ];

    // register + bind the real handlers for the combos that carry `run`
    window.useShortcuts(MAP, { bind: true });

    return (
      <div className="omada-cheat-demo">
        <div className="omada-cheat-demobar">
          <Cheatsheet.Trigger onClick={() => setOpen(true)} />
          <Button variant="text" icon={<Icon name="command" size={15} />} onClick={() => setOpen(true)}>
            {t('cheat.opencta')}
          </Button>
          <span className="omada-cheat-demohint">
            <Icon name="info" size={13} />
            {t('cheat.demobind')}
          </span>
        </div>

        <div className="omada-cheat-readout">
          <span className="omada-cheat-readlabel">{t('cheat.lastfired')}</span>
          <span className="omada-cheat-readval">
            {lastBound ? lastBound : t('cheat.none')}
          </span>
        </div>

        <Cheatsheet open={open} onOpenChange={setOpen} />

        <p className="omada-cheat-pagehint">{t('cheat.hint')}</p>
      </div>
    );
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.Cheatsheet = CheatsheetDemo;
})();
