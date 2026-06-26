/* ────────────────────────────────────────────────────────────────────────
   components/UndoToast/UndoToast.jsx — OmadaUndoToast

   The "we did the thing, but you can take it back" snackbar. A bottom-anchored
   bar pops up after a destructive or bulk action (deleted 3 devices, archived a
   site, moved a client) and offers a single Undo action for a few seconds before
   it auto-commits. A thin progress hairline ticks down so the window is visible;
   hovering pauses the countdown so the user can read it. Multiple actions stack.

   `OmadaUndoToast.Host` mounts once near the app root. `useUndo()` (or the
   imperative `OmadaUndoToast.push(...)`) enqueues a toast:
       push({ message, onUndo, onCommit, duration })
   Undo fires onUndo and removes the toast; letting it expire fires onCommit.

   Thin composition over Button + OmadaIcon over an antd-tokened surface.
   Token-driven, dark twin, i18n, RTL-mirrored.

   Figma: derived from Message 全局提示 (toast surface) + the Dropdown elevated
   surface 3:16099. Original undo-affordance pattern — the Batch 22 candidate
   left unbuilt.
   Exports: window.Omada.UndoToast (+ .Host, .push, .clear), window.useUndo
   ──────────────────────────────────────────────────────────────────────── */
(function () {
  const { Button } = window.antd;
  const Icon = window.Omada.Icon;

  // ── tiny global event bus so any caller can push without prop-drilling ──
  const listeners = new Set();
  let seq = 0;
  function push(opts) {
    const o = opts || {};
    const id = o.id != null ? o.id : 'undo-' + (++seq);
    const toast = {
      id,
      message: o.message || '',
      undoLabel: o.undoLabel,
      icon: o.icon || 'check-circle',
      tone: o.tone || 'default',           // 'default' | 'danger'
      duration: o.duration == null ? 6000 : o.duration,
      onUndo: o.onUndo,
      onCommit: o.onCommit,
    };
    listeners.forEach((fn) => fn({ type: 'push', toast }));
    return id;
  }
  function clear(id) { listeners.forEach((fn) => fn({ type: 'clear', id })); }

  // companion hook — same surface, returns { push, clear }
  function useUndo() {
    const { useMemo } = React;
    return useMemo(() => ({ push, clear }), []);
  }

  // ── a single toast row, owns its own countdown + pause-on-hover ──
  function ToastRow(props) {
    const { useState, useEffect, useRef } = React;
    const ctx = window.useOmada ? window.useOmada() : null;
    const t = ctx ? ctx.t : (k) => k;
    const toast = props.toast;
    const dur = toast.duration;

    const [paused, setPaused] = useState(false);
    const [pct, setPct] = useState(100);
    const startRef = useRef(Date.now());
    const elapsedRef = useRef(0);
    const doneRef = useRef(false);

    const finish = (undone) => {
      if (doneRef.current) return;
      doneRef.current = true;
      if (undone) { if (toast.onUndo) toast.onUndo(); }
      else { if (toast.onCommit) toast.onCommit(); }
      props.onDone(toast.id, undone);
    };

    useEffect(() => {
      if (dur === 0) return;             // 0 = sticky, never auto-commits
      if (paused) return;
      startRef.current = Date.now();
      const tick = setInterval(() => {
        const e = elapsedRef.current + (Date.now() - startRef.current);
        const p = Math.max(0, 100 - (e / dur) * 100);
        setPct(p);
        if (p <= 0) { clearInterval(tick); finish(false); }
      }, 50);
      return () => {
        clearInterval(tick);
        elapsedRef.current += Date.now() - startRef.current;
      };
    }, [paused, dur]);

    return (
      <div
        className={'omada-undo-toast is-' + toast.tone}
        role="status"
        aria-live="polite"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <span className="omada-undo-ic"><Icon name={toast.icon} size={18} /></span>
        <span className="omada-undo-msg">{toast.message}</span>
        <Button
          size="small"
          type="link"
          className="omada-undo-action"
          onClick={() => finish(true)}
        >
          <Icon name="refresh" size={14} />
          {toast.undoLabel || t('undo.undo')}
        </Button>
        <button
          type="button"
          className="omada-undo-x"
          aria-label={t('undo.dismiss')}
          onClick={() => finish(false)}
        >
          <Icon name="close" size={15} />
        </button>
        {dur !== 0 && (
          <span className="omada-undo-bar" style={{ width: pct + '%' }} />
        )}
      </div>
    );
  }

  // ── the host: subscribes to the bus, renders the stack ──
  function UndoHost(props) {
    const { useState, useEffect, useCallback } = React;
    const [toasts, setToasts] = useState([]);
    const max = props.max == null ? 3 : props.max;

    useEffect(() => {
      const fn = (ev) => {
        if (ev.type === 'push') {
          setToasts((list) => {
            const next = list.concat(ev.toast);
            return next.length > max ? next.slice(next.length - max) : next;
          });
        } else if (ev.type === 'clear') {
          setToasts((list) => list.filter((x) => x.id !== ev.id));
        }
      };
      listeners.add(fn);
      return () => listeners.delete(fn);
    }, [max]);

    const onDone = useCallback((id) => {
      setToasts((list) => list.filter((x) => x.id !== id));
    }, []);

    if (!toasts.length) return null;
    const place = props.placement || 'bottom';   // 'bottom' | 'top'
    return (
      <div className={'omada-undo-host is-' + place} aria-live="polite">
        {toasts.map((toast) => (
          <ToastRow key={toast.id} toast={toast} onDone={onDone} />
        ))}
      </div>
    );
  }

  function OmadaUndoToast() { return null; }   // namespace holder
  OmadaUndoToast.Host = UndoHost;
  OmadaUndoToast.push = push;
  OmadaUndoToast.clear = clear;

  window.Omada = window.Omada || {};
  window.Omada.UndoToast = OmadaUndoToast;
  window.useUndo = useUndo;
})();
