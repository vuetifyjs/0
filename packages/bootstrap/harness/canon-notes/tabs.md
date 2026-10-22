# tabs

Renderless root. `v-model` is the selected value, via `createSingle({ events: true, mandatory: 'force' })` and `useProxyModel`.

`List` is `ul.nav` with `role="tablist"`. Default variant is `nav-tabs`. `pills` is `nav-pills`. `vertical` forces `nav-pills` and `nav-pills-vertical`, and `aria-orientation="vertical"`. Roving orientation is read once at setup.

`Item` is `li.nav-item` > `button.nav-link`. Selected adds `.active`, `aria-selected="true"`. Disabled is the native attribute. Arrow, Home, and End are `useRovingFocus` on the button. Click calls `focus(id)`, which selects.

`Content` is `div.tab-content`. `Panel` is `div.tab-pane`. Selected pane also has `.show.active`, `role="tabpanel"`, and `tabindex="0"`. Panes must be direct children of `.tab-content`. `instant` adds `.tab-pane-instant`.

No `data-bs-toggle` or `data-bs-target`. This is not v0 Tabs.
