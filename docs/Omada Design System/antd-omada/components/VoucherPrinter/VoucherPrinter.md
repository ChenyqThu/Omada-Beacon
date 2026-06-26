# VoucherPrinter — `window.Omada.VoucherPrinter`

A **hotspot voucher batch** panel: batch header with duration / data-limit / network meta and an unused–used tally, a Segmented toggle between a **code grid** (ticket chips, used ones dimmed + struck) and a **print sheet** preview (miniature A4 of `perSheet` tickets: network · code · validity), and a print CTA running an idle → printing → queued stub.

Distinct from **LicenseCard** (Batch 26 — a single entitlement card): this is a bulk credential batch with a physical print artefact.

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `codes` | `[{ code, used? }]` | `[]` | The batch. |
| `batchName` | string | — | Header title. |
| `duration` / `dataLimit` / `network` | string | — | Meta chips; `network` + `duration` also print on tickets. |
| `perSheet` | number | `12` | Tickets per A4 sheet. |
| `onPrint` | `(codes: string[]) => void` | — | Called with unused codes when the stub completes. |

## Behaviour
- Sheet preview shows the first sheet only; the caption localizes "A4 · {n} per sheet · {s} sheets".
- Codes render LTR mono in RTL.

## Figma
No voucher frame exists in the file (verified against the mount); nearest context is the hotspot/portal quick-action icon SYMBOL `25947:12260` ("Property 1=portal"). Ticket anatomy follows Card/Tag tokens.
