---
"@vuetify/v0": minor
---

feat(Otp): add Otp compound component over createOtp (#519)

Adds `Otp.Root`, `Otp.Item`, and `Otp.HiddenInput` for one-time-password /
verification-code entry. Root bridges v-model, exposes a `role="group"` with a
locale-driven default accessible name, and auto-renders a hidden input when
`name` is set. Each Item is a single character box (`autocomplete="one-time-code"`)
that auto-advances on input, moves back on Backspace of an empty box, supports
arrow-key movement, and distributes pasted or autofilled text across boxes.
`@complete` fires when the code fills. Reject-and-retry lives on `createOtp`'s
`onComplete` option.
Root slots an `items` array derived from `length` (same pattern as Rating) so
boxes are iterated once instead of repeating the count in `v-for`.
