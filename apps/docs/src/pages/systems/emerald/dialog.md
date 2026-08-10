---
title: EmDialog - Emerald Dialog for Vue
meta:
- name: description
  content: Emerald's modal dialog — a compound over Vuetify0's headless Dialog, rendering a native dialog element with focus trapping, top-layer painting and Escape dismissal.
- name: keywords
  content: emerald dialog, vue modal, native dialog element, focus trap vue, design system modal, vuetify0 dialog
features:
  category: Component
  label: 'C: EmDialog'
  level: 2
  renderless: false
  order: 4
related:
  - /systems/emerald
  - /systems/emerald/button
  - /components/disclosure/dialog
---

# EmDialog

<DocsPageFeatures :frontmatter />

A modal dialog built on the platform's own `<dialog>` element — focus trapping, top-layer painting and Escape dismissal come from the browser rather than from JavaScript.

## Usage

`EmDialog` owns the open state through `v-model`; everything else is an express part. `EmDialogActivator` is the trigger, `EmDialogContent` is the modal surface, and `EmDialogTitle`, `EmDialogDescription`, `EmDialogFooter` and `EmDialogClose` are the regions inside it.

The activator has one prop worth knowing before you write your first dialog. By default it renders its own element; pass `renderless` and it becomes a pure slot host, handing you an `attrs` object to spread onto your own trigger. Use `renderless` whenever the trigger is an `EmButton` — otherwise you get a button inside a button, which is invalid markup and confuses assistive technology about what is actually clickable.

::: ds-example
/systems/emerald/dialog/basic
:::

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import {
    EmDialog,
    EmDialogActivator,
    EmDialogClose,
    EmDialogContent,
    EmDialogDescription,
    EmDialogFooter,
    EmDialogTitle,
  } from '@paper/emerald'
</script>

<template>
  <EmDialog>
    <EmDialogActivator />

    <EmDialogContent>
      <EmDialogTitle />

      <EmDialogDescription />

      <EmDialogFooter />

      <EmDialogClose />
    </EmDialogContent>
  </EmDialog>
