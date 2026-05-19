---
title: toHighlight - Text Search Highlighting for Vue 3
meta:
  - name: description
    content: Pure Vue 3 transformer that splits text into matched and unmatched chunks given a query string or pre-computed match ranges. No DOM, no state, no reactivity — just a HighlightChunk array. Wrap in computed() for reactive recomputation.
  - name: keywords
    content: highlight, text search, mark, query, search terms, Vue 3, headless, transformer, filter, autocomplete, MatchRange
features:
  category: Transformer
  label: 'E: toHighlight'
  github: /composables/toHighlight/
  level: 1
related:
  - /composables/data/create-filter
  - /components/forms/combobox
  - /composables/transformers/to-array
---

# toHighlight

Pure transformer that splits text into matched and unmatched chunks. Returns a plain `HighlightChunk[]` — wrap the call in `computed()` for reactive recomputation.

<DocsPageFeatures :frontmatter />

## Usage

```ts collapse
import { computed } from 'vue'
import { toHighlight } from '@vuetify/v0'

const chunks = computed(() =>
  toHighlight(() => props.text, () => props.query, { ignoreCase: true })
)
// chunks.value → [{ text: 'Hello ', match: false }, { text: 'World', match: true }]
```

## Architecture

`toHighlight` resolves its input through a fixed priority order:

```mermaid "Highlight Resolution"
flowchart LR
  options[Options] --> matches{matches?}
  matches -- non-empty --> normalize[sort + merge ranges]
  matches -- empty / none --> query{query?}
  query -- truthy --> find[find ranges]
  query -- empty / none --> noop[full text, match: false]
  find --> ranges{matches found?}
  ranges -- yes --> chunk[chunk text]
  ranges -- no --> noop
  normalize --> chunk
  chunk --> chunks[HighlightChunk array]
  noop --> chunks
```

## Reactivity

`toHighlight` is a pure transformer — it reads each input through `toValue` once and
returns a plain `HighlightChunk[]`. To make the result track upstream changes, wrap the
call in `computed()` (or any reactive scope). The function itself creates no reactivity.

| Behavior | Reactive | Notes |
| - | :-: | - |
| Calling `toHighlight(text, query)` | <AppErrorIcon /> | One-shot snapshot at call time |
| Wrapping in `computed(() => toHighlight(...))` | <AppSuccessIcon /> | Re-runs when tracked refs change |
| Passing refs or getters as arguments | <AppSuccessIcon /> | `toValue` unwraps them on every call |
| Mutating returned chunks | <AppErrorIcon /> | Treat the array as derived; do not mutate |

> [!TIP] Reach for plain values, refs, or getters
> Every input accepts `MaybeRefOrGetter<T>`. Pass a literal for static input, a `Ref` for
> v-model integration, or a getter (`() => props.text`) for prop-driven reactivity. Wrap
> the call in `computed()` when you want the result to update automatically.

## Examples

::: example
/composables/to-highlight/messages.ts
/composables/to-highlight/MessageRow.vue
/composables/to-highlight/inbox.vue

### Inbox search

A mail-style search pane that exercises every input shape `toHighlight` accepts. The
search `Input.Root` drives a single-term query, the saved-filter `Toggle.Root` chips
extend that into a multi-term array, and the **Server snippets** `Switch.Root` swaps the
body-text path from client-side substring matching to caller-supplied `MatchRange[]`
returned by a mock backend. Every option is a real-world button you'd find on a working
inbox, not a "demo mode" toggle.

The `MessageRow` sub-component owns its `toHighlight` calls so the parent list stays
dumb — pass it the resolved `terms` array and the `serverMode` flag and it decides which
shape to feed the transformer. Pulling the per-row work into a child also means the same
row component drops into any list with a query in scope.

- **Single query** — type into the search box with no chips active. `terms` is a
  one-element `string[]`. `toHighlight` accepts that just as happily as a bare string,
  so this and "Multiple" share a code path. `ignoreCase: true, matchAll: true` are the
  typical defaults for search UIs; drop either flag when stricter behavior is warranted
  (legal text, identifier lookups).
- **Multiple queries** — toggle on one or more saved filters. Each filter chip appends
  its label to `terms`, the `Input` value joins them, and `toHighlight` searches each
  term independently. Overlapping or adjacent spans collapse automatically — `['budget',
  'budgets']` against *"budget vs budgets line item"* yields two clean highlights, not
  four overlapping ones. Derive the array from chips, a tokenizer, an API suggestion
  list, or a comma-split text input — anything that produces `string[]`.
- **Pre-computed ranges** — flip **Server snippets** on. The body text now ignores
  `query` entirely and renders from `[start, end]` pairs supplied by `snippets()` in
  `messages.ts` — a stand-in for a real search backend (Algolia, Elasticsearch, your
  own indexer) that returns character offsets alongside matched documents. The
  whole-word matcher used by `snippets()` highlights different spans than client-side
  substring matching, so the visual difference between the two modes is real, not
  cosmetic. The matched chunks render with an underline so the source of truth is
  obvious at a glance.

`MatchRange` is exported as `readonly [number, number]` where `end` is exclusive — the
same convention as `String.prototype.slice`. Caller-supplied ranges are sorted and merged
before chunking, so unordered or overlapping input is normalized for you.

| File | Role |
|------|------|
| `messages.ts` | Records plus a `snippets()` function that fakes a backend's offset response |
| `MessageRow.vue` | Renders one row; owns both `toHighlight` calls (subject + body) |
| `inbox.vue` | Entry: `Input.Root` search, `Toggle.Root` filters, `Switch.Root` mode |

| Priority | Source | Condition |
|----------|--------|-----------|
| 1 | `matches` | non-empty array |
| 2 | `query` | string or `string[]` |
| 3 | No-match fallback | neither provided |

:::

## Accessibility

Wrap matched chunks in the native `<mark>` element. It carries the implicit ARIA role
`mark` and is announced by screen readers as highlighted or marked text. No additional
ARIA attributes are needed on the wrapper element.

> [!TIP]
> WCAG 1.4.3 (Contrast — Minimum) applies to highlighted text. Ensure sufficient contrast
> between the mark background color and the surrounding text.

## FAQ

::: faq
??? Does toHighlight preserve the original casing?

Yes. The source `text` string is sliced at match boundaries, so the original characters
(including casing, punctuation, and whitespace) are always preserved in the output chunks.
`ignoreCase` affects only the matching logic, not the returned text.

??? Can I use it with createFilter results?

Yes. The `matches` option accepts `MatchRange[]` — `[start, end]` pairs. Once
`createFilter` exposes positional data, pass the result directly and skip the query path.

??? How does it handle overlapping multi-term matches?

Overlapping or adjacent spans are merged before the chunks array is produced.
`['foo', 'oba']` against `'foobar'` yields `[{ text: 'fooba', match: true }, { text: 'r', match: false }]`
rather than two separate matches.

??? Are caller-supplied match ranges normalized?

Yes. Ranges passed via the `matches` option are sorted by start index and merged on
overlap or adjacency before chunking. Pass `[[4, 6], [0, 2]]` or `[[0, 4], [2, 6]]` and
the output is the same as if you had supplied the canonical sorted, non-overlapping form.

??? What happens when neither query nor matches is provided?

The function returns a single `[{ text: sourceText, match: false }]` chunk — the full
string with no highlights. Safe to iterate without any guard.

??? Is it SSR-safe?

Yes. `toHighlight` is a pure function with no DOM access and no reactive state. It is
safe to call during SSR.
:::

<DocsApi />
