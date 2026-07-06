/* ────────────────────────────────────────────────────────────────────────
   components/Search/Search.jsx — OmadaSearch

   Thin wrapper over antd AutoComplete + Input, matching the Figma
   "Searchbox 搜索框": a 32px filled-grey field (#F4F4F4), 4px radius, grey
   placeholder, trailing search glyph, a clear (✕) icon once typed, and a
   results dropdown that falls back to an illustrated "No Data" empty state.

   Behaviour from the Figma spec: Enter triggers `onSearch` immediately, and
   typing auto-fires `onSearch` after a debounce (Figma says 3s; default here
   600ms, override via `debounce`). Clearing restores the default list.

   States Normal / Hover / Focus(green border) / Done / Clear / Disabled are
   handled by the filled-field CSS in omada-overrides.css (+ dark twin); the
   green focus border is the standard Omada 3px ring family.

   Figma: Searchbox 搜索框 node 43:34737.
   Exports: window.Omada.Search
   ──────────────────────────────────────────────────────────────────────── */

const { AutoComplete: AntAutoComplete, Input: AntInput2, Empty: AntEmpty2 } = window.antd;

function OmadaSearch({
  placeholder, options, onSearch, onSelect, debounce = 600,
  allowClear = true, disabled = false, width = 260, className = '', ...rest
}) {
  const { useState, useRef, useCallback } = React;
  const { t } = window.useOmada();
  const [value, setValue] = useState('');
  const [open, setOpen] = useState(false);
  const timer = useRef(null);

  const fire = useCallback((v) => { if (onSearch) onSearch(v); }, [onSearch]);

  const handleChange = (v) => {
    setValue(v);
    setOpen(!!v);
    if (timer.current) clearTimeout(timer.current);
    if (debounce > 0) timer.current = setTimeout(() => fire(v), debounce);
  };

  const handleEnter = (e) => {
    if (timer.current) clearTimeout(timer.current);
    fire(e.target.value);
  };

  const empty = (
    <div className="omada-search-empty">
      <AntEmpty2 image={AntEmpty2.PRESENTED_IMAGE_SIMPLE} description={t('search.noData')} />
    </div>
  );

  const cls = ('omada-search ' + className).trim();
  return (
    <AntAutoComplete
      className={cls}
      style={{ width }}
      options={options}
      value={value}
      open={open && !disabled}
      onDropdownVisibleChange={(o) => setOpen(o && !!value)}
      onChange={handleChange}
      onSelect={(v, opt) => { setValue(v); setOpen(false); if (onSelect) onSelect(v, opt); }}
      disabled={disabled}
      notFoundContent={empty}
      popupClassName="omada-search-pop"
      {...rest}
    >
      <AntInput2
        placeholder={placeholder || t('search.ph')}
        allowClear={allowClear}
        disabled={disabled}
        onPressEnter={handleEnter}
        suffix={<window.OmadaIcon name="search" size={16} className="omada-search-icon" />}
      />
    </AntAutoComplete>
  );
}

window.Omada = window.Omada || {};
window.Omada.Search = OmadaSearch;
