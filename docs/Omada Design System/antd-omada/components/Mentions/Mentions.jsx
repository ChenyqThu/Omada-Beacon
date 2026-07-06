/* ────────────────────────────────────────────────────────────────────────
   components/Mentions/Mentions.jsx — OmadaMentions

   Thin wrapper over antd <Mentions> — a multi-line text field that offers an
   @-prefixed autocomplete for tagging teammates inside device notes, audit
   comments and change requests.

   We add only the `omada-mentions` class so the control matches the Omada
   TextArea (4px radius, green focus ring) and the suggestion popup picks up
   the menu styling — all in omada-overrides.css with a dark twin. Options can
   be passed via `options` (antd 6 preferred) or `Mentions.Option` children;
   both are forwarded untouched, along with prefix, split, rows, autoSize,
   value/onChange, onSearch, status and disabled.

   No dedicated Figma frame (antd primitive). Matched against the TextArea +
   Dropdown menu specs (Input2 43:34721, Dropdown 3:64442).
   Exports: window.Omada.Mentions
   ──────────────────────────────────────────────────────────────────────── */
(function () {
  const { Mentions: AntMentions } = window.antd;

  function OmadaMentions(props) {
    const className = props.className || '';
    const rest = Object.assign({}, props);
    delete rest.className;
    const cls = ['omada-mentions', className].filter(Boolean).join(' ');
    return <AntMentions className={cls} {...rest} />;
  }

  OmadaMentions.Option = AntMentions.Option;
  OmadaMentions.getMentions = AntMentions.getMentions;

  window.Omada = window.Omada || {};
  window.Omada.Mentions = OmadaMentions;
})();
