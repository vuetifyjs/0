# BStrength

- Presentational. The consumer passes `value`. This component does not score a password. No zxcvbn. No `createRating`.
- `variant="segments"` (default) is `div.strength` with four `div.strength-segment`. Values `0`–`4` are the count of leading `.active` segments. Values above `4` are a percentage of 100 mapped onto those four.
- `data-bs-strength` is the level name: `weak`, `fair`, `good`, `strong`. It is omitted at 0. A bare attribute (no value) is the bundle's scorer. This component sets the level and does not score.
- `variant="bar"` is `div.strength-bar`. The fill length is `--bs-strength-width` on that element. The host stays `width: 100%`. The level attribute supplies the color.
- `text` renders `span.strength-text` as a sibling. Omit it and the span is absent.
