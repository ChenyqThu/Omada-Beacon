/* ────────────────────────────────────────────────────────────────────────
   components/Cheatsheet/Cheatsheet.jsx — OmadaCheatsheet

   A keyboard-shortcut cheatsheet GENERATED from a registered shortcut map —
   not a hand-authored list. Distinct from ShortcutsOverlay (Batch 19), which
   renders a static, manually-curated Modal. Here the legend builds itself:

     · A tiny registry (an event bus) collects shortcut entries from anywhere
       in the app. `Omada.Cheatsheet.register(items)` adds, returns an
       unregister fn; `useShortcuts(items, { bind })` registers on mount,
       cleans up on unmount, and (opt-in) wires a real keydown handler that
       matches combos and calls each entry's `run`.
     · The Cheatsheet Modal reads the live registry (merged with any `shortcuts`
       prop), groups by `group`, and offers a search filter.
     · Keys are PLATFORM-AWARE: the 'mod' token renders ⌘ on macOS, Ctrl
       elsewhere; shift/alt/enter/esc/arrows get proper glyphs.
     · `.Trigger` is the "?"-style opener (also bound to the `?` key by default).

   Thin composition over Modal + Input + OmadaIcon. Token-driven, dark twin,
   i18n, RTL-mirrored.

   Figma: no dedicated node — the <kbd> chip styling matches the CommandPalette
   reference (Batch 17); the registry-generator pattern is original.
   Exports: window.Omada.Cheatsheet (+ .Trigger, .register, .clear), window.useShortcuts
   ──────────────────────────────────────────────────────────────────────── */
