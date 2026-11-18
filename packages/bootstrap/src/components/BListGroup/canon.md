`ul.list-group` > `li.list-group-item` by default. `flush` adds `list-group-flush`. `horizontal` adds `list-group-horizontal` only — the pin's `md:list-group-horizontal` is a consumer class, not a prop. `numbered` renders `ol.list-group.list-group-numbered`.

Action items are `button.list-group-item.list-group-item-action` (`action`) or `a.list-group-item.list-group-item-action` (`href`). Put those in `as="div"`, matching the pin. `.active` sets `aria-current="true"`. A disabled button uses the `disabled` attribute. A disabled link uses `.disabled` and `aria-disabled="true"`.

`selectable` plus `v-model` stores the active item id (`value`, or `useId()` when omitted). Without `selectable`, `active` is presentational and the model is left alone.
