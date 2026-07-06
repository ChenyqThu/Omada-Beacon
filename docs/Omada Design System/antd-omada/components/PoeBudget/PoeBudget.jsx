/* ────────────────────────────────────────────────────────────────────────
   components/PoeBudget/PoeBudget.jsx — OmadaPoeBudget

   A PoE POWER BUDGET panel for an access switch: an editable budget
   (W) with a Figma-matched "Remaining PoE power" header — value pair
   `remaining / budget` over a slim 6px bar — and per-port rows
   showing the powered device, its 802.3 class chip, a priority
   select (high / medium / low), allocated watts and a PoE switch.
   When requested power exceeds the budget the panel PREEMPTS the
   lowest-priority ports first (low → medium, highest port number
   first): preempted rows dim, their watts strike through, and a
   warning strip explains the order.

   Distinct from PortPanel (physical port faceplate) and VlanMatrix
   (membership grid): this is a power-ledger list with a live
   preemption rule.

   Token-driven, dark twin, i18n. Figma: frame 25331:112308
   ("Remaining PoE Power" header + 6px bar) and SYMBOL 25947:11987
   (poe bolt); rows follow CertManager/DnsTable list metrics.
   Exports: window.Omada.PoeBudget
   ──────────────────────────────────────────────────────────────────────── */
(function () {
  const { InputNumber, Select, Switch, Tooltip } = window.antd;

  const PRIO_RANK = { low: 0, medium: 1, high: 2 };
  const DEFAULT_PORTS = [
    { port: 1, device: 'poe.d.lobbyAp',  cls: 6, watts: 21.8, prio: 'high'   },
    { port: 2, device: 'poe.d.officeAp', cls: 4, watts: 13.5, prio: 'high'   },
    { port: 3, device: 'poe.d.domeCam',  cls: 3, watts: 10.2, prio: 'medium' },
    { port: 4, device: 'poe.d.phone',    cls: 2, watts: 5.8,  prio: 'low'    },
    { port: 5, device: 'poe.d.door',     cls: 3, watts: 9.0,  prio: 'medium' },
    { port: 6, device: 'poe.d.hallCam',  cls: 3, watts: 11.4, prio: 'medium' },
    { port: 7, device: 'poe.d.phone',    cls: 2, watts: 6.1,  prio: 'low'    },
    { port: 8, device: null,             cls: 0, watts: 0,    prio: 'low'    },
  ];

  function stdOf(cls) { return cls >= 5 ? '802.3bt' : cls >= 4 ? '802.3at' : '802.3af'; }

  function OmadaPoeBudget(props) {
    const { useState, useMemo } = React;
    const ctx = window.useOmada ? window.useOmada() : null;
    const t = ctx ? ctx.t : (k) => k;

    const [budget, setBudget] = useState(props.defaultBudget != null ? props.defaultBudget : 65);
    const [rows, setRows] = useState(function () {
      return (props.ports || DEFAULT_PORTS).map(function (p) {
        return Object.assign({ on: !!p.device }, p);
      });
    });

    function patch(port, delta) {
      setRows(function (rs) {
        return rs.map(function (r) { return r.port === port ? Object.assign({}, r, delta) : r; });
      });
    }

    const calc = useMemo(function () {
      const active = rows.filter(function (r) { return r.on && r.device; });
      const requested = active.reduce(function (s, r) { return s + r.watts; }, 0);
      const preempted = {};
      let draw = requested;
      if (draw > budget) {
        const order = active.slice().sort(function (a, b) {
          return PRIO_RANK[a.prio] - PRIO_RANK[b.prio] || b.port - a.port;
        });
        for (let i = 0; i < order.length && draw > budget; i++) {
          preempted[order[i].port] = true;
          draw -= order[i].watts;
        }
      }
      return { requested: requested, draw: draw, preempted: preempted };
    }, [rows, budget]);

    const remaining = Math.max(0, budget - calc.draw);
    const pct = budget > 0 ? Math.min(100, (calc.draw / budget) * 100) : 100;
    const oversub = Object.keys(calc.preempted).length > 0;
    const tone = oversub || pct >= 90 ? 'crit' : pct >= 70 ? 'warn' : 'ok';

    return (
      <div className={'omada-poe' + (props.className ? ' ' + props.className : '')}>
        <div className="omada-poe-head">
          <div className="omada-poe-remain">
            <span className="omada-poe-label">
              <window.OmadaIcon name="zap" size={14} className="omada-poe-bolt" />
              {t('poe.remaining')}
            </span>
            <span className="omada-poe-val">{remaining.toFixed(1)}W / {Number(budget).toFixed(2)}W</span>
          </div>
          <div className={'omada-poe-bar tone-' + tone}>
            <div className="omada-poe-fill" style={{ width: pct + '%' }} />
          </div>
          <div className="omada-poe-meta">
            <span>{t('poe.draw')}: <b>{calc.draw.toFixed(1)}W</b></span>
            <span className="omada-poe-budgetctl">
              {t('poe.budget')}
              <InputNumber size="small" min={20} max={740} step={5} value={budget}
                           onChange={function (v) { if (v != null) setBudget(v); }}
                           style={{ width: 84 }} suffix="W" />
            </span>
          </div>
        </div>

        {oversub ? <div className="omada-poe-oversub">
          <window.OmadaIcon name="warning" size={14} /> {t('poe.oversub')}
        </div> : null}

        <div className="omada-poe-rows">
          {rows.map(function (r) {
            const pre = !!calc.preempted[r.port];
            const empty = !r.device;
            return (
              <div key={r.port}
                   className={'omada-poe-row' + (pre ? ' is-preempted' : '') + (empty || !r.on ? ' is-off' : '')}>
                <span className="omada-poe-port">{r.port}</span>
                <span className="omada-poe-dev">
                  {empty ? <i className="omada-poe-nodev">{t('poe.nodevice')}</i> : t(r.device)}
                  {!empty ? <span className="omada-poe-cls">{t('poe.class').replace('{n}', r.cls)} · {stdOf(r.cls)}</span> : null}
                </span>
                {!empty ? (
                  <Select size="small" value={r.prio} style={{ width: 96 }}
                          onChange={function (v) { patch(r.port, { prio: v }); }}
                          options={[
                            { value: 'high',   label: t('poe.prio.high') },
                            { value: 'medium', label: t('poe.prio.medium') },
                            { value: 'low',    label: t('poe.prio.low') },
                          ]} />
                ) : <span />}
                <span className="omada-poe-watts">{empty ? '—' : r.watts.toFixed(1) + 'W'}</span>
                {pre ? (
                  <Tooltip title={t('poe.preempt.tip')}>
                    <span className="omada-poe-pretag">{t('poe.preempted')}</span>
                  </Tooltip>
                ) : <span />}
                <Switch size="small" checked={r.on && !empty} disabled={empty}
                        onChange={function (v) { patch(r.port, { on: v }); }} />
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  window.Omada = window.Omada || {};
  window.Omada.PoeBudget = OmadaPoeBudget;
})();
