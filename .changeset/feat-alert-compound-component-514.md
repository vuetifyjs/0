---
"@vuetify/v0": minor
---

feat(Alert): add the `Alert` compound component (#647)

A headless compound component for inline status messages: `Alert.Root` renders a live region that assistive technology announces automatically when content is inserted or updated, `Alert.Title` renders as an `h5`, and `Alert.Description` renders as a `p`. Use `role="alert"` (the default, assertive) for urgent messages that must interrupt the current announcement, or `role="status"` for polite, non-urgent information.
