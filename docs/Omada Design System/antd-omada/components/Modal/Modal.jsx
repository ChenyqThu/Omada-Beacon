/* ────────────────────────────────────────────────────────────────────────
   components/Modal/Modal.jsx — OmadaModal + useOmadaModal() confirm presets

   Thin wrapper over antd Modal. Omada defaults match the Figma "Dialog 对话框":
   12px radius (token), 480 default width, the OmadaIcon close glyph, a header
   bottom-rule + 18px title (omada-overrides.css). Footer button labels (OK /
   Cancel) come from antd ConfigProvider locale; product copy via window.t().

   useOmadaModal() returns the App-context modal API (themed + locale-aware in
   antd 6) plus three Omada presets that inject the right OmadaIcon + tone:
     • confirmDelete({ title, content, onOk }) — danger, warning glyph, red OK
     • confirmDiscard({ title, content, onOk }) — neutral warning
     • info({ title, content }) — info glyph
   Each accepts overrides and forwards the rest to antd modal.confirm.

   Figma: Dialog 确认框 node 3:26637 (info / confirm / loading dialogs).

   Exports: window.Omada.Modal, window.Omada.useModal (= useOmadaModal)
   ──────────────────────────────────────────────────────────────────────── */

const { Modal: AntModal, App: AntAppForModal } = window.antd;

function modalIcon(name, color) {
  return window.OmadaIcon
    ? <window.OmadaIcon name={name} size={22} style={{ color, marginTop: 1 }} />
    : null;
}

function OmadaModal({ width = 480, closeIcon, centered = true, ...rest }) {
  const ci = closeIcon !== undefined
    ? closeIcon
    : (window.OmadaIcon ? <window.OmadaIcon name="close" size={18} /> : undefined);
  return <AntModal width={width} centered={centered} closeIcon={ci} {...rest} />;
}

function useOmadaModal() {
  // App.useApp() gives the themed, locale-aware modal instance in antd 6.
  const { modal } = AntAppForModal.useApp();

  const base = (preset) => ({
    centered: true,
    icon: null,                 // we render our own glyph inside `title`
    ...preset,
  });

  const titled = (name, tone, title) => (
    <span style={{ display: 'inline-flex', alignItems: 'flex-start', gap: 12 }}>
      {modalIcon(name, tone)}
      <span style={{ flex: 1 }}>{title}</span>
    </span>
  );

  return {
    modal,
    confirmDelete: ({ title, content, okText, ...rest }) => modal.confirm(base({
      title: titled('warning', 'var(--omada-red,#EE385C)', title),
      content: <div style={{ paddingLeft: 34 }}>{content}</div>,
      okButtonProps: { danger: true },
      okText,
      ...rest,
    })),
    confirmDiscard: ({ title, content, ...rest }) => modal.confirm(base({
      title: titled('warning', 'var(--omada-orange,#FF8C27)', title),
      content: <div style={{ paddingLeft: 34 }}>{content}</div>,
      ...rest,
    })),
    info: ({ title, content, ...rest }) => modal.info(base({
      title: titled('info', 'var(--omada-blue,#0069CB)', title),
      content: <div style={{ paddingLeft: 34 }}>{content}</div>,
      ...rest,
    })),
  };
}

window.Omada = window.Omada || {};
window.Omada.Modal = OmadaModal;
window.Omada.useModal = useOmadaModal;
