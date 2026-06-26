/* ────────────────────────────────────────────────────────────────────────
   components/Card/Card.jsx — OmadaCard

   The content container. The Figma "Card 卡片" page fixes the look:
   8px corner radius, white surface, 1px #ECECEC hairline border, no shadow
   by default; the dark twin is #1A1A1A on a rgba(255,255,255,0.1) border.
   All of that is already in the Card token block (omada-theme.js) + the
   surface/border tokens, so this is a thin antd <Card> wrapper that only
   adds an Omada `variant` convenience and forwards everything.

     variant:
       'outlined' (default) — hairline border, flat
       'shadow'             — borderless, elevated with the Omada md shadow
       'filled'             — grey-50 surface, no border (section grouping)

   Re-exports antd statics: Card.Grid, Card.Meta.

   Figma: Card 卡片 node 25331:86622 (light) · dark twin 25331:86633 region.
   Exports: window.Omada.Card
   ──────────────────────────────────────────────────────────────────────── */
(function () {
  const { Card: AntCard } = window.antd;

  function OmadaCard({ variant = 'outlined', className = '', children, ...rest }) {
    const map = {
      outlined: { variant: 'outlined' },
      shadow:   { variant: 'borderless' },
      filled:   { variant: 'borderless' },
    }[variant] || { variant: 'outlined' };

    const cls = ['omada-card', 'omada-card-' + variant, className].filter(Boolean).join(' ');
    return <AntCard {...map} className={cls} {...rest}>{children}</AntCard>;
  }

  // Forward antd statics so callers can use <Card.Grid>/<Card.Meta>.
  OmadaCard.Grid = AntCard.Grid;
  OmadaCard.Meta = AntCard.Meta;

  window.Omada = window.Omada || {};
  window.Omada.Card = OmadaCard;
})();
