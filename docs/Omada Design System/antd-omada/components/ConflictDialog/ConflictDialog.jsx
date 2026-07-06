/* ────────────────────────────────────────────────────────────────────────
   components/ConflictDialog/ConflictDialog.jsx — OmadaConflictDialog

   CONCURRENT-EDIT resolution — someone else saved this page while you were
   editing. The dialog lists every conflicting field with both values side
   by side (MINE | THEIRS), each a selectable card; pick per field, or bulk
   "keep all mine" / "take all theirs", then Resolve returns the merged
   object. Fields where you pick the other side flag visibly so the final
   review is honest.

   Distinct from ApprovalFlow (Batch 23 — a request/approve pipeline) and
   AutoSave (Batch 22 — surfaces THAT a conflict happened): this is the
   resolution surface itself.

     · `conflicts: [{ key, label, mine, theirs, render? }]`
     · `meta: { actor, when }` fills the header sentence.
     · `onResolve(merged, choices)` — merged = { key: chosenValue },
       choices = { key: 'mine' | 'theirs' }.
     · Defaults every field to 'mine'; Resolve is always available.

   Thin composition over Modal + Button + OmadaIcon. Token-driven, dark
   twin, i18n, RTL-mirrored.

   Figma: no dedicated node — dialog chrome from Dialog (node group
   "Dialog"); the two-column value cards are original.
   Exports: window.Omada.ConflictDialog
   ──────────────────────────────────────────────────────────────────────── */
(function () {
  const { useState, useEffect } = React;
  const { Modal, Button } = window.antd;
  const Icon = window.Omada.Icon;

  function renderVal(f, v) {
    if (f.render) return f.render(v);
    if (typeof v === 'boolean') return v ? 'true' : 'false';
    if (v == null || v === '') return '—';
    return String(v);
  }

  function OmadaConflictDialog(props) {
    const ctx = window.useOmada ? window.useOmada() : null;
    const t = ctx ? ctx.t : (k) => k;

    const conflicts = props.conflicts || [];
    const [choices, setChoices] = useState({});

    // reset to "all mine" whenever the dialog (re)opens
    useEffect(() => {
      if (props.open) {
        const init = {};
        conflicts.forEach((f) => { init[f.key] = 'mine'; });
        setChoices(init);
      }
      // eslint-disable-next-line
    }, [props.open]);

    const pick = (key, side) => setChoices((c) => Object.assign({}, c, { [key]: side }));
    const bulk = (side) => {
      const next = {};
      conflicts.forEach((f) => { next[f.key] = side; });
      setChoices(next);
    };

    const theirsCount = conflicts.filter((f) => choices[f.key] === 'theirs').length;

    const resolve = () => {
      const merged = {};
      conflicts.forEach((f) => { merged[f.key] = choices[f.key] === 'theirs' ? f.theirs : f.mine; });
      if (props.onResolve) props.onResolve(merged, Object.assign({}, choices));
    };

    const meta = props.meta || {};

    const card = (f, side) => {
      const active = choices[f.key] === side;
      return (
        <button
          type="button"
          role="radio"
          aria-checked={active}
          className={'omada-confd-card is-' + side + (active ? ' is-active' : '')}
          onClick={() => pick(f.key, side)}
        >
          <span className="omada-confd-cardside">
            {active && <Icon name="check" size={12} />}
            {t(side === 'mine' ? 'confd.mine' : 'confd.theirs')}
          </span>
          <span className="omada-confd-cardval">{renderVal(f, side === 'mine' ? f.mine : f.theirs)}</span>
        </button>
      );
    };

    return (
      <Modal
        open={props.open}
        onCancel={props.onCancel}
        width={props.width || 620}
        className="omada-confd-modal"
        rootClassName="omada-confd-root"
        title={
          <span className="omada-confd-title">
            <Icon name="merge" size={18} />
            {props.title || t('confd.title')}
          </span>
        }
        footer={
          <div className="omada-confd-footer">
            <span className="omada-confd-tally">
              {t('confd.tally')
                .replace('{m}', conflicts.length - theirsCount)
                .replace('{t}', theirsCount)}
            </span>
            <Button onClick={props.onCancel}>{t('common.cancel')}</Button>
            <Button type="primary" onClick={resolve}>{t('confd.resolve')}</Button>
          </div>
        }
      >
        <p className="omada-confd-meta">
          <Icon name="warning" size={14} />
          {t('confd.meta')
            .replace('{actor}', meta.actor || '—')
            .replace('{time}', meta.when || '')}
        </p>

        <div className="omada-confd-bulk">
          <span className="omada-confd-count">{t('confd.fields').replace('{n}', conflicts.length)}</span>
          <button type="button" className="omada-confd-bulkbtn" onClick={() => bulk('mine')}>{t('confd.allmine')}</button>
          <span className="omada-confd-bulksep">·</span>
          <button type="button" className="omada-confd-bulkbtn" onClick={() => bulk('theirs')}>{t('confd.alltheirs')}</button>
        </div>

        <div className="omada-confd-list">
          {conflicts.map((f) => (
            <div key={f.key} className="omada-confd-row" role="radiogroup" aria-label={f.label}>
              <span className="omada-confd-flabel">{f.label}</span>
              <div className="omada-confd-cards">
                {card(f, 'mine')}
                {card(f, 'theirs')}
              </div>
            </div>
          ))}
        </div>
      </Modal>
    );
  }

  window.Omada = window.Omada || {};
  window.Omada.ConflictDialog = OmadaConflictDialog;
})();
