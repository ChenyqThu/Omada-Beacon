/* ────────────────────────────────────────────────────────────────────────
   components/Carousel/Carousel.jsx — OmadaCarousel

   Thin wrapper over antd <Carousel> for "what's new" panels, onboarding tips
   and device-shot galleries. antd handles the slide engine; we add only:
     - the `omada-carousel` class so the dot rail goes brand-green and the
       prev/next arrows pick up the Omada pill-button styling (light + dark
       twins in omada-overrides.css)
     - sensible defaults: dots on, arrows on, slide effect — all overridable
   Everything else (autoplay, autoplaySpeed, effect 'scrollx'|'fade', dotPosition,
   afterChange, beforeChange, infinite, draggable) is forwarded. A ref is
   forwarded so callers can drive .next() / .prev() / .goTo().

   No dedicated Figma frame (antd primitive). Matched against the Card +
   Image gallery specs (Card 25331:85805, Image 43:34769-adjacent).
   Exports: window.Omada.Carousel
   ──────────────────────────────────────────────────────────────────────── */
(function () {
  const { Carousel: AntCarousel } = window.antd;

  const OmadaCarousel = React.forwardRef(function OmadaCarousel(props, ref) {
    const className = props.className || '';
    const arrows = props.arrows !== undefined ? props.arrows : true;
    const dots = props.dots !== undefined ? props.dots : true;
    const rest = Object.assign({}, props);
    delete rest.className; delete rest.arrows; delete rest.dots;
    const cls = ['omada-carousel', className].filter(Boolean).join(' ');
    return <AntCarousel ref={ref} className={cls} arrows={arrows} dots={dots} {...rest} />;
  });

  window.Omada = window.Omada || {};
  window.Omada.Carousel = OmadaCarousel;
})();
