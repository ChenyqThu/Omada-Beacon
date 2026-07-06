/* ────────────────────────────────────────────────────────────────────────
   components/App/App.jsx — OmadaApp + useOmadaApp()

   The antd-6 RECOMMENDED feedback pattern, wrapped for Omada. antd 6 deprecates
   the static `message.success()` / `notification.open()` / `Modal.confirm()`
   calls because they render OUTSIDE React's context — they miss the active
   ConfigProvider theme, locale and direction, so a toast fired from a dark,
   中文, RTL screen comes out light, English and LTR.

   The fix antd ships is <App>: it mounts a context holder, and
   `App.useApp()` hands back message / notification / modal instances that ARE
   inside the tree — so every toast, banner and confirm dialog inherits the
   Omada theme, the zhCN/enUS locale and the RTL direction for free.

   This wrapper:
     · OmadaApp        — a thin <App> with Omada-tuned message/notification
                         defaults (top offset, maxCount, placement, duration).
                         Forwards every antd App prop.
     · useOmadaApp()   — App.useApp(); the ONLY way to reach message/
                         notification/modal in the library. Throws nothing —
                         antd returns no-op stubs if no holder is mounted, but
                         we mount one in ThemeProvider so it always works.

   Because ThemeProvider already renders <App> at the root, useOmadaApp() works
   anywhere. Nest OmadaApp only to SCOPE different defaults to a subtree.

   Figma: no node — this is an antd-6 architecture primitive, not a visual one.
   The toasts/dialogs it produces are the Message / Notification / Modal
   wrappers already matched to their Figma nodes.
   Exports: window.Omada.App, window.useOmadaApp
   ──────────────────────────────────────────────────────────────────────── */
(function () {
  const { App: AntApp } = window.antd;

  // Omada feedback defaults — tuned to the spec (top toasts, calm stacking).
  const OMADA_MESSAGE = { top: 16, maxCount: 3, duration: 3 };
  const OMADA_NOTIFICATION = { placement: 'topRight', top: 24, maxCount: 4, duration: 4.5 };

  function OmadaApp(props) {
    const className = props.className || '';
    const message = props.message;
    const notification = props.notification;

    const rest = Object.assign({}, props);
    delete rest.className; delete rest.message; delete rest.notification;

    const mergedMessage = Object.assign({}, OMADA_MESSAGE, message || {});
    const mergedNotification = Object.assign({}, OMADA_NOTIFICATION, notification || {});

    return (
      <AntApp
        className={('omada-app ' + className).trim()}
        message={mergedMessage}
        notification={mergedNotification}
        {...rest}
      />
    );
  }

  // The single entry point for contextual feedback in the library.
  function useOmadaApp() {
    return AntApp.useApp();
  }

  window.Omada = window.Omada || {};
  window.Omada.App = OmadaApp;
  window.useOmadaApp = useOmadaApp;
})();
