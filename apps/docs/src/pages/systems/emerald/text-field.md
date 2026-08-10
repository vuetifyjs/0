---
title: EmTextField - Emerald Text Field for Vue
meta:
- name: description
  content: Emerald's text field — label, help text, and error messages as props, with validation, timing and aria wiring supplied by Vuetify0's headless Input.
- name: keywords
  content: emerald text field, vue input, form validation vue, design system input, vuetify0 input, paper emerald
features:
  category: Component
  label: 'C: EmTextField'
  level: 2
  renderless: false
  order: 2
related:
  - /systems/emerald
  - /systems/emerald/select
  - /components/forms/input
---

# EmTextField

<DocsPageFeatures :frontmatter />

A single-line text input with its label, help text and error messages attached — all of them props, with the association between them handled for you.

## Usage

Everything around the input is a prop. `label` renders the visible label and wires it to the control, `description` is the help text below it, and `errorMessages` is what replaces that help text when validation fails. There are **no named slots** — this is a shell component with fixed anatomy, which is the convention across every Emerald control whose shape does not vary.

`v-model` is a `string` and defaults to `''`. It stays a string for every `type`, including `number` — the DOM gives you a string, and quietly coercing it is how forms end up with `NaN` in a payload.

::: ds-example
/systems/emerald/text-field/basic
:::

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import { EmTextField } from '@paper/emerald'
</script>

<template>
  <EmTextField />
