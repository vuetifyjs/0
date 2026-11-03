---
"@vuetify/v0": patch
---

fix(Breadcrumbs): widths of removed crumbs no longer count toward overflow

Replacing or shortening the trail drops the widths of the crumbs and dividers that left, so the ellipsis no longer appears when the remaining crumbs fit.
