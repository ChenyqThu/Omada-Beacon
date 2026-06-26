/* ────────────────────────────────────────────────────────────────────────
   components/DependencyHint/DependencyHint.jsx — OmadaDependencyHint

   A SETTING-DEPENDENCY callout — "Enabling Deep Packet Inspection requires
   Traffic Logging". It sits under the dependent control, lists each
   prerequisite with its live state, and offers ONE-CLICK Enable buttons
   (plus Enable-all when several are off). When everything is satisfied it
   flips to a quiet success note — or hides entirely with `hideWhenMet`.

   Distinct from HintPopover (Batch 23 — explanatory hover content) and
   FormValidation (Batch 13 — value errors): this expresses a relationship
   BETWEEN settings, with the fix inline.

     · `feature` — the dependent setting's label (fills the sentence).
     · `requires: [{ key, label, enabled, onEnable? }]` — live state comes
       from the caller; `onEnable(key)` flips it (no enable button when
       omitted — read-only prerequisite).
     · `mode: 'enable' | 'disable'` — the disable variant warns the other
       way: "Disabling {a} will also disable …".

   Thin composition over OmadaIcon + Button on the warning/success token
   washes. Token-driven, dark twin, i18n, RTL-mirrored.

   Figma: no dedicated node — callout anatomy follows Alert; the
   requirement rows are original.
   Exports: window.Omada.DependencyHint
   ──────────────────────────────────────────────────────────────────────── */
(function () {
  const { Button } = window.antd;
  const Icon = window.Omada.Icon;

  function OmadaDependencyHint(props) {
    const ctx = window.useOmada ? window.useOmada() : null;
    const t = ctx ? ctx.t : (k) => k;

    const requires = props.requires || [];
    const mode = props.mode || 'enable';
    const unmet = requires.filter((r) => !r.enabled);
    const met = mode === 'enable' && unmet.length === 0;

    if (met && props.hideWhenMet) return null;

    const sentence = mode === 'disable'
      ? t('dep.disables').replace('{a}', props.feature || '')
      : met
        ? t('dep.met')
        : t('dep.requires').replace('{a}', props.feature || '');

    const enableAll = () => {
      unmet.forEach((r) => { if (r.onEnable) r.onEnable(r.key); });
    };

    return (
      <div className={'omada-dep' + (met ? ' is-met' : '') + (mode === 'disable' ? ' is-disable' : '') + (props.className ? ' ' + props.className : '')} role="note">
        <span className="omada-dep-icon">
          <Icon name={met ? 'check-circle' : 'info'} size={15} />
        </span>
        <div className="omada-dep-body">
          <span className="omada-dep-sentence">{sentence}</span>
          {!(met && mode === 'enable') && (
            <div className="omada-dep-reqs">
              {requires.map((r) => (
                <span key={r.key} className={'omada-dep-req' + (r.enabled ? ' is-on' : '')}>
                  <span className="omada-dep-dot" aria-hidden="true">
                    {r.enabled ? <Icon name="check" size={10} /> : null}
                  </span>
                  {r.label}
                  <span className="omada-dep-state">{t(r.enabled ? 'dep.on' : 'dep.off')}</span>
                  {mode === 'enable' && !r.enabled && r.onEnable && (
                    <Button size="small" className="omada-dep-enable" onClick={() => r.onEnable(r.key)}>
                      {t('dep.enable')}
                    </Button>
                  )}
                </span>
              ))}
            </div>
          )}
        </div>
        {mode === 'enable' && unmet.length > 1 && unmet.every((r) => r.onEnable) && (
          <Button size="small" type="primary" className="omada-dep-enableall" onClick={enableAll}>
            {t('dep.enableall').replace('{n}', unmet.length)}
          </Button>
        )}
      </div>
    );
  }

  window.Omada = window.Omada || {};
  window.Omada.DependencyHint = OmadaDependencyHint;
})();
