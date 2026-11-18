---
'@vuetify/v0': minor
---

feat(createCalendar): add a Gregorian month grid

`createCalendar` is a Gregorian month grid with single and range selection. `mode` may be a ref, and changing it clears the selection. Days outside `min` and `max` are disabled. `disabled` can also name individual days with a list or a predicate. A day that is not a real calendar day is ignored. A month outside 1 through 12 is ignored. Paging stops at year 0000 and year 9999. A move past those years stops on `min` or `max` when one is set. A spill day outside `YYYY-MM-DD` stays disabled. An omitted month is today on the server as well as in the browser. When the grid owns its adapter, a locale ref also updates the week columns.
