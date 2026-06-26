/* ────────────────────────────────────────────────────────────────────────
   components/AlarmRules/AlarmRules.jsx — OmadaAlarmRules

   A THRESHOLD-RULE builder: each row reads as a sentence —

     [enabled] When [metric] is [above|below] [value unit] for [n min]
               → [severity]

   Controlled: `rules` + `onChange(nextRules)`. Severity renders as a
   coloured-dot Select (critical red · warning orange · info blue).
   The value unit follows the chosen metric (% · Mbps · clients).

   Distinct from FilterBuilder (Batch 19 — query rows that FILTER a
   table): these rows DEFINE alerting thresholds with severity and a
   sustain window, and each row can be disabled without deleting it.

     rule: { id, enabled, metric, op: 'gt'|'lt', value, sustain (min),
             severity: 'critical'|'warning'|'info' }

   Token-driven, dark twin, i18n, RTL-safe.
   Figma: no dedicated node this session (VFS permission pending) —
   row anatomy follows FilterBuilder; pills follow Tag tokens.
   Exports: window.Omada.AlarmRules
   ──────────────────────────────────────────────────────────────────────── */
(function () {
  const Icon = window.Omada.Icon;
  const { Select, InputNumber, Switch, Button } = window.antd;

  const METRICS = {
    cpu:     { unit: 'pct',     max: 100 },
    mem:     { unit: 'pct',     max: 100 },
    clients: { unit: 'clients', max: 100000 },
    traffic: { unit: 'mbps',    max: 100000 },
    loss:    { unit: 'pct',     max: 100 },
  };
  const SUSTAINS = [1, 5, 15, 60];
  const SEVERITIES = ['critical', 'warning', 'info'];

  let uid = 0;

  function OmadaAlarmRules(props) {
    const ctx = window.useOmada ? window.useOmada() : null;
    const t = ctx ? ctx.t : (k) => k;

    const rules = props.rules || [];
    const emit = (next) => { if (props.onChange) props.onChange(next); };
    const patch = (id, key, value) => {
      emit(rules.map((r) => {
        if (r.id !== id) return r;
        const n = Object.assign({}, r); n[key] = value;
        if (key === 'metric') {
          const def = METRICS[value];
          if (def && n.value > def.max) n.value = def.max;
        }
        return n;
      }));
    };
    const remove = (id) => emit(rules.filter((r) => r.id !== id));
    const add = () => emit(rules.concat([{
      id: 'r' + Date.now() + '_' + (uid++), enabled: true,
      metric: 'cpu', op: 'gt', value: 90, sustain: 5, severity: 'warning',
    }]));

    const sevOptions = SEVERITIES.map((s) => ({
      value: s,
      label: (
        <span className="omada-alr-sevopt">
          <span className={'omada-alr-sevdot is-' + s} aria-hidden="true" />
          {t('alr.sev.' + s)}
        </span>
      ),
    }));

    return (
      <div className={'omada-alr' + (props.className ? ' ' + props.className : '')}>
        {rules.length === 0 && (
          <div className="omada-alr-empty"><Icon name="bell" size={14} />{t('alr.empty')}</div>
        )}
        {rules.map((r) => {
          const def = METRICS[r.metric] || METRICS.cpu;
          return (
            <div key={r.id} className={'omada-alr-row' + (r.enabled ? '' : ' is-off')}>
              <Switch size="small" checked={r.enabled} onChange={(v) => patch(r.id, 'enabled', v)} />
              <span className="omada-alr-word">{t('alr.when')}</span>
              <Select size="small" value={r.metric} popupMatchSelectWidth={false}
                      onChange={(v) => patch(r.id, 'metric', v)}
                      options={Object.keys(METRICS).map((k) => ({ value: k, label: t('alr.metric.' + k) }))} />
              <Select size="small" value={r.op} popupMatchSelectWidth={false}
                      onChange={(v) => patch(r.id, 'op', v)}
                      options={[{ value: 'gt', label: t('alr.op.gt') }, { value: 'lt', label: t('alr.op.lt') }]} />
              <span className="omada-alr-valuecell">
                <InputNumber size="small" min={0} max={def.max} value={r.value}
                             onChange={(v) => patch(r.id, 'value', v == null ? 0 : v)}
                             style={{ width: 86 }} />
                <span className="omada-alr-unit">{t('alr.u.' + def.unit)}</span>
              </span>
              <span className="omada-alr-word">{t('alr.for')}</span>
              <Select size="small" value={r.sustain} popupMatchSelectWidth={false}
                      onChange={(v) => patch(r.id, 'sustain', v)}
                      options={SUSTAINS.map((m) => ({ value: m, label: t('alr.min').replace('{n}', m) }))} />
              <span className="omada-alr-arrow" aria-hidden="true"><Icon name="arrow-right" size={13} /></span>
              <Select size="small" className="omada-alr-sevselect" value={r.severity}
                      popupMatchSelectWidth={false}
                      onChange={(v) => patch(r.id, 'severity', v)} options={sevOptions} />
              <Button size="small" type="text" aria-label={t('alr.remove')}
                      className="omada-alr-del"
                      icon={<Icon name="trash" size={13} />} onClick={() => remove(r.id)} />
            </div>
          );
        })}
        <Button size="small" type="dashed" icon={<Icon name="plus" size={12} />} onClick={add}
                className="omada-alr-add">
          {t('alr.add')}
        </Button>
      </div>
    );
  }

  window.Omada = window.Omada || {};
  window.Omada.AlarmRules = OmadaAlarmRules;
})();
