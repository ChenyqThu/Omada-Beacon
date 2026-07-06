/* ────────────────────────────────────────────────────────────────────────
   components/NetworkSelector/NetworkSelector.jsx — OmadaNetworkSelector

   A HIERARCHICAL site / network switcher. The trigger shows the current
   `site › network`; the popover holds a search box, a Recents group
   (last 3 picks, newest first), and the full site → network tree with
   the current pick marked. Searching filters across both levels.

     · `sites` — [{ id, name, networks: [{ id, name, vlan? }] }]
     · `value` — { siteId, netId }
     · `onChange({ siteId, netId })`

   Recents are kept internally (per mount). Selection closes the popover.

   Distinct from CommandPalette (Batch 17 — a global ⌘K modal over
   actions/entities): this is a scoped context switcher that lives in
   the chrome, like the site dropdown in a controller header.

   Token-driven, dark twin, i18n, RTL-safe.
   Figma: no dedicated node this session (VFS permission pending) —
   popover anatomy follows Dropdown/Menu tokens; rows follow Menu.
   Exports: window.Omada.NetworkSelector
   ──────────────────────────────────────────────────────────────────────── */
(function () {
  const Icon = window.Omada.Icon;
  const { Popover, Input } = window.antd;

  function OmadaNetworkSelector(props) {
    const { useState, useMemo, useRef, useEffect } = React;
    const ctx = window.useOmada ? window.useOmada() : null;
    const t = ctx ? ctx.t : (k) => k;

    const sites = props.sites || [];
    const value = props.value || {};
    const [open, setOpen] = useState(false);
    const [q, setQ] = useState('');
    const [recents, setRecents] = useState([]); // [{siteId, netId}]
    const searchRef = useRef(null);

    useEffect(() => {
      if (open && searchRef.current) setTimeout(() => searchRef.current.focus(), 60);
      if (!open) setQ('');
    }, [open]);

    const find = (siteId, netId) => {
      const s = sites.find((x) => x.id === siteId);
      const n = s && s.networks.find((x) => x.id === netId);
      return { site: s, net: n };
    };
    const cur = find(value.siteId, value.netId);

    const pick = (siteId, netId) => {
      setRecents((r) => [{ siteId, netId }]
        .concat(r.filter((x) => !(x.siteId === siteId && x.netId === netId)))
        .slice(0, 3));
      setOpen(false);
      if (props.onChange) props.onChange({ siteId, netId });
    };

    const norm = (s) => (s || '').toLowerCase();
    const filtered = useMemo(() => {
      if (!q) return sites;
      const nq = norm(q);
      return sites
        .map((s) => {
          const siteHit = norm(s.name).includes(nq);
          const nets = s.networks.filter((n) => siteHit || norm(n.name).includes(nq));
          return siteHit || nets.length ? Object.assign({}, s, { networks: nets }) : null;
        })
        .filter(Boolean);
    }, [q, sites]);

    const NetRow = (p) => {
      const isCur = p.siteId === value.siteId && p.net.id === value.netId;
      return (
        <button type="button"
                className={'omada-nsl-net' + (isCur ? ' is-current' : '')}
                onClick={() => pick(p.siteId, p.net.id)}>
          <Icon name="wifi" size={13} />
          <span className="omada-nsl-netname">{p.net.name}</span>
          {p.net.vlan != null && <span className="omada-nsl-vlan">VLAN {p.net.vlan}</span>}
          {p.withSite && <span className="omada-nsl-netsite">{p.siteName}</span>}
          {isCur && <span className="omada-nsl-cur"><Icon name="check" size={12} strokeWidth={2.2} />{t('nsl.current')}</span>}
        </button>
      );
    };

    const content = (
      <div className="omada-nsl-pop">
        <Input
          ref={searchRef}
          size="small"
          allowClear
          prefix={<Icon name="search" size={13} />}
          placeholder={t('nsl.search')}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="omada-nsl-searchbox"
        />
        <div className="omada-nsl-scroll">
          {!q && recents.length > 0 && (
            <div className="omada-nsl-group">
              <div className="omada-nsl-grouplabel"><Icon name="clock" size={11} />{t('nsl.recents')}</div>
              {recents.map((r) => {
                const f = find(r.siteId, r.netId);
                if (!f.site || !f.net) return null;
                return <NetRow key={'r' + r.siteId + r.netId} siteId={r.siteId} net={f.net} withSite={true} siteName={f.site.name} />;
              })}
            </div>
          )}
          <div className="omada-nsl-group">
            <div className="omada-nsl-grouplabel"><Icon name="building" size={11} />{t('nsl.allsites')}</div>
            {filtered.map((s) => (
              <div key={s.id} className="omada-nsl-site">
                <div className="omada-nsl-sitehead">
                  <span className="omada-nsl-sitename">{s.name}</span>
                  <span className="omada-nsl-sitecount">{t('nsl.networks').replace('{n}', s.networks.length)}</span>
                </div>
                {s.networks.map((n) => <NetRow key={n.id} siteId={s.id} net={n} />)}
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="omada-nsl-empty"><Icon name="search" size={13} />{t('nsl.empty')}</div>
            )}
          </div>
        </div>
      </div>
    );

    return (
      <Popover
        content={content}
        trigger="click"
        placement="bottomLeft"
        arrow={false}
        open={open}
        onOpenChange={setOpen}
        styles={{ body: { padding: 0 } }}
      >
        <button type="button" className={'omada-nsl-trigger' + (open ? ' is-open' : '') + (props.className ? ' ' + props.className : '')}>
          <Icon name="building" size={14} />
          <span className="omada-nsl-trigsite">{cur.site ? cur.site.name : '—'}</span>
          <span className="omada-nsl-trigsep" aria-hidden="true">›</span>
          <span className="omada-nsl-trignet">{cur.net ? cur.net.name : '—'}</span>
          <Icon name="chevron-down" size={13} className="omada-nsl-trigchev" />
        </button>
      </Popover>
    );
  }

  window.Omada = window.Omada || {};
  window.Omada.NetworkSelector = OmadaNetworkSelector;
})();
