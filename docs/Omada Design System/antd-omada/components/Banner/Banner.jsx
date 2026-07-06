/* ────────────────────────────────────────────────────────────────────────
   components/Banner/Banner.jsx — OmadaBanner

   A full-width system / announcement bar — the non-modal "everyone needs to
   know this" strip that sits above page content (maintenance windows, firmware
   availability, trial countdowns, region incidents). Tones map to the semantic
   ramp: info · success · warning · critical · brand. Each carries a leading
   tone icon, a message, an optional inline action link, and an optional close.

   Dismissal is persistent: closing a banner writes `omada.banner.<id>` to
   localStorage and the banner stays hidden on reload (turn off with
   `persist={false}`). `OmadaBanner.Stack` renders an array and skips dismissed
   ones; `OmadaBanner.reset(ids)` clears the flags (handy for the demo).

   Thin composition over OmadaIcon + a Link-styled action. Token-driven with a
   dark twin; full-bleed banner variant available via `banner`.

   Figma: derived from Alert 警告提示 banner mode (2942:91347 / 3:25828) — same
   tone discs, stretched to a page-width bar. Original.
   Exports: window.Omada.Banner (+ .Stack, .reset, .isDismissed)
   ──────────────────────────────────────────────────────────────────────── */
(function () {
  const Icon = window.Omada.Icon;

  const TONE_ICON = {
    info: 'info', success: 'check-circle', warning: 'warning',
    critical: 'warning', brand: 'rocket',
  };

  const lsKey = (id) => 'omada.banner.' + id;
  function isDismissed(id) {
    if (!id) return false;
    try { return localStorage.getItem(lsKey(id)) === '1'; } catch (e) { return false; }
  }
  function setDismissed(id, v) {
    if (!id) return;
    try { v ? localStorage.setItem(lsKey(id), '1') : localStorage.removeItem(lsKey(id)); } catch (e) {}
  }

  function OmadaBanner(props) {
    const { useState } = React;
    const ctx = window.useOmada ? window.useOmada() : null;
    const t = ctx ? ctx.t : (k) => k;

    const persist = props.persist !== false;
    const closable = props.closable !== false;
    const [gone, setGone] = useState(() => (persist ? isDismissed(props.id) : false));
    if (gone) return null;

    const tone = props.tone || 'info';
    const icon = props.icon || TONE_ICON[tone] || 'info';

    const close = () => {
      setGone(true);
      if (persist) setDismissed(props.id, true);
      if (props.onClose) props.onClose(props.id);
    };

    return (
      <div className={'omada-banner is-' + tone + (props.banner ? ' is-bleed' : '')} role="status">
        <span className="omada-banner-ic"><Icon name={icon} size={18} /></span>
        <span className="omada-banner-msg">{props.message || props.children}</span>
        {props.action && (
          <button type="button" className="omada-banner-action"
                  onClick={props.action.onClick}>
            {props.action.label}
            <Icon name={props.action.icon || 'arrow-right'} size={14} />
          </button>
        )}
        {closable && (
          <button type="button" className="omada-banner-x" aria-label={t('bn.dismiss')} onClick={close}>
            <Icon name="close" size={16} />
          </button>
        )}
      </div>
    );
  }

  function BannerStack(props) {
    const items = props.items || [];
    return (
      <div className="omada-banner-stack">
        {items.map((b) => <OmadaBanner key={b.id} {...b} />)}
      </div>
    );
  }

  OmadaBanner.Stack = BannerStack;
  OmadaBanner.reset = (ids) => (ids || []).forEach((id) => setDismissed(id, false));
  OmadaBanner.isDismissed = isDismissed;

  window.Omada = window.Omada || {};
  window.Omada.Banner = OmadaBanner;
})();
