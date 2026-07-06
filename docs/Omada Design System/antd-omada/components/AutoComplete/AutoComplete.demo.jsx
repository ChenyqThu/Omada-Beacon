/* components/AutoComplete/AutoComplete.demo.jsx — window.OmadaDemos.AutoComplete */
(function () {
  const { AutoComplete } = window.Omada;
  const OmadaIcon = window.OmadaIcon;
  const { useState, useMemo } = React;

  function opt(icon, label, sub) {
    return {
      value: label,
      label: (
        <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <OmadaIcon name={icon} size={15} style={{ color: 'var(--fg-tertiary)' }} />
          <span style={{ flex: 1, fontSize: 13 }}>{label}</span>
          {sub ? <span style={{ fontSize: 11, color: 'var(--fg-tertiary)', fontFamily: 'var(--font-mono)' }}>{sub}</span> : null}
        </span>
      ),
    };
  }

  function groupTitle(text) {
    return (
      <span style={{
        fontFamily: 'var(--font-mono)', fontSize: 10, textTransform: 'lowercase',
        letterSpacing: '0.04em', color: 'var(--fg-tertiary)',
      }}>{text}</span>
    );
  }

  function AutoCompleteDemo() {
    const { t } = window.useOmada();
    const [value, setValue] = useState('');

    const all = useMemo(() => [
      {
        label: groupTitle(t('ac.recent')),
        options: [opt('clock', 'EAP670', '192.168.0.24'), opt('clock', 'ER7206', '192.168.0.1')],
      },
      {
        label: groupTitle(t('ac.devices')),
        options: [
          opt('ap', 'EAP670 — HQ Floor 3', '48'),
          opt('switch', 'SG2428P — Core', '26'),
          opt('gateway', 'ER7206 — Gateway', '1.2G'),
          opt('camera', 'VIGI C540 — Lobby', 'live'),
        ],
      },
      {
        label: groupTitle(t('ac.sites')),
        options: [opt('map', 'HQ Campus', '4 fl'), opt('map', 'Branch — Lab', '1 fl')],
      },
    ], [t]);

    // filter inside groups by typed value
    const filtered = useMemo(() => {
      const q = value.trim().toLowerCase();
      if (!q) return all;
      return all
        .map((g) => ({ label: g.label, options: g.options.filter((o) => o.value.toLowerCase().includes(q)) }))
        .filter((g) => g.options.length);
    }, [value, all]);

    const plain = [
      { value: '192.168.0.1' }, { value: '192.168.0.2' }, { value: '192.168.0.24' }, { value: '192.168.0.61' },
    ];

    return (
      <>
        <div className="grid-2" style={{ alignItems: 'start' }}>
          <div>
            <div style={{ fontSize: 12, color: 'var(--fg-secondary)', marginBottom: 6 }}>{t('ac.label')}</div>
            <AutoComplete
              prefixIcon="search"
              placeholder={t('ac.ph')}
              options={filtered}
              value={value}
              onChange={setValue}
              onSelect={(v) => setValue(v)}
              style={{ width: '100%' }}
            />
          </div>
          <div>
            <div style={{ fontSize: 12, color: 'var(--fg-secondary)', marginBottom: 6 }}>{t('ac.plain')}</div>
            <AutoComplete
              placeholder={t('ac.ph')}
              options={plain}
              filterOption={(input, option) => option.value.includes(input)}
              style={{ width: '100%' }}
            />
            <div style={{ marginTop: 14, fontSize: 12, color: 'var(--fg-secondary)', marginBottom: 6 }}>{t('common.disabled')}</div>
            <AutoComplete
              prefixIcon="search"
              placeholder={t('ac.ph')}
              disabled
              defaultValue="ER7206"
              style={{ width: '100%' }}
            />
          </div>
        </div>
      </>
    );
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.AutoComplete = AutoCompleteDemo;
})();
