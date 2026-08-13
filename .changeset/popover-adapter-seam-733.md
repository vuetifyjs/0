---
'@vuetify/v0': minor
---

feat(usePopover): add a pluggable positioning-adapter seam

`usePopover` had exactly one positioning implementation - CSS anchor
positioning, hard-coded, with no way to supply another. CSS anchor
positioning isn't available in Firefox ESR or pre-26 Safari; when the
browser doesn't support it, the emitted `position-area` /
`position-try-fallbacks` properties are silently ignored and content
renders unanchored at `position: fixed`, pinned to the viewport
origin. There was also no path for a consumer who wants a JS
positioning library (floating-ui, Popper, or their own) - not as a
fallback, not as an opt-in.

`usePopover` now accepts an `adapter: PopoverAdapter` option,
following the same abstract-class adapter pattern already used by
`useLogger`, `useLocale`, and `useStorage`. `V0PopoverAdapter` (the
default) reproduces today's CSS anchor-positioning output byte-for-byte
- no consumer's build changes, no bundle-size delta, no new dependency.
`@vuetify/v0` ships no JS-engine adapter itself: the deliverable is the
contract, not an implementation of it.

The adapter's `setup()` context now also carries the previously-missing
activator element - a new `attachAnchor()` (companion to the existing
`attach()`) registers it - so a JS engine can measure both the
reference and floating elements, plus a normalized `{ side, align }`
placement descriptor derived from `positionArea` (with the raw CSS
value always available as an escape hatch).

`Popover.Root`, `Tooltip.Root`, `Select.Root`, and `createCombobox` all
thread an `adapter` option through to their underlying `usePopover()`
call (`positionAdapter` on `createCombobox`, since it already has its
own `adapter` option for query filtering).

See the "Bring your own positioning engine" section on the `usePopover`
docs page for a worked (not shipped) floating-ui adapter example.