</template>
```

## Composed on v0

`EmDialog` maps onto v0's [Dialog](/components/disclosure/dialog) compound: `Dialog.Root`, `Dialog.Activator`, `Dialog.Content`, `Dialog.Title`, `Dialog.Description` and `Dialog.Close`.

`Dialog.Content` renders a real `<dialog>` opened as a modal, which is where most of the behavior comes from. The browser traps focus inside it, makes the rest of the page inert, paints it in the top layer above every stacking context on the page, and closes it on Escape. None of that is v0 code and none of it is Emerald's — it is the platform, which is why it behaves correctly in situations a hand-rolled modal usually does not, like being opened from inside a transformed or `overflow: hidden` ancestor.

v0's contribution is the wiring around it: the `aria-haspopup` / `aria-expanded` pair on the activator, the `aria-labelledby` and `aria-describedby` that point the dialog at its own title and description, the outside-click dismissal, and the two-way binding between the element's open state and your `v-model`.

`EmDialogFooter` is the one part with no v0 counterpart. It is a plain layout element with a `variant` prop, because arranging buttons is a visual decision with no behavior attached.

## Examples

::: ds-example
/systems/emerald/dialog/confirm

### Confirming a destructive action

The case dialogs exist for: an action that cannot be undone, where the cost of an accidental click is high enough to justify interrupting the reader.

Two deliberate choices here. `closeOnClickOutside` is off, and there is no `EmDialogClose`, so the only ways out are the two buttons — the reader has to make a decision rather than dismiss the question. Reserve that for genuinely destructive confirmations; using it for routine dialogs is how modals become the thing people complain about.

The other is what the buttons say. "Keep project" and "Delete" name their outcomes, so each one can be read on its own; "Cancel" and "OK" force the reader back to the title to work out which is which. The destructive action takes the `destructive` variant and, notably, is *not* the primary — the safe choice should be the easy one.

Note that Escape still closes this dialog. That is the browser's own behavior on a modal `<dialog>` and it is not worth fighting: a reader who presses Escape has clearly not confirmed anything, so the outcome is the safe one anyway.
:::

::: ds-example
/systems/emerald/dialog/form

### Forms inside a dialog

Dialog content is an ordinary slot, so form controls compose into it directly — `EmTextField` here, but any Emerald control works the same way.

Focus is the thing to get right. The browser moves focus into the dialog when it opens and restores it to the activator on close, so a reader who opens the dialog, cancels, and carries on tabbing lands exactly where they were. That only holds if the trigger is still in the DOM when the dialog closes, which is one more reason to leave the activator mounted rather than swapping it out on open.

`EmDialogFooter`'s `variant` handles the layout. `one-button` is the right shape for a single confirming action, `buttons` for the usual cancel-and-confirm pair, and `pagination` for a multi-step flow with navigation on both sides. It is layout only; nothing about the variant changes behavior.

For a real form, prefer submitting on Enter as well as on the button — a dialog with a single text field is one people expect to complete without reaching for the mouse.
:::

## Props

<!-- Hand-authored, temporarily. These pages predate DocsApi extraction for
     @paper/* packages; once the generator covers the design systems this table
     is replaced by <DocsApi />. Keep it in sync with the EmDialog sources until then. -->

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `v-model` | `boolean` | — | Open state |
| `id` | `string` | — | Dialog id |
| `namespace` | `string` | — | Which v0 `Dialog` instance to bind to. Only needed when nesting |

### Parts

Every part except `EmDialogFooter` takes an optional `namespace`.

| Part | Props | Notes |
|------|-------|-------|
| `EmDialogActivator` | `renderless` (`boolean`, default `false`) | With `renderless`, spread the `attrs` slot prop onto your own trigger |
| `EmDialogContent` | `closeOnClickOutside` (`boolean`), `blocking` (`boolean`) | Both default to v0's behavior when unset |
| `EmDialogTitle` | — | Names the dialog via `aria-labelledby` |
| `EmDialogDescription` | — | Describes it via `aria-describedby` |
| `EmDialogFooter` | `variant`: `'buttons' \| 'pagination' \| 'one-button'`, default `'buttons'` | Layout only; no `namespace` |
| `EmDialogClose` | — | Falls back to a close glyph when given no content. Always named from the locale key `Dialog.close` |

`EmDialogActivator` slot props: `isOpen`, and an `attrs` object carrying `type`, `role`, `tabindex`, `aria-haspopup`, `aria-expanded`, `data-open`, `onClick` and `onKeydown`.

## Accessibility

Most of this section describes the browser rather than the component, which is the point of rendering a native `<dialog>`.

### Focus

Opening moves focus into the dialog and traps it there — Tab cycles within the modal and cannot reach the page behind it, which is also made inert, so the content behind is not merely unclickable but invisible to assistive technology. Closing returns focus to the element that opened it.

That restoration depends on the activator still existing. If the trigger is inside something that unmounts while the dialog is open, focus falls back to the document body and a keyboard user restarts from the top of the page.

### Naming

`EmDialogTitle` becomes the dialog's accessible name through `aria-labelledby`, and `EmDialogDescription` its description through `aria-describedby`. Include a title on every dialog: without one, the dialog is announced only as "dialog", giving a screen-reader user no idea what just interrupted them.

`EmDialogClose` names itself. `Dialog.Close` always sets `aria-label` from the locale key `Dialog.close`, falling back to "Close" — unconditionally, whatever you put in the slot. So the default glyph button is already labelled, and replacing the content with a different icon does not leave it anonymous.

The flip side is that the label is not yours to override from the slot: putting the word "Cancel" inside `EmDialogClose` produces a button that still announces as "Close". When the affordance needs a different name, install a locale message for `Dialog.close`, or use a plain `EmButton` bound to the model instead of the close part.

### Dismissal

| Gesture | Behavior |
|---------|----------|
| Escape | Closes. Native to the modal `<dialog>` element |
| Click outside | Closes, unless `closeOnClickOutside` is `false` |
| `EmDialogClose` | Closes |
| Setting `v-model` to `false` | Closes |

Escape is the one you cannot turn off from this component's props, and generally should not want to. A reader who presses Escape has not confirmed anything, so for a confirmation dialog the result is the same as choosing the safe option; for a form, treat it the same way you treat Cancel.

### Modality

A modal dialog interrupts. It is the right tool when the reader genuinely cannot continue until they answer, and the wrong one for anything that could sit inline — a settings panel, a detail view, a non-blocking notice. Each of those has a better home, and the accessibility cost of a modal (focus displaced, page inert, context lost) is paid whether or not the interruption was warranted.