(function () {
  const { Modal, Input } = window.antd;
  const Icon = window.Omada.Icon;

  const IS_MAC = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent || '');

  // ── platform-aware key glyphs ──
  const GLYPH = {
    mod: IS_MAC ? '⌘' : 'Ctrl',
    cmd: '⌘', ctrl: 'Ctrl', shift: '⇧', alt: IS_MAC ? '⌥' : 'Alt', opt: '⌥',
    enter: '↵', return: '↵', esc: 'Esc', escape: 'Esc', tab: 'Tab',
    space: 'Space', backspace: '⌫', delete: 'Del',
    up: '↑', down: '↓', left: '←', right: '→', plus: '+', slash: '/',
  };
  function glyph(tok) {
    const k = String(tok).toLowerCase();
    if (GLYPH[k]) return GLYPH[k];
    return String(tok).length === 1 ? String(tok).toUpperCase() : tok;
  }
  // accept ['mod','K'] | 'mod+k' | 'g s'(sequence via space)
  function tokens(keys) {
    if (Array.isArray(keys)) return keys;
    return String(keys).trim().split(/\s+/).map((seg) => seg.split('+'));
  }

  // ── the registry / event bus ──
  const entries = new Map();       // id -> item
  const listeners = new Set();
  let seq = 0;
  function emit() { listeners.forEach((fn) => fn()); }
  function register(items) {
    const arr = Array.isArray(items) ? items : [items];
    const ids = [];
    arr.forEach((it) => {
      const id = it.id != null ? it.id : 'sc-' + (++seq);
      entries.set(id, Object.assign({ id }, it));
      ids.push(id);
    });
    emit();
    return () => { ids.forEach((id) => entries.delete(id)); emit(); };
  }
  function clear(id) {
    if (id == null) entries.clear(); else entries.delete(id);
    emit();
  }
  function list() { return Array.from(entries.values()); }

  function matches(e, combo) {
    // combo is an array of tokens for a single chord
    const want = { mod: false, shift: false, alt: false };
    let main = null;
    combo.forEach((tok) => {
      const k = String(tok).toLowerCase();
      if (k === 'mod' || k === 'cmd' || k === 'ctrl') want.mod = true;
      else if (k === 'shift') want.shift = true;
      else if (k === 'alt' || k === 'opt') want.alt = true;
      else main = k;
    });
    const modDown = IS_MAC ? e.metaKey : e.ctrlKey;
    if (want.mod !== modDown) return false;
    if (want.shift !== e.shiftKey) return false;
    if (want.alt !== e.altKey) return false;
    if (main == null) return true;
    const key = (e.key || '').toLowerCase();
    return key === main || (main.length === 1 && key === main);
  }

  // ── hook: register for display + optionally bind handlers ──
  function useShortcuts(items, opts) {
    const { useEffect } = React;
    const bind = opts && opts.bind;
    useEffect(() => {
      const off = register(items);
      let keyHandler = null;
      if (bind) {
        keyHandler = (e) => {
          const tag = (e.target && e.target.tagName) || '';
          if (/INPUT|TEXTAREA|SELECT/.test(tag) || (e.target && e.target.isContentEditable)) return;
          for (const it of (Array.isArray(items) ? items : [items])) {
            if (!it.run || !it.keys) continue;
            const chords = tokens(it.keys);
            // only single-chord combos are bound (sequences are display-only)
            if (chords.length === 1 && matches(e, chords[0])) {
              e.preventDefault(); it.run(e); break;
            }
          }
        };
        window.addEventListener('keydown', keyHandler);
      }
      return () => { off(); if (keyHandler) window.removeEventListener('keydown', keyHandler); };
      // eslint-disable-next-line
    }, []);
  }

  // ── key chip rendering ──
  function Keys(props) {
    const chords = tokens(props.keys);
    return (
      <span className="omada-cheat-keys">
        {chords.map((chord, ci) => (
          <React.Fragment key={ci}>
            {ci > 0 && <span className="omada-cheat-then">{props.thenLabel}</span>}
            <span className="omada-cheat-chord">
              {chord.map((tok, ti) => (
                <kbd className="omada-cheat-kbd" key={ti}>{glyph(tok)}</kbd>
              ))}
            </span>
          </React.Fragment>
        ))}
      </span>
    );
  }

  function OmadaCheatsheet(props) {
    const { useState, useEffect, useMemo } = React;
    const ctx = window.useOmada ? window.useOmada() : null;
    const t = ctx ? ctx.t : (k) => k;

    const controlled = props.open !== undefined;
    const [innerOpen, setInnerOpen] = useState(false);
    const open = controlled ? props.open : innerOpen;
    const setOpen = (v) => { if (props.onOpenChange) props.onOpenChange(v); if (!controlled) setInnerOpen(v); };

    const [, force] = useState(0);
    useEffect(() => {
      const fn = () => force((x) => x + 1);
      listeners.add(fn);
      return () => listeners.delete(fn);
    }, []);

    const [q, setQ] = useState('');

    // bind the `?` key to open (unless typing)
    useEffect(() => {
      if (props.openKey === false) return;
      const fn = (e) => {
        const tag = (e.target && e.target.tagName) || '';
        if (/INPUT|TEXTAREA|SELECT/.test(tag) || (e.target && e.target.isContentEditable)) return;
        if (e.key === '?' || (e.key === '/' && e.shiftKey)) { e.preventDefault(); setOpen(true); }
      };
      window.addEventListener('keydown', fn);
      return () => window.removeEventListener('keydown', fn);
      // eslint-disable-next-line
    }, [props.openKey]);

    const all = useMemo(() => {
      const reg = list();
      const fromProp = props.shortcuts || [];
      return reg.concat(fromProp);
    }, [props.shortcuts, open, q]);

    const groups = useMemo(() => {
      const term = q.trim().toLowerCase();
      const byGroup = new Map();
      all.forEach((it) => {
        if (term) {
          const hay = (it.label + ' ' + (Array.isArray(it.keys) ? it.keys.join(' ') : it.keys || '')).toLowerCase();
          if (hay.indexOf(term) === -1) return;
        }
        const g = it.group || t('cheat.general');
        if (!byGroup.has(g)) byGroup.set(g, []);
        byGroup.get(g).push(it);
      });
      return Array.from(byGroup.entries());
    }, [all, q, t]);

    const total = all.length;

    return (
      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        width={props.width || 600}
        title={
          <span className="omada-cheat-title">
            <Icon name="keyboard" size={18} />
            {props.title || t('cheat.title')}
            <span className="omada-cheat-titlecount">{total}</span>
          </span>
        }
        className="omada-cheat-modal"
        rootClassName="omada-cheat-root"
      >
        <div className="omada-cheat-body">
          <Input
            allowClear
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t('cheat.search')}
            prefix={<Icon name="search" size={15} />}
            className="omada-cheat-searchbar"
          />
          {groups.length === 0 && (
            <div className="omada-cheat-empty">{t('cheat.noresults')}</div>
          )}
          <div className="omada-cheat-groups">
            {groups.map(([g, items]) => (
              <section className="omada-cheat-group" key={g}>
                <h4 className="omada-cheat-grouphead">{g}</h4>
                <ul className="omada-cheat-rows">
                  {items.map((it) => (
                    <li className="omada-cheat-row" key={it.id || it.label}>
                      <span className="omada-cheat-label">{it.label}</span>
                      <Keys keys={it.keys} thenLabel={t('cheat.then')} />
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
          <div className="omada-cheat-foot">
            <Icon name="info" size={13} />
            {t('cheat.foot').replace('{key}', '?')}
          </div>
        </div>
      </Modal>
    );
  }

  function Trigger(props) {
    const ctx = window.useOmada ? window.useOmada() : null;
    const t = ctx ? ctx.t : (k) => k;
    const cls = 'omada-cheat-trigger' + (props.className ? ' ' + props.className : '');
    return (
      <button type="button" className={cls} onClick={props.onClick} aria-label={t('cheat.title')}>
        <Icon name="keyboard" size={16} />
        {props.children || t('cheat.trigger')}
      </button>
    );
  }

  OmadaCheatsheet.Trigger = Trigger;
  OmadaCheatsheet.register = register;
  OmadaCheatsheet.clear = clear;
  OmadaCheatsheet.list = list;

  window.Omada = window.Omada || {};
  window.Omada.Cheatsheet = OmadaCheatsheet;
  window.useShortcuts = useShortcuts;
})();
