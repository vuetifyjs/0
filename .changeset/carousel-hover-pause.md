---
"@vuetify/v0": patch
---

fix(Carousel): hovering pauses autoplay until the pointer leaves

Hovering the slides, arrows, dots, or progress pauses rotation and leaving resumes it. A play button in the root still starts rotation while the pointer is on it. A Stop press, a pause() call, or keyboard focus inside the carousel keeps it from resuming.
