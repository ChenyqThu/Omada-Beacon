/* ────────────────────────────────────────────────────────────────────────
   components/Progress/Progress.jsx — OmadaProgress

   Thin wrapper over antd Progress. Matches the Figma "Progress 进度条":
     · line     → 6px track, #ECECEC rail, brand-green fill, 100-radius caps,
                  trailing % label (or a status glyph at the right)
     · circle   → 112px medium ring, 6px stroke, #ECECEC rail, centred % text
                  or status icon (success check / warning / failed)
     · dashboard→ 270° sweep (antd type="dashboard")
   All colour comes from omada-theme.js → components.Progress
   (defaultColor green, remainingColor #ECECEC, circleTextColor) plus the
   semantic status tokens antd applies for status="success|exception".

   Convenience: `tone` → antd `status`
     active → 'active' (animated stripe), success → 'success',
     warning → custom (orange via strokeColor token), error → 'exception'.

   Figma: Progress 进度条 node 43:34760 (line + circle, ing/done/warning/error).
   Exports: window.Omada.Progress
   ──────────────────────────────────────────────────────────────────────── */

const { Progress: AntProgress } = window.antd;

function OmadaProgress({ tone, status, strokeColor, className = '', ...rest }) {
  const O = window.OMADA;
  const mode = document.documentElement.getAttribute('data-omada-theme') === 'dark' ? 'dark' : 'light';
  const warnColor = mode === 'dark' ? O.orangeDark : O.orange;

  // map Omada `tone` → antd `status` (+ a warning stroke that antd has no status for)
  const map = {
    active:  { status: 'active' },
    success: { status: 'success' },
    error:   { status: 'exception' },
    warning: { strokeColor: warnColor },
    normal:  {},
  }[tone] || {};

  const cls = ('omada-progress ' + (tone === 'warning' ? 'omada-progress-warning ' : '') + className).trim();
  return (
    <AntProgress
      className={cls}
      {...map}
      {...(status ? { status } : {})}
      {...(strokeColor ? { strokeColor } : {})}
      {...rest}
    />
  );
}

window.Omada = window.Omada || {};
window.Omada.Progress = OmadaProgress;
