---
"@vuetify/v0": minor
---

feat(createTimePicker): add a segmented time value

The value is a 24-hour `HH:mm` string, or `HH:mm:ss` when seconds are on. It stays null until the hour and minute are set, and the second too when seconds are on. The cycle defaults to 24-hour. In 12-hour mode, AM and PM shift the stored hour by twelve. A step snaps to its interval, and a complete value clamps into `min` and `max`. Disabled and readonly block every edit, including clear.
