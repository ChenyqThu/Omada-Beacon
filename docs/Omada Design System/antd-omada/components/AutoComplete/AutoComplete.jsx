/* ────────────────────────────────────────────────────────────────────────
   components/AutoComplete/AutoComplete.jsx — OmadaAutoComplete

   Thin wrapper over antd <AutoComplete> — a free-text field that suggests as
   you type (quick-find a device by name / IP, jump to a site). Distinct from
   <Search>, which is the filled-grey search box; AutoComplete is the bordered
   input + suggestion popup.

   We add only:
     - the `omada-ac` class so the popup + grouped-section titles pick up the
       Omada styling (light + dark twins in omada-overrides.css)
     - an optional leading OmadaIcon via `prefixIcon` (rendered inside the
       embedded Input) without disturbing antd's option/popup machinery
   Everything else (options, value, onChange, onSelect, onSearch, filterOption,
   allowClear, disabled, status) is forwarded.

   No dedicated Figma frame (antd primitive). Matched against the Select +
   Searchbox specs (Select 43:34731, Searchbox 43:34737).
   Exports: window.Omada.AutoComplete
   ──────────────────────────────────────────────────────────────────────── */
(function () {
  const { AutoComplete: AntAutoComplete, Input: AntInput } = window.antd;
  const OmadaIcon = window.OmadaIcon;

  function OmadaAutoComplete(props) {
    const prefixIcon = props.prefixIcon;
    const placeholder = props.placeholder;
    const allowClear = props.allowClear !== undefined ? props.allowClear : true;
    const className = props.className || '';
    const popupClassName = props.popupClassName || '';
    const children = props.children;

    const rest = Object.assign({}, props);
    delete rest.prefixIcon; delete rest.placeholder; delete rest.allowClear;
    delete rest.className; delete rest.popupClassName; delete rest.children;

    const cls = ['omada-ac', className].filter(Boolean).join(' ');
    const popCls = ['omada-ac-pop', popupClassName].filter(Boolean).join(' ');

    // When a prefix icon is requested we embed an <Input> child so the glyph
    // sits inside the control (antd renders children as the input element).
    const input = prefixIcon
      ? (
        <AntInput
          allowClear={allowClear}
          placeholder={placeholder}
          prefix={<OmadaIcon name={prefixIcon} size={16} style={{ color: 'var(--om-ph,#999)' }} />}
        />
      )
      : (children || undefined);

    return (
      <AntAutoComplete
        className={cls}
        popupClassName={popCls}
        allowClear={prefixIcon ? undefined : allowClear}
        placeholder={prefixIcon ? undefined : placeholder}
        {...rest}
      >
        {input}
      </AntAutoComplete>
    );
  }

  window.Omada = window.Omada || {};
  window.Omada.AutoComplete = OmadaAutoComplete;
})();
