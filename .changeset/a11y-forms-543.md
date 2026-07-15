---
'@vuetify/v0': patch
---

fix(Switch,Form,Slider): correct ARIA states for mixed, native validation, and grouped form controls (#543)

- `Switch.Root` and `Switch.SelectAll` no longer emit the spec-invalid `aria-checked="mixed"`; the value is clamped to `false` while indeterminate, so screen readers announce a valid switch state. Style indeterminate switches with `data-state="indeterminate"` as before.
- `Switch.Thumb` and `Switch.Track` are now marked `aria-hidden="true"`, hiding the decorative visuals from assistive technology.
- `Form.Root` now renders `novalidate` by default, so the browser's native constraint popups no longer block submit before v0's async validation runs. Opt back into native constraint validation with `:novalidate="false"`.
- `Slider.Root` now exposes `role="group"` plus optional `label` / `ariaLabelledby` props, giving multi-thumb sliders an accessible group name.
