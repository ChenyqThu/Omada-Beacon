---
name: omada-design
description: Use this skill to generate well-branded interfaces and assets for TP-Link Omada (enterprise networking & surveillance console), either for production or throwaway prototypes/mocks/decks. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read the `README.md` file within this skill, then `colors_and_type.css` for tokens. Browse `assets/` for the brand marks and `ui_kits/omada-console/` for ready-made React components (TopBar, Sidebar, Dashboard, Devices table, Login screen, plus base controls in `components.jsx`).

If creating visual artifacts (slides, mocks, throwaway prototypes, etc.) copy assets out and create static HTML files for the user to view. Pull in `colors_and_type.css` via `<link>` and load Manrope from Google Fonts. Brand chrome should always carry the Omada green (`#00A870`) and the white Omada wordmark on top-bars; never invent a different primary colour.

If working on production code, you can copy assets and read the rules in `README.md` to become an expert in designing with this brand. The voice is technical and direct — second-person imperative, no emoji, no marketing-speak, sentence case in product chrome, Title Case for page/tab titles.

If the user invokes this skill without any other guidance, ask them what they want to build or design, ask a few sharp questions (which product surface — cloud console / PRO / VIGI? which screen? marketing or in-product? dark or light?), and act as an expert designer who outputs HTML artifacts *or* production code, depending on the need.
