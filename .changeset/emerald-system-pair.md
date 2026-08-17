---
'@paper/emerald': minor
---

feat(emerald): register emerald-light / emerald-dark and follow the OS

`createEmeraldPlugin` defaults `system: { light: 'emerald-light', dark: 'emerald-dark' }`.
The light theme id is now `emerald-light` (`data-theme="emerald"` is gone).
Tokens and `--emerald-*` are unchanged.
