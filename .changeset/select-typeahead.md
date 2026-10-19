---
"@vuetify/v0": minor
---

feat(Select): select an option by typing its text

Printable characters match option text. Characters typed within one second accumulate, and a repeated letter cycles. A single select updates the value and leaves the list open or closed as it was. The matcher is `useTypeahead`.
