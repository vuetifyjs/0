---
"@vuetify/v0": minor
---

fix(Breadcrumbs): expose collapsed-items count and `aria-expanded` on the expander (#634)

Collapsed breadcrumb items were invisible to screen readers: the ellipsis hardcoded `aria-hidden="true"` and was non-interactive, so truncated levels were unreachable by assistive technology with no disclosure path to reveal them. `BreadcrumbsEllipsis` now accepts an `interactive` prop that turns it into a disclosure toggle exposing `aria-expanded`, a count-aware `aria-label` (e.g. "Show 3 more breadcrumbs"), and click/Enter/Space activation.
