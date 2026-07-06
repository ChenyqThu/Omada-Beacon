/* ────────────────────────────────────────────────────────────────────────
   components/NetworkInput/NetworkInput.jsx — OmadaIpInput + OmadaMacInput

   Two segmented network-address fields, built from a shared SegmentedInput
   base. antd has no MAC/IP control, so this is an original Omada component —
   but it is still token-/CSS-driven (the filled grey field, green focus
   border, red error border all come from omada-overrides.css + the Omada
   colour vars), never a fork of anything.

   Matches the Figma "IP地址" (4 octets, 0–255, separated by a 2px dot) and
   "MAC 输入框" (6 hex pairs, separated by "-"):
     · filled grey #F4F4F4 field, 4px radius, 32px tall
     · focus → 1px brand-green border (the Click/Focus states)
     · error → 1px red border + "invalid format" message below
     · disabled → 0.6 opacity
   Auto-advances between segments while typing, supports Backspace-to-prev,
   typing the separator to jump, and pasting a whole address.

   Figma: IP地址 node 43:34725 · MAC 输入框 node 43:34724.
   Exports: window.Omada.IpInput, window.Omada.MacInput, window.Omada.SegmentedInput
   ──────────────────────────────────────────────────────────────────────── */
(function () {
  const { useState, useRef, useEffect, useCallback } = React;

  function SegmentedInput({
    count, sep, joinSep, sanitize, placeholderSeg, segWidth = 40,
    value, defaultValue, onChange, validate,
    disabled = false, status, width, className = '',
  }) {
    const controlled = value != null;
    const parse = useCallback((str) => {
      const parts = String(str || '').split(new RegExp('[.\\-:]')).slice(0, count);
      const out = new Array(count).fill('');
      parts.forEach((p, i) => { out[i] = sanitize(p, i); });
      return out;
    }, [count, sanitize]);

    const [segs, setSegs] = useState(() => parse(controlled ? value : defaultValue));
    const [focused, setFocused] = useState(false);
    const refs = useRef([]);

    useEffect(() => { if (controlled) setSegs(parse(value)); }, [value, controlled, parse]);

    const emit = (next) => {
      const joined = next.join(joinSep);
      const complete = next.every((s) => s !== '');
      const valid = !validate || !complete || validate(next);
      if (onChange) onChange(joined, { complete, valid, segments: next });
    };

    const setSeg = (i, raw) => {
      const clean = sanitize(raw, i);
      const next = segs.slice();
      next[i] = clean;
      if (!controlled) setSegs(next);
      emit(next);
      return clean;
    };

    const onSegChange = (i, e) => {
      const raw = e.target.value;
      // typing a separator jumps to the next field
      if (/[.\-:]/.test(raw)) {
        setSeg(i, raw.replace(/[.\-:]/g, ''));
        if (i < count - 1) refs.current[i + 1] && refs.current[i + 1].focus();
        return;
      }
      const clean = setSeg(i, raw);
      const full = sanitize('x'.repeat(99), i).length || 3;
      if (clean.length >= full && i < count - 1) refs.current[i + 1] && refs.current[i + 1].focus();
    };

    const onKey = (i, e) => {
      if (e.key === 'Backspace' && !e.target.value && i > 0) {
        refs.current[i - 1] && refs.current[i - 1].focus();
      }
      if ((e.key === 'ArrowRight') && e.target.selectionStart === e.target.value.length && i < count - 1) {
        refs.current[i + 1] && refs.current[i + 1].focus();
      }
      if ((e.key === 'ArrowLeft') && e.target.selectionStart === 0 && i > 0) {
        refs.current[i - 1] && refs.current[i - 1].focus();
      }
    };

    const onPaste = (e) => {
      const text = (e.clipboardData || window.clipboardData).getData('text');
      if (/[.\-:]/.test(text)) { e.preventDefault(); const next = parse(text); if (!controlled) setSegs(next); emit(next); }
    };

    const cls = [
      'omada-seg-input',
      focused ? 'is-focused' : '',
      status === 'error' ? 'is-error' : '',
      disabled ? 'is-disabled' : '',
      className,
    ].filter(Boolean).join(' ');

    return (
      <div className={cls} style={{ width }}>
        {segs.map((s, i) => (
          <React.Fragment key={i}>
            {i > 0 && (sep === 'dot'
              ? <span className="omada-seg-dot" aria-hidden="true" />
              : <span className="omada-seg-sep" aria-hidden="true">{sep}</span>)}
            <input
              ref={(el) => { refs.current[i] = el; }}
              className="omada-seg-field"
              style={{ width: segWidth }}
              value={s}
              inputMode={sep === 'dot' ? 'numeric' : 'text'}
              placeholder={placeholderSeg ? placeholderSeg[i] : ''}
              disabled={disabled}
              aria-label={`segment ${i + 1}`}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              onChange={(e) => onSegChange(i, e)}
              onKeyDown={(e) => onKey(i, e)}
              onPaste={onPaste}
            />
          </React.Fragment>
        ))}
      </div>
    );
  }

  // ── IP: 4 octets, digits only, clamp 0–255 ──
  function ipSanitize(raw) {
    let v = String(raw).replace(/[^0-9]/g, '').slice(0, 3);
    if (v !== '' && parseInt(v, 10) > 255) v = '255';
    return v;
  }
  function ipValidate(segs) {
    return segs.every((s) => s !== '' && +s >= 0 && +s <= 255);
  }
  function OmadaIpInput({ width = 240, segWidth = 44, ...rest }) {
    return (
      <SegmentedInput
        count={4} sep="dot" joinSep="." sanitize={ipSanitize} validate={ipValidate}
        placeholderSeg={['192', '168', '0', '1']} segWidth={segWidth} width={width}
        {...rest}
      />
    );
  }

  // ── MAC: 6 hex pairs, separated by "-" ──
  function macSanitize(raw) {
    return String(raw).replace(/[^0-9a-fA-F]/g, '').slice(0, 2).toUpperCase();
  }
  function macValidate(segs) {
    return segs.every((s) => /^[0-9A-F]{2}$/.test(s));
  }
  function OmadaMacInput({ width = 240, segWidth = 26, ...rest }) {
    return (
      <SegmentedInput
        count={6} sep="-" joinSep="-" sanitize={macSanitize} validate={macValidate}
        placeholderSeg={['AA', 'BB', 'CC', 'DD', 'EE', 'FF']} segWidth={segWidth} width={width}
        {...rest}
      />
    );
  }

  window.Omada = window.Omada || {};
  window.Omada.SegmentedInput = SegmentedInput;
  window.Omada.IpInput = OmadaIpInput;
  window.Omada.MacInput = OmadaMacInput;
})();
