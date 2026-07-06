/* ────────────────────────────────────────────────────────────────────────
   components/Density/Density.jsx — OmadaDensity

   A DENSITY / COMPACT-MODE board. It demonstrates that one ConfigProvider can
   re-scale a whole subtree two independent ways, with NO per-component edits:

     · componentSize — small | middle | large → control HEIGHT
       (token controlHeightSM/.../LG: 24 · 32 · 40)
     · compact algorithm — theme.compactAlgorithm → tightens PADDING and the
       row / item rhythm (table cells, form gaps, list rows)

   Live controls (a Segmented for size + a Switch for compact) rebuild the
   ConfigProvider theme on the fly, re-using getOmadaTheme(mode) so the Omada
   tokens + dark algorithm are always preserved — the compact algorithm is
   appended to whatever algorithm list the mode already needs. A representative
   specimen set (Button · Input · Select · Tag · Radio · a small Table) sits
   inside that scoped provider so you can read the size/compact effect across
   the library at once.

   This is NOT a new primitive — it wraps antd ConfigProvider + existing Omada
   wrappers. No bespoke colour; surfaces are theme vars with dark twins.

   Figma: no dedicated density frame; this is the ConfigProvider componentSize
   + theme.compactAlgorithm story from antd, themed with the Omada tokens
   (omada-theme.js controlHeight scale).
   Exports: window.Omada.Density
   ──────────────────────────────────────────────────────────────────────── */
(function () {
  const { useState } = React;
  const OmadaIcon = window.OmadaIcon;

  function OmadaDensity(props) {
    const className = props.className || '';
    const rest = Object.assign({}, props);
    delete rest.className;

    const ctx = window.useOmada ? window.useOmada() : { t: (k) => k, lang: 'en', mode: 'light' };
    const t = ctx.t;
    const mode = ctx.mode;

    const { ConfigProvider, theme, Table, Radio, Tag } = window.antd;
    const Button = window.Omada.Button;
    const Input = window.Omada.Input;
    const Select = window.Omada.Select;

    const [size, setSize] = useState('middle');
    const [compact, setCompact] = useState(false);

    // Rebuild the scoped theme: Omada tokens + dark + (optional) compact algo.
    const base = window.getOmadaTheme(mode, theme.darkAlgorithm);
    const algos = [];
    if (mode === 'dark') algos.push(theme.darkAlgorithm);
    if (compact) algos.push(theme.compactAlgorithm);
    const scopedTheme = Object.assign({}, base, algos.length ? { algorithm: algos } : { algorithm: undefined });

    const cols = [
      { title: t('table.col.device'), dataIndex: 'device', key: 'device' },
      { title: t('table.col.ip'), dataIndex: 'ip', key: 'ip' },
      { title: t('table.col.status'), dataIndex: 'status', key: 'status',
        render: (s) => <Tag color={s === 'on' ? 'green' : 'default'}>{t(s === 'on' ? 'status.online' : 'status.offline')}</Tag> },
    ];
    const data = [
      { key: 1, device: 'EAP670', ip: '192.168.0.24', status: 'on' },
      { key: 2, device: 'SG2428P', ip: '192.168.0.2', status: 'on' },
      { key: 3, device: 'ER7206', ip: '192.168.0.1', status: 'off' },
    ];

    const SIZES = [
      { value: 'small',  label: t('density.small') },
      { value: 'middle', label: t('density.middle') },
      { value: 'large',  label: t('density.large') },
    ];

    return (
      <div className={('omada-density ' + className).trim()} {...rest}>
        <div className="omada-density-bar">
          <span className="omada-density-ctl">
            <span className="omada-density-clabel">{t('density.size')}</span>
            <Radio.Group value={size} onChange={(e) => setSize(e.target.value)} optionType="button" buttonStyle="solid" size="small">
              {SIZES.map((s) => <Radio.Button key={s.value} value={s.value}>{s.label}</Radio.Button>)}
            </Radio.Group>
          </span>
          <span className="omada-density-ctl">
            <span className="omada-density-clabel">{t('density.compact')}</span>
            <window.antd.Switch checked={compact} onChange={setCompact} size="small" />
          </span>
        </div>

        <div className="omada-density-desc">{t('density.desc')}</div>

        <ConfigProvider theme={scopedTheme} componentSize={size}>
          <div className="omada-density-stage">
            <div className="omada-density-row">
              <Button variant="primary"><OmadaIcon name="plus" size={16} /> {t('device.addDevice')}</Button>
              <Button variant="secondary">{t('common.cancel')}</Button>
              <Input style={{ width: 180 }} placeholder={t('field.search.ph')}
                     prefix={<OmadaIcon name="search" size={15} />} />
              <Select
                style={{ width: 150 }}
                defaultValue="all"
                options={[
                  { value: 'all', label: t('common.all') },
                  { value: 'ap', label: t('net.ap') },
                  { value: 'switch', label: t('net.switch') },
                ]}
              />
            </div>
            <Table columns={cols} dataSource={data} pagination={false} bordered={false} />
          </div>
        </ConfigProvider>

        <div className="omada-density-note">{t('density.note')}</div>
      </div>
    );
  }

  window.Omada = window.Omada || {};
  window.Omada.Density = OmadaDensity;
})();
