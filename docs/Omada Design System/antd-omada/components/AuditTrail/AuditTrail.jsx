/* ────────────────────────────────────────────────────────────────────────
   components/AuditTrail/AuditTrail.jsx — OmadaAuditTrail

   A DAY-GROUPED security audit log — who did what, from where, and whether
   it worked. Each entry reads time · actor · action · target with an IP
   chip and a RESULT pill (success / failed / denied). Days group under
   sticky "Today / Yesterday / date" headers; failed and denied rows carry
   a tinted accent so security reviews scan fast.

   Distinct from ActivityLog (Batch 21), which is a LIVE event feed
   (relative times, streaming order, no outcome semantics) — the AuditTrail
   is the reviewable security record: calendar-grouped, absolute mono
   timestamps, actor + source IP + outcome on every row.

     · `entries: [{ id, ts, actor, action, target?, ip?, via?, result }]`
       — result: 'success' | 'failed' | 'denied'.
     · `filter` ('all' default) narrows by result — wire it to a Segmented.
     · Day labels localise via Intl; "today"/"yesterday" via i18n keys.

   Thin composition over OmadaIcon on tokened surfaces. Token-driven,
   dark twin, i18n, RTL-aware (timestamps/IPs stay LTR).

   Figma: no dedicated node — row anatomy follows the Table/ActivityLog
   language; result pills use the semantic tones.
   Exports: window.Omada.AuditTrail
   ──────────────────────────────────────────────────────────────────────── */
(function () {
  const { useMemo } = React;
  const Icon = window.Omada.Icon;

  const RESULT_ICON = { success: 'check-circle', failed: 'close', denied: 'ban' };

  function dayKey(ts) {
    const d = new Date(ts);
    return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
  }

  function dayLabel(ts, lang, t) {
    const now = new Date();
    const k = dayKey(ts);
    if (k === dayKey(now)) return t('audit.today');
    if (k === dayKey(now.getTime() - 86400000)) return t('audit.yesterday');
    return new Date(ts).toLocaleDateString(lang === 'zh' ? 'zh-CN' : 'en-US',
      { month: 'short', day: 'numeric', weekday: 'short' });
  }

  function timeLabel(ts) {
    const d = new Date(ts);
    const p = (x) => (x < 10 ? '0' + x : '' + x);
    return p(d.getHours()) + ':' + p(d.getMinutes()) + ':' + p(d.getSeconds());
  }

  function OmadaAuditTrail(props) {
    const ctx = window.useOmada ? window.useOmada() : null;
    const t = ctx ? ctx.t : (k) => k;
    const lang = ctx ? ctx.lang : 'en';

    const entries = props.entries || [];
    const filter = props.filter || 'all';

    const groups = useMemo(() => {
      const list = entries
        .filter((e) => filter === 'all' || e.result === filter)
        .slice()
        .sort((a, b) => b.ts - a.ts);
      const out = [];
      list.forEach((e) => {
        const k = dayKey(e.ts);
        const last = out[out.length - 1];
        if (last && last.key === k) last.items.push(e);
        else out.push({ key: k, ts: e.ts, items: [e] });
      });
      return out;
    }, [entries, filter]);

    if (groups.length === 0) {
      return (
        <div className={'omada-audit is-empty' + (props.className ? ' ' + props.className : '')}>
          <Icon name="shield" size={18} />
          <span>{t('audit.empty')}</span>
        </div>
      );
    }

    return (
      <div className={'omada-audit' + (props.className ? ' ' + props.className : '')}>
        {groups.map((g) => (
          <div key={g.key} className="omada-audit-day">
            <div className="omada-audit-dayhead">
              <span className="omada-audit-daylabel">{dayLabel(g.ts, lang, t)}</span>
              <span className="omada-audit-daycount">{g.items.length}</span>
              <span className="omada-audit-dayrule" />
            </div>
            {g.items.map((e) => (
              <div key={e.id} className={'omada-audit-row is-' + (e.result || 'success')}>
                <span className="omada-audit-time">{timeLabel(e.ts)}</span>
                <span className="omada-audit-actor">
                  <span className="omada-audit-avatar" aria-hidden="true">{(e.actor || '?').charAt(0).toUpperCase()}</span>
                  {e.actor}
                </span>
                <span className="omada-audit-action">
                  {e.action}
                  {e.target && <code className="omada-audit-target">{e.target}</code>}
                  {e.via && <span className="omada-audit-via">{t('audit.via').replace('{x}', e.via)}</span>}
                </span>
                {e.ip && <span className="omada-audit-ip">{e.ip}</span>}
                <span className={'omada-audit-result is-' + (e.result || 'success')}>
                  <Icon name={RESULT_ICON[e.result] || 'check-circle'} size={12} />
                  {t('audit.r.' + (e.result || 'success'))}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }

  window.Omada = window.Omada || {};
  window.Omada.AuditTrail = OmadaAuditTrail;
})();
