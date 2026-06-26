/* ────────────────────────────────────────────────────────────────────────
   components/Flex/Flex.jsx — OmadaFlex

   Thin wrapper over antd <Flex> — the low-level flexbox primitive used to lay
   out toolbars, button clusters, KPI rows and form footers without hand-rolled
   CSS. Per COMPONENT_SPEC, prefer flex/grid + gap over inline flow; this is the
   token-friendly building block for that.

   We add nothing visual — `gap` accepts antd's named steps ('small' | 'middle'
   | 'large') which resolve to the theme's spacing tokens, so spacing stays on
   the 8-grid. We only attach the `omada-flex` class as a styling hook and
   forward everything (vertical, justify, align, gap, wrap, flex, component).

   No dedicated Figma frame (antd primitive / layout utility). Spacing steps
   match the Space spec.
   Exports: window.Omada.Flex
   ──────────────────────────────────────────────────────────────────────── */
(function () {
  const { Flex: AntFlex } = window.antd;

  function OmadaFlex(props) {
    const className = props.className || '';
    const rest = Object.assign({}, props);
    delete rest.className;
    const cls = ['omada-flex', className].filter(Boolean).join(' ');
    return <AntFlex className={cls} {...rest} />;
  }

  window.Omada = window.Omada || {};
  window.Omada.Flex = OmadaFlex;
})();
