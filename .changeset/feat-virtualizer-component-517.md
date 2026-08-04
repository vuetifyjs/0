---
"@vuetify/v0": minor
---

feat(Virtualizer): add Virtualizer compound component over createVirtual (#517)

`createVirtual` has shipped a complete virtual-scrolling composable (visible-window
rendering, fixed or dynamic item heights, bidirectional scrolling, scroll anchoring
across data changes, edge detection for infinite scroll, iOS momentum/elastic
scrolling) since 0.1.0, but there was no Vue component wrapping it — consumers had to
wire up the scroll container, spacer elements, and resize reporting by hand, exactly
as shown in the composable's own `@example`.

Added `Virtualizer.Root` and `Virtualizer.Item`:

- `Virtualizer.Root` creates the `createVirtual` context, renders the scroll container
  (with a default `tabindex="0"` — a scrollable region needs keyboard access per axe's
  `scrollable-region-focusable` rule) plus the leading/trailing spacer elements that
  reserve space for items scrolled out of view, and provides context to `Item`. The
  default slot receives only the currently visible (+ overscan) items.
- `Virtualizer.Item` wraps a single rendered item and measures its own height via
  `ResizeObserver`, reporting it back to Root's `resize(index, height)` automatically —
  so variable-height content just works without the consumer calling `resize()` by hand.

`Virtualizer.Item` intentionally doesn't bake in `role`/`aria-posinset`/`aria-setsize` —
a bare element without a role fails axe's `aria-allowed-attr` (those attributes require
a role that supports them, e.g. `option`/`row`/`gridcell`), and a headless component
can't know which role fits the consumer's content ahead of time. All passthrough attrs
(including ARIA) already reach the rendered element through the normal `attrs` merge,
so a consumer building a listbox or grid supplies the matching role and posinset/setsize
directly on their `Virtualizer.Item` usage.

Registered in the advisory a11y sweep (`packages/0/src/components/fixtures/Virtualizer.vue`)
— clean, no axe violations (this caught both issues above during development). Bumped
`Virtualizer`'s `maturity.json` entry from `draft` to `preview`.
