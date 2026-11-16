---
"@vuetify/v0": minor
---

feat(TimePicker): add hour, minute, and second spinbuttons (#1161)

`TimePicker` edits a 24-hour time string through `TimePicker.Hour`, `TimePicker.Minute`, `TimePicker.Second`, and `TimePicker.Period` spinbuttons inside `TimePicker.Root`. The second field renders only with `seconds`, and the AM/PM field only with `hour-cycle="h12"`. The model stays null until every rendered numeric field is set.

Arrow keys move a field one interval, PageUp and PageDown move it further, Home and End set its lowest and highest value, and Backspace or Delete clears it. Typing digits is not supported. `hour-step`, `minute-step`, `second-step`, `min`, and `max` constrain the value, and `disabled` and `readonly` ignore every key.

Set `name` to submit the value with a form through an auto-rendered `TimePicker.HiddenInput`.
