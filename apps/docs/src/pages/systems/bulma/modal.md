---
title: BuModal - Bulma Modal for Vue
meta:
- name: description
  content: Bulma's modal markup with Vuetify0 behavior — Escape to close, backdrop dismissal, focus trapping and focus return, in both the modal-content and modal-card variants.
- name: keywords
  content: bulma modal, vue modal, modal-card, dialog, focus trap, bulma vue, paper bulma
features:
  category: Component
  label: 'C: BuModal'
  level: 2
  renderless: false
  order: 1
related:
  - /systems/bulma
  - /systems/bulma/dropdown
  - /components/disclosure/dialog
---

# BuModal

Bulma's `.modal` with the JavaScript it never shipped: open state, backdrop dismissal, Escape, focus trapping and focus return.

<DocsPageFeatures :frontmatter />

> [!NOTE]
> Reference: [Modal on bulma.io](https://bulma.io/documentation/components/modal/) — classes and visual variants. This page is the JavaScript.

## Usage

`v-model` owns the open state. The panel is whichever part you compose inside: `BuModalContent` for the plain variant, `BuModalCard` for the head/body/foot one. Everything inside the panel is Bulma's.

::: ds-example
/systems/bulma/modal/basic
:::

## Anatomy

Both panels are shown here for completeness — a modal composes one or the other, never both.

```vue Anatomy no-filename collapse
<script setup lang="ts">
  import {
    BuModal,
    BuModalBody,
    BuModalCard,
    BuModalClose,
    BuModalContent,
    BuModalDelete,
    BuModalFoot,
    BuModalHead,
    BuModalTitle,
  } from '@paper/bulma'
</script>

<template>
  <BuModal>
    <BuModalContent />

    <BuModalClose />

    <BuModalCard>
      <BuModalHead>
        <BuModalTitle />

        <BuModalDelete />
      </BuModalHead>

      <BuModalBody />

      <BuModalFoot />
    </BuModalCard>
  </BuModal>
</template>
```

## Composed on v0

Wraps v0's [Dialog](/components/disclosure/dialog). `Dialog.Root` owns `v-model`. `Dialog.Content` is renderless so the host can stay a `<div class="modal">` — the fixture demands that, never a native `<dialog>`. `BuModalContent` and `BuModalCard` take the identity Dialog would have bound (`id`, `role`, `aria-modal`, and on the card `aria-labelledby`) off the dialog context; the stack `z-index` lands on `.modal`.

Two things v0 ships that this wrapper skips. `Scrim` is global per stack ticket — mounting it behind a modal that already paints `.modal-background` would double the backdrop, so the backdrop is hand-rolled. And v0 has no `useFocusTrap`: Tab and Shift+Tab wrap inside `.modal`, and focus returns to the trigger on close, including when the modal unmounts while open.

The parts that do map through: `BuModalTitle` is `Dialog.Title as="p"`. `BuModalClose` is `Dialog.Close` with class `modal-close` (the content-variant large X). `BuModalDelete` is `Dialog.Close` with class `delete` (the card-head X). They are not interchangeable.

`blocking` is Dialog's `blocking` — backdrop clicks only. Escape still closes.

## The markup you know

The Bulma tab is the markup [published on bulma.io](https://bulma.io/documentation/components/modal/), captured verbatim in the conformance fixture. The Vue tab is the component that renders it. The conformance suite diffs the two on every test run — element for element, class for class.

::: code-group no-filename

```html Bulma collapse
<div class="modal is-active">
  <div class="modal-background"></div>
  <div class="modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title">Modal title</p>
      <button class="delete" aria-label="close"></button>
    </header>
    <section class="modal-card-body">
      <!-- Content ... -->
    </section>
    <footer class="modal-card-foot">
      <div class="buttons">
        <button class="button is-success">Save changes</button>
        <button class="button">Cancel</button>
      </div>
    </footer>
  </div>
</div>
```

```vue Vue collapse
<template>
  <BuModal v-model="open">
    <BuModalCard>
      <BuModalHead>
        <BuModalTitle>Modal title</BuModalTitle>
        <BuModalDelete />
      </BuModalHead>

      <BuModalBody>
        Content ...
      </BuModalBody>

      <BuModalFoot>
        <div class="buttons">
          <button class="button is-success">Save changes</button>
          <button class="button">Cancel</button>
        </div>
      </BuModalFoot>
    </BuModalCard>
  </BuModal>
</template>
```

:::

You write no `is-active` and no `.modal-background`. Compose `BuModalDelete` in the card head (or `BuModalClose` beside the content panel) for the documented X; omitting it is a valid head without a dismiss.

## Examples

::: ds-example
/systems/bulma/modal/card

### Card variant

Composing `BuModalCard` instead of `BuModalContent` gives Bulma's three-region layout — a sticky head and foot with a scrollable body, sized to the viewport. Compose `BuModalDelete` inside `BuModalHead` for the documented card-head X; a head without it is a title-only bar. Footer buttons still write `v-model` themselves.

Reach for it when the modal has an obvious title and a decision to commit — a form, a confirmation. The plain content variant, with its large corner close button, suits a modal whose body is a single self-contained block.
:::

## Props

`BuModal` renders `.modal` and its backdrop, and owns the open state. Everything else is a part.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `v-model` | `boolean` | `false` | Open state |
| `blocking` | `boolean` | `false` | Ignore clicks on `.modal-background` |

| Part | Renders | Notes |
|------|---------|-------|
| `BuModalContent` | `div.modal-content` | Plain variant panel; carries `role="dialog"` |
| `BuModalClose` | `button.modal-close` | Sibling of the content panel; `size` prop, default `large` |
| `BuModalCard` | `div.modal-card` | Card variant panel; carries `role="dialog"` |
| `BuModalHead` | `header.modal-card-head` | Slot only; compose Title and optional Delete |
| `BuModalTitle` | `p.modal-card-title` | Supplies the panel's accessible name |
| `BuModalDelete` | `button.delete` | Card-head X; `Dialog.Close` — not `BuModalClose` |
| `BuModalBody` | `section.modal-card-body` | Scrollable region |
| `BuModalFoot` | `footer.modal-card-foot` | Action row |

## Accessibility

The panel part — `BuModalContent` or `BuModalCard` — carries `role="dialog"` and `aria-modal`. Tab and Shift+Tab cycle inside the modal, Escape closes it, and focus returns to whatever opened it, including when the modal is unmounted while open.

> [!IMPORTANT]
> `BuModalCard` binds `aria-labelledby` to the id `BuModalTitle` renders. Compose a title, or that reference dangles and the dialog has no accessible name.

> [!NOTE]
> `blocking` gates backdrop clicks only. Escape still closes a blocking modal, matching Vuetify0's Dialog semantics and the native `dialog` element's cancel behavior.
