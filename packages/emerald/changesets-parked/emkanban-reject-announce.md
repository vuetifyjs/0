---
'@paper/emerald': patch
---

fix(EmKanban): announce rejected drops instead of leaving the live region stale

A drop gated by `disabled`, `accept`, or an unknown id used to bail silently,
so keyboard and screen-reader users still heard the pickup message. The board
now announces "Move not allowed, the card stayed where it was."
