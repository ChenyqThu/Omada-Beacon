# Handoff Prompt — Omada × antd 6 component library

Copy the block below into a **new session** in this same project. Replace `<BATCH>` with the batch you want (e.g. "Batch 1 — Foundations & primitives"). Everything the new session needs is already in the project; the prompt points it at the right files.

---

## ▼▼▼ COPY FROM HERE ▼▼▼

I'm building the **Omada component library on top of Ant Design 6** (antd@6.4.3, the latest). This is an existing project — the design system and a working token theme already exist. **Do not start from scratch and do not re-derive the design language.** Your job is to implement components per an established spec.

**Read these first, in order:**
1. `antd-omada/COMPONENT_SPEC.md` — the binding implementation standard. Follow it exactly: token-first, thin wrappers (no forks), light + dark + i18n (en/zh) mandatory for every component, the Definition-of-Done checklist, and the batch plan.
2. `antd-omada/omada-theme.js` — the authoritative light + dark token config. Use `window.getOmadaTheme(mode, theme.darkAlgorithm)`. Don't hard-code brand colours.
3. `antd-omada/omada-overrides.css` — the thin global CSS layer (pills, menu accent bar, dark-mode twins). Add to it; mirror every light rule with a `[data-omada-theme="dark"]` rule.
4. `antd-omada/index.html` — the live gallery. It already loads React 18 + Babel + antd 6 UMD + dayjs + Lucide, and has a working **Light/Dark + EN/中文** toolbar. New component demos get mounted here.
5. `README.md` (project root) — Omada brand, voice/content rules, colours, type. `colors_and_type.css` — design tokens.

**The Figma source of truth** is the file "🌟 商用WEB组件库.fig" mounted to the agent VFS (explore with `fig_ls` / `fig_read` / `fig_grep` / `fig_screenshot`). For each component, find its node in the Figma, read the JSX pseudocode (trust it over screenshots), and match metrics/states. If the VFS is NOT mounted in this session, tell me and I'll re-attach it — don't guess at component specs.

**Your task this session: implement `<BATCH>`** from the batch plan in COMPONENT_SPEC.md §6.

**Icons — use the REAL Omada icons, not Lucide.** Pull the actual icon set out of the Figma into `antd-omada/assets/icons/` with `fig_copy_files` (never redraw SVGs by hand). In Batch 1, build `components/Icon/Icon.jsx` (`OmadaIcon`) that renders these by name at 16/20/24 px, driven by `currentColor`, and every component in every batch uses `OmadaIcon` — not the Lucide CDN. The dark-mode brand green is the brightened `#16B981` (already set in the theme — keep it).

For each component in the batch:
- Create `antd-omada/components/<Name>/<Name>.jsx` (thin wrapper, exports to `window.Omada.<Name>`), `<Name>.demo.jsx` (every variant/size/state + a dark row), and `<Name>.md` (props + Figma node id).
- Drive ALL visuals through theme tokens; only touch `omada-overrides.css` for what tokens can't express, and add the dark twin in the same edit.
- Route every user-facing string through `window.t(key, lang)` using `antd-omada/omada-i18n.js` (create it in Batch 1 if it doesn't exist yet). antd's own strings come from `ConfigProvider locale`.
- Mount each demo in `antd-omada/index.html` and add it to the TOC.
- **Verify in all four states: light-EN, light-中文, dark-EN, dark-中文.** Screenshot light + dark for each component before calling it done.

**Workflow:** make a todo list of the components in the batch, build them, then call `done` on `antd-omada/index.html`, fix any console errors, and `fork_verifier_agent` to confirm. Work through the whole batch without stopping unless the Figma VFS is missing or a token decision genuinely needs my call. When finished, give me a 3-line summary + the same handoff prompt pre-filled for the *next* batch.

## ▲▲▲ COPY TO HERE ▲▲▲

---

### Notes for you (the human), not part of the prompt

- **One batch per session** keeps context clean and screenshots focused. The 6 batches are in `COMPONENT_SPEC.md §6`.
- After each session, the agent hands you the next batch's prompt — just paste it into a fresh session.
- If you'd rather the agent pull the **real bespoke Omada icons** out of the Figma — this is now **baked into Batch 1** (the prompt instructs it to extract icons into `antd-omada/assets/icons/` and build `OmadaIcon`; Lucide is dropped once coverage is complete). Nothing extra to add.
- If you want **ProComponents** (`ProTable`/`ProForm`/`ProLayout`), say so in Batch 2/5 — it needs `@ant-design/pro-components` v6 and a slightly different theme hook (`proTheme`), which the agent will set up.
- The gallery uses in-browser Babel (fine for review). For production, the same `.jsx` wrappers compile in a normal Vite/Next build — the only change is swapping `window.antd` destructuring for real `import { ... } from 'antd'` and `window.Omada.X = ...` for `export`.
