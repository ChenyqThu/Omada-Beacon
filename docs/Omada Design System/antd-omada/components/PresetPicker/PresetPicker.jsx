/* ────────────────────────────────────────────────────────────────────────
   components/PresetPicker/PresetPicker.jsx — OmadaPresetPicker

   The time-window control that lives at the top of every dashboard, log view
   and chart: a Segmented row of quick presets (Last 24h · 7d · 30d · 90d) plus
   a Custom option that reveals a RangePicker. Picking a preset computes a
   concrete [start, end] and emits it; picking a custom range flips the segment
   to "Custom" and keeps the dates. The resolved window is summarised inline so
   the user always sees the literal span they're looking at.

   Controlled (`value` = preset key) or uncontrolled (`defaultValue`). Emits
   onChange({ preset, range: [dayjs, dayjs] }). Preset list is overridable.

   Thin composition over Segmented + OmadaRangePicker + OmadaIcon. Token-driven,
   dark twin, i18n (preset labels via t()), RTL-mirrored.

   Figma: derived from DatePicker 日期选择器 RangePicker + Segmented 分段控制器.
   Original dashboard time-window composite.
   Exports: window.Omada.PresetPicker (+ .DEFAULT_PRESETS, .resolve)
   ──────────────────────────────────────────────────────────────────────── */
(function () {
  const { Segmented } = window.antd;
  const RangePicker = window.Omada.RangePicker;
  const Icon = window.Omada.Icon;
  const dayjs = window.dayjs;

  // preset key → how many units back from now
  const DEFAULT_PRESETS = [
    { key: '24h', amount: 24, unit: 'hour' },
    { key: '7d',  amount: 7,  unit: 'day' },
    { key: '30d', amount: 30, unit: 'day' },
    { key: '90d', amount: 90, unit: 'day' },
  ];

  function resolve(presetKey, presets) {
    const list = presets || DEFAULT_PRESETS;
    const p = list.find((x) => x.key === presetKey);
    if (!p || !dayjs) return null;
    const end = dayjs();
    return [end.subtract(p.amount, p.unit), end];
  }

  function fmtRange(range, t, withTime) {
    if (!range || !range[0] || !range[1] || !dayjs) return '';
    const f = withTime ? 'MMM D, HH:mm' : 'MMM D, YYYY';
    return range[0].format(f) + '  →  ' + range[1].format(f);
  }

  function OmadaPresetPicker(props) {
    const { useState } = React;
    const ctx = window.useOmada ? window.useOmada() : null;
    const t = ctx ? ctx.t : (k) => k;

    const presets = props.presets || DEFAULT_PRESETS;
    const controlled = props.value !== undefined;
    const [internal, setInternal] = useState(props.defaultValue || presets[0].key);
    const preset = controlled ? props.value : internal;

    // custom range state (only meaningful when preset === 'custom')
    const [customRange, setCustomRange] = useState(props.defaultRange || null);

    const withTime = !!props.showTime;
    const activeRange = preset === 'custom' ? customRange : resolve(preset, presets);

    const emit = (nextPreset, nextRange) => {
      if (!controlled) setInternal(nextPreset);
      if (props.onChange) props.onChange({ preset: nextPreset, range: nextRange });
    };

    const onSegment = (key) => {
      if (key === 'custom') {
        const seed = customRange || resolve(preset, presets) || resolve(presets[0].key, presets);
        setCustomRange(seed);
        emit('custom', seed);
      } else {
        emit(key, resolve(key, presets));
      }
    };

    const onCustomPick = (range) => {
      setCustomRange(range);
      if (!controlled) setInternal('custom');
      if (props.onChange) props.onChange({ preset: 'custom', range });
    };

    const options = presets
      .map((p) => ({ label: t('pp.preset.' + p.key), value: p.key }))
      .concat([{
        label: (
          <span className="omada-pp-customlabel">
            <Icon name="calendar" size={13} />{t('pp.preset.custom')}
          </span>
        ),
        value: 'custom',
      }]);

    return (
      <div className="omada-pp">
        <div className="omada-pp-controls">
          <Segmented
            size={props.size || 'middle'}
            options={options}
            value={preset}
            onChange={onSegment}
          />
          {preset === 'custom' && (
            <RangePicker
              value={customRange}
              showTime={withTime}
              onChange={onCustomPick}
              allowClear={false}
              className="omada-pp-range"
            />
          )}
        </div>
        {props.showSummary !== false && (
          <div className="omada-pp-summary">
            <Icon name="clock" size={13} />
            <span className="omada-pp-summarytext">{fmtRange(activeRange, t, withTime)}</span>
          </div>
        )}
      </div>
    );
  }

  OmadaPresetPicker.DEFAULT_PRESETS = DEFAULT_PRESETS;
  OmadaPresetPicker.resolve = resolve;

  window.Omada = window.Omada || {};
  window.Omada.PresetPicker = OmadaPresetPicker;
})();
