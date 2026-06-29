---
"@vuetify/v0": patch
---

fix(Treeview): let keyboard focus reach controls inside items

Tab and Shift+Tab now move focus between a tree node and the focusable controls it contains. Tabbing out of a control advances from that control's own row, and `aria-disabled` controls are skipped.
