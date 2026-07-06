/* ────────────────────────────────────────────────────────────────────────
   components/PortMirror/PortMirror.jsx — OmadaPortMirror

   A PORT-MIRROR SESSION editor: a 10-port strip where clicking
   toggles SOURCE membership (filled green, with a direction glyph),
   a destination Select (source ports excluded; the chosen
   destination gets a DST ring on the strip and can no longer be a
   source), a Tx / Rx / Both direction Segmented, and an enable
   switch that stays off until the session is valid. A summary line
   spells the session out: sources → destination (direction).

   Distinct from PortPanel (physical faceplate status) and
   VlanMatrix (membership paint grid): this is a single-session
   src→dst config with mutual exclusion.

   Token-driven, dark twin, i18n. Port order stays LTR in RTL.
   Figma: SYMBOL 1830:2964 ("设备=Switch, 图标=Mirror-镜像口") — no
   full frame; port squares follow PortPanel metrics.
   Exports: window.Omada.PortMirror
   ──────────────────────────────────────────────────────────────────────── */
(function () {
  const { Segmented, Select, Switch } = window.antd;

  function OmadaPortMirror(props) {
    const { useState } = React;
    const ctx = window.useOmada ? window.useOmada() : null;
    const t = ctx ? ctx.t : (k) => k;

    const count = props.portCount || 10;
    const ports = [];
    for (let i = 1; i <= count; i++) ports.push(i);

    const [sources, setSources] = useState(props.defaultSources || [1, 3, 5]);
    const [dest, setDest] = useState(props.defaultDest != null ? props.defaultDest : 8);
    const [dir, setDir] = useState('both');
    const [enabled, setEnabled] = useState(false);

    const valid = sources.length > 0 && dest != null;

    function togglePort(p) {
      if (p === dest) return;
      setSources(function (ss) {
        return ss.indexOf(p) !== -1
          ? ss.filter(function (x) { return x !== p; })
          : ss.concat([p]).sort(function (a, b) { return a - b; });
      });
      if (enabled) setEnabled(false);
    }

    function pickDest(p) {
      setDest(p);
      setSources(function (ss) { return ss.filter(function (x) { return x !== p; }); });
      if (enabled) setEnabled(false);
    }

    const dirGlyph = dir === 'tx' ? 'arrow-up' : dir === 'rx' ? 'arrow-down' : null;

    return (
      <div className={'omada-pmir' + (props.className ? ' ' + props.className : '')}>
        <div className="omada-pmir-striplabel">{t('pmir.sources')}</div>
        <div className="omada-pmir-strip" role="group" aria-label={t('pmir.sources')}>
          {ports.map(function (p) {
            const isSrc = sources.indexOf(p) !== -1;
            const isDst = p === dest;
            return (
              <button key={p} type="button"
                      className={'omada-pmir-port' + (isSrc ? ' is-src' : '') + (isDst ? ' is-dst' : '')}
                      aria-pressed={isSrc}
                      title={isDst ? t('pmir.dest') : undefined}
                      onClick={function () { togglePort(p); }}>
                <span className="omada-pmir-num">{p}</span>
                {isSrc ? (
                  dirGlyph
                    ? <window.OmadaIcon name={dirGlyph} size={9} className="omada-pmir-glyph" />
                    : <span className="omada-pmir-bidir" aria-hidden="true" />
                ) : null}
                {isDst ? <em className="omada-pmir-dstbadge">{t('pmir.destBadge')}</em> : null}
              </button>
            );
          })}
        </div>
        <p className="omada-pmir-cliptip">{t('pmir.clickTip')}</p>

        <div className="omada-pmir-controls">
          <label className="omada-pmir-field">
            <span>{t('pmir.dest')}</span>
            <Select size="small" style={{ width: 120 }} value={dest} placeholder={t('pmir.none')}
                    onChange={pickDest}
                    options={ports.filter(function (p) { return sources.indexOf(p) === -1; })
                                  .map(function (p) { return { value: p, label: t('poe.port').replace('{n}', p) }; })} />
          </label>
          <label className="omada-pmir-field">
            <span>{t('pmir.direction')}</span>
            <Segmented size="small" value={dir} onChange={function (v) { setDir(v); }}
                       options={[
                         { value: 'both', label: t('pmir.dir.both') },
                         { value: 'tx',   label: t('pmir.dir.tx') },
                         { value: 'rx',   label: t('pmir.dir.rx') },
                       ]} />
          </label>
          <label className="omada-pmir-field">
            <span>{t('pmir.enable')}</span>
            <Switch size="small" checked={enabled && valid} disabled={!valid} onChange={setEnabled} />
          </label>
        </div>

        <div className={'omada-pmir-summary' + (valid ? '' : ' is-invalid') + (enabled && valid ? ' is-live' : '')}>
          {valid ? (
            <React.Fragment>
              {enabled ? <i className="omada-pmir-livedot" /> : null}
              {t('pmir.summary')
                .replace('{srcs}', sources.join(', '))
                .replace('{d}', dest)
                .replace('{dir}', t('pmir.dir.' + dir))}
            </React.Fragment>
          ) : t('pmir.pick')}
        </div>
      </div>
    );
  }

  window.Omada = window.Omada || {};
  window.Omada.PortMirror = OmadaPortMirror;
})();
