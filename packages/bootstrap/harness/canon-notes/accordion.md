# accordion

Rendered root is `div.accordion`. `theme` adds `theme-{theme}`. `small` adds `accordion-sm`. Flush and gap are not props; pass those classes yourself.

Each item is `details.accordion-item`. `open` maps to the native open attribute and is not a v-model. The header is `summary.accordion-header` plus the chevron. The chevron SVG is the pin's markup (`accordion-icon`, path `m2 5 6 6 6-6`). The body is `div.accordion-body`.

`exclusive` defaults to true and sets the same `name` on every details. The name is the `name` prop or `useId()`. `exclusive` false omits `name`, so several items can be open.

There is no click handler. The browser toggles `details`.
