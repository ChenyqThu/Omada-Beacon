# BackupRestore

Configuration-backup list, newest first: name · auto/manual chip · locale-formatted timestamp · size. Per-row Download (client-side `.cfg` blob stub) and Restore behind a danger Popconfirm — confirming runs a ~1.6 s restoring progress fill then a green "restored from" banner (auto-dismisses). "Back up now" spins ~1.2 s and prepends a manual entry timestamped now; "Upload backup" is a labelled stub.

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `backups` | `{id, name, type, ts, size}[]` | 3-entry demo set | `name` starting with `bkr.` is an i18n key; `type` is `auto\|manual` |
| `className` | `string` | — | merged onto the root |

## Behaviour

- Timestamps render via `toLocaleString` with `zh-CN` / `en-US` from the active language.
- Only one restore can run at a time; other Restore buttons disable while it runs.
- All timers cleaned up on unmount.

## Figma

No dedicated frame — list rows follow CertManager, the banner follows MaintenanceBanner's success tone. Distinct from CertManager (credential inventory) and DataExport (table data export).
