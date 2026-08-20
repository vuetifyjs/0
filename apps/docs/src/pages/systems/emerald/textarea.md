---
title: EmTextarea - Emerald Textarea for Vue
meta:
- name: description
  content: Emerald's textarea — multi-line text entry with label, help text and error messages as props, validation and aria wiring supplied by Vuetify0's headless Input.
- name: keywords
  content: emerald textarea, vue textarea, multiline input vue, form validation vue, vuetify0 input, paper emerald
features:
  category: Component
  label: 'C: EmTextarea'
  level: 2
  renderless: false
  order: 28
related:
  - /systems/emerald
  - /systems/emerald/text-field
  - /components/forms/input
---

# EmTextarea

<DocsPageFeatures :frontmatter />

Multi-line text entry with its label, help text and error messages attached — the same field anatomy as [EmTextField](/systems/emerald/text-field), grown to paragraph-length values.

## Usage

Everything around the control is a prop. `label` renders the visible label and wires it to the control, `description` is the help text below it, and `errorMessages` adds error text of your own to the same region where rule failures appear. There are **no named slots** — fixed anatomy, the convention across every Emerald control whose shape does not vary.

`v-model` is a `string` defaulting to `''`, and `rows` sets how many lines of text are visible before scrolling — it drives both the native `rows` attribute and the control's minimum height, so the box opens at that size and cannot be dragged smaller. The reader can still drag it taller: the control resizes vertically by design, because the component cannot know how much someone has to say.

::: ds-example
/systems/emerald/textarea/basic
:::

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import { EmTextarea } from '@paper/emerald'
</script>

<template>
  <EmTextarea />
