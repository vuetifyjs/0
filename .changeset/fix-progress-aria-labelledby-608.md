---
"@vuetify/v0": patch
---

fix(Progress): only emit `aria-labelledby` when `Progress.Label` is mounted (#638)

`Progress.Root` unconditionally emitted `aria-labelledby` pointing to a label id even when no `Progress.Label` child was mounted, creating a dangling IDREF that assistive technology could misreport. `aria-labelledby` is now conditional on a label actually being present, and a new `ariaLabel` prop covers the case where no visible label exists but an accessible name is still needed.
