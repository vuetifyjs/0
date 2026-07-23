---
"@vuetify/v0": patch
---

fix(Snackbar): SnackbarPortal creates a stacking context so its z-index takes effect (#602)

The teleported snackbar region applied its stack z-index to a `position: static` element, which CSS ignores — a body-fallback snackbar could render behind positioned page chrome regardless of its z-index. `SnackbarPortal` now sets `position: relative` alongside the z-index (visually neutral, no offsets) so the stacking context is established. `Portal`'s `zIndex` slot prop is now documented to require a positioned element.
