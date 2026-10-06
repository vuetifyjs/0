---
"@vuetify/v0": patch
---

fix(Pagination): fit buttons of different widths and grow with the container

Responsive sizing no longer assumes every button matches the first one. Controls and page buttons are measured separately, wider page numbers no longer overflow after navigating, and a root in a flex row shows more pages when its container grows. In a flex row the root still needs `min-width: 0` to shrink.
