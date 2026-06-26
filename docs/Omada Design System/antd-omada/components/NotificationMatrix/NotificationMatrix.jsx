/* ────────────────────────────────────────────────────────────────────────
   components/NotificationMatrix/NotificationMatrix.jsx — OmadaNotificationMatrix

   The notification-preferences grid: events down the rows, delivery channels
   across the columns, a Switch in every cell. Each column header carries a
   bulk toggle (turn a whole channel on/off) that reflects all-on / some-on /
   all-off; each row shows the event name + a one-line description. Some cells
   can be locked (a channel that doesn't apply to an event) — they render a
   muted dash instead of a switch.

   Fully controlled: `value` is a flat map keyed `"<eventKey>:<channelKey>"`,
   `onChange` returns the next map. A small "{n} of {total} on" footer keeps the
   overall state legible.

   Thin composition over Switch + OmadaIcon on an antd-tokened grid. Token-
   driven, dark twin, i18n, RTL-mirrored.

   Figma: derived from Switch 开关 + the Table 表格 header/row grid + Form 表单
   settings rows. Original preferences-matrix composite.
   Exports: window.Omada.NotificationMatrix (+ .key)
   ──────────────────────────────────────────────────────────────────────── */
(function () {
  const { Switch } = window.antd;
  const Icon = window.Omada.Icon;

  const cellKey = (eventKey, channelKey) => eventKey + ':' + channelKey;

  function OmadaNotificationMatrix(props) {
    const ctx = window.useOmada ? window.useOmada() : null;
    const t = ctx ? ctx.t : (k) => k;

    const events = props.events || [];
    const channels = props.channels || [];
    const value = props.value || {};
    const locked = props.locked || {};   // map "event:channel" → true means N/A

    const isLocked = (ek, ck) => locked[cellKey(ek, ck)] === true;
    const on = (ek, ck) => value[cellKey(ek, ck)] === true;

    const setMany = (updates) => {
      if (!props.onChange) return;
      props.onChange(Object.assign({}, value, updates));
    };

    const toggleCell = (ek, ck, next) => setMany({ [cellKey(ek, ck)]: next });

    // column bulk toggle — flips every non-locked cell in the channel
    const columnState = (ck) => {
      const cells = events.filter((e) => !isLocked(e.key, ck));
      const onCount = cells.filter((e) => on(e.key, ck)).length;
      if (onCount === 0) return 'none';
      if (onCount === cells.length) return 'all';
      return 'some';
    };
    const toggleColumn = (ck) => {
      const next = columnState(ck) !== 'all';
      const updates = {};
      events.forEach((e) => { if (!isLocked(e.key, ck)) updates[cellKey(e.key, ck)] = next; });
      setMany(updates);
    };

    const total = events.reduce((acc, e) => acc + channels.filter((c) => !isLocked(e.key, c.key)).length, 0);
    const onTotal = events.reduce((acc, e) => acc + channels.filter((c) => !isLocked(e.key, c.key) && on(e.key, c.key)).length, 0);

    const cols = 'minmax(180px, 1.6fr) ' + channels.map(() => 'minmax(72px, 1fr)').join(' ');

    return (
      <div className="omada-nm">
        <div className="omada-nm-grid" role="table">
          {/* header */}
          <div className="omada-nm-head" style={{ gridTemplateColumns: cols }} role="row">
            <span className="omada-nm-corner">{props.rowHeader || t('nm.event')}</span>
            {channels.map((c) => {
              const state = columnState(c.key);
              return (
                <button
                  type="button"
                  key={c.key}
                  className={'omada-nm-colhead is-' + state}
                  onClick={() => toggleColumn(c.key)}
                  aria-label={t('nm.togglecol').replace('{c}', c.label)}
                  title={t('nm.togglecol').replace('{c}', c.label)}
                >
                  {c.icon && <Icon name={c.icon} size={16} />}
                  <span className="omada-nm-colname">{c.label}</span>
                  <span className={'omada-nm-colstate is-' + state} aria-hidden="true" />
                </button>
              );
            })}
          </div>

          {/* rows */}
          {events.map((e) => (
            <div className="omada-nm-row" style={{ gridTemplateColumns: cols }} role="row" key={e.key}>
              <div className="omada-nm-rowlabel">
                <span className="omada-nm-eventname">{e.label}</span>
                {e.desc && <span className="omada-nm-eventdesc">{e.desc}</span>}
              </div>
              {channels.map((c) => (
                <div className="omada-nm-cell" role="cell" key={c.key}>
                  {isLocked(e.key, c.key) ? (
                    <span className="omada-nm-na" aria-label={t('nm.na')}>—</span>
                  ) : (
                    <Switch
                      size="small"
                      checked={on(e.key, c.key)}
                      onChange={(next) => toggleCell(e.key, c.key, next)}
                      aria-label={e.label + ' · ' + c.label}
                    />
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>

        {props.showSummary !== false && (
          <div className="omada-nm-foot">
            <Icon name="bell" size={13} />
            <span>{t('nm.summary').replace('{n}', onTotal).replace('{total}', total)}</span>
          </div>
        )}
      </div>
    );
  }

  OmadaNotificationMatrix.key = cellKey;

  window.Omada = window.Omada || {};
  window.Omada.NotificationMatrix = OmadaNotificationMatrix;
})();
