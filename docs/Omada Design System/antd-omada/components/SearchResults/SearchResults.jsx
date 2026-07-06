/* ────────────────────────────────────────────────────────────────────────
   components/SearchResults/SearchResults.jsx — OmadaSearchResults

   A global SPOTLIGHT search surface. Where the Batch-17 CommandPalette runs
   ACTIONS, this searches DATA: it filters a mixed corpus of entities (devices,
   sites, clients, pages) and shows them GROUPED BY TYPE with the matched
   substring highlighted, a type icon, a secondary meta line and a status pill
   where relevant — the "search everything" overlay of a large console.

   Behaviour:
     · ⌘/ · Ctrl+/ (or the trigger) opens; Esc closes.
     · Type to filter across name + meta + keywords; hits regroup under their
       entity type, each group capped (configurable) with a "+N more" line.
     · ↑ / ↓ move the active row across groups (wraps); Enter opens it; the
       active row stays in view (no page scroll). Empty query shows RECENT.
     · Matched characters are wrapped in <mark> (token-tinted, not a new colour).

   It is data-driven: pass `corpus` (or use the seeded device/site/client set)
   and `onOpen(entity)`. All chrome is theme-var driven with dark twins in
   omada-overrides.css; the active row + marks use the brand-green token.

   Figma: "搜索框✅" (node 3:20722) — the search dropdown's 4px-radius panel,
   grouped rows and soft elevation; we keep the structure, drop the branded
   header, and route every string through window.t.
   Exports: window.Omada.SearchResults
   ──────────────────────────────────────────────────────────────────────── */
