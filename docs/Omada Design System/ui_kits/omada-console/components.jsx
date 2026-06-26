/* Shared atoms for the Omada console UI kit.
   Exports to window so other .jsx files can use without imports.            */
const { useState, useEffect, useRef } = React;

/* ─── Icon — wraps a Lucide name as inline SVG via createIcons ──────────── */
function Icon({ name, size = 18, style, className = '', stroke = 1.6 }) {
  return (
    <i
      data-lucide={name}
      style={{ width: size, height: size, display: 'inline-flex', strokeWidth: stroke, ...style }}
      className={className}
    ></i>
  );
}

/* ─── Button ─────────────────────────────────────────────────────────────── */
function Button({ variant = 'primary', icon, children, ...rest }) {
  const cls = `btn btn-${variant}`;
  return (
    <button className={cls} {...rest}>
      {icon && <Icon name={icon} size={14} />}
      {children}
    </button>
  );
}

/* ─── IconBtn — circular icon-only button ────────────────────────────────── */
function IconBtn({ name, size = 18, ...rest }) {
  return (
    <button className="icbtn" {...rest}>
      <Icon name={name} size={size} />
    </button>
  );
}

/* ─── Card ───────────────────────────────────────────────────────────────── */
function Card({ title, action, tight, children, style }) {
  return (
    <div className={`card ${tight ? 'card-tight' : ''}`} style={style}>
      {(title || action) && (
        <div className="card-head">
          {title && <div className="card-title">{title}</div>}
          {action}
        </div>
      )}
      {children}
    </div>
  );
}

/* ─── StatusPill ─────────────────────────────────────────────────────────── */
function Pill({ tone = 'neutral', children, dot = true }) {
  return (
    <span className={`pill pill-${tone}`}>
      {dot && <span className="dot"></span>}
      {children}
    </span>
  );
}

/* ─── Switch ─────────────────────────────────────────────────────────────── */
function Switch({ on = false, onChange }) {
  return (
    <span
      className={`switch ${on ? 'on' : ''}`}
      onClick={() => onChange && onChange(!on)}
    />
  );
}

/* ─── Field ──────────────────────────────────────────────────────────────── */
function Field({ label, children }) {
  return (
    <div className="field">
      {label && <label className="field-label">{label}</label>}
      {children}
    </div>
  );
}

/* ─── Mini gauge (semicircle health score) ───────────────────────────────── */
function HealthGauge({ value = 76, size = 132 }) {
  const r = 52;
  const cx = size / 2;
  const cy = size / 2 + 6;
  const C = Math.PI * r;
  const pct = Math.max(0, Math.min(100, value));
  const dash = (pct / 100) * C;
  const colour =
    pct >= 70 ? '#00A870' : pct >= 50 ? '#FF8C27' : '#EE385C';
  return (
    <div style={{ position: 'relative', width: size, height: size * 0.78 }}>
      <svg width={size} height={size * 0.78} style={{ overflow: 'visible' }}>
        <path
          d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          fill="none"
          stroke="#ECECEC"
          strokeWidth="10"
          strokeLinecap="round"
        />
        <path
          d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          fill="none"
          stroke={colour}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${C}`}
        />
      </svg>
      <div style={{
        position: 'absolute', left: 0, right: 0, top: 26, textAlign: 'center'
      }}>
        <div style={{ fontSize: 32, fontWeight: 700, color: colour, lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: 11, color: 'var(--fg-tertiary)', marginTop: 4 }}>Site Health Score</div>
      </div>
    </div>
  );
}

/* ─── SparkLine — simple SVG line chart ──────────────────────────────────── */
function SparkLine({ data, w = 600, h = 80, stroke = '#00A870', fill = 'rgba(0,168,112,0.10)', smooth = true }) {
  if (!data || !data.length) return null;
  const max = Math.max(...data), min = Math.min(...data);
  const span = max - min || 1;
  const pts = data.map((v, i) => [
    (i / (data.length - 1)) * w,
    h - ((v - min) / span) * (h - 10) - 5
  ]);
  let d = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 1; i < pts.length; i++) {
    if (smooth) {
      const [px, py] = pts[i - 1], [x, y] = pts[i];
      const mx = (px + x) / 2;
      d += ` Q ${mx} ${py}, ${x} ${y}`;
    } else {
      d += ` L ${pts[i][0]} ${pts[i][1]}`;
    }
  }
  const dFill = `${d} L ${w} ${h} L 0 ${h} Z`;
  return (
    <svg width="100%" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ display: 'block' }}>
      <path d={dFill} fill={fill} />
      <path d={d} fill="none" stroke={stroke} strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

/* ─── Donut — clients/traffic split ───────────────────────────────────────── */
function Donut({ slices, size = 120, thickness = 16, centerLabel, centerValue }) {
  const r = (size - thickness) / 2;
  const C = 2 * Math.PI * r;
  const total = slices.reduce((s, x) => s + x.value, 0) || 1;
  let acc = 0;
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#F4F4F4" strokeWidth={thickness} />
        {slices.map((s, i) => {
          const len = (s.value / total) * C;
          const dash = `${len} ${C}`;
          const offset = -acc;
          acc += len;
          return (
            <circle key={i}
              cx={size / 2} cy={size / 2} r={r}
              fill="none" stroke={s.color} strokeWidth={thickness}
              strokeDasharray={dash} strokeDashoffset={offset}
              strokeLinecap="butt"
            />
          );
        })}
      </svg>
      {centerValue !== undefined && (
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{ fontSize: 22, fontWeight: 700, lineHeight: 1 }}>{centerValue}</div>
          {centerLabel && <div style={{ fontSize: 11, color: 'var(--fg-tertiary)', marginTop: 4 }}>{centerLabel}</div>}
        </div>
      )}
    </div>
  );
}

/* ─── Refresh Lucide icons after React renders ───────────────────────────── */
function useLucide() {
  useEffect(() => {
    if (window.lucide) window.lucide.createIcons();
  });
}

/* ─── Brand logo helpers ─────────────────────────────────────────────────── */
function OmadaWordmark({ dark = false, height = 26 }) {
  // SVG paths are black by default; on dark backgrounds we invert to white.
  return (
    <img
      src="../../assets/omada-logo.svg"
      alt="Omada"
      style={{
        height, display: 'block',
        filter: dark ? 'brightness(0) invert(1)' : 'none'
      }}
    />
  );
}

Object.assign(window, {
  Icon, Button, IconBtn, Card, Pill, Switch, Field,
  HealthGauge, SparkLine, Donut, useLucide, OmadaWordmark
});
