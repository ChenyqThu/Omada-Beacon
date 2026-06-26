/* ────────────────────────────────────────────────────────────────────────
   components/CommandPalette/CommandPalette.jsx — OmadaCommandPalette

   A keyboard-first COMMAND PALETTE + shortcut reference. antd ships no palette
   primitive, so this composes one from antd Modal + Input + a token-driven
   result list — the ⌘K / Ctrl+K pattern that power users expect for "jump to
   anything" navigation across a large console (sites, devices, settings,
   actions).

   Behaviour:
     · ⌘K / Ctrl+K (or the trigger button) opens; Esc closes.
     · Type to fuzzy-filter commands by label + keywords; results regroup
       under their section.
     · ↑ / ↓ move the active row (wraps); Enter runs it; the active row scrolls
       into view inside the list (no page scroll).
     · Each command shows its OmadaIcon + an optional shortcut hint rendered as
       <kbd> chips.
   Running a command fires a themed App-context toast (useMessage) so the demo
   is observable; in product the command's `run` would navigate or mutate.

   The reference table below the trigger documents the global shortcut set as
   <kbd> rows — a living legend that matches the palette.

   All chrome is theme-var driven (surface / border / active row) with dark
   twins in omada-overrides.css; the active row + kbd accents use the brand
   green token. ⌘ vs Ctrl is detected from the platform.

   Figma: no dedicated node — an antd-6 composition pattern (Modal + Input +
   list). Glyphs are OmadaIcon; the modal radius/shadow come from tokens.
   Exports: window.Omada.CommandPalette
   ──────────────────────────────────────────────────────────────────────── */
