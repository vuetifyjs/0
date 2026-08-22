---
"@paper/bulma": minor
---

feat(bulma): Vue behavior for Bulma's markup (#760)

`@paper/bulma` is a compat design system: components render the markup and classes [bulma.io](https://bulma.io/documentation/) documents, against the `bulma.css` you already load. There is no theme, no class prefix, and no CSS in the package. `bulma` is an optional peer.

What ships is the JavaScript Bulma never did — open state, click-outside, Escape, focus, and form wiring — for the documented component, element, and form families, plus `BuNumberField` composed from form addons.
