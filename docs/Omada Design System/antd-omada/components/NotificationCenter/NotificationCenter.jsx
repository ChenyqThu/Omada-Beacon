/* ────────────────────────────────────────────────────────────────────────
   components/NotificationCenter/NotificationCenter.jsx — OmadaNotificationCenter

   A PERSISTENT inbox. Transient toasts (Message / Notification) vanish; the
   things you must not miss — a gateway went offline, firmware is ready, a
   client was blocked — also land here, in a drawer you can open any time.
   antd has no inbox primitive, so this composes one over Drawer + a
   token-driven list:

     · A trigger button carries a Badge of the UNREAD count (caps at 99+, dot
       when zero is suppressed). Opening it reveals the drawer.
     · Filter tabs — All · Unread · then one tab per tone present (alert /
       success / info) — re-slice the list; each shows its own count.
     · A row is unread until opened: click it (or its leading dot) to mark read;
       the dot clears and the badge drops. "Mark all read" clears the column;
       per-row dismiss removes it; "Clear all" empties the inbox.
     · Each row shows a tone disc (OmadaIcon), title, one-line body and a
       relative timestamp. Empty states (nothing / nothing unread) render the
       Omada Empty illustration.

   Self-managing: seed with `items`; it owns read/dismiss state and reports
   every change through onChange(nextItems) for callers who want to persist.
   The drawer is the Omada Drawer wrapper (themed, locale + RTL aware).

   Chrome is theme-var driven with dark twins in omada-overrides.css; tone discs
   reuse the semantic tone tokens (success/warning/error/info), unread dot +
   active tab use brand green. No new colour.

   Figma: no dedicated node — an inbox pattern over the Drawer (Batch 3) +
   Badge (Batch 2) + Empty (Batch 5). Glyphs are OmadaIcon.
   Exports: window.Omada.NotificationCenter
   ──────────────────────────────────────────────────────────────────────── */
(function () {
  const { useState, useMemo } = React;
  const Icon = window.Omada.Icon;
  const Button = window.Omada.Button;
  const Badge = window.Omada.Badge;
  const Drawer = window.Omada.Drawer;
  const Empty = window.Omada.Empty;

  const TONE_ICON = { alert: 'warning', success: 'check-circle', info: 'info', error: 'ban' };

  function relTime(ts, t) {
    const mins = Math.round((Date.now() - ts) / 60000);
    if (mins < 1) return t('nc.now');
    if (mins < 60) return mins + t('nc.m');
    const hrs = Math.round(mins / 60);
    if (hrs < 24) return hrs + t('nc.h');
    const days = Math.round(hrs / 24);
    return days + t('nc.d');
  }

  function OmadaNotificationCenter(props) {
    const className = props.className || '';
    const rest = Object.assign({}, props);
    delete rest.className; delete rest.items; delete rest.onChange; delete rest.triggerLabel;

    const ctx = window.useOmada ? window.useOmada() : null;
    const t = ctx ? ctx.t : (k) => k;

    const [open, setOpen] = useState(false);
    const [list, setList] = useState(props.items || []);
    const [filter, setFilter] = useState('all');

    const update = (next) => { setList(next); if (props.onChange) props.onChange(next); };

    const unread = useMemo(() => list.filter((n) => !n.read).length, [list]);
    const tones = useMemo(() => {
      const seen = [];
      list.forEach((n) => { if (n.tone && !seen.includes(n.tone)) seen.push(n.tone); });
      return seen;
    }, [list]);

    const filtered = useMemo(() => {
      if (filter === 'all') return list;
      if (filter === 'unread') return list.filter((n) => !n.read);
      return list.filter((n) => n.tone === filter);
    }, [list, filter]);

    const markRead = (id) => update(list.map((n) => (n.id === id ? Object.assign({}, n, { read: true }) : n)));
    const markAllRead = () => update(list.map((n) => Object.assign({}, n, { read: true })));
    const dismiss = (id) => update(list.filter((n) => n.id !== id));
    const clearAll = () => update([]);

    const TABS = [
      { key: 'all', label: t('nc.all'), count: list.length },
      { key: 'unread', label: t('nc.unread'), count: unread },
    ].concat(tones.map((tone) => ({
      key: tone,
      label: t('nc.tone.' + tone),
      count: list.filter((n) => n.tone === tone).length,
    })));

    return (
      <div className={('omada-nc ' + className).trim()} {...rest}>
        <Badge count={unread} overflowCount={99} size="small" offset={[-2, 4]}>
          <Button variant="outline" icon={<Icon name="bell" size={16} />} onClick={() => setOpen(true)}>
            {props.triggerLabel || t('nc.inbox')}
          </Button>
        </Badge>

        <Drawer
          open={open}
          onClose={() => setOpen(false)}
          width={400}
          className="omada-nc-drawer"
          title={(
            <span className="omada-nc-title">
              <Icon name="inbox" size={18} />
              {t('nc.title')}
              {unread > 0 && <span className="omada-nc-titlecount">{unread} {t('nc.new')}</span>}
            </span>
          )}
          extra={(
            <Button variant="text" size="small" disabled={!unread}
              onClick={markAllRead} icon={<Icon name="check-check" size={16} />}>
              {t('nc.markAll')}
            </Button>
          )}
        >
          <div className="omada-nc-tabs" role="tablist">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                type="button"
                role="tab"
                aria-selected={filter === tab.key}
                className={'omada-nc-tab' + (filter === tab.key ? ' is-active' : '')}
                onClick={() => setFilter(tab.key)}
              >
                {tab.label}
                <span className="omada-nc-tabcount">{tab.count}</span>
              </button>
            ))}
          </div>

          <div className="omada-nc-list">
            {filtered.length === 0 && (
              <div className="omada-nc-empty">
                <Empty description={filter === 'unread' ? t('nc.emptyUnread') : t('nc.empty')} />
              </div>
            )}
            {filtered.map((n) => (
              <div
                key={n.id}
                className={'omada-nc-item' + (n.read ? ' is-read' : '')}
                onClick={() => !n.read && markRead(n.id)}
              >
                <span className={'omada-nc-disc tone-' + (n.tone || 'info')}>
                  <Icon name={TONE_ICON[n.tone] || 'info'} size={16} />
                </span>
                <div className="omada-nc-body">
                  <div className="omada-nc-itemhd">
                    <span className="omada-nc-itemtitle">{n.title}</span>
                    <span className="omada-nc-time">{relTime(n.ts, t)}</span>
                  </div>
                  <div className="omada-nc-text">{n.body}</div>
                </div>
                {!n.read && <span className="omada-nc-dot" aria-label={t('nc.unread')} />}
                <button type="button" className="omada-nc-dismiss"
                  aria-label={t('common.remove')}
                  onClick={(e) => { e.stopPropagation(); dismiss(n.id); }}>
                  <Icon name="close" size={14} />
                </button>
              </div>
            ))}
          </div>

          {list.length > 0 && (
            <div className="omada-nc-foot">
              <Button variant="text" size="small" onClick={clearAll}
                icon={<Icon name="trash" size={15} />}>
                {t('nc.clearAll')}
              </Button>
            </div>
          )}
        </Drawer>
      </div>
    );
  }

  window.Omada = window.Omada || {};
  window.Omada.NotificationCenter = OmadaNotificationCenter;
})();
