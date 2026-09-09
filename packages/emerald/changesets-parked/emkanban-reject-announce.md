---
'@paper/emerald': patch
---

fix(EmKanban): announce rejected drops instead of leaving the live region stale

Rejected drops now announce "Move not allowed, the card stayed where it was."
instead of leaving the pickup line in the live region with no new feedback.
