---
"@vuetify/v0": minor
---

feat(TimePicker): add hour, minute, and second spinbuttons (#1161)

`TimePicker` edits a 24-hour time string through `TimePicker.Hour`, `TimePicker.Minute`, `TimePicker.Second`, and `TimePicker.Period` spinbuttons inside `TimePicker.Root`. The second field renders only with `seconds`, and the AM/PM field only with `hour-cycle="h12"`. The model stays null until the hour, the minute, and, with `seconds`, the second are all set.

Arrow keys move a field one interval, PageUp and PageDown move the hour about 2 hours and the minute or second about 15, Home and End set its lowest and highest value, and Backspace or Delete clears it. Typing digits is not supported. `hour-step`, `minute-step`, and `second-step` keep each field on the multiples of its step, `min` and `max` keep a complete time inside a window on those steps, and `disabled` and `readonly` ignore every key.

Root and each field take `ariaLabel` and `ariaLabelledby`, and Root takes `ariaDescribedby`; names default to the locale catalog. The digits a field shows follow the locale's numerals, while the model stays in Latin digits. Fields carry `data-state="empty"` or `"filled"`, and Root carries `data-complete` while the fields show a complete time.

`required`, `rules`, `error`, `errorMessages`, and `validateOn` validate the model, and the picker registers with a parent `Form`. Focus moving between the fields is not a blur, and `validateOn="input"` validates an edit or a value set from outside. The picker normalizing a value on its own validates only once the picker has a validity, from a validation or from `error` or `errorMessages`, and a reset does not unless `error` or `errorMessages` is set; a parent that accepts an update late is read as a value from outside, which validates. `TimePicker.Description` and `TimePicker.Error` hold the help text and the messages; the fields point at them with `aria-describedby` and `aria-errormessage` and carry `aria-required` and `aria-invalid`. Root carries `data-state="pristine"`, `"valid"`, or `"invalid"`, plus `data-dirty` and `data-focused`, and its slot exposes `errors`, `isValid`, `isPristine`, `isFocused`, `validate`, and `reset`.

Set `name` to submit the displayed time with a form through an auto-rendered `TimePicker.HiddenInput`, and `form` to associate it with a form Root sits outside.
