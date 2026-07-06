# Toggles — `Omada.Switch` · `Omada.Checkbox` · `Omada.Radio`

The three boolean/choice controls, wrapped as a tight cluster. All antd props forward through. Sub-components attached: `Checkbox.Group`, `Radio.Group`, `Radio.Button`.

**Figma:** `/Switch`, `/Checkbox`, `/Radio` pages.

## Why these are near-pure passthroughs

antd already renders them exactly to spec **from tokens** (`omada-theme.js`):

- **Switch** — `trackHeight 20`, `handleSize 16` (sm 14/10), checked = brand green; exact 36×20 geometry + handle travel patched in `omada-overrides.css` with a dark twin.
- **Checkbox** — 3px corner radius, brand-green checked/indeterminate.
- **Radio** — 8px dot, brand green; `Radio.Button` solid group uses the green fill.

So the wrappers add no visuals — they exist to keep one consistent `Omada.*` import surface and forward sub-components. Dark mode is handled by `theme.darkAlgorithm` + the token overrides; nothing hard-coded.

## i18n

Option/inline labels are product copy — route through `t()`. The segmented `Radio.Button` values here ("1 h", "24 h") are unit-bearing and identical across locales.

## Do / Don't

- ✅ `<Switch defaultChecked />`, `<Checkbox.Group options={…} />`, `<Radio.Group buttonStyle="solid">`
- ❌ Don't set `style={{background:'#00A870'}}` on the checked track — it's a token.
