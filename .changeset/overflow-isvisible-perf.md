---
"@vuetify/v0": patch
---

perf(Overflow): cache item visibility in a hidden-index set, dropping per-item O(n) rank scans to O(1) (whole-list visibility goes from O(n²) to O(n) per resize)
