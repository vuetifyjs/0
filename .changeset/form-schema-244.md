---
"@vuetify/v0": minor
---

feat(createFormSchema): schema-driven form generation (#244)

Adds `createFormSchema` — a thin composable over `createForm` and
`createValidation` that accepts a typed field-definition object and returns
reactive value refs, per-field bindings (modelValue / onUpdate:modelValue /
errorMessages), and form-level `submit`, `reset`, `isValid`, and
`isValidating` helpers.

The schema is UI-agnostic: consumers decide how each field is rendered and can
spread `schema.fields.<name>` onto any input component.
