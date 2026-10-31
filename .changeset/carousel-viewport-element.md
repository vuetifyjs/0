---
"@vuetify/v0": patch
---

fix(Carousel): expose the viewport element

Carousel.Viewport exposes its scroll element, so a template ref can listen for scrollend.
