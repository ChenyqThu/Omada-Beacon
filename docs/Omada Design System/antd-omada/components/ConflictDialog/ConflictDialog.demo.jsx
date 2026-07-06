/* components/ConflictDialog/ConflictDialog.demo.jsx — window.OmadaDemos.ConflictDialog */
(function () {
  const ConflictDialog = window.Omada.ConflictDialog;
  const { Button } = window.antd;
  const Icon = window.Omada.Icon;

  function ConflictDialogDemo() {
    const { useState } = React;
    const ctx = window.useOmada();
    const t = ctx.t;

    const [open, setOpen] = useState(false);
    const [result, setResult] = useState(null);

    const conflicts = [
      { key: 'ssid', label: t('confd.d.ssid'), mine: 'Omada-Office', theirs: 'Omada-HQ' },
      { key: 'channel', label: t('confd.d.channel'), mine: 'Auto', theirs: '36 (5 GHz)' },
      { key: 'txpower', label: t('confd.d.txpower'), mine: 'High', theirs: 'Medium' },
      { key: 'isolation', label: t('confd.d.isolation'), mine: false, theirs: true },
      { key: 'ratelimit', label: t('confd.d.ratelimit'), mine: '—', theirs: '25 Mbps / 10 Mbps' },
    ];

    return (
      <div className="omada-confd-demo">
        <div className="omada-confd-block">
          <div className="omada-confd-blocktitle">{t('confd.b.demo')}</div>
          <div className="omada-confd-stage">
            <Button type="primary" onClick={() => { setResult(null); setOpen(true); }}>
              {t('confd.open')}
            </Button>
            {result && (
              <span className="omada-confd-resolved">
                <Icon name="check-circle" size={14} />
                {t('confd.resolved').replace('{m}', result.mine).replace('{t}', result.theirs)}
              </span>
            )}
          </div>
        </div>

        <ConflictDialog
          open={open}
          conflicts={conflicts}
          meta={{ actor: 'n.zhang', when: '14:32' }}
          onCancel={() => setOpen(false)}
          onResolve={(merged, choices) => {
            const theirs = Object.keys(choices).filter((k) => choices[k] === 'theirs').length;
            setResult({ mine: conflicts.length - theirs, theirs });
            setOpen(false);
          }}
        />
        <p className="omada-confd-pagehint">{t('confd.hint')}</p>
      </div>
    );
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.ConflictDialog = ConflictDialogDemo;
})();
