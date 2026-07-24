---
"@vuetify/v0": patch
---

fix(Carousel): add `onKeydown` to `Next`/`Previous` for non-native element keyboard activation (#639)

`Carousel.Next` and `Carousel.Previous` only exposed `onClick` in their `attrs` slot props. When rendered with `as="div"` (or any non-button element), browsers do not synthesize click events from Enter or Space, silently breaking keyboard navigation. Both now wire an `onKeydown` handler that calls the existing click logic on Enter/Space, matching the pattern already used by `CarouselIndicator`.
