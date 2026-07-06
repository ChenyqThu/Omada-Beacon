# Carousel — `window.Omada.Carousel`

Thin wrapper over antd `Carousel` for "what's new" panels, onboarding tips and device-shot galleries. Defaults to dots + arrows on; everything is overridable. A `ref` is forwarded for programmatic control.

## Props

| Prop | Type | Notes |
|---|---|---|
| `autoplay` | `boolean` | auto-advance |
| `autoplaySpeed` | `number` | ms between slides (default 3000) |
| `effect` | `'scrollx' \| 'fade'` | transition |
| `dots` | `boolean \| object` | default `true`; brand-green active dot |
| `dotPosition` | `'top' \| 'bottom' \| 'left' \| 'right'` | default `'bottom'` |
| `arrows` | `boolean` | default `true`; Omada pill arrows |
| `infinite` | `boolean` | loop (default `true`) |
| `draggable` | `boolean` | drag to slide |
| `afterChange` / `beforeChange` | `(current) => void` | slide callbacks |
| `className` | `string` | merged after `omada-carousel` |
| …antd `Carousel` props | | forwarded |

## Ref API
`ref.current.next()`, `.prev()`, `.goTo(slide, dontAnimate)`.

## i18n
Slide content via `window.t()` (`carousel.*`).

## Theming
Dot rail (active = brand green), prev/next arrows and the demo "what's new" slide panels live in `omada-overrides.css` (`.omada-carousel …`, `.omada-news-slide …` + dark twins). No brand hex in the JSX/wrapper.

## Figma
No dedicated frame (antd primitive). Matched against **Card `25331:85805`** and the device gallery / Image specs.
