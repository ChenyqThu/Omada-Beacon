/* ────────────────────────────────────────────────────────────────────────
   components/EditableField/EditableField.jsx — OmadaEditableField

   Inline click-to-edit for a single value — the lightweight alternative to
   opening a form just to rename a device or change one setting. Display mode
   shows the value with a quiet pencil affordance on hover; clicking (or the
   pencil) swaps in the right control: text Input, InputNumber, or Select. The
   draft commits on Enter / blur / ✓ and reverts on Esc / ✕. A `validate(value)`
   hook can block the commit and surface an inline error while staying in edit
   mode; an empty value falls back to a muted "Not set" placeholder.

   Thin composition over antd Input / InputNumber / Select + Button + OmadaIcon.
   Token-driven, dark twin, RTL-safe. Autofocuses and selects on enter-edit.

   Figma: Table 表格 inline-edit row (24381:129437 — "click Edit → editable
   state → Cancel reverts"). Original single-field distillation.
   Exports: window.Omada.EditableField
   ──────────────────────────────────────────────────────────────────────── */
(function () {
  const { Input, InputNumber, Select } = window.antd;
  const Icon = window.Omada.Icon;

  function OmadaEditableField(props) {
    const { useState, useRef, useEffect } = React;
    const ctx = window.useOmada ? window.useOmada() : null;
    const t = ctx ? ctx.t : (k) => k;

    const type = props.type || 'text';
    const [editing, setEditing] = useState(false);
    const [draft, setDraft] = useState(props.value);
    const [error, setError] = useState(null);
    const inputRef = useRef(null);

    useEffect(() => { if (!editing) setDraft(props.value); }, [props.value, editing]);
    useEffect(() => {
      if (editing && inputRef.current) {
        const node = inputRef.current;
        if (node.focus) node.focus();
        if (node.select && type === 'text') { try { node.select(); } catch (e) {} }
      }
    }, [editing, type]);

    const start = () => { if (props.disabled) return; setDraft(props.value); setError(null); setEditing(true); };
    const cancel = () => { setEditing(false); setError(null); setDraft(props.value); };
    const commit = () => {
      const err = props.validate ? props.validate(draft) : null;
      if (err) { setError(err); return; }
      setEditing(false); setError(null);
      if (draft !== props.value && props.onCommit) props.onCommit(draft);
    };

    const onKeyDown = (e) => {
      if (e.key === 'Enter' && type !== 'select') { e.preventDefault(); commit(); }
      else if (e.key === 'Escape') { e.preventDefault(); cancel(); }
    };

    // ── display mode ──
    if (!editing) {
      const opt = type === 'select' && props.options
        ? props.options.find((o) => o.value === props.value) : null;
      const shown = type === 'select'
        ? (opt ? opt.label : props.value)
        : props.value;
      const isEmpty = shown == null || shown === '';
      return (
        <span className={'omada-ef' + (props.disabled ? ' is-disabled' : '')}>
          <button type="button" className="omada-ef-display" onClick={start}
                  disabled={props.disabled} aria-label={t('ef.edit')}>
            <span className={'omada-ef-value' + (isEmpty ? ' is-empty' : '')}>
              {isEmpty ? (props.emptyText || t('ef.empty')) : shown}
              {props.suffix != null && !isEmpty ? <span className="omada-ef-unit"> {props.suffix}</span> : null}
            </span>
            {!props.disabled && <Icon name="edit" size={14} className="omada-ef-pencil" />}
          </button>
        </span>
      );
    }

    // ── edit mode ──
    let control;
    if (type === 'number') {
      control = (
        <InputNumber ref={inputRef} value={draft} onChange={(v) => setDraft(v)} onKeyDown={onKeyDown}
                     size="small" status={error ? 'error' : ''} min={props.min} max={props.max}
                     style={{ width: props.width || 110 }} autoFocus />
      );
    } else if (type === 'select') {
      control = (
        <Select ref={inputRef} value={draft} onChange={(v) => setDraft(v)} options={props.options}
                size="small" status={error ? 'error' : ''} open={undefined} defaultOpen
                style={{ minWidth: props.width || 160 }} autoFocus
                onKeyDown={(e) => { if (e.key === 'Escape') cancel(); }} />
      );
    } else {
      control = (
        <Input ref={inputRef} value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={onKeyDown}
               size="small" status={error ? 'error' : ''} placeholder={props.placeholder}
               style={{ width: props.width || 180 }} autoFocus />
      );
    }

    return (
      <span className="omada-ef is-editing">
        <span className="omada-ef-edit">
          {control}
          <button type="button" className="omada-ef-ok" onMouseDown={(e) => e.preventDefault()} onClick={commit} aria-label={t('common.save')}>
            <Icon name="check" size={15} />
          </button>
          <button type="button" className="omada-ef-x" onMouseDown={(e) => e.preventDefault()} onClick={cancel} aria-label={t('common.cancel')}>
            <Icon name="close" size={15} />
          </button>
        </span>
        {error && <span className="omada-ef-err" role="alert">{error}</span>}
      </span>
    );
  }

  window.Omada = window.Omada || {};
  window.Omada.EditableField = OmadaEditableField;
})();
