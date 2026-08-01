---
"@vuetify/v0": patch
---

fix(Slider): default the thumb's accessible name (#740)

`Slider.Thumb` renders `role="slider"` and read its accessible name only from
the consumer-supplied `ariaLabel`/`ariaLabelledby` props, with no fallback —
so the shape `Slider`'s own `@example` documents shipped a thumb with no name
at all (axe `aria-input-field-name`, serious).

`Slider.Thumb` now falls back to `locale.ti('Slider.label') ?? 'Slider'` when
neither `ariaLabel` nor `ariaLabelledby` is provided, matching the pattern
already used by `Pagination.Root`, `Breadcrumbs.Root` and `Carousel.Item`. A
consumer-supplied `ariaLabel` still wins, and `ariaLabelledby` still suppresses
`aria-label` entirely (previously both attributes could be set at once).
