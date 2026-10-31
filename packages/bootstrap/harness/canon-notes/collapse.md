# collapse

Rendered root is `div.collapse`. `.show` follows the boolean v-model. There is no `.collapsing` class and no height animation.

`horizontal` adds `.collapse-horizontal`. The id is `useId()` unless `id` is passed, so a button outside can set `aria-controls`.

No `data-bs-toggle`, `data-bs-target`, or dismiss attributes. Keyboard behavior belongs to the consumer's button.

This is not v0 Collapsible. That primitive would change the tag and the classes Bootstrap's stylesheet expects. The panel is a div this component renders itself.
