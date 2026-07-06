/* ────────────────────────────────────────────────────────────────────────
   components/Select/Select.jsx — OmadaSelect

   Thin wrapper over antd Select. Swaps the default arrow for the Omada
   chevron (OmadaIcon "chevron-down") for brand consistency, and forwards
   everything else. Option-selected / active colours come from
   omada-theme.js → components.Select (light + dark).

   Exports: window.Omada.Select  (with .Option .OptGroup attached)
   ──────────────────────────────────────────────────────────────────────── */

const { Select: AntSelect } = window.antd;

function OmadaSelect({ suffixIcon, ...rest }) {
  delete rest.suffixIcon;
  const arrow = suffixIcon !== undefined
    ? suffixIcon
    : (window.OmadaIcon
        ? <window.OmadaIcon name="chevron-down" size={14} style={{ color: 'var(--om-ph,#999)' }} />
        : undefined);
  return <AntSelect suffixIcon={arrow} {...rest} />;
}

OmadaSelect.Option   = AntSelect.Option;
OmadaSelect.OptGroup = AntSelect.OptGroup;

window.Omada = window.Omada || {};
window.Omada.Select = OmadaSelect;
