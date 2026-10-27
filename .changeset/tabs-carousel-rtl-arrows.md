---
"@vuetify/v0": patch
---

fix(Tabs): reverse Arrow Left/Right for horizontal tabs and carousel indicators in right-to-left layouts

Under `dir="rtl"` on the document or an ancestor, Arrow Right now moves to the previous tab or indicator dot and Arrow Left to the next, matching the visual order. Vertical orientation is unchanged.
