/* components/Mentions/Mentions.demo.jsx — window.OmadaDemos.Mentions */
(function () {
  const { Mentions } = window.Omada;
  const OmadaIcon = window.OmadaIcon;
  const { useState } = React;

  const ADMINS = [
    { value: 'ava.chen',   label: 'Ava Chen' },
    { value: 'marco.diaz', label: 'Marco Diaz' },
    { value: 'priya.nair', label: 'Priya Nair' },
    { value: 'sam.okoye',  label: 'Sam Okoye' },
  ];

  function MentionsDemo() {
    const { t } = window.useOmada();
    const [value, setValue] = useState('Rebooting after the 5\u202fGHz drop — ');

    const options = ADMINS.map((a) => ({
      value: a.value,
      label: (
        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{
            width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(0,168,112,0.12)', color: '#00A870', fontSize: 11, fontWeight: 600,
          }}>{a.label.split(' ').map((w) => w[0]).join('')}</span>
          <span style={{ fontSize: 13 }}>{a.label}</span>
          <span style={{ fontSize: 11, color: 'var(--fg-tertiary)', fontFamily: 'var(--font-mono)' }}>@{a.value}</span>
        </span>
      ),
    }));

    return (
      <>
        <div className="grid-2" style={{ alignItems: 'start' }}>
          <div>
            <div style={{ fontSize: 12, color: 'var(--fg-secondary)', marginBottom: 6 }}>{t('mention.label')}</div>
            <Mentions
              value={value}
              onChange={setValue}
              options={options}
              placeholder={t('mention.ph')}
              autoSize={{ minRows: 3, maxRows: 6 }}
              style={{ width: '100%' }}
            />
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8, color: 'var(--fg-tertiary)', fontSize: 12 }}>
              <OmadaIcon name="info" size={14} />
              {t('mention.hint')}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 12, color: 'var(--fg-secondary)', marginBottom: 6 }}>{t('common.disabled')}</div>
            <Mentions
              disabled
              defaultValue="Escalated to @ava.chen"
              options={options}
              autoSize={{ minRows: 3, maxRows: 6 }}
              style={{ width: '100%' }}
            />
          </div>
        </div>
      </>
    );
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.Mentions = MentionsDemo;
})();
