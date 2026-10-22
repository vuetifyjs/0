Do not use v0 Breadcrumbs. Its overflow treatment does not match this markup.

Parts are Root, Item, Link, and Divider. Bulma's breadcrumb is a single file (`BuBreadcrumb.vue` plus a barrel and a browser test). That split is not copied. The pin's divider is a sibling `li.breadcrumb-divider`, so Divider is its own component and the example writes it between items. Nothing inserts a divider after the last item.

The last crumb sets `aria-current="page"` on `li.breadcrumb-item` (`current`) and `.active` on `a.breadcrumb-link` (`active`). An empty divider matches the pin's first sample; "/" and "›" are slot content, as in the later samples. The nav name is `label`, or `locale.ti('Breadcrumb.label')`, or `breadcrumb`.
