---
"@vuetify/v0": minor
---

feat(createTimePicker): add a segmented time value (#1161)

`createTimePicker` keeps a time as separate hour, minute, and optional second fields. The value is a 24-hour `HH:mm` string, or `HH:mm:ss` when `seconds` is on, and it stays null until every enabled field is set. `hourCycle: 'h12'` shows the hour as 1–12 with an AM/PM period while the stored hour stays 24-hour.

`hourStep`, `minuteStep`, and `secondStep` keep each field on the multiples of its step. `step` moves a field by a signed number of intervals and wraps at either end, `commit` sets a field to the nearest multiple without wrapping, and `grid` reports the lowest value, highest value, and step a field can show. A complete value outside `min` and `max` moves to the nearest time inside them that is on every field's step, so `minuteStep: 15` with `min: '10:07'` starts at `10:15`. When no such time lies between the bounds, the value is clamped to the bound itself.

The initial value is normalized when the picker is created, and a string written to `value` later is normalized before the next flush and written back in canonical form. A string that is not a valid time empties the fields and logs a warning in development. When the model's owner refuses a value the picker wrote, the fields take the model's value as given and the picker writes nothing more; a value the owner substitutes is normalized and written back once. `display` reports the time the fields show. While `disabled` or `readonly` is set, `commit`, `step`, and `clear` do nothing and the picker never writes `value`.

Call it inside a component `setup` or an `effectScope`; stopping the scope disposes the picker.