</template>
```

## Composed on v0

`EmTextField` renders v0's [Input](/components/forms/input) compound: `Input.Root` owns the field, `Input.Control` is the element you type into, and `Input.Description` and `Input.Error` are the two message regions.

Most of what is hard about a text field lives in that compound rather than in Emerald. `Input.Root` wires each message region to the control by its own attribute and runs the validation pipeline — v0's `createValidation` under the hood, so the rule contract and the `validateOn` timing are the same ones documented on the Input page.

The label is the exception, and it is worth knowing which layer owns it. Emerald generates the field id itself with `useId()` when you do not pass one, renders its own `<label for="…">`, and hands the id down to `Input.Root` — which then uses it for the control and derives the description and error ids from it. So the `for`/`id` pair is the skin's, and the attribute wiring beneath it is v0's.

Emerald supplies the CSS and one structural decision: `Input.Error` is always rendered rather than conditionally mounted. That matters for announcements rather than for layout — the region carries `aria-live="polite"`, and a live region has to already be in the document when its content arrives, or the insertion is not announced at all.

The state attributes the stylesheet keys on — `data-focused`, `data-disabled`, `data-readonly`, `data-state="invalid"` — are all emitted by v0. Emerald writes no state class of its own.

## Examples

::: ds-example
/systems/emerald/text-field/validation

### Rules and timing

`rules` is an array of functions taking the value and returning `true` when it passes, or a string to show when it does not. They may return a promise, so an async check — a username lookup, a server-side uniqueness test — is the same shape as a synchronous one. Rules run in order and the first failure is what gets shown.

`validateOn` decides *when*, and it is the prop that most changes how the field feels. It defaults to `blur`, which waits until the reader leaves the field — usually right, because validating on every keystroke means telling someone their email is invalid while they are still on the second character. `input` validates as they type, worth it for a field with live feedback like a password strength meter. `submit` defers everything to the form.

Each of those combines with `lazy` or `eager`, and the two are not opposites. `lazy` suppresses validation until the field has been touched, so a form the reader has typed into elsewhere does not light up fields they have not reached yet. `eager` is about escalation: before the first failure it validates only on the base trigger, and once the field has failed it re-validates on every keystroke — so the error clears the moment the reader fixes it rather than making them leave the field again.

`blur lazy`, as in this example, is the combination most forms want. Reach for `blur eager` when the correction itself is fiddly enough that per-keystroke feedback earns its keep.

Note that `required` is a separate prop from a required *rule*. The prop sets the aria state and the visual marker; the rule is what actually rejects an empty value. Both, as in this example — the prop is the promise, the rule is the enforcement.
:::

::: ds-example
/systems/emerald/text-field/states

### Readonly, disabled, and error

Three states that all stop normal editing and mean entirely different things.

`readonly` shows a real value that cannot be edited here. The control stays focusable and its text stays selectable and copyable, which is the whole point for something like a generated account id. It is still submitted with the form.

`disabled` takes the field out of play — unfocusable, greyed to the neutral tokens, and not submitted. Reach for it when a field is irrelevant given other answers, and prefer removing it entirely when it will never become relevant. As with buttons, a disabled control with no visible explanation is a frequent accessibility complaint; put the reason where a keyboard user will find it, because they will never land on the field itself.

`error` and `errorMessages` are the manual override for validation state you compute elsewhere — a server rejection, a cross-field constraint that no single field's rules can see. Setting `error` flips the field to `data-state="invalid"` and swaps the description region for the messages. When the field's own `rules` can express the constraint, use those instead; these two props are for the cases they cannot reach.
:::

## Props

<!-- Hand-authored, temporarily. These pages predate DocsApi extraction for
     @paper/* packages; once the generator covers the design systems this table
     is replaced by <DocsApi />. Keep it in sync with EmTextField.vue until then. -->

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `v-model` | `string` | `''` | The field value. Always a string, whatever the `type` |
| `label` | `string` | — | Visible label, associated by `for`/`id` |
| `description` | `string` | — | Help text below the control |
| `placeholder` | `string` | — | Native placeholder. Not a substitute for `label` |
| `type` | `string` | `'text'` | Native input type |
| `autocomplete` | `string` | — | Native autocomplete token |
| `name` | `string` | — | Form field name |
| `id` | `ID` | generated | Field id. Falls back to `useId()` |
| `required` | `boolean` | `false` | Marks the field required. Does not itself reject an empty value |
| `disabled` | `boolean` | `false` | Field unavailable and not submitted |
| `readonly` | `boolean` | `false` | Value shown but not editable; still focusable and submitted |
| `rules` | `FormValidationRule[]` | — | Validators — `(value) => true \| string`, optionally async |
| `validateOn` | `ValidateOn` | `'blur'` | When rules run: `blur`, `input` or `submit`, each combinable with `lazy` or `eager` |
| `error` | `boolean` | `false` | Force the invalid state from outside the rule pipeline |
| `errorMessages` | `string \| string[]` | — | Messages to show while `error` is set |
| `namespace` | `string` | — | Which v0 `Input` instance to bind to. Only needed when nesting |

`FormValidationRule` and `ValidateOn` are v0 types, re-exported from `@vuetify/v0`. There are no slots.

## Accessibility

`Input.Root` renders a native `<input>` and owns the relationships between it and everything around it, which is the part hand-rolled fields most often get wrong.

### Label association

`label` renders a real `<label for="…">` pointing at the field id — Emerald's own element, over an id it generates with `useId()` when you do not supply one. That gives you the two things a wrapping label alone does not: the label text becomes the control's accessible name, and clicking it moves focus into the field.

A `placeholder` is not a label. It disappears the moment someone types, it is not reliably announced, and it fails contrast requirements in most designs. Use it for a format hint — `you@example.com` — and always pass `label` as well.

### Descriptions and errors

The two regions are wired to the control by **different attributes**, and they coexist rather than replacing one another.

| Region | Attribute on the control | Present when |
|--------|--------------------------|--------------|
| `Input.Description` | `aria-describedby` | A `description` is set — regardless of validity |
| `Input.Error` | `aria-errormessage` | The field is invalid and has at least one message |

So a field that is both described and invalid exposes both: the help text stays associated the whole time, and the error arrives on its own channel alongside it. The control also gets `aria-invalid` while it is failing, which is what flips a screen reader into reporting the error at all — `aria-errormessage` is ignored without it.

`Input.Error` additionally carries `aria-live="polite"`, so a message that appears while the reader is already past the field is announced without stealing focus. This is the reason the region is always mounted: a live region has to be in the document before its content changes, or the browser has nothing to observe and the first message is silently missed.

The practical consequence is the opposite of what a swap would imply — help text does not disappear when validation fails, so `description` is a safe place for the format requirement rather than a risky one.

### Required

`required` sets the native attribute and the aria state, so the field is announced as required on focus rather than only failing at submit. Pair it with a rule that actually rejects the empty value; the attribute is a promise to the reader, and the rule is what keeps it.

### States

| State | Focusable | Submitted | Announced as |
|-------|-----------|-----------|--------------|
| `readonly` | Yes | Yes | Read-only |
| `disabled` | No | No | Disabled |
| `error` | Yes | Yes | Invalid, with the message as its description |
