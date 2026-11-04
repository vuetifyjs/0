Border is `div.spinner-border` with `role="status"` and a `.visually-hidden` label. The default label is "Loading". The pin's border sample uses "Loading…"; the component contract is "Loading".

`grow` switches the root class to `spinner-grow`. The pin never puts `spinner-border` and `spinner-grow` on the same element. `small` adds `spinner-sm` on that div.

`variant="rotate"` renders the separate `svg.bi.spinner-rotate` from the pin (its own spinner, with the eight spokes). It does not add `spinner-rotate` onto `.spinner-border`. The pin's svg has only path children, so the accessible name is `aria-label` — the same "Loading" string, or `Spinner.label` — and the default slot does not render on that branch. The pin sets no width on that svg. `width` and `height` are fallthrough attributes (`1em`), not component props, so the fixture stays attribute-free. Color (`fg-primary` and similar) stays a consumer class.
