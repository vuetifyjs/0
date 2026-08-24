---
'@vuetify/v0': minor
---

feat(usePopover): ship a first-party floating-ui adapter

CSS anchor positioning is still the default and still zero-dependency.
For Firefox ESR and Safari before 26 — or any consumer who already
wants a JS engine — import `FloatingUIPopoverAdapter` from
`@vuetify/v0/popover/adapters/floating-ui` and pass it as `adapter`.
The subpath is the only place `@floating-ui/dom` is reachable; install
it as a peer (`>=1.8.0`). `positionTry` is ignored — `flip()` covers
overflow. Override the default middleware (`offset(8)`, `flip()`,
`shift({ padding: 8 })`) via the constructor.
