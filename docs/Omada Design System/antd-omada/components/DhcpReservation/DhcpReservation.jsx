/* ────────────────────────────────────────────────────────────────────────
   components/DhcpReservation/DhcpReservation.jsx — OmadaDhcpReservation

   DHCP SCOPE + STATIC LEASES: a scope strip (fixed /24 network, an
   editable dynamic-pool start/end pair with subnet + ordering
   validation) over a MAC → IP reservation table. Rows edit inline;
   validation is live and BLOCKS SAVE: malformed MAC, IP outside the
   subnet, duplicate IP, duplicate MAC. A reservation inside the
   dynamic pool gets a WARNING chip (honoured, but flagged) rather
   than an error. ADD RESERVATION appends an editing row.

   Distinct from DnsTable (record-type-driven value validation):
   here validation is CROSS-ROW (conflicts) and RANGE-based
   (subnet / pool), not per-type syntax.

   Token-driven, dark twin, i18n. Figma: SYMBOL 26455:7659 ("DHCP")
   — no full frame; table metrics follow DnsTable/CertManager.
   Exports: window.Omada.DhcpReservation
   ──────────────────────────────────────────────────────────────────────── */
(function () {
  const { Button, Input, Tooltip } = window.antd;

  const MAC_RE = /^([0-9A-Fa-f]{2}[:-]){5}[0-9A-Fa-f]{2}$/;
  function ipParts(ip) {
    const m = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/.exec(ip || '');
    if (!m) return null;
    const p = [+m[1], +m[2], +m[3], +m[4]];
    return p.every(function (n) { return n <= 255; }) ? p : null;
  }
  function inSubnet(ip) {
    const p = ipParts(ip);
    return !!p && p[0] === 192 && p[1] === 168 && p[2] === 0;
  }
  function lastOctet(ip) { const p = ipParts(ip); return p ? p[3] : -1; }

  const DEFAULT_ROWS = [
    { id: 'v1', mac: '3C-22-FB-9A-41-07', ip: '192.168.0.10',  host: 'dhcpr.n.nas' },
    { id: 'v2', mac: '00-1B-A9-55-E2-C4', ip: '192.168.0.21',  host: 'dhcpr.n.printer' },
    { id: 'v3', mac: '9C-53-22-D0-18-2F', ip: '192.168.0.150', host: 'dhcpr.n.cam' },
  ];

  function OmadaDhcpReservation(props) {
    const { useState, useRef } = React;
    const ctx = window.useOmada ? window.useOmada() : null;
    const t = ctx ? ctx.t : (k) => k;

    const [pool, setPool] = useState({ start: '192.168.0.100', end: '192.168.0.199' });
    const [rows, setRows] = useState(function () {
      return (props.reservations || DEFAULT_ROWS).map(function (r) {
        return Object.assign({ editing: false, draft: null }, r);
      });
    });
    const counter = useRef(0);

    const poolValid = inSubnet(pool.start) && inSubnet(pool.end) && lastOctet(pool.start) < lastOctet(pool.end);
    function inPool(ip) {
      return poolValid && inSubnet(ip) && lastOctet(ip) >= lastOctet(pool.start) && lastOctet(ip) <= lastOctet(pool.end);
    }

    function errorsFor(draft, selfId) {
      const errs = [];
      if (!MAC_RE.test(draft.mac)) errs.push(t('dhcpr.err.mac'));
      if (!inSubnet(draft.ip)) errs.push(t('dhcpr.err.subnet'));
      rows.forEach(function (r) {
        if (r.id === selfId) return;
        const otherIp = r.editing && r.draft ? r.draft.ip : r.ip;
        const otherMac = (r.editing && r.draft ? r.draft.mac : r.mac).toUpperCase().replace(/:/g, '-');
        if (inSubnet(draft.ip) && otherIp === draft.ip) errs.push(t('dhcpr.err.ipConflict'));
        if (MAC_RE.test(draft.mac) && otherMac === draft.mac.toUpperCase().replace(/:/g, '-')) errs.push(t('dhcpr.err.macConflict'));
      });
      return errs;
    }

    function patchRow(id, delta) {
      setRows(function (rs) {
        return rs.map(function (r) { return r.id === id ? Object.assign({}, r, delta) : r; });
      });
    }
    function patchDraft(id, delta) {
      setRows(function (rs) {
        return rs.map(function (r) {
          return r.id === id ? Object.assign({}, r, { draft: Object.assign({}, r.draft, delta) }) : r;
        });
      });
    }

    function addRow() {
      counter.current += 1;
      setRows(function (rs) {
        return rs.concat([{ id: 'n' + counter.current, mac: '', ip: '', host: '', isNew: true,
                            editing: true, draft: { mac: '', ip: '', host: '' } }]);
      });
    }

    return (
      <div className={'omada-dhcpr' + (props.className ? ' ' + props.className : '')}>
        <div className="omada-dhcpr-scope">
          <span className="omada-dhcpr-scopelabel">{t('dhcpr.scope')}</span>
          <span className="omada-dhcpr-net">{t('dhcpr.network')} <b>192.168.0.0/24</b></span>
          <label className="omada-dhcpr-poolfield">
            <span>{t('dhcpr.poolStart')}</span>
            <Input size="small" value={pool.start} status={poolValid ? undefined : 'error'}
                   onChange={function (e) { setPool({ start: e.target.value, end: pool.end }); }} />
          </label>
          <label className="omada-dhcpr-poolfield">
            <span>{t('dhcpr.poolEnd')}</span>
            <Input size="small" value={pool.end} status={poolValid ? undefined : 'error'}
                   onChange={function (e) { setPool({ start: pool.start, end: e.target.value }); }} />
          </label>
          {!poolValid ? <span className="omada-dhcpr-poolerr">{t('dhcpr.err.pool')}</span> : null}
        </div>

        <div className="omada-dhcpr-table">
          <div className="omada-dhcpr-grid omada-dhcpr-headrow" aria-hidden="true">
            <span>{t('dhcpr.mac')}</span><span>{t('dhcpr.ip')}</span><span>{t('dhcpr.host')}</span><span /><span />
          </div>
          {rows.map(function (r) {
            if (!r.editing) {
              return (
                <div key={r.id} className="omada-dhcpr-grid omada-dhcpr-row">
                  <span className="omada-dhcpr-mono">{r.mac}</span>
                  <span className="omada-dhcpr-mono">
                    {r.ip}
                    {inPool(r.ip) ? (
                      <Tooltip title={t('dhcpr.inPool.tip')}>
                        <em className="omada-dhcpr-pooltag">{t('dhcpr.inPool')}</em>
                      </Tooltip>
                    ) : null}
                  </span>
                  <span>{r.host && r.host.indexOf('dhcpr.') === 0 ? t(r.host) : r.host}</span>
                  <Button size="small" type="text"
                          icon={<window.OmadaIcon name="edit" size={13} />}
                          aria-label={t('common.edit')}
                          onClick={function () { patchRow(r.id, { editing: true, draft: { mac: r.mac, ip: r.ip, host: r.host && r.host.indexOf('dhcpr.') === 0 ? t(r.host) : r.host } }); }} />
                  <Button size="small" type="text" danger
                          icon={<window.OmadaIcon name="trash" size={13} />}
                          aria-label={t('common.delete')}
                          onClick={function () { setRows(function (rs) { return rs.filter(function (x) { return x.id !== r.id; }); }); }} />
                </div>
              );
            }
            const errs = errorsFor(r.draft, r.id);
            return (
              <div key={r.id} className="omada-dhcpr-editwrap">
                <div className="omada-dhcpr-grid omada-dhcpr-row is-editing">
                  <Input size="small" value={r.draft.mac} placeholder="AA-BB-CC-DD-EE-FF"
                         status={MAC_RE.test(r.draft.mac) ? undefined : 'error'}
                         onChange={function (e) { patchDraft(r.id, { mac: e.target.value }); }} />
                  <Input size="small" value={r.draft.ip} placeholder="192.168.0.x"
                         status={inSubnet(r.draft.ip) ? undefined : 'error'}
                         onChange={function (e) { patchDraft(r.id, { ip: e.target.value }); }} />
                  <Input size="small" value={r.draft.host}
                         onChange={function (e) { patchDraft(r.id, { host: e.target.value }); }} />
                  <Button size="small" type="primary" disabled={errs.length > 0}
                          onClick={function () { patchRow(r.id, { editing: false, isNew: false, draft: null, mac: r.draft.mac.toUpperCase().replace(/:/g, '-'), ip: r.draft.ip, host: r.draft.host }); }}>
                    {t('common.save')}
                  </Button>
                  <Button size="small"
                          onClick={function () {
                            if (r.isNew) setRows(function (rs) { return rs.filter(function (x) { return x.id !== r.id; }); });
                            else patchRow(r.id, { editing: false, draft: null });
                          }}>
                    {t('common.cancel')}
                  </Button>
                </div>
                {errs.length > 0 ? <div className="omada-dhcpr-errs">{errs.join(' · ')}</div> : null}
              </div>
            );
          })}
        </div>

        <Button size="small" icon={<window.OmadaIcon name="plus" size={13} />} onClick={addRow}
                style={{ alignSelf: 'flex-start' }}>
          {t('dhcpr.add')}
        </Button>
      </div>
    );
  }

  window.Omada = window.Omada || {};
  window.Omada.DhcpReservation = OmadaDhcpReservation;
})();