(function () {
  const { useState, useEffect, useRef, useMemo, useCallback } = React;
  const { Modal } = window.antd;
  const Icon = window.Omada.Icon;
  const StatusPill = window.Omada.StatusPill;

  const IS_MAC = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform || '');
  const MOD = IS_MAC ? '\u2318' : 'Ctrl';

  function Kbd(props) { return <kbd className="omada-cmd-kbd">{props.children}</kbd>; }

  // Split `text` on the first case-insensitive occurrence of `q`, marking it.
  function highlight(text, q) {
    if (!q) return text;
    const i = text.toLowerCase().indexOf(q.toLowerCase());
    if (i < 0) return text;
    return [
      text.slice(0, i),
      <mark className="omada-srch-mark" key="m">{text.slice(i, i + q.length)}</mark>,
      text.slice(i + q.length),
    ];
  }

  function OmadaSearchResults(props) {
    const className = props.className || '';
    const rest = Object.assign({}, props);
    delete rest.className; delete rest.corpus; delete rest.onOpen; delete rest.groupLimit;

    const ctx = window.useOmada();
    const t = ctx.t;
    const groupLimit = props.groupLimit || 4;

    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [active, setActive] = useState(0);
    const [recent, setRecent] = useState([]);   // entity ids
    const [opened, setOpened] = useState(null);  // last opened entity (demo feedback)
    const listRef = useRef(null);
    const inputRef = useRef(null);

    // Default corpus — entity types map to a section + glyph.
    const corpus = useMemo(function () {
      if (props.corpus) return props.corpus;
      return [
        { id: 'd1', type: 'device', icon: 'ap',      name: 'AP-Lobby-01',  meta: 'EAP670 · 10.0.12.4',  status: 'connected',    kw: 'access point wifi' },
        { id: 'd2', type: 'device', icon: 'switch',  name: 'SW-Core-01',   meta: 'SG3428X · 10.0.12.1', status: 'connected',    kw: 'switch poe' },
        { id: 'd3', type: 'device', icon: 'gateway', name: 'GW-Edge-01',   meta: 'ER8411 · 10.0.12.254',status: 'pending',      kw: 'gateway router' },
        { id: 'd4', type: 'device', icon: 'ap',      name: 'AP-Patio-02',  meta: 'EAP610 · 10.0.12.16', status: 'disconnected', kw: 'access point wifi' },
        { id: 's1', type: 'site',   icon: 'map',     name: 'HQ — Floor 2', meta: '42 ' + t('srch.devicesWord'), kw: 'headquarters office' },
        { id: 's2', type: 'site',   icon: 'map',     name: 'Warehouse B',  meta: '18 ' + t('srch.devicesWord'), kw: 'storage depot' },
        { id: 's3', type: 'site',   icon: 'map',     name: 'Retail — Downtown', meta: '9 ' + t('srch.devicesWord'), kw: 'shop store' },
        { id: 'c1', type: 'client', icon: 'user',    name: 'johns-macbook', meta: 'AC:DE:48:00:11:22',  kw: 'laptop apple' },
        { id: 'c2', type: 'client', icon: 'user',    name: 'pixel-8-pro',   meta: 'F0:9F:C2:13:45:AB',  kw: 'phone android' },
        { id: 'p1', type: 'page',   icon: 'dashboard', name: t('cmd.dashboard'), meta: t('srch.sec.page'), kw: 'home overview' },
        { id: 'p2', type: 'page',   icon: 'insights',  name: t('cmd.insights'),  meta: t('srch.sec.page'), kw: 'analytics charts' },
        { id: 'p3', type: 'page',   icon: 'settings',  name: t('srch.pageSettings'), meta: t('srch.sec.page'), kw: 'preferences config' },
      ];
    }, [props.corpus, ctx.lang]);

    const sectionLabel = {
      device: t('srch.sec.device'), site: t('srch.sec.site'),
      client: t('srch.sec.client'), page: t('srch.sec.page'),
    };
    const sectionOrder = ['device', 'site', 'client', 'page'];

    const q = query.trim();
    const matches = useMemo(function () {
      if (!q) {
        if (recent.length) return recent.map(function (id) { return corpus.find(function (e) { return e.id === id; }); }).filter(Boolean);
        return corpus.slice(0, 5);
      }
      const ql = q.toLowerCase();
      return corpus.filter(function (e) { return (e.name + ' ' + e.meta + ' ' + (e.kw || '')).toLowerCase().indexOf(ql) >= 0; });
    }, [q, corpus, recent]);

    // group + cap each section; build a flat list for keyboard nav
    const grouped = useMemo(function () {
      if (!q) return [{ section: t('srch.recent'), type: '_recent', items: matches, more: 0 }];
      const out = [];
      sectionOrder.forEach(function (type) {
        const all = matches.filter(function (e) { return e.type === type; });
        if (!all.length) return;
        out.push({ section: sectionLabel[type], type: type, items: all.slice(0, groupLimit), more: Math.max(0, all.length - groupLimit) });
      });
      return out;
    }, [matches, q, groupLimit, ctx.lang]);

    const flatList = useMemo(function () {
      const f = [];
      grouped.forEach(function (g) { g.items.forEach(function (e) { f.push(e); }); });
      return f;
    }, [grouped]);

    const openEntity = useCallback(function (e) {
      if (!e) return;
      setOpen(false);
      setOpened(e);
      setRecent(function (r) { return [e.id].concat(r.filter(function (id) { return id !== e.id; })).slice(0, 4); });
      if (props.onOpen) props.onOpen(e);
    }, [props]);

    useEffect(function () {
      const onKey = function (e) {
        if ((e.metaKey || e.ctrlKey) && e.key === '/') { e.preventDefault(); setOpen(function (o) { return !o; }); }
      };
      window.addEventListener('keydown', onKey);
      return function () { window.removeEventListener('keydown', onKey); };
    }, []);

    useEffect(function () {
      if (open) { setQuery(''); setActive(0); setTimeout(function () { if (inputRef.current) inputRef.current.focus(); }, 60); }
    }, [open]);
    useEffect(function () { setActive(0); }, [query]);

    useEffect(function () {
      if (!listRef.current) return;
      const el = listRef.current.querySelector('[data-active="true"]');
      if (!el) return;
      const top = el.offsetTop, bottom = top + el.offsetHeight;
      const vt = listRef.current.scrollTop, vb = vt + listRef.current.clientHeight;
      if (top < vt) listRef.current.scrollTop = top - 6;
      else if (bottom > vb) listRef.current.scrollTop = bottom - listRef.current.clientHeight + 6;
    }, [active, grouped]);

    const onListKey = function (e) {
      const n = Math.max(flatList.length, 1);
      if (e.key === 'ArrowDown') { e.preventDefault(); setActive(function (a) { return (a + 1) % n; }); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(function (a) { return (a - 1 + n) % n; }); }
      else if (e.key === 'Enter') { e.preventDefault(); openEntity(flatList[active]); }
    };

    let flat = -1;

    return (
      <div className={('omada-srch ' + className).trim()} {...rest}>
        <div className="omada-srch-launch">
          <button type="button" className="omada-srch-trigger" onClick={function () { setOpen(true); }}>
            <Icon name="search" size={16} />
            <span className="omada-srch-triggerlabel">{t('srch.trigger')}</span>
            <span className="omada-srch-triggerkbd"><Kbd>{MOD}</Kbd><Kbd>/</Kbd></span>
          </button>
          {opened && (
            <span className="omada-srch-opened">
              <Icon name="corner-down-left" size={14} />
              {t('srch.opened')} <strong>{opened.name}</strong>
            </span>
          )}
        </div>

        <Modal
          open={open}
          onCancel={function () { setOpen(false); }}
          footer={null}
          closable={false}
          width={580}
          styles={{ body: { padding: 0 } }}
          className="omada-srch-modal"
          maskClosable
          destroyOnHidden
        >
          <div className="omada-srch-panel" onKeyDown={onListKey}>
            <div className="omada-srch-searchrow">
              <Icon name="search" size={18} />
              <input
                ref={inputRef}
                className="omada-srch-input"
                value={query}
                onChange={function (e) { setQuery(e.target.value); }}
                placeholder={t('srch.placeholder')}
                aria-label={t('srch.placeholder')}
              />
              {query && (
                <button type="button" className="omada-srch-clear" onClick={function () { setQuery(''); if (inputRef.current) inputRef.current.focus(); }} aria-label={t('common.close')}>
                  <Icon name="close" size={15} />
                </button>
              )}
              <Kbd>Esc</Kbd>
            </div>

            <div className="omada-srch-list" ref={listRef} role="listbox">
              {flatList.length === 0 && (
                <div className="omada-srch-empty">
                  <Icon name="search" size={22} />
                  <span className="omada-srch-emptytitle">{t('srch.empty')}</span>
                  <span className="omada-srch-emptyhint">{t('srch.emptyHint')}</span>
                </div>
              )}
              {grouped.map(function (g) {
                return (
                  <div className="omada-srch-group" key={g.section}>
                    <div className="omada-srch-grouptitle">
                      {g.type === '_recent' && <Icon name="clock" size={13} />}
                      {g.section}
                      {g.type !== '_recent' && <span className="omada-srch-groupn">{g.items.length + g.more}</span>}
                    </div>
                    {g.items.map(function (e) {
                      flat += 1;
                      const isActive = flat === active;
                      const my = flat;
                      return (
                        <div
                          key={e.id}
                          role="option"
                          aria-selected={isActive}
                          data-active={isActive}
                          className={'omada-srch-row' + (isActive ? ' is-active' : '')}
                          onMouseEnter={function () { setActive(my); }}
                          onClick={function () { openEntity(e); }}
                        >
                          <span className="omada-srch-rowix"><Icon name={e.icon} size={18} /></span>
                          <span className="omada-srch-rowtxt">
                            <span className="omada-srch-rowname">{highlight(e.name, q)}</span>
                            <span className="omada-srch-rowmeta">{highlight(e.meta, q)}</span>
                          </span>
                          {e.status && <StatusPill status={e.status} className="omada-srch-rowpill" />}
                          <span className="omada-srch-rowenter"><Icon name="corner-down-left" size={15} /></span>
                        </div>
                      );
                    })}
                    {g.more > 0 && (
                      <div className="omada-srch-more">{(t('srch.more') || '+{n} more').replace('{n}', g.more)}</div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="omada-srch-foot">
              <span><Kbd>↑</Kbd><Kbd>↓</Kbd> {t('cmd.foot.move')}</span>
              <span><Kbd>↵</Kbd> {t('srch.foot.open')}</span>
              <span><Kbd>Esc</Kbd> {t('cmd.foot.close')}</span>
            </div>
          </div>
        </Modal>
      </div>
    );
  }

  window.Omada = window.Omada || {};
  window.Omada.SearchResults = OmadaSearchResults;
})();
