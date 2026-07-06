/* ────────────────────────────────────────────────────────────────────────
   components/Splitter/Splitter.jsx — OmadaSplitter

   Resizable panel group — the master/detail split used by device list ↔
   detail, topology ↔ inspector. antd <Splitter> + <Splitter.Panel> handle the
   drag mechanics; we only re-skin the drag bar to a hairline that turns green
   on hover/drag (omada-overrides.css, with a dark twin) and forward all props.

   Re-exports Splitter.Panel so callers write <Splitter.Panel>.

   Figma: master/detail layout from /Layout (node 3:64434).
   Exports: window.Omada.Splitter  (.Panel)
   ──────────────────────────────────────────────────────────────────────── */
(function () {
  const { Splitter: AntSplitter } = window.antd;

  function OmadaSplitter(props) {
    const className = props.className || '';
    const rest = Object.assign({}, props);
    delete rest.className;
    const cls = ['omada-splitter', className].filter(Boolean).join(' ');
    return <AntSplitter className={cls} {...rest} />;
  }

  OmadaSplitter.Panel = AntSplitter.Panel;

  window.Omada = window.Omada || {};
  window.Omada.Splitter = OmadaSplitter;
})();
