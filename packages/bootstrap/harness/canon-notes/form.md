# Form controls

Amendments for BFormControl, BFormField, BFormLabel, BFormText, BFormFeedback, and BFile. Not folded into CANON.md.

- There is no BForm. The consumer writes `<form data-bs-validate>`. `data-bs-validate` stays on that element. This package does not emit it, and it does not emit `data-bs-toggle`.
- BFormControl renders `<input>`, `<textarea>`, or `<select>` via `as` (default `input`). All three use `.form-control`. The pin's select is `.form-control`, not `.form-select`.
- `size="sm" | "lg"` adds `.form-control-sm` / `.form-control-lg`. A number is the native select `size` attribute only.
- `invalid` adds `.is-invalid`. `valid` adds `.is-valid`. These are the pin's server-state classes. They are not driven by `createInput` rules.
- `plaintext` adds `.form-control-plaintext` only when the control is also `readonly`. `.form-control` stays.
- `v-model` is the string value. `createInput` holds that ref and the dirty / focus / touched flags. The component renders the element and writes the model from the native `input` event. An empty string does not set the `value` attribute, because the pin omits it; the property is still cleared.
- BFormField is `div.form-field`. `floating` adds `.form-floating`. `always` adds `.form-floating-always` only together with `floating`. The pin also uses a bare `.form-floating` (sometimes on `<form>`), with the label before the control and without `.form-label`. This package does not drop `.form-field`, and BFormLabel always renders `.form-label`. The slot is not auto-composed.
- BFormFeedback is `.invalid-feedback`, or `.valid-feedback` when `valid` is set.
- BFile is `<input type="file" class="form-control">`. `v-model` is `FileList | null` from the native `change` event. File contents are not read.
