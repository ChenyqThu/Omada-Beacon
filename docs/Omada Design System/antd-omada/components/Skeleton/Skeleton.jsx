/* ────────────────────────────────────────────────────────────────────────
   components/Skeleton/Skeleton.jsx — OmadaSkeleton

   Thin wrapper over antd <Skeleton>, matching the Figma "loading 加载" skeleton
   rows: grey #ECECEC blocks at 2–3px radius, the paragraph's last row shorter,
   and an `active` shimmer driven by the per-mode gradient tokens
   (Skeleton.gradientFromColor / gradientToColor in omada-theme.js — light uses
   a dark wash, dark a light wash). `active` defaults on so the shimmer shows.

   Re-exports the static block placeholders (Button / Avatar / Input / Image /
   Node) so callers compose richer loading shells the antd way. Adds only the
   `omada-skeleton` class for any structural nudges; all colour from tokens.

   Split out of the old combined **Loading** section (Batch 11).

   Figma: loading 加载 node 3:26828 (page 43:34762) — skeleton row stack.
   Exports: window.Omada.Skeleton
   ──────────────────────────────────────────────────────────────────────── */

const { Skeleton: AntSkeleton } = window.antd;

function OmadaSkeleton(props) {
  const active = props.active !== undefined ? props.active : true;
  const className = props.className || '';
  const rest = Object.assign({}, props);
  delete rest.active; delete rest.className;
  const cls = ('omada-skeleton ' + className).trim();
  return <AntSkeleton className={cls} active={active} {...rest} />;
}

OmadaSkeleton.Button = AntSkeleton.Button;
OmadaSkeleton.Avatar = AntSkeleton.Avatar;
OmadaSkeleton.Input  = AntSkeleton.Input;
OmadaSkeleton.Image  = AntSkeleton.Image;
OmadaSkeleton.Node   = AntSkeleton.Node;

window.Omada = window.Omada || {};
window.Omada.Skeleton = OmadaSkeleton;
