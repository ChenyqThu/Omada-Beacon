/* ────────────────────────────────────────────────────────────────────────
   components/PresenceStack/PresenceStack.jsx — OmadaPresenceStack

   A collaboration PRESENCE cue. The "who else is here" avatar stack a shared
   surface shows in its top bar — overlapping avatars with a live/idle/offline
   dot, a hover name + status, an editing ring on whoever holds the pen, and a
   "+N" overflow that opens a roster popover. Plus an optional "N viewing" label.

   Behaviour:
     · Up to `max` avatars render overlapped (newest/active first). Each carries a
       corner presence dot (active green · idle amber · offline grey) and a
       Tooltip with the name + localized status. A user with `editing:true` gets
       a brand-green ring + an "editing" caption.
     · Beyond `max`, a "+N" disc opens a Popover listing everyone with their dot
       and status — so no one is hidden, just collapsed.
     · Pure presence: no realtime transport here. Feed it a `users` array; it
       sorts active-first by default and renders. RTL-safe (the stack origin and
       dot side mirror).

   Thin composition over OmadaAvatar + Omada Tooltip / Popover / Icon. All chrome
   is theme-var driven with dark twins in omada-overrides.css; the active dot +
   editing ring use brand-green. Tones cycle the Omada avatar ramp.

   Figma: top-bar avatar language (Avatar 头像 2985:128851) extended with a
   presence dot — a collaboration pattern with no single node. No branded art.
   Exports: window.Omada.PresenceStack
   ──────────────────────────────────────────────────────────────────────── */
(function () {
  const Avatar = window.Omada.Avatar;
  const Tooltip = window.Omada.Tooltip;
  const Popover = window.Omada.Popover;
  const Icon = window.Omada.Icon;

  const TONES = ['brand', 'blue', 'magenta', 'orange', 'neutral'];

  function initials(name) {
    const parts = String(name || '').trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  function PresenceDot(props) {
    return <span className={'omada-ps-dot is-' + (props.status || 'offline')} aria-hidden="true" />;
  }

  function OmadaPresenceStack(props) {
    const className = props.className || '';
    const rest = Object.assign({}, props);
    delete rest.className; delete rest.users; delete rest.max; delete rest.size;
    delete rest.showLabel; delete rest.label; delete rest.sort;

    const ctx = window.useOmada ? window.useOmada() : null;
    const t = ctx ? ctx.t : (k) => k;

    let users = (props.users || []).slice();
    const max = props.max || 4;
    const size = props.size || 30;
    const showLabel = props.showLabel === undefined ? true : props.showLabel;
    const doSort = props.sort === undefined ? true : props.sort;

    if (doSort) {
      const rank = { active: 0, idle: 1, offline: 2 };
      users.sort((a, b) => {
        if (!!b.editing - !!a.editing) return (b.editing ? 1 : 0) - (a.editing ? 1 : 0);
        return (rank[a.status] || 3) - (rank[b.status] || 3);
      });
    }

    const visible = users.slice(0, max);
    const overflow = users.slice(max);
    const activeCount = users.filter((u) => u.status === 'active').length;

    const statusText = (s) => t('ps.s.' + (s || 'offline'));

    const avatarFor = (u, i) => {
      const tone = u.tone || TONES[i % TONES.length];
      const body = (
        <span className={'omada-ps-item' + (u.editing ? ' is-editing' : '')}>
          <Avatar size={size} tone={tone} src={u.src} style={{ fontSize: Math.round(size * 0.4), fontWeight: 600 }}>
            {!u.src && initials(u.name)}
          </Avatar>
          <PresenceDot status={u.status} />
        </span>
      );
      return (
        <Tooltip
          key={u.key != null ? u.key : i}
          title={
            <span className="omada-ps-tip">
              <span className="omada-ps-tipname">{u.name}</span>
              <span className="omada-ps-tipstatus"><span className={'omada-ps-tipdot is-' + (u.status || 'offline')} />{u.editing ? t('ps.editing') : statusText(u.status)}</span>
            </span>
          }
        >
          {body}
        </Tooltip>
      );
    };

    const rosterContent = (
      <ul className="omada-ps-roster" role="list">
        {users.map((u, i) => (
          <li key={u.key != null ? u.key : i} className="omada-ps-rosteritem">
            <Avatar size={24} tone={u.tone || TONES[i % TONES.length]} src={u.src} style={{ fontSize: 10, fontWeight: 600 }}>
              {!u.src && initials(u.name)}
            </Avatar>
            <span className="omada-ps-rostername">{u.name}</span>
            <span className="omada-ps-rosterstatus"><span className={'omada-ps-tipdot is-' + (u.status || 'offline')} />{u.editing ? t('ps.editing') : statusText(u.status)}</span>
          </li>
        ))}
      </ul>
    );

    return (
      <div className={('omada-ps ' + className).trim()} {...rest}>
        <div className="omada-ps-stack" style={{ '--om-ps-size': size + 'px' }}>
          {visible.map((u, i) => avatarFor(u, i))}
          {overflow.length > 0 && (
            <Popover content={rosterContent} title={t('ps.everyone')} trigger="click" placement="bottomRight">
              <button type="button" className="omada-ps-more" style={{ width: size, height: size }} aria-label={t('ps.showAll')}>
                +{overflow.length}
              </button>
            </Popover>
          )}
        </div>
        {showLabel && (
          <span className="omada-ps-label">
            <Icon name="eye" size={14} />
            {props.label !== undefined ? props.label : (activeCount + ' ' + t('ps.viewing'))}
          </span>
        )}
      </div>
    );
  }

  window.Omada = window.Omada || {};
  window.Omada.PresenceStack = OmadaPresenceStack;
})();
