---
"@vuetify/v0": patch
---

fix(Combobox): route ComboboxEmpty default slot text through useLocale

The hardcoded `"No results"` fallback in `ComboboxEmpty` was not going through `useLocale`, violating PHILOSOPHY §5.5 (locale-first strings). Added a `Combobox.noResults` key to the English message bundle and changed the default slot content to `{{ locale.ti('Combobox.noResults') ?? 'No results' }}`, matching the pattern used by `Dialog.Close` and other components. Consumers who override the default slot are unaffected.
