/* ────────────────────────────────────────────────────────────────────────
   components/Message/Message.jsx — useOmadaMessage()

   Thin wrapper over antd's message API. In antd 6 the themed, locale-aware
   instance comes from App.useApp() — so this is a hook, not a component.
   It returns { success, error, info, warning, loading, open, message } where
   the four status helpers inject the matching OmadaIcon glyph + tone so
   toasts read in the Omada visual language. `loading` keeps antd's spinner.
   Duration / radius come from omada-theme.js → components.Message.

   Figma: Toast Message 全局提示 node 2965:16331 (dark twin 3:25954).

   Exports: window.Omada.useMessage (= useOmadaMessage)
   ──────────────────────────────────────────────────────────────────────── */

const { App: AntAppForMsg } = window.antd;

const OM_MSG_TONE = {
  success: { icon: 'check-circle', color: 'var(--omada-green-500,#00A870)' },
  error:   { icon: 'ban',          color: 'var(--omada-red,#EE385C)' },
  info:    { icon: 'info',         color: 'var(--omada-blue,#0069CB)' },
  warning: { icon: 'warning',      color: 'var(--omada-orange,#FF8C27)' },
};

function msgGlyph(kind) {
  const m = OM_MSG_TONE[kind];
  return (m && window.OmadaIcon)
    ? <window.OmadaIcon name={m.icon} size={16} style={{ color: m.color }} />
    : undefined;
}

function useOmadaMessage() {
  const { message } = AntAppForMsg.useApp();

  const show = (kind, content, opts = {}) =>
    message.open({ type: kind, icon: msgGlyph(kind), content, duration: 3, ...opts });

  return {
    message,                                   // raw App-context instance
    success: (c, o) => show('success', c, o),
    error:   (c, o) => show('error', c, o),
    info:    (c, o) => show('info', c, o),
    warning: (c, o) => show('warning', c, o),
    loading: (c, o) => message.open({ type: 'loading', content: c, duration: 0, ...o }),
    open:    (o) => message.open(o),
  };
}

window.Omada = window.Omada || {};
window.Omada.useMessage = useOmadaMessage;
