/* ────────────────────────────────────────────────────────────────────────
   components/WhatsNew/WhatsNew.jsx — OmadaWhatsNew

   The "what's new" changelog drawer. A bell/sparkle trigger carries an unread
   Badge; opening slides in a right-hand Drawer with reverse-chronological
   release entries, each grouped by category tag (new · improved · fixed) and a
   bulleted list of changes. "Unread" is everything newer than the last entry
   the user has seen — persisted to localStorage under `omada.whatsnew.lastseen`
   so the badge clears across reloads and only re-lights when you ship again.

   `OmadaWhatsNew` is the all-in-one (trigger + drawer + unread bookkeeping).
   `OmadaWhatsNew.Trigger` / `.Panel` are exposed for custom placement.
   `OmadaWhatsNew.unreadCount(entries)` / `.markSeen(entries)` are the helpers.

   Thin composition over Drawer + Badge + Button + Tag-styled chips + OmadaIcon.
   Token-driven, dark twin, i18n, RTL-mirrored.

   Figma: derived from the 更新日志 / Log card pattern (Card/log) + Drawer 抽屉.
   Original changelog-drawer composite.
   Exports: window.Omada.WhatsNew (+ .Trigger, .Panel, .unreadCount, .markSeen)
   ──────────────────────────────────────────────────────────────────────── */
(function () {
  const { Drawer, Badge, Button } = window.antd;
  const Icon = window.Omada.Icon;

  const TAG_META = {
    new:      { cls: 'is-new',      icon: 'rocket' },
    improved: { cls: 'is-improved', icon: 'trending-up' },
    fixed:    { cls: 'is-fixed',    icon: 'check-circle' },
  };

  const LS_KEY = 'omada.whatsnew.lastseen';
  function getLastSeen() {
    try { return localStorage.getItem(LS_KEY) || ''; } catch (e) { return ''; }
  }
  function setLastSeen(v) {
    try { v ? localStorage.setItem(LS_KEY, v) : localStorage.removeItem(LS_KEY); } catch (e) {}
  }
  // entries are newest-first; everything before the lastSeen id is "read"
  function unreadCount(entries) {
    const list = entries || [];
    const seen = getLastSeen();
    if (!seen) return list.length;
    let n = 0;
    for (let i = 0; i < list.length; i++) {
      if (list[i].id === seen) break;
      n++;
    }
    return n;
  }
  function markSeen(entries) {
    const list = entries || [];
    if (list.length) setLastSeen(list[0].id);
  }

  function TagChip(props) {
    const ctx = window.useOmada ? window.useOmada() : null;
    const t = ctx ? ctx.t : (k) => k;
    const meta = TAG_META[props.tag] || TAG_META.new;
    return (
      <span className={'omada-wn-tag ' + meta.cls}>
        <Icon name={meta.icon} size={12} />{t('wn.tag.' + props.tag)}
      </span>
    );
  }

  function Panel(props) {
    const ctx = window.useOmada ? window.useOmada() : null;
    const t = ctx ? ctx.t : (k) => k;
    const dir = ctx ? ctx.dir : 'ltr';
    const entries = props.entries || [];
    const seen = props.lastSeen;
    // index of the first already-seen entry; everything before it is unread
    const seenIdx = seen ? entries.findIndex((x) => x.id === seen) : -1;

    return (
      <Drawer
        title={
          <span className="omada-wn-drawertitle">
            <Icon name="rocket" size={18} />{props.title || t('wn.title')}
          </span>
        }
        placement={dir === 'rtl' ? 'left' : 'right'}
        width={Math.min(420, (typeof window !== 'undefined' ? window.innerWidth : 420) - 24)}
        open={props.open}
        onClose={props.onClose}
        className="omada-wn-drawer"
      >
        <div className="omada-wn-feed">
          {entries.map((e, i) => {
            const isUnread = seenIdx === -1 ? true : i < seenIdx;
            return (
              <article key={e.id} className={'omada-wn-entry' + (isUnread ? ' is-unread' : '')}>
                <div className="omada-wn-entryhead">
                  <span className="omada-wn-version">{e.version}</span>
                  {e.date && <span className="omada-wn-date">{e.date}</span>}
                  {isUnread && <span className="omada-wn-newdot" aria-label={t('wn.unread')} />}
                </div>
                {e.title && <h4 className="omada-wn-entrytitle">{e.title}</h4>}
                <div className="omada-wn-groups">
                  {(e.changes || []).map((grp, gi) => (
                    <div className="omada-wn-group" key={gi}>
                      <TagChip tag={grp.tag} />
                      <ul className="omada-wn-items">
                        {grp.items.map((it, ii) => <li key={ii}>{it}</li>)}
                      </ul>
                    </div>
                  ))}
                </div>
              </article>
            );
          })}
          {entries.length === 0 && (
            <div className="omada-wn-empty">{t('wn.empty')}</div>
          )}
        </div>
      </Drawer>
    );
  }

  function Trigger(props) {
    const ctx = window.useOmada ? window.useOmada() : null;
    const t = ctx ? ctx.t : (k) => k;
    return (
      <Badge count={props.count || 0} size="small" offset={[-2, 2]}>
        <Button
          icon={<Icon name="rocket" size={16} />}
          onClick={props.onClick}
          aria-label={t('wn.title')}
        >
          {props.label || t('wn.whatsnew')}
        </Button>
      </Badge>
    );
  }

  function OmadaWhatsNew(props) {
    const { useState } = React;
    const entries = props.entries || [];
    const [open, setOpen] = useState(false);
    const [seen, setSeen] = useState(() => getLastSeen());
    const count = (function () {
      if (!seen) return entries.length;
      const idx = entries.findIndex((x) => x.id === seen);
      return idx === -1 ? entries.length : idx;
    })();

    const openDrawer = () => {
      setOpen(true);
      // mark seen on open so the badge clears
      if (entries.length) { setLastSeen(entries[0].id); setSeen(entries[0].id); }
      if (props.onOpen) props.onOpen();
    };

    return (
      <React.Fragment>
        <Trigger count={count} label={props.triggerLabel} onClick={openDrawer} />
        <Panel
          entries={entries}
          lastSeen={seen}
          open={open}
          title={props.title}
          onClose={() => { setOpen(false); if (props.onClose) props.onClose(); }}
        />
      </React.Fragment>
    );
  }

  OmadaWhatsNew.Trigger = Trigger;
  OmadaWhatsNew.Panel = Panel;
  OmadaWhatsNew.unreadCount = unreadCount;
  OmadaWhatsNew.markSeen = markSeen;
  OmadaWhatsNew.resetSeen = () => setLastSeen('');

  window.Omada = window.Omada || {};
  window.Omada.WhatsNew = OmadaWhatsNew;
})();
