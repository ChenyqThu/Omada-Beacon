/* ────────────────────────────────────────────────────────────────────────
   components/FirewallRules/FirewallRules.jsx — OmadaFirewallRules

   ORDERED FIREWALL RULES: src / dst / port / protocol / action rows
   evaluated top-down (first match wins). Drag the grip to re-order
   priority — the index column renumbers live; a per-row switch
   enables/disables without losing position; the action chip is
   brand-green for ALLOW and red for DENY. A pinned, dashed DEFAULT
   POLICY row sits last and cannot be dragged. ADD RULE appends a
   disabled deny template.

   Distinct from FilterBuilder (query expression over a table) and
   AlarmRules (threshold → notify): these rows are an ACL with
   ordering semantics.

   Token-driven, dark twin, i18n. Figma: SYMBOL 25947:12247
   ("Property 1=acl") — no full frame; drag affordance follows
   SortableList, chips follow Tag metrics.
   Exports: window.Omada.FirewallRules
   ──────────────────────────────────────────────────────────────────────── */
(function () {
  const { Button, Switch } = window.antd;

  const DEFAULT_RULES = [
    { id: 'r1', name: 'acl.r.guestLan', src: 'acl.net.guest', dst: 'acl.net.lan', port: 'acl.any', proto: 'acl.any', action: 'deny',  on: true },
    { id: 'r2', name: 'acl.r.dns',      src: 'acl.any',       dst: 'acl.net.gw',  port: '53',      proto: 'UDP',     action: 'allow', on: true },
    { id: 'r3', name: 'acl.r.web',      src: 'acl.net.lan',   dst: 'acl.net.wan', port: '80, 443', proto: 'TCP',     action: 'allow', on: true },
    { id: 'r4', name: 'acl.r.iot',      src: 'acl.net.iot',   dst: 'acl.net.wan', port: 'acl.any', proto: 'acl.any', action: 'deny',  on: false },
  ];

  function OmadaFirewallRules(props) {
    const { useState, useRef } = React;
    const ctx = window.useOmada ? window.useOmada() : null;
    const t = ctx ? ctx.t : (k) => k;
    const tv = function (v) { return v.indexOf('acl.') === 0 ? t(v) : v; };

    const [rules, setRules] = useState(props.rules || DEFAULT_RULES);
    const [overIdx, setOverIdx] = useState(-1);
    const dragIdx = useRef(-1);
    const counter = useRef(0);

    function onDrop(idx) {
      const from = dragIdx.current;
      setOverIdx(-1);
      dragIdx.current = -1;
      if (from < 0 || from === idx) return;
      setRules(function (rs) {
        const next = rs.slice();
        const moved = next.splice(from, 1)[0];
        next.splice(idx, 0, moved);
        return next;
      });
    }

    function addRule() {
      counter.current += 1;
      const n = counter.current;
      setRules(function (rs) {
        return rs.concat([{ id: 'new' + n, name: 'acl.newRule', src: 'acl.any', dst: 'acl.any', port: 'acl.any', proto: 'acl.any', action: 'deny', on: false }]);
      });
    }

    return (
      <div className={'omada-fwr' + (props.className ? ' ' + props.className : '')}>
        <div className="omada-fwr-grid omada-fwr-headrow" aria-hidden="true">
          <span /><span>#</span>
          <span>{t('acl.name')}</span><span>{t('acl.source')}</span><span>{t('acl.dest')}</span>
          <span>{t('acl.port')}</span><span>{t('acl.protocol')}</span><span>{t('acl.action')}</span><span />
        </div>

        {rules.map(function (r, i) {
          return (
            <div key={r.id}
                 className={'omada-fwr-grid omada-fwr-row' + (r.on ? '' : ' is-off') + (overIdx === i ? ' is-over' : '')}
                 draggable="true"
                 onDragStart={function () { dragIdx.current = i; }}
                 onDragOver={function (e) { e.preventDefault(); if (overIdx !== i) setOverIdx(i); }}
                 onDragLeave={function () { if (overIdx === i) setOverIdx(-1); }}
                 onDrop={function () { onDrop(i); }}
                 onDragEnd={function () { setOverIdx(-1); dragIdx.current = -1; }}>
              <span className="omada-fwr-grip" title={t('acl.dragTip')}>
                <window.OmadaIcon name="grip-vertical" size={14} />
              </span>
              <span className="omada-fwr-idx">{i + 1}</span>
              <span className="omada-fwr-name">{tv(r.name)}</span>
              <span className="omada-fwr-net">{tv(r.src)}</span>
              <span className="omada-fwr-net">
                <window.OmadaIcon name="arrow-right" size={11} className="omada-fwr-arrow" />
                {tv(r.dst)}
              </span>
              <span className="omada-fwr-port">{tv(r.port)}</span>
              <span className="omada-fwr-proto">{tv(r.proto)}</span>
              <span className={'omada-fwr-action is-' + r.action}>{t('acl.' + r.action)}</span>
              <Switch size="small" checked={r.on}
                      onChange={function (v) {
                        setRules(function (rs) {
                          return rs.map(function (x) { return x.id === r.id ? Object.assign({}, x, { on: v }) : x; });
                        });
                      }} />
            </div>
          );
        })}

        <div className="omada-fwr-grid omada-fwr-row omada-fwr-default">
          <span /><span className="omada-fwr-idx">∗</span>
          <span className="omada-fwr-name">{t('acl.default')}</span>
          <span className="omada-fwr-net">{t('acl.any')}</span>
          <span className="omada-fwr-net">{t('acl.any')}</span>
          <span className="omada-fwr-port">{t('acl.any')}</span>
          <span className="omada-fwr-proto">{t('acl.any')}</span>
          <span className="omada-fwr-action is-allow">{t('acl.allow')}</span>
          <span />
        </div>

        <div className="omada-fwr-foot">
          <Button size="small" icon={<window.OmadaIcon name="plus" size={13} />} onClick={addRule}>
            {t('acl.addRule')}
          </Button>
          <span className="omada-fwr-tip">{t('acl.dragTip')}</span>
        </div>
      </div>
    );
  }

  window.Omada = window.Omada || {};
  window.Omada.FirewallRules = OmadaFirewallRules;
})();
