# BNavbar

Matches the pinned navbar examples, with these deltas:

- No `data-bs-toggle` and no `data-bs-target`. The toggler opens the drawer.
- The toggler is `BButton` `icon` plus `navbar-toggler`. Its name is `label`, or `Navbar.toggle`, or "Toggle navigation".
- `aria-controls` is the dialog id. `BDrawer` gets that id from Dialog. The navbar does not mint a second one.
- No `.navbar-collapse`. The pin's responsive menu is `dialog.drawer`, rendered by `BDrawer`.
- Expand classes are `navbar-expand` and colon utilities (`sm:navbar-expand`, `md:navbar-expand`, `lg:navbar-expand`). Not `navbar-expand-md`.
- No `data-bs-theme`. `bg-*` and `fg-*` stay on the consumer.
- `BNavbar.Nav` is a slot wrapper (`navbar-nav` only). It does not implement nav items.
- The dialog's id, `role`, and `aria-modal` come from `BDrawer` / Dialog. Conform ignores additive `aria-*`, `data-*`, `role`, `tabindex`, `id`, plus `open` and `style`.
