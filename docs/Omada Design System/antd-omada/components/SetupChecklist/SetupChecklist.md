# SetupChecklist — `window.Omada.SetupChecklist`

A first-run **onboarding checklist**. The empty-state a controller shows when a
site has no devices yet: a titled card with a progress meter and a vertical list
of setup steps, each a status disc + title + hint + one call-to-action. Finish
every required step and the body flips to a success illustration.

Thin composition over antd **Progress** + Omada **Button / Tag / Icon /
Illustration**. Not a fork — all visuals come from tokens; the meter and the
active disc use the brand-green token, with dark twins in `omada-overrides.css`.

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `items` | `Step[]` | `[]` | `{ key, title, desc?, cta?, optional?, done? }`. |
| `onRun` | `(key) => void` | — | Fires when a step CTA is pressed. **Controlled** when present — the parent flips `done`. Omit to let the panel toggle its own copy (uncontrolled). |
| `onSkip` | `(key) => void` | — | Fires when an optional step is skipped. |
| `onDismiss` | `() => void` | — | Fires when the panel is closed (×). |
| `onFinish` | `() => void` | — | Fires from the success-state CTA. |
| `gated` | `boolean` | `true` | When true, only the current step's CTA is enabled; later steps are muted until reached. |
| `title` / `subtitle` | `node` | i18n | Header copy. |
| `finishCta` | `node` | — | Label for the success-state button (omit to hide it). |
| `successScene` | `string` | `'success'` | An `OMADA_ILLUS` scene name for the done state. |

Required progress ignores `optional` and skipped steps; the panel is "done" only
when every **required** step is `done`.

## States

todo · current (accent ring) · done (green check) · optional (tag + Skip) ·
skipped · all-done success · dismissed.

## i18n

All chrome via `window.t()` under the `suc.*` namespace (verified en + zh). Step
copy is passed in by the caller (the demo routes it through `t`).

## Do / Don't

- **Do** keep steps to 3–5 and order them by dependency (adopt before configure).
- **Do** mark genuinely optional steps `optional` so they don't block the meter.
- **Don't** use it as a permanent nav — dismiss it once setup is complete.

## Figma

Controller first-run / empty-site guide — `icon/guide` **25947:13977** + the
"empty / no devices" states **26455:6471**. Recomposed as a checklist; no branded
artwork copied (IP-bound frames stay declined off `tp-link.com`).
