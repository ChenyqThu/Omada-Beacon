/* ────────────────────────────────────────────────────────────────────────
   components/Anchor/Anchor.jsx — OmadaAnchor

   In-page section navigation. antd <Anchor> already does scroll-spy + smooth
   scroll; we only re-skin the active marker to the Omada green ink rail and
   forward everything. The active bar colour comes from the token
   colorPrimary; the rail + spacing come from omada-overrides.css (with a dark
   twin). No brand hex in the JSX.

   Convenience: pass `items` straight through (antd 6 prefers items over
   <Anchor.Link> children). `getContainer` lets a demo scope scroll-spy to a
   bordered panel instead of the window.

   Figma: nav/anchor pattern derived from /Layout + /Navigation page chrome.
   Exports: window.Omada.Anchor
   ──────────────────────────────────────────────────────────────────────── */
(function () {
  const { Anchor: AntAnchor } = window.antd;

  function OmadaAnchor(props) {
    const className = props.className || '';
    const rest = Object.assign({}, props);
    delete rest.className;
    const cls = ['omada-anchor', className].filter(Boolean).join(' ');
    return <AntAnchor className={cls} {...rest} />;
  }

  // Forward the static Link in case a caller uses the children API.
  OmadaAnchor.Link = AntAnchor.Link;

  window.Omada = window.Omada || {};
  window.Omada.Anchor = OmadaAnchor;
})();
