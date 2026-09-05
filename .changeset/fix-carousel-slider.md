---
"@vuetify/v0": patch
---

fix(Carousel): start autoplay automatically on mount (#978)

fix(Slider): prevent thumb overflow at min/max positions (#978)

When `autoplay > 0`, the carousel timer now starts automatically on mount. Consumers no longer need to call `play()` manually.

Slider thumbs now use CSS `calc()` positioning with `--v0-slider-thumb-offset` variable (defaults to 0px) to keep thumbs within track bounds. Set this variable to half your thumb width to prevent overflow.
