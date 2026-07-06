/* ────────────────────────────────────────────────────────────────────────
   components/Notification/Notification.jsx — useOmadaNotification()

   Thin wrapper over antd's notification API. Like message, the themed,
   locale-aware instance comes from App.useApp(), so this is a hook. It
   returns { success, error, info, warning, open, notification } where the
   status helpers inject the matching OmadaIcon glyph + tone and default to
   topRight placement. Notices carry a title (`message`) + `description`, and
   optionally a `btn` action node. Radius (8px) + padding from
   omada-theme.js → components.Notification; the close glyph is OmadaIcon.

   Figma: Notification 通知提醒框 node 29197:52977.

   Exports: window.Omada.useNotification (= useOmadaNotification)
   ──────────────────────────────────────────────────────────────────────── */

const { App: AntAppForNotif } = window.antd;

const OM_NOTIF_TONE = {
  success: { icon: 'check-circle', color: 'var(--omada-green-500,#00A870)' },
  error:   { icon: 'ban',          color: 'var(--omada-red,#EE385C)' },
  info:    { icon: 'info',         color: 'var(--omada-blue,#0069CB)' },
  warning: { icon: 'warning',      color: 'var(--omada-orange,#FF8C27)' },
};

function notifGlyph(kind) {
  const m = OM_NOTIF_TONE[kind];
  return (m && window.OmadaIcon)
    ? <window.OmadaIcon name={m.icon} size={22} style={{ color: m.color }} />
    : undefined;
}

function useOmadaNotification() {
  const { notification } = AntAppForNotif.useApp();
  const closeIcon = window.OmadaIcon ? <window.OmadaIcon name="close" size={16} /> : undefined;

  const show = (kind, opts = {}) =>
    notification.open({
      type: kind,
      icon: notifGlyph(kind),
      placement: 'topRight',
      closeIcon,
      duration: 4.5,
      ...opts,
    });

  return {
    notification,                              // raw App-context instance
    success: (o) => show('success', o),
    error:   (o) => show('error', o),
    info:    (o) => show('info', o),
    warning: (o) => show('warning', o),
    open:    (o) => show(o.type || 'info', o),
  };
}

window.Omada = window.Omada || {};
window.Omada.useNotification = useOmadaNotification;
