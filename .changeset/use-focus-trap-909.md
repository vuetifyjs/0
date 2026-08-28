---
"@vuetify/v0": minor
---

feat(useFocusTrap): confine Tab and Shift+Tab to a root element

A `<dialog>` opened with `showModal()` is trapped by the browser. Anything else — a `Dialog.Content` rendered `as="div"`, a drawer, a command palette — had to hand-roll containment. `useFocusTrap` is that loop, once:

```ts
const panel = useTemplateRef<HTMLElement>('panel')

useFocusTrap(panel, { active: isOpen })
```

Tab and Shift+Tab wrap at the first and last tabbable descendant, focus moves into the root on activate, and the previously focused element gets it back on deactivate. Pass `initial` to choose where focus lands (or `false` to skip autofocus), `restore: false` to leave focus alone on release, and `onEscape` to opt into Escape handling — the trap never closes anything itself.

The boundary is computed the way the browser computes tab order, not by element identity: a radio group counts as one stop (the checked member, or the first when none is checked), and focus parked on a script-focusable `tabindex="-1"` descendant past the last stop still wraps rather than walking out. `aria-disabled` controls stay in the tab order per APG, so they remain real boundaries.

The keydown listener is bound to `document` in the capture phase rather than to the root, so focus that escaped the subtree — a backdrop click that blurred to `<body>`, a stray programmatic `focus()` — is recovered on the next Tab instead of leaving the trap permanently dead. Only the boundaries are intercepted, so a nested widget keeps its own Tab handling. Containment pierces open shadow roots; discovery does not, which is documented along with the `<iframe>` limitation.

Give the root `tabindex="-1"` if it can ever hold zero tabbable descendants — the trap focuses the root as a fallback, and v0 does not write attributes onto elements it did not render.
