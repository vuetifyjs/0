---
"@vuetify/v0": patch
---

fix(Menu): a repeated typeahead letter still accepts the next character

Repeating a letter moves to the next match. A different letter before the pause searches from that one letter.

A click listener on a menu item runs before the item's own action, including when the item is disabled.
