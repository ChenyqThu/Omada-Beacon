/* ────────────────────────────────────────────────────────────────────────
   components/WanFailover/WanFailover.jsx — OmadaWanFailover

   PRIMARY / BACKUP WAN link cards + a live failover state machine + an
   event timeline. Normal: primary is ACTIVE (pulsing green), backup is
   STANDBY. "Simulate failure" → DETECTING (amber sweep, ~1.2 s) →
   FAILOVER: primary DOWN (error tone), backup ACTIVE, two timeline
   events appended (link down, traffic moved). "Restore" plays it back.
   Events are timestamped with the active locale, newest first.

   Distinct from SpeedTest (one link's throughput) and FirmwareRollout
   (staged waves): this is a two-link redundancy state view.

   Token-driven, dark twin, i18n. IPs/latency render LTR in RTL.
   Figma: no dedicated frame — cards follow Card tokens, timeline
   follows AuditTrail metrics.
   Exports: window.Omada.WanFailover
   ──────────────────────────────────────────────────────────────────────── */
(function () {
  const { Button } = window.antd;

  function OmadaWanFailover(props) {
    const { useState, useRef, useEffect } = React;
    const ctx = window.useOmada ? window.useOmada() : null;
    const t = ctx ? ctx.t : (k) => k;
    const lang = ctx ? ctx.lang : 'en';
    const locale = lang === 'zh' ? 'zh-CN' : 'en-US';

    const primary = props.primary || { name: 'WAN1 · Fiber', ip: '203.0.113.10', latency: 8 };
    const backup = props.backup || { name: 'WAN2 · LTE', ip: '10.64.21.7', latency: 41 };

    const [phase, setPhase] = useState('normal'); // normal | detecting | failover | restoring
    const [events, setEvents] = useState([]);
    const timer = useRef(null);

    useEffect(function () {
      return function () { if (timer.current) window.clearTimeout(timer.current); };
    }, []);

    function stamp() {
      return new Date().toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    }
    function pushEvents(list) {
      setEvents(function (prev) {
        return list.map(function (e) { return { id: 'e' + Date.now() + Math.random(), time: stamp(), text: e.text, tone: e.tone }; })
          .concat(prev).slice(0, 8);
      });
    }

    function simulate() {
      setPhase('detecting');
      timer.current = window.setTimeout(function () {
        setPhase('failover');
        pushEvents([
          { text: t('wanf.ev.switched').replace('{l}', backup.name), tone: 'warning' },
          { text: t('wanf.ev.failed').replace('{l}', primary.name), tone: 'error' },
        ]);
        if (props.onFailover) props.onFailover();
      }, 1200);
    }
    function restore() {
      setPhase('restoring');
      timer.current = window.setTimeout(function () {
        setPhase('normal');
        pushEvents([{ text: t('wanf.ev.restored').replace('{l}', primary.name), tone: 'success' }]);
        if (props.onRestore) props.onRestore();
      }, 1000);
    }

    function linkCard(link, role) {
      const isPrimary = role === 'primary';
      let state; // active | standby | down | checking
      if (phase === 'normal') state = isPrimary ? 'active' : 'standby';
      else if (phase === 'detecting') state = isPrimary ? 'checking' : 'standby';
      else if (phase === 'failover') state = isPrimary ? 'down' : 'active';
      else state = isPrimary ? 'checking' : 'active';

      const stateLabel = state === 'active' ? t('wanf.active')
        : state === 'standby' ? t('wanf.standby')
        : state === 'down' ? t('wanf.down')
        : t('wanf.detecting');

      return (
        <div className={'omada-wanf-card is-' + state}>
          <div className="omada-wanf-cardhead">
            <span className="omada-wanf-role">{isPrimary ? t('wanf.primary') : t('wanf.backup')}</span>
            <span className={'omada-wanf-state is-' + state}>
              <i className="omada-wanf-dot" />
              {stateLabel}
            </span>
          </div>
          <div className="omada-wanf-linkname">
            <window.OmadaIcon name={isPrimary ? 'globe' : 'ap'} size={16} />
            {link.name}
          </div>
          <div className="omada-wanf-meta">
            <span className="omada-wanf-ip">{link.ip}</span>
            <span className="omada-wanf-lat">
              {t('wanf.latency')}: <b>{state === 'down' ? '—' : link.latency + ' ms'}</b>
            </span>
          </div>
        </div>
      );
    }

    return (
      <div className={'omada-wanf' + (props.className ? ' ' + props.className : '')}>
        <div className="omada-wanf-cards">
          {linkCard(primary, 'primary')}
          <span className={'omada-wanf-arrow is-' + phase} aria-hidden="true">
            <window.OmadaIcon name="arrow-right" size={16} />
          </span>
          {linkCard(backup, 'backup')}
        </div>

        <div className="omada-wanf-actions">
          {phase === 'normal' || phase === 'detecting' ? (
            <Button danger loading={phase === 'detecting'} onClick={simulate} disabled={phase === 'detecting'}>
              {phase === 'detecting' ? t('wanf.detecting') : t('wanf.simulate')}
            </Button>
          ) : (
            <Button type="primary" loading={phase === 'restoring'} onClick={restore} disabled={phase === 'restoring'}>
              {t('wanf.restore')}
            </Button>
          )}
        </div>

        {events.length > 0 ? (
          <div className="omada-wanf-timeline">
            <div className="omada-wanf-tlhead">{t('wanf.timeline')}</div>
            <ul>
              {events.map(function (e) {
                return (
                  <li key={e.id} className={'omada-wanf-ev is-' + e.tone}>
                    <span className="omada-wanf-evdot" />
                    <span className="omada-wanf-evtime">{e.time}</span>
                    <span className="omada-wanf-evtext">{e.text}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        ) : null}
      </div>
    );
  }

  window.Omada = window.Omada || {};
  window.Omada.WanFailover = OmadaWanFailover;
})();
