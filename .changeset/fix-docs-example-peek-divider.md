---
"@paper/genesis": patch
---

fix(GnDocsExample): restore the preview/code divider in peek mode

Peek examples skip the toggle bar, and the toggle bar is what carried the `border-top` separating the preview from the code pane — so a peek example rendered its preview and its code as one unbroken surface while a non-peek example on the same page showed a divider. On docs pages that interleave the two modes (peek under Usage and Recipes, expandable examples under Examples) the inconsistency reads as every other example missing a border. `GnDocsExample` now draws the divider on `.genesis-docs-example__code` itself when the root carries `data-peek`, so both modes match.
