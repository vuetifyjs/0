---
"@vuetify/v0": minor
---

feat(Otp): add Otp compound component over createOtp (#519)

`createOtp` has shipped a complete, tested headless primitive for one-time-password /
verification-code values since 1.0.0-alpha.5, but there was no Vue component wrapping
it — consumers had to hand-roll the rendering, focus management, and keyboard/paste
wiring themselves.

Added `Otp.Root`, `Otp.Item`, and `Otp.HiddenInput`, following the same
Root/Item/HiddenInput shape as `Rating` and `Slider`:

- `Otp.Root` creates the `createOtp` context, bridges v-model, renders a `role="group"`
  container with a locale-driven default `aria-label` ("Verification code"), and tracks
  each `Otp.Item`'s element so items can move focus between each other.
- `Otp.Item` renders one character box (`<input maxlength="1" autocomplete="one-time-code">`
  by default). Typing a pattern-accepted character auto-advances focus to the next box;
  Backspace on an empty box moves focus back and clears the previous box; arrow keys move
  focus directly between boxes; pasting distributes the clipboard text across boxes
  starting at the box it was pasted into (`createOtp.distribute`), matching what
  `maxlength` would otherwise silently truncate. Each box gets its own
  `aria-label` ("Digit N of length").
- `Otp.HiddenInput` mirrors `Rating.HiddenInput` — auto-rendered when `name` is set, for
  native form submission.

Registered in the advisory a11y sweep (`packages/0/src/components/fixtures/Otp.vue`) —
clean, no axe violations. Bumped `Otp`'s entry in `maturity.json` from `draft` to
`preview`.
