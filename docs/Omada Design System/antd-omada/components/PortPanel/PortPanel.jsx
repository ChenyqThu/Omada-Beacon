/* ────────────────────────────────────────────────────────────────────────
   components/PortPanel/PortPanel.jsx — OmadaPortPanel

   A switch PORT-GRID visualization — the faceplate view. RJ45 ports lay
   out in real switch order (odd row on top, even row below, numbered in
   column pairs), SFP/uplink cages group at the end, and every port tile
   carries a STATUS tone: link up (brand green), down (hollow), disabled
   (dimmed), error (red), with a PoE dot and an uplink mark. Click a port
   to INSPECT it — a details card reads name · status · speed · VLAN ·
   PoE draw · TX/RX.

     · `ports: [{ id, name?, status, speed?, poe?, uplink?, media?,
       vlan?, tx?, rx? }]` — status: 'up' | 'down' | 'disabled' | 'error';
       media: 'rj45' (default) | 'sfp'.
     · `selected` / `onSelect(port|null)` for controlled selection;
       uncontrolled otherwise. `inspect={false}` hides the card,
       `legend={false}` the legend.
     · Tiles are plain buttons (≥ 32px hit target), keyboard focusable.

   Thin composition over OmadaIcon on tokened surfaces; tiles are CSS
   only. Token-driven, dark twin, i18n, RTL-aware (port numbers LTR).

   Figma: no dedicated node — the Product/device pages are branded frames
   (declined on IP grounds); this faceplate abstraction is original,
   toned with the semantic palette.
   Exports: window.Omada.PortPanel
   ──────────────────────────────────────────────────────────────────────── */
(function () {
  const { useState } = React;
  const Icon = window.Omada.Icon;

  const STATUSES = ['up', 'down', 'disabled', 'error'];

  function OmadaPortPanel(props) {
    const ctx = window.useOmada ? window.useOmada() : null;
    const t = ctx ? ctx.t : (k) => k;

    const ports = props.ports || [];
    const rj45 = ports.filter((p) => (p.media || 'rj45') === 'rj45');
    const sfp = ports.filter((p) => p.media === 'sfp');

    const controlled = props.selected !== undefined;
    const [innerSel, setInnerSel] = useState(null);
    const selectedId = controlled ? props.selected : innerSel;
    const setSel = (id) => {
      if (!controlled) setInnerSel(id);
      if (props.onSelect) props.onSelect(id == null ? null : ports.find((p) => p.id === id) || null);
    };

    const sel = selectedId == null ? null : ports.find((p) => p.id === selectedId) || null;

    const tile = (p) => {
      const cls = 'omada-portp-port is-' + (p.status || 'down')
        + (p.media === 'sfp' ? ' is-sfp' : '')
        + (selectedId === p.id ? ' is-selected' : '');
      const label = (p.media === 'sfp' ? t('portp.sfp') + ' ' : t('portp.port') + ' ') + p.id
        + ' · ' + t('portp.s.' + (p.status || 'down'));
      return (
        <button
          key={p.id}
          type="button"
          className={cls}
          aria-label={label}
          aria-pressed={selectedId === p.id}
          title={label}
          onClick={() => setSel(selectedId === p.id ? null : p.id)}
        >
          <span className="omada-portp-jack" aria-hidden="true">
            {p.poe ? <span className="omada-portp-poe" /> : null}
            {p.uplink ? <Icon name="arrow-up" size={10} className="omada-portp-uplinkmark" /> : null}
          </span>
          <span className="omada-portp-num">{p.id}</span>
        </button>
      );
    };

    const field = (label, val) => (
      val == null ? null : (
        <span className="omada-portp-field">
          <span className="omada-portp-flabel">{label}</span>
          <span className="omada-portp-fval">{val}</span>
        </span>
      )
    );

    return (
      <div className={'omada-portp' + (props.className ? ' ' + props.className : '')}>
        <div className="omada-portp-plate">
          {props.label && <span className="omada-portp-platelabel">{props.label}</span>}
          <div className="omada-portp-banks">
            {rj45.length > 0 && (
              <div className="omada-portp-bank is-rj45" style={{ ['--om-portp-cols']: Math.ceil(rj45.length / 2) }}>
                {rj45.map(tile)}
              </div>
            )}
            {sfp.length > 0 && (
              <div className="omada-portp-bank is-sfpbank" style={{ ['--om-portp-cols']: Math.ceil(sfp.length / 2) }}>
                {sfp.map(tile)}
              </div>
            )}
          </div>
        </div>

        {props.legend !== false && (
          <div className="omada-portp-legend">
            {STATUSES.map((s) => (
              <span key={s} className={'omada-portp-leg is-' + s}>
                <span className="omada-portp-legswatch" />{t('portp.s.' + s)}
              </span>
            ))}
            <span className="omada-portp-leg is-poeleg">
              <span className="omada-portp-legswatch"><span className="omada-portp-poe" /></span>{t('portp.s.poe')}
            </span>
          </div>
        )}

        {props.inspect !== false && (
          <div className={'omada-portp-inspect' + (sel ? '' : ' is-idle')} aria-live="polite">
            {!sel && <span className="omada-portp-idle"><Icon name="switch" size={15} />{t('portp.select')}</span>}
            {sel && (
              <React.Fragment>
                <span className="omada-portp-iname">
                  <span className={'omada-portp-idot is-' + (sel.status || 'down')} />
                  {(sel.media === 'sfp' ? t('portp.sfp') : t('portp.port')) + ' ' + sel.id}
                  {sel.name && <span className="omada-portp-ialias">{sel.name}</span>}
                </span>
                <span className="omada-portp-fields">
                  {field(t('portp.f.status'), t('portp.s.' + (sel.status || 'down')))}
                  {field(t('portp.f.speed'), sel.speed)}
                  {field(t('portp.f.vlan'), sel.vlan)}
                  {field(t('portp.f.poe'), sel.poe ? (typeof sel.poe === 'number' ? sel.poe + ' W' : t('portp.on')) : null)}
                  {field('TX', sel.tx)}
                  {field('RX', sel.rx)}
                </span>
              </React.Fragment>
            )}
          </div>
        )}
      </div>
    );
  }

  window.Omada = window.Omada || {};
  window.Omada.PortPanel = OmadaPortPanel;
})();
