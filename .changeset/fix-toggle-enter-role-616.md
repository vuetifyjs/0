---
"@vuetify/v0": patch
---

fix(Toggle): add Enter key support and `role="button"` for non-native `as` elements (#636)

`ToggleRoot`'s `onKeydown` only handled Space, so a `Toggle` rendered as a non-native element (`as="div"`, `as="span"`) could be focused but not activated with Enter. It also never emitted `role="button"` for non-native elements, so some assistive technology announced the implicit tag role instead. Both are fixed: Enter now toggles alongside Space, and `role="button"` is set whenever `as !== 'button'`.
