# BToggler

- A click toggles `value` on the root, or on `document.getElementById(target)` when `target` is set. A leading `#` is stripped. The pin's class selector (`data-bs-target=".foo"`) is not supported. `target` is an id.
- `attribute` defaults to `class`. That path toggles one class token and sets `aria-pressed` from whether the token is present. Any other attribute name is added with `value` or removed. That path does not set `aria-pressed`.
- The handler is the component `@click`. Do not bind it from a composable.
- This is not a checkbox and not `Toggle`. Do not emit `data-bs-toggle`, `data-bs-value`, `data-bs-attribute`, or `data-bs-target`.
