---
"@paper/genesis": patch
---

fix(GnDocsExample): pad the expanded example description so the expand pill clears the prose — the centered pill is absolutely positioned across the bottom border and was clipping the last line of fully-expanded descriptions. Bottom padding is reserved only in the expanded state, so the collapsed fade is unchanged.
