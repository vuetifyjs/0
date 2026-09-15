---
"@paper/genesis": patch
---

fix(GnActionButton): use v0 Tooltip instead of native title

Docs toolbar actions (copy, reset, playground, bin) now show the themed tooltip on hover and keyboard focus, and share the app's tooltip delay region. The `title` prop is unchanged.
