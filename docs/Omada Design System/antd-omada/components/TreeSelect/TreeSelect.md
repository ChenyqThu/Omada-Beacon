# TreeSelect — `Omada.TreeSelect`

Thin wrapper over antd `TreeSelect` — a `Select` whose dropdown is a `Tree`. Used for the "Assign to Site" picker. Adds the OmadaIcon chevron suffix, the rotating tree switcher (shared with `Omada.Tree` via `window.omadaSwitcherIcon`), 4px control radius, and the green selected-node tint. Single + `treeCheckable` multiple, search, clearable.

**Figma:** TreeSelect 树选择 (page node `43:34732`) — control matches Select 选择器; dropdown matches the Tree node rows (32px, green selected tint).

| Prop | Type | Default | Notes |
|---|---|---|---|
| `treeData` | `array` | — | antd shape `{ value, title, children }`. |
| `treeCheckable` | `boolean` | — | Checkbox multi-select; pair with `showCheckedStrategy`. |
| `showSearch` | `boolean` | — | Set `treeNodeFilterProp="title"` to search titles. |
| `suffixIcon` | `node` | OmadaIcon `chevron-down` | Pass `null` to drop it. |
| `switcherIcon` | `fn` | `window.omadaSwitcherIcon` | Rotating chevron. |
| …rest | — | — | All antd `TreeSelect` props forwarded. |

Statics forwarded: `TreeNode`, `SHOW_PARENT`, `SHOW_CHILD`, `SHOW_ALL`.

## Theming
- Control radius/height → `omada-theme.js` `components.Select`; node tints → `components.TreeSelect` (light + dark).
- Dropdown shadow → `.ant-select-dropdown` rule in `omada-overrides.css`.

## Do / Don't
- ✅ Use `maxTagCount="responsive"` so multi-select tags collapse instead of wrapping.
- ✅ Localize titles + placeholders via `window.t()`.
- ❌ Don't restyle the dropdown per language — CJK falls back through the font token.
