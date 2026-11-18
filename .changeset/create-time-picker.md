---
"@vuetify/v0": minor
---

feat(createTimePicker): add a segmented time value (#1161)

`createTimePicker` keeps a time as separate hour, minute, and optional second fields. The value is a 24-hour `HH:mm` string, or `HH:mm:ss` when `seconds` is on, and it stays null until every enabled field has a value. `hourCycle: 'h12'` shows the hour as 1–12 with an AM/PM period while the stored hour stays 24-hour.

`hourStep`, `minuteStep`, and `secondStep` keep each field on the multiples of its step. `step` moves a field by a signed number of intervals and wraps at either end, `commit` sets a field to the nearest multiple without wrapping, and `grid` reports the lowest value, highest value, and step a field can show. A complete value outside `min` and `max` moves to the nearest time inside them that is on every field's step, so `minuteStep: 15` with `min: '10:07'` starts at `10:15`. When no such time lies between the bounds, the picker clamps the value to the bound itself.

The picker normalizes the initial value at creation. It normalizes a string that reaches `value` later before the next flush and writes it back in canonical form. A string that is not a valid time empties the fields and logs a warning in development. When the model's owner refuses a value the picker wrote, the fields take the model's value as given and the picker writes nothing more; the picker normalizes a value the owner substitutes and writes it back once. `display` reports the time the fields show. While `disabled` or `readonly` is on, `commit`, `step`, and `clear` do nothing and the picker never writes `value`.

`required`, `rules`, `error`, and `errorMessages` validate the value through `createInput`, which the picker returns as `input` with `validate`, `reset`, `errors`, `isValid`, `isPristine`, `isDirty`, and `isTouched`. The picker registers with a parent form. A value the picker normalized is still pristine, and `input.reset()` puts the initial value back and drops a partly entered time; while `disabled` or `readonly` it does not write `value`. `revision` goes up when the model holds a new settled value worth validating. An edit the owner took counts, and so does a value from outside. The picker's own normalizing counts only once the value already has a validity. `input.reset()` does not count unless `error` or `errorMessages` is set. Under an owner that accepts late, the picker's normalizing of the initial value comes back as a value from outside and counts. Watch it to validate on input.

Call it inside a component `setup` or an `effectScope`; stopping the scope disposes the picker.
