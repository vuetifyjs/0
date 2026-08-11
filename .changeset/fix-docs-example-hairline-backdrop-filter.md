---
"@paper/genesis": patch
---

fix(GnDocsExample): keep the card's bottom hairline from being eaten by backdrop-filter

Consumers apply a `backdrop-filter` to the example's bars (the docs glass treatment), which composites that child into its own layer. The layer pixel-snaps outward and paints over the card's own `border-bottom` whenever the card's bottom edge lands below a half-pixel — so the bottom border disappeared on some examples and not others, and changing any earlier example's height reshuffled which ones broke. `GnDocsExample` now draws the hairline on the last child instead: a border on the child paints above its own filter, so it survives at any sub-pixel offset. A `-1px` margin keeps it on the row the card's border occupied, leaving the card's height and corner radii unchanged.
