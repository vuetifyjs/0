---
"@vuetify/v0": patch
---

fix(Carousel): autoplay stays stopped until play() is called again

Moving keyboard focus into the carousel, or dragging a slide, stops rotation. It does not start again on its own. While rotation is running, the slide announcement region is silent. The default accessible name is "Slides".
