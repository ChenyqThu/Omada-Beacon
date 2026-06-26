/* ────────────────────────────────────────────────────────────────────────
   components/ShortcutsOverlay/ShortcutsOverlay.jsx — OmadaShortcutsOverlay

   The keyboard SHORTCUTS HELP overlay — the "press ? for help" sheet. Where the
   Batch-17 CommandPalette carries a SHORT reference, this is the full,
   categorised legend: grouped sections (Navigation / Actions / View / Editing),
   each a list of <kbd> chord rows, with a filter box and platform-aware ⌘/Ctrl.

   Behaviour:
     · "?" opens it from anywhere (ignored while typing in an input / textarea /
       contenteditable); the trigger button opens it too; Esc closes.
     · Type to filter rows by label across every group; empty groups hide.
     · Chords render as <kbd> chips; a "then" separator handles sequence chords
       (G then D). ⌘ vs Ctrl is detected from the platform.

   Thin composition over antd Modal + a token-driven grid; the data is a plain
   group array so a product swaps in its own map. All chrome is theme-var driven
   with dark twins in omada-overrides.css; kbd accents use the brand-green
   token. RTL-safe.

   Figma: no dedicated node — an antd-6 Modal composition; <kbd> styling matches
   the CommandPalette reference. Glyphs are OmadaIcon.
   Exports: window.Omada.ShortcutsOverlay
   ──────────────────────────────────────────────────────────────────────── */
(function () {
  const { useState, useEffect, useMemo } = React;
  const { Modal } = window.antd;
  const Icon = window.Omada.Icon;

  const IS_MAC = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform || '');
  const MOD = IS_MAC ? '\u2318' : 'Ctrl';
  const ALT = IS_MAC ? '\u2325' : 'Alt';

  function Kbd(props) { return <kbd className="omada-cmd-kbd">{props.children}</kbd>; }

  function isTyping(el) {
    if (!el) return false;
    const tag = (el.tagName || '').toLowerCase();
    return tag === 'input' || tag === 'textarea' || el.isContentEditable;
  }

  function OmadaShortcutsOverlay(props) {
    const className = props.className || '';
    const rest = Object.assign({}, props);
    delete rest.className; delete rest.groups;

    const ctx = window.useOmada();
    const t = ctx.t;
    const THEN = t('sc.then');

    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');

    const groups = useMemo(function () {
      if (props.groups) return props.groups;
      return [
        { key: 'nav', title: t('sc.g.nav'), icon: 'dashboard', items: [
          { keys: [MOD, 'K'], label: t('sc.k.palette') },
          { keys: [MOD, '/'], label: t('sc.k.search') },
          { keys: ['G', THEN, 'D'], label: t('sc.k.dashboard') },
          { keys: ['G', THEN, 'V'], label: t('sc.k.devices') },
          { keys: ['G', THEN, 'C'], label: t('sc.k.clients') },
        ] },
        { key: 'act', title: t('sc.g.act'), icon: 'power', items: [
          { keys: [MOD, 'E'], label: t('sc.k.export') },
          { keys: [MOD, 'S'], label: t('sc.k.save') },
          { keys: ['R'], label: t('sc.k.reboot') },
          { keys: [MOD, 'Z'], label: t('sc.k.undo') },
          { keys: [MOD, '\u21E7', 'Z'], label: t('sc.k.redo') },
        ] },
        { key: 'view', title: t('sc.g.view'), icon: 'eye', items: [
          { keys: [MOD, 'J'], label: t('sc.k.theme') },
          { keys: ['['], label: t('sc.k.collapse') },
          { keys: [']'], label: t('sc.k.expand') },
          { keys: [ALT, '1'], label: t('sc.k.density') },
        ] },
        { key: 'edit', title: t('sc.g.edit'), icon: 'edit', items: [
          { keys: ['\u2191', '\u2193'], label: t('sc.k.move') },
          { keys: ['Space'], label: t('sc.k.select') },
          { keys: [MOD, 'A'], label: t('sc.k.selectAll') },
          { keys: ['Esc'], label: t('sc.k.clear') },
          { keys: ['?'], label: t('sc.k.help') },
        ] },
      ];
    }, [props.groups, ctx.lang]);

    const filtered = useMemo(function () {
      const q = query.trim().toLowerCase();
      if (!q) return groups;
      return groups.map(function (g) {
        return Object.assign({}, g, { items: g.items.filter(function (it) { return it.label.toLowerCase().indexOf(q) >= 0; }) });
      }).filter(function (g) { return g.items.length; });
    }, [groups, query]);

    useEffect(function () {
      const onKey = function (e) {
        if (e.key === '?' && !isTyping(e.target) && !e.metaKey && !e.ctrlKey && !e.altKey) {
          e.preventDefault(); setOpen(function (o) { return !o; });
        }
      };
      window.addEventListener('keydown', onKey);
      return function () { window.removeEventListener('keydown', onKey); };
    }, []);

    useEffect(function () { if (open) setQuery(''); }, [open]);

    return (
      <div className={('omada-sc ' + className).trim()} {...rest}>
        <button type="button" className="omada-sc-trigger" onClick={function () { setOpen(true); }}>
          <Icon name="keyboard" size={16} />
          <span className="omada-sc-triggerlabel">{t('sc.trigger')}</span>
          <Kbd>?</Kbd>
        </button>

        <Modal
          open={open}
          onCancel={function () { setOpen(false); }}
          footer={null}
          closable={false}
          width={680}
          styles={{ body: { padding: 0 } }}
          className="omada-sc-modal"
          maskClosable
          destroyOnHidden
        >
          <div className="omada-sc-panel">
            <div className="omada-sc-head">
              <div className="omada-sc-title">
                <span className="omada-sc-titleix"><Icon name="keyboard" size={20} /></span>
                {t('sc.title')}
              </div>
              <div className="omada-sc-searchrow">
                <Icon name="search" size={15} />
                <input
                  className="omada-sc-input"
                  value={query}
                  onChange={function (e) { setQuery(e.target.value); }}
                  placeholder={t('sc.filter')}
                  aria-label={t('sc.filter')}
                  autoFocus
                />
                <Kbd>Esc</Kbd>
              </div>
            </div>

            <div className="omada-sc-grid">
              {filtered.length === 0 && (
                <div className="omada-sc-empty">
                  <Icon name="search" size={20} />
                  <span>{t('sc.empty')}</span>
                </div>
              )}
              {filtered.map(function (g) {
                return (
                  <div className="omada-sc-group" key={g.key}>
                    <div className="omada-sc-grouptitle">
                      {g.icon && <Icon name={g.icon} size={14} />}{g.title}
                    </div>
                    <div className="omada-sc-rows">
                      {g.items.map(function (it, i) {
                        return (
                          <div className="omada-sc-row" key={i}>
                            <span className="omada-sc-rowlabel">{it.label}</span>
                            <span className="omada-sc-rowkeys">
                              {it.keys.map(function (k, j) {
                                return k === THEN
                                  ? <span className="omada-sc-then" key={j}>{k}</span>
                                  : <Kbd key={j}>{k}</Kbd>;
                              })}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="omada-sc-foot">
              <span>{t('sc.footHint')}</span>
              <span className="omada-sc-foothelp"><Kbd>?</Kbd> {t('sc.footToggle')}</span>
            </div>
          </div>
        </Modal>
      </div>
    );
  }

  window.Omada = window.Omada || {};
  window.Omada.ShortcutsOverlay = OmadaShortcutsOverlay;
})();
