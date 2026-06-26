# DataExport — `Omada.DataExport`

Turn a table view into a file: **CSV / JSON / clipboard** export over the
DataTable. antd has no export primitive; this composes one and really writes
bytes (Blob download + clipboard), not a mock.

`window.Omada.DataExport` · demo `window.OmadaDemos.DataExport`

## Behaviour
- **Format** — CSV (RFC-4180 quoting: comma/quote/newline fields wrapped, inner
  quotes doubled) or pretty JSON (2-space).
- **Scope** — whole dataset, or only the rows checked in the embedded
  selectable DataTable.
- **Download** — builds a `Blob` with the correct MIME (`text/csv` /
  `application/json`), object-URL + temporary `<a download>`, then revokes.
  Filename = `filename-YYYY-MM-DD.ext`.
- **Copy** — `navigator.clipboard` with an `execCommand` fallback; both confirm
  via an App-context toast.
- **Live preview** — shows the first rows of the real output with row + byte
  count.

## Props
| Prop | Type | Notes |
|---|---|---|
| `columns` | antd column defs | Passed to the table; only columns with a `dataIndex` are serialised (action columns skipped). |
| `data` | `array` | Row objects; each needs a `key`. |
| `filename` | `string` | Base name (date + extension appended). Default `omada-export`. |
| `previewRows` | `number` | Rows shown in the preview pane. Default 4. |

Mount under `OmadaThemeProvider` (the copy/download toasts use `useMessage`).
Strings come from `window.t()` (`dxp.*`).

## Tokens / styling
The code preview reuses the shared dark "snippet" surface (ThemeExport /
PrintExport). Controls + cards are theme-var driven with
`[data-omada-theme="dark"]` twins in `omada-overrides.css`. No hard-coded hex in
the `.jsx`.

## Notes
- Serialises the raw `dataIndex` values, not the column `render` output — export
  reflects data, not presentation.
- For large tables, export reads the full `data` array (not the virtualised DOM)
  — pair with VirtualList for display only.

## Figma
No dedicated node — an export architecture board over the DataTable (Batch 2).
Glyphs are `OmadaIcon` (`file-text` / `braces` / `download` / `copy`).
