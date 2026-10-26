---
"@vuetify/v0": patch
---

fix(toElement): resolve a component with a fragment root (several root nodes, or leading text or comments) to its first root Element instead of returning a text anchor, and return `undefined` for comment or text roots
