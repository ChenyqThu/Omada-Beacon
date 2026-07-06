/* ────────────────────────────────────────────────────────────────────────
   components/Affix/Affix.jsx — OmadaAffix

   Sticks a node to the viewport edge once it would scroll past. antd <Affix>
   is purely behavioural (no colour of its own), so this is the thinnest of
   wrappers — it exists only so the library exposes one consistent name and
   so a demo can opt into an Omada "stuck" elevation via a class hook that has
   a light + dark twin in omada-overrides.css.

   Convenience: `lifted` — when affixed, add the Omada md shadow so a stuck
   toolbar reads as elevated above the content beneath it.

   Figma: sticky-toolbar pattern from /Layout (node 3:64434) headers.
   Exports: window.Omada.Affix
   ──────────────────────────────────────────────────────────────────────── */
(function () {
  const { Affix: AntAffix } = window.antd;
  const { useState } = React;

  function OmadaAffix(props) {
    const { lifted = false, children, onChange } = props;
    const rest = Object.assign({}, props);
    delete rest.lifted; delete rest.children; delete rest.onChange;
    const [stuck, setStuck] = useState(false);
    const handle = (affixed) => { setStuck(!!affixed); onChange && onChange(affixed); };
    return (
      <AntAffix onChange={handle} {...rest}>
        <div className={'omada-affix-inner' + (lifted && stuck ? ' is-stuck' : '')}>
          {children}
        </div>
      </AntAffix>
    );
  }

  window.Omada = window.Omada || {};
  window.Omada.Affix = OmadaAffix;
})();
