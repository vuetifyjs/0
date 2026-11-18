v0 Pagination's model is 1-based (`defineModel` default 1, prop `page` / `modelValue`). This wrapper does not convert it.

The rendered tree is `nav` > `ul.pagination` > `li.page-item` > `a.page-link` (or a link with no `href` when that control is disabled). `.active` and `.disabled` are on the `li`, matching the pin. `aria-current="page"` is on the active link.

`size` is only `sm` or `lg` (`pagination-sm`, `pagination-lg`). The item count is `total`, passed through as v0's `size`. `perPage` defaults to 1, so `total` is the page count. A class on `BPagination` lands on `ul.pagination`, so `justify-content-*` stays a consumer class on the list.

Behavior (select, prev, next, disabled on the ends) is v0 Pagination, renderless, so the Bootstrap elements are the ones in the document. The click updates the page and does not follow `href`. The nav name is `label`, or `Pagination.label`, or `Page navigation`.
