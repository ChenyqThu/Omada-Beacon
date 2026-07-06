# Tour — `Omada.Tour`

Guided onboarding walkthrough — spotlights a target and shows a titled card with prev/next/finish. antd `<Tour>` reads `colorPrimary` for the active indicator + the elevated/mask tokens; the wrapper localizes the buttons and adds an OmadaIcon glyph disc per step title.

| Step prop | Type | Notes |
|---|---|---|
| `iconName` | `string` | OmadaIcon glyph in a green disc before the title. |
| `title` / `description` | `node` | Route through `window.t()`. |
| `target` | `() => HTMLElement` | The element to spotlight. |
| `nextButtonProps` / `prevButtonProps` | `{ children }` | Localized button labels (`tour.next` / `tour.prev` / `tour.finish`). |

Wrapper props: `steps` (mapped), `open`, `onClose` forwarded. **Figma:** the `/Driver` page is a divider card, so Tour is themed to the Omada token language rather than that frame. **i18n:** `tour.*`.