(function () {
  const { useState, useEffect, useRef, useMemo, useCallback } = React;
  const { Modal, Input } = window.antd;
  const Icon = window.Omada.Icon;
  const Button = window.Omada.Button;

  const IS_MAC = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform || '');
  const MOD = IS_MAC ? '\u2318' : 'Ctrl';

  // Command registry — label/section via i18n keys, stable id + icon + keys.
  function buildCommands(t) {
    return [
      { id: 'goto-dashboard', section: t('cmd.sec.nav'), icon: 'dashboard', label: t('cmd.dashboard'), keys: ['G', 'D'], kw: 'home overview' },
      { id: 'goto-devices',   section: t('cmd.sec.nav'), icon: 'devices',   label: t('cmd.devices'),   keys: ['G', 'V'], kw: 'ap switch gateway' },
      { id: 'goto-clients',   section: t('cmd.sec.nav'), icon: 'clients',   label: t('cmd.clients'),   keys: ['G', 'C'], kw: 'users stations' },
      { id: 'goto-insights',  section: t('cmd.sec.nav'), icon: 'insights',  label: t('cmd.insights'),  keys: ['G', 'I'], kw: 'analytics charts' },
      { id: 'act-adopt',      section: t('cmd.sec.act'), icon: 'adopt',     label: t('cmd.adopt'),     keys: null,       kw: 'provision add' },
      { id: 'act-reboot',     section: t('cmd.sec.act'), icon: 'reboot',    label: t('cmd.reboot'),    keys: null,       kw: 'restart power cycle' },
      { id: 'act-export',     section: t('cmd.sec.act'), icon: 'export',    label: t('cmd.export'),    keys: [MOD, 'E'], kw: 'download csv pdf' },
      { id: 'act-search',     section: t('cmd.sec.act'), icon: 'search',    label: t('cmd.searchAll'), keys: ['/'],      kw: 'find lookup' },
      { id: 'set-theme',      section: t('cmd.sec.set'), icon: 'moon',      label: t('cmd.toggleTheme'), keys: [MOD, 'J'], kw: 'dark light appearance' },
      { id: 'set-lang',       section: t('cmd.sec.set'), icon: 'languages', label: t('cmd.toggleLang'),  keys: null,      kw: 'language locale 中文' },
      { id: 'set-help',       section: t('cmd.sec.set'), icon: 'help-circle', label: t('cmd.help'),      keys: ['?'],     kw: 'docs support shortcuts' },
    ];
  }

  function Kbd(props) {
    return <kbd className="omada-cmd-kbd">{props.children}</kbd>;
  }

  function OmadaCommandPalette(props) {
    const className = props.className || '';
    const rest = Object.assign({}, props);
    delete rest.className;

    const ctx = window.useOmada();
    const t = ctx.t;
    const omada = ctx;
    const msg = window.Omada.useMessage();

    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [active, setActive] = useState(0);
    const listRef = useRef(null);
    const inputRef = useRef(null);

    const commands = useMemo(() => buildCommands(t), [t, ctx.lang]);

    const filtered = useMemo(() => {
      const q = query.trim().toLowerCase();
      if (!q) return commands;
      return commands.filter((c) =>
        (c.label + ' ' + c.kw + ' ' + c.section).toLowerCase().includes(q));
    }, [query, commands]);

    // group filtered results by section, preserving order
    const groups = useMemo(() => {
      const out = [];
      const idx = {};
      filtered.forEach((c) => {
        if (idx[c.section] === undefined) { idx[c.section] = out.length; out.push({ section: c.section, items: [] }); }
        out[idx[c.section]].items.push(c);
      });
      return out;
    }, [filtered]);

    const runCommand = useCallback((cmd) => {
      setOpen(false);
      if (cmd.id === 'set-theme') { omada.toggleMode(); return; }
      if (cmd.id === 'set-lang') { omada.setLang(omada.lang === 'zh' ? 'en' : 'zh'); return; }
      msg.success(t('cmd.ran') + ' · ' + cmd.label);
    }, [omada, msg, t]);

    // global ⌘K / Ctrl+K
    useEffect(() => {
      const onKey = (e) => {
        if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
          e.preventDefault();
          setOpen((o) => !o);
        }
      };
      window.addEventListener('keydown', onKey);
      return () => window.removeEventListener('keydown', onKey);
    }, []);

    // reset + focus on open
    useEffect(() => {
      if (open) {
        setQuery('');
        setActive(0);
        setTimeout(() => { if (inputRef.current) inputRef.current.focus(); }, 60);
      }
    }, [open]);

    useEffect(() => { setActive(0); }, [query]);

    // keep active row in view
    useEffect(() => {
      if (!listRef.current) return;
      const el = listRef.current.querySelector('[data-active="true"]');
      if (el && el.scrollIntoView) {
        const top = el.offsetTop, bottom = top + el.offsetHeight;
        const vt = listRef.current.scrollTop, vb = vt + listRef.current.clientHeight;
        if (top < vt) listRef.current.scrollTop = top - 6;
        else if (bottom > vb) listRef.current.scrollTop = bottom - listRef.current.clientHeight + 6;
      }
    }, [active, groups]);

    const onListKey = (e) => {
      if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => (a + 1) % Math.max(filtered.length, 1)); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => (a - 1 + filtered.length) % Math.max(filtered.length, 1)); }
      else if (e.key === 'Enter') { e.preventDefault(); const c = filtered[active]; if (c) runCommand(c); }
    };

    // flat index → for active highlighting across groups
    let flat = -1;

    const SHORTCUTS = [
      { keys: [MOD, 'K'], label: t('cmd.ref.palette') },
      { keys: ['/'],      label: t('cmd.ref.search') },
      { keys: ['G', t('cmd.ref.then'), 'D'], label: t('cmd.ref.goto') },
      { keys: [MOD, 'E'], label: t('cmd.ref.export') },
      { keys: [MOD, 'J'], label: t('cmd.ref.theme') },
      { keys: ['?'],      label: t('cmd.ref.help') },
      { keys: ['Esc'],    label: t('cmd.ref.close') },
    ];

    return (
      <div className={('omada-cmd ' + className).trim()} {...rest}>
        <div className="omada-cmd-launch">
          <button type="button" className="omada-cmd-trigger" onClick={() => setOpen(true)}>
            <Icon name="search" size={16} />
            <span className="omada-cmd-triggerlabel">{t('cmd.trigger')}</span>
            <span className="omada-cmd-triggerkbd"><Kbd>{MOD}</Kbd><Kbd>K</Kbd></span>
          </button>
          <span className="omada-cmd-launchhint">{t('cmd.launchHint')}</span>
        </div>

        {/* ── shortcut reference ── */}
        <div className="omada-cmd-refsub">{t('cmd.refTitle')}</div>
        <div className="omada-cmd-reftable">
          {SHORTCUTS.map((s, i) => (
            <div className="omada-cmd-refrow" key={i}>
              <span className="omada-cmd-refkeys">
                {s.keys.map((k, j) => (
                  k === t('cmd.ref.then')
                    ? <span className="omada-cmd-then" key={j}>{k}</span>
                    : <Kbd key={j}>{k}</Kbd>
                ))}
              </span>
              <span className="omada-cmd-reflabel">{s.label}</span>
            </div>
          ))}
        </div>

        <Modal
          open={open}
          onCancel={() => setOpen(false)}
          footer={null}
          closable={false}
          width={560}
          styles={{ body: { padding: 0 } }}
          className="omada-cmd-modal"
          maskClosable
          destroyOnHidden
        >
          <div className="omada-cmd-panel" onKeyDown={onListKey}>
            <div className="omada-cmd-searchrow">
              <Icon name="search" size={18} />
              <input
                ref={inputRef}
                className="omada-cmd-input"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t('cmd.placeholder')}
                aria-label={t('cmd.placeholder')}
              />
              <Kbd>Esc</Kbd>
            </div>

            <div className="omada-cmd-list" ref={listRef} role="listbox">
              {groups.length === 0 && (
                <div className="omada-cmd-empty">
                  <Icon name="search" size={20} />
                  <span>{t('cmd.empty')}</span>
                </div>
              )}
              {groups.map((g) => (
                <div className="omada-cmd-group" key={g.section}>
                  <div className="omada-cmd-grouptitle">{g.section}</div>
                  {g.items.map((c) => {
                    flat += 1;
                    const isActive = flat === active;
                    const myFlat = flat;
                    return (
                      <div
                        key={c.id}
                        role="option"
                        aria-selected={isActive}
                        data-active={isActive}
                        className={'omada-cmd-row' + (isActive ? ' is-active' : '')}
                        onMouseEnter={() => setActive(myFlat)}
                        onClick={() => runCommand(c)}
                      >
                        <span className="omada-cmd-rowix"><Icon name={c.icon} size={18} /></span>
                        <span className="omada-cmd-rowlabel">{c.label}</span>
                        {c.keys && (
                          <span className="omada-cmd-rowkeys">
                            {c.keys.map((k, j) => <Kbd key={j}>{k}</Kbd>)}
                          </span>
                        )}
                        <span className="omada-cmd-rowenter">
                          <Icon name="corner-down-left" size={15} />
                        </span>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            <div className="omada-cmd-foot">
              <span><Kbd>↑</Kbd><Kbd>↓</Kbd> {t('cmd.foot.move')}</span>
              <span><Kbd>↵</Kbd> {t('cmd.foot.run')}</span>
              <span><Kbd>Esc</Kbd> {t('cmd.foot.close')}</span>
            </div>
          </div>
        </Modal>
      </div>
    );
  }

  window.Omada = window.Omada || {};
  window.Omada.CommandPalette = OmadaCommandPalette;
})();