</template>
```

## Composed on v0

`EmTextarea` renders v0's [Input](/components/forms/input) compound — the same four parts as `EmTextField`: `Input.Root` owns the field, `Input.Control` is the element you type into, and `Input.Description` and `Input.Error` are the two message regions.

What makes it a textarea is one prop: Emerald passes `as="textarea"` to `Input.Control`. The compound is element-agnostic — the control renders through v0's `Atom`, so the whole wiring surface (value sync, focus tracking, the validation pipeline, the aria attributes) applies to a `<textarea>` exactly as it does to an `<input>`. v0 supplies the behavior; Emerald picks the element.

The ownership split around the label is the same as the text field's, and worth restating because it decides who owns the `for`/`id` pair. Emerald generates the field id with `useId()` when you do not pass one, renders its own `<label for="…">`, and hands the id down to `Input.Root` — which then puts it on the control and derives the description and error ids from it. The label element is the skin's; the attribute wiring beneath it is v0's. Emerald deliberately does not pass `label` to `Input.Root`, so the accessible name comes from the real label element rather than a duplicate `aria-label`.

Emerald's additions are CSS and two structural decisions. First, `Input.Error` is always rendered rather than conditionally mounted — the region carries `aria-live="polite"`, and a live region must already be in the document when its content arrives or the insertion is not announced. Second, `rows` is threaded twice: onto the control as the native attribute, and into a `--emerald-textarea-rows` custom property that the stylesheet multiplies by the body line-height to compute the control's `min-height` — which is what makes `rows` a floor for the drag-resize rather than just an initial size.

The state attributes the stylesheet keys on — `data-focused`, `data-disabled`, `data-readonly`, `data-state="invalid"` — are all emitted by v0, on the root and on the control. Emerald writes no state class; the one attribute it binds itself, `data-disabled` on the root, mirrors what v0 already emits there.

## Examples

::: ds-example
/systems/emerald/textarea/rows

### Sizing with rows

`rows` is the one prop the text field does not have, and it is a statement about the answer you expect. Two rows says "a sentence"; six says "take your time". The default is 3.

The number is a floor, not a cage. It sets the native `rows` attribute and a matching `min-height`, so the control opens at that height and the resize handle cannot shrink it below — but the reader can always drag it taller. Content past the visible rows scrolls; the box never grows on its own.

Pick `rows` for the *typical* answer, not the longest one. A summary field at two rows still accepts an essay — it just signals that an essay was not the assignment.
:::

::: ds-example
/systems/emerald/textarea/validation

### Rules and timing

`rules` is an array of functions taking the value and returning `true` when it passes, or a string to show when it does not. They may return a promise, every active rule runs against the value, and every failure's message is shown — the same contract as every Emerald field, because the pipeline is v0's `createValidation` underneath.

`validateOn` decides *when*. It defaults to `blur`, which suits a textarea even better than a single-line field: a multi-line answer is composed, reread and edited, and flagging it mid-thought is noise. The `lazy` modifier, as here, holds rules back until the field has been touched; its visible effect belongs to the `input` trigger, which otherwise fires from the first keystroke — with `blur` the first blur is also the first touch, so `blur lazy` behaves like plain `blur` and reads as a statement of intent.

A minimum-length rule is the textarea's characteristic check — "did you actually tell us anything" — and the example's second rule shows the polite way to write it: pass when empty (let the `required` rule own emptiness), fail only on a non-empty answer that is too short. Because every failing rule's message is shown, a length rule that also failed on empty would stack its complaint under the required rule's — each rule owning one condition is what keeps the region readable.
:::

::: ds-example
/systems/emerald/textarea/states

### Readonly, disabled, and error

The same three states as the text field, with one textarea-specific wrinkle each.

`readonly` shows a real value that cannot be edited here — a generated key, terms text, an audit note. The control stays focusable and its text stays selectable and copyable, which matters more for a textarea than anywhere else: multi-line readonly content usually exists precisely so it can be copied. It is still submitted with the form.

`disabled` takes the field out of play — unfocusable, greyed to the neutral tokens, not submitted — and it also removes the resize handle, since resizing a field you cannot enter is an interaction with no outcome.

`error` and `errorMessages` are the manual override for validity you compute elsewhere — a server-side rejection, a moderation check. Setting `error` flips the control to `data-state="invalid"`; `errorMessages` is what the error region shows, and non-empty messages mark the field invalid on their own. When the field's own `rules` can express the constraint, prefer those; these two props are for the cases they cannot reach.
:::

## Props

<!-- Hand-authored ahead of DocsApi extraction for @paper/emerald -->

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `v-model` | `string` | `''` | The field value |
| `label` | `string` | — | Visible label, associated by `for`/`id` |
| `description` | `string` | — | Help text below the control |
| `placeholder` | `string` | — | Native placeholder. Not a substitute for `label` |
| `rows` | `number` | `3` | Visible text rows — sets the native attribute and the control's minimum height |
| `name` | `string` | — | Form field name |
| `id` | `ID` | generated | Field id. Falls back to `useId()` |
| `required` | `boolean` | `false` | Marks the field required. Does not itself reject an empty value |
| `disabled` | `boolean` | `false` | Field unavailable and not submitted; also disables resize |
| `readonly` | `boolean` | `false` | Value shown but not editable; still focusable and submitted |
| `rules` | `FormValidationRule[]` | — | Validators — `(value) => true \| string`, optionally async |
| `validateOn` | `ValidateOn` | `'blur'` | When rules run: `blur`, `input` or `submit`, each combinable with `lazy` or `eager` |
| `error` | `boolean` | `false` | Force the invalid state from outside the rule pipeline |
| `errorMessages` | `string \| string[]` | — | Manual messages, merged ahead of rule errors; setting them marks the field invalid |
| `namespace` | `string` | — | Which v0 `Input` instance to bind to. Only needed when nesting |

`FormValidationRule` and `ValidateOn` are v0 types, re-exported from `@vuetify/v0`. There are no slots.

## Accessibility

The control is a native `<textarea>`, so the platform already handles the essentials of multi-line entry — Enter inserts a newline rather than submitting the form, and long content scrolls within the box. Everything around the element is wired by v0's `Input.Root`.

### Label association

`label` renders a real `<label for="…">` pointing at the field id — Emerald's own element, over an id it generates with `useId()` when you do not supply one. The label text becomes the control's accessible name, and clicking it moves focus into the field. A `placeholder` is neither of those things: it disappears on the first keystroke and is not reliably announced. Use it for a nudge about content, and always pass `label` as well.

### Descriptions and errors

The two message regions are wired to the control by **different attributes**, and they coexist rather than replacing one another.

| Region | Attribute on the control | Present when |
|--------|--------------------------|--------------|
| `Input.Description` | `aria-describedby` | A `description` is set — regardless of validity |
| `Input.Error` | `aria-errormessage` | The field is invalid and has at least one message |

A field that is both described and invalid exposes both: the help text stays associated the whole time, and the error arrives on its own channel alongside it. The control also gets `aria-invalid` while failing — the state that makes a screen reader report the error at all.

`Input.Error` carries `aria-live="polite"`, and Emerald keeps the region mounted from the start so the live region exists before its first message arrives — a region inserted together with its content is not announced.

### Required

`required` sets the native attribute and the aria state, so the field is announced as required on focus rather than only failing at submit. Pair it with a rule that actually rejects the empty value — the attribute is the promise, the rule is the enforcement.

### States

| State | Focusable | Submitted | Announced as |
|-------|-----------|-----------|--------------|
| `readonly` | Yes | Yes | Read-only |
| `disabled` | No | No | Disabled |
| `error` | Yes | Yes | Invalid, with the message as its error text |
