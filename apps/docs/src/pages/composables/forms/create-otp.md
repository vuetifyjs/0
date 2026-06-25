---
title: createOtp - One-Time Password Composable
meta:
- name: description
  content: Composable for fixed-length one-time-password and verification-code state with pattern-gated entry and decisional completion hook for Vue 3.
- name: keywords
  content: createOtp, otp, pin input, verification code, composable, Vue 3, headless
features:
  category: Composable
  label: 'E: createOtp'
  github: /composables/createOtp/
  level: 2
related:
  - /composables/forms/create-input
  - /composables/forms/create-validation
---

# createOtp

Manage a fixed-length one-time-password or verification-code value with pattern-gated entry, length-based completion detection, and a decisional async hook. Headless — your component owns rendering, focus, and event wiring.

<DocsPageFeatures :frontmatter />

## Usage

```ts collapse
import { createOtp } from '@vuetify/v0'

const otp = createOtp({
  length: 6,
  pattern: 'numeric',
  onComplete: async value => {
    const ok = await verify(value)
    return ok // false clears the value and surfaces an error
  },
})

otp.write(0, '4')          // single character at a position
otp.distribute('123456')   // distributes filtered characters
otp.value.value            // '412345' joined string
otp.isComplete.value       // true when length reached and all chars valid
otp.accepts('a')           // false under 'numeric'
otp.clear()
```

## Architecture

```mermaid "createOtp Architecture"
flowchart TD
  Options["OtpOptions"]
  COTP["createOtp"]:::primary
  CI["createInput&lt;string&gt;"]
  Context["OtpContext"]

  Options --> COTP
  COTP --> CI
  CI --> Context
  COTP --> Context
```

Layer 2 orchestrator. Aggregates createInput for validation, dirty tracking, and ARIA wiring. No registry, no focus traversal, no observers — rendering, per-element refs, and keyboard wiring are the consumer's responsibility.

## Reactivity

| Property | Type | Reactive | Description |
| - | - | :-: | - |
| `value` | `Readonly<Ref<string>>` | <AppSuccessIcon /> | Joined OTP string. Readonly — mutate via the helpers below. |
| `length` | `Readonly<Ref<number>>` | <AppSuccessIcon /> | Target character count from the `length` option. |
| `input` | `InputContext<string>` | <AppSuccessIcon /> | Underlying `createInput` surface — ARIA IDs, errors, validation, focus/touched. |
| `isComplete` | `Readonly<Ref<boolean>>` | <AppSuccessIcon /> | `true` when value reaches `length` and every character passes `accepts`. Fires `onComplete` on the false → true edge. |
| `write(index, char)` | `(index: number, char: string) => void` | — | Writes one character at `index`. Empty `char` truncates to `value.slice(0, index)` (Backspace mental model). Multi-character `char` is reduced to the first character — use `distribute` for multi-character input. |
| `distribute(text, index?)` | `(text: string, index?: number) => number` | — | Filters `text` through `accepts`, splices at `index` (default `0`), clips to `length`. Returns the count consumed so consumers can advance focus. |
| `clear()` | `() => void` | — | Empties the joined value. |
| `fill(text)` | `(text: string) => void` | — | Replaces the joined value (filtered + clipped). |
| `accepts(char)` | `(char: string) => boolean` | — | Pattern test, exposed so consumers can guard `beforeinput`. |

Every helper is gated on the configured `disabled` and `readonly` options, and on the internal pending state while an async `onComplete` is in flight.

## Patterns

| Pattern | Matches |
| - | - |
| `'numeric'` | `[0-9]` |
| `'alphanumeric'` | `[a-zA-Z0-9]` |
| `'alphabetic'` | `[a-zA-Z]` |
| `RegExp` | Custom; tested per character |

`accepts(char)` is the single point of truth and is reactive through `MaybeRefOrGetter` — toggle modes at runtime and every helper respects the new pattern on the next call.

## Examples

::: gn-example
/composables/create-otp/basic

### Six-Input Numeric OTP

A minimal six-input numeric OTP. The consumer's component owns the inputs, the template refs, and the per-element focus advance; `createOtp` owns the state, the pattern contract, and the length contract underneath. This is the headless-contract acid test: every visible behavior is replayable by writing markup against `value`, `length`, and `accepts`, with no slot tickets or focus indices baked into the composable.

When to reach for this over a single wide `<input maxlength="6">`: when the design calls for boxed per-character slots, when the consumer needs to react to per-position events (highlighting the focused position, animating fills), or when paste-handling deserves first-class treatment. For a single-input rendering of the same state, the same `createOtp` underneath works without modification — only the markup changes.

Tradeoffs to know about. The example wires focus advance manually because focus is rendering territory; consumers preferring roving focus across the inputs can wrap the `<input>`s in `useRovingFocus` without changing the state model. The `distribute` helper returns the count consumed so the consumer can choose where to land focus after the characters land — the example moves to the next still-empty slot, but other strategies (stay put, focus the last input, focus the submit button) are equally valid.

Related: see [createInput](/composables/forms/create-input) for the validation, error, and field-state surface that `createOtp` aggregates underneath, and [createValidation](/composables/forms/create-validation) for the `rules` array that flows through unchanged.

:::

## FAQ

::: faq

??? Why is the value a single string instead of an array?

Backends and form submissions expect the joined string. Storing as an array would force two derivations on every read and break v-model compatibility with `InputContext<string>`. Per-position access is plain string indexing — `value.value[i] ?? ''` — which the consumer's component does inline when rendering.

??? Why is onComplete decisional instead of an observational event?

The dominant flow is "user finished typing → verify → wrong, clear it." Folding that into the completion event collapses a state machine consumers would otherwise hand-roll. Async verification also avoids racing a separate `validate` option for who clears the value first.

??? When does onComplete fire?

Exactly once on the false → true edge of `isComplete` — when the value first reaches `length` with every character passing `accepts`. Mutations after completion don't re-fire it; clearing and re-completing does. The watcher dedupes via an internal sentinel that resets whenever the value drops back below complete (or on rejection), so a clear-and-refill cycle still re-fires `onComplete`.

??? What happens during async verification?

While an async `onComplete` is pending, every mutation helper (`write`, `distribute`, `fill`, `clear`) is a no-op — the field is effectively locked until the promise settles, so the user can't race the verifier. On rejection, the value clears and `input.errors` surfaces `v0.otp.rejected`; on the next successful mutation the rejection clears automatically.

??? Where does focus management live?

In your component, not in `createOtp`. The composable has no concept of slots, element refs, or "which input is focused" because rendering shape is the component's call. A six-input OTP and a single-input OTP with character overlay use the same `createOtp` underneath.

:::

<DocsApi />
