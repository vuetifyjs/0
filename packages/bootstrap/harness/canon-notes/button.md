# button

No variant: class `btn`. Variant `solid`, `outline`, `subtle`, `link`, or `text`: `btn-{variant}` and not also `btn`. On this pin those faces share one selector group with `.btn`.

`icon` with no variant is `btn-icon` alone. `icon` with a variant adds `btn-icon`. Sizes `xs`, `sm`, `lg` add `btn-xs`, `btn-sm`, `btn-lg`. `theme` adds `theme-{theme}`. `active` adds `.active`.

`href` renders `a` with `role="button"`. A disabled button uses the native `disabled` attribute and omits `aria-disabled`. A disabled anchor keeps `href`, adds `.disabled`, `aria-disabled="true"`, and `tabindex="-1"`. `aria-current="page"` only on an active anchor. `type` defaults to `button` and is omitted on an anchor.

Not v0 Button. That component would add classes this pin does not use.
