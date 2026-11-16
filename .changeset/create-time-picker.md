---
"@vuetify/v0": minor
---

feat(createTimePicker): add a segmented time value (#1161)

`createTimePicker` keeps a time as separate hour, minute, and optional second fields. The value is a 24-hour `HH:mm` string, or `HH:mm:ss` when `seconds` is on, and it stays null until every enabled field is set. `hourCycle: 'h12'` shows the hour as 1–12 with an AM/PM period while the stored hour stays 24-hour.

`hourStep`, `minuteStep`, and `secondStep` keep each field on the multiples of its step. `step` moves a field by a signed number of intervals and wraps at either end, `commit` sets a field to the nearest multiple without wrapping, and `grid` reports the lowest value, highest value, and step a field can show. A complete value clamps into `min` and `max`, and a bound wins over the step.

A string written to `value` is normalized and written back in canonical form. A string that is not a valid time empties the fields and logs a warning in development. While `disabled` or `readonly` is set, `commit`, `step`, and `clear` do nothing and the picker never writes `value`.
