# alert

`div.alert` with `role="alert"`, `aria-live="assertive"`, and `aria-atomic="true"` (v0 `Alert`, renderless). `v-model` defaults to `true`. `theme` adds `theme-{theme}`.

Mount and leave go through `usePresence`. Closing sets `.hiding` and unmounts after 150ms (`--bs-alert-transition-duration: .15s` on the pin). `instant` adds `.alert-instant` and unmounts in the same turn. `prefers-reduced-motion: reduce` does too. Opening again stops the timer and cancels the leave.

The dismiss control is a consumer `BClose`. This component does not listen for it. No `data-bs-dismiss`.

Do not wrap the root in `v-if` bound to the same model. That unmounts before the fade.
