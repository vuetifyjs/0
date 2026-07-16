---
"@vuetify/v0": patch
---

fix(Carousel): pause autoplay while keyboard focus is inside the carousel (#625)

Moving focus into the carousel now pauses auto-rotation and moving focus out resumes it, mirroring the existing pointer/touch behavior and satisfying WCAG 2.2.2 (Pause, Stop, Hide).
