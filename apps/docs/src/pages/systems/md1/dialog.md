---
title: Md1Dialog - Material Design 1 Dialog for Vue
meta:
- name: description
  content: The Material Design 1 dialog in its alert, simple, confirmation and full-screen forms, on a native dialog element with side-by-side or stacked actions. Built on Vuetify0's Dialog and AlertDialog.
- name: keywords
  content: md1 dialog, material design 1 dialog, alert dialog, simple dialog, confirmation dialog, full-screen dialog, vue dialog, vuetify0 dialog, paper md1
features:
  category: Component
  label: 'C: Md1Dialog'
  level: 2
  renderless: false
  group: overlay
  order: 1
related:
  - /systems/md1
  - /systems/md1/button
  - /components/disclosure/dialog
  - /components/disclosure/alert-dialog
---

# Md1Dialog

<DocsPageFeatures :frontmatter />

The Material Design 1 dialog. A 24 dp sheet that interrupts with a decision: an alert, a list that commits on a tap, a choice that waits for OK, or a full-screen task on a handset.

> [!NOTE]
> Reference: [Dialogs, Material Design 1 guidelines](http://web.archive.org/web/20181225002255/https://material.io/archive/guidelines/components/dialogs.html), the archived page Material Design 1 is pinned to. Types, metrics, actions, scrolling and dismissal. This page is the Vue.

## Usage

`Md1Dialog` is a compound. The root owns the open state (`v-model`) and the committed choice (`v-model:value`); `Md1Dialog.Content` is the native `<dialog>` and the sheet inside it. `variant` picks one of the page's four types and defaults to `alert`.

::: ds-example
/systems/md1/dialog/basic
:::

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import { Md1Dialog } from '@paper/md1'
</script>

<template>
  <Md1Dialog>
    <Md1Dialog.Activator />

    <Md1Dialog.Content>
      <Md1Dialog.Title />

      <Md1Dialog.Text />

      <Md1Dialog.Actions>
        <Md1Dialog.Cancel />

        <Md1Dialog.Confirm />
      </Md1Dialog.Actions>
    </Md1Dialog.Content>
  </Md1Dialog>
</template>
```

## Composed on Vuetify0

`Md1Dialog` renders v0's [AlertDialog](/components/disclosure/alert-dialog) compound under `variant="alert"` and v0's [Dialog](/components/disclosure/dialog) compound for the other three types. Every part picks the matching v0 part from the root's variant, so one Material Design 1 tree serves both. `Dialog.Content` opens a native `<dialog>` with `showModal()`, which gives the top layer, focus containment, the inert page behind and Escape. `Title` and `Text` render `Dialog.Title` and `Dialog.Description`, which wire `aria-labelledby` and `aria-describedby` on the dialog only while they are mounted.

The scrim is the dialog's own `::backdrop` in `--md1-scrim`. Material Design 1 passes `scrim: false` to every `Dialog.Content` it renders and never mounts v0's `Scrim`, so one backdrop paints per dialog. An app that also mounts `<Scrim>` paints a second one.

`Cancel` and `Confirm` are flat [Md1Buttons](/systems/md1/button), each with its ripple. Under the alert they sit on the renderless `AlertDialog.Cancel` and `AlertDialog.Action`; otherwise `Cancel` sits on `Dialog.Close` and `Confirm` is a plain button that commits through the root. The root provides a `md1:dialog` context with `value` and `commit(value)`, the hook a list or a radio group inside the dialog calls. `Dialog.Close` names itself "Close" from the locale; Material Design 1 drops that label so the visible text stays the accessible name.

`data-variant`, `data-open`, `data-dismissible` and `data-scrolled` on the `<dialog>`, and `data-stacked` on the action row, are Material Design 1's own.

## Examples

::: ds-example
/systems/md1/dialog/title

### Alert with a title

Most alerts have no title: one or two sentences carry the question, as in the usage example. A title is for high-risk situations, and it must be a clear question or statement ("Erase USB storage?"), never "Warning!" or "Are you sure?".

The title is the Title style, Roboto Medium 20 sp on a 28 dp line, 24 dp from the top edge and 20 dp above the body text. The sheet rests at 24 dp, the elevation page's value for dialogs; under a mouse and keyboard it rests 2 dp lower, at 22 dp, like every resting surface. The text is Body 1 (14 sp) at the secondary ink; the page states no body style, so that is a Material Design 1 decision. The sheet keeps 24 dp of padding around its content and 24 dp below the text before the actions.

The 52 dp action area holds the two flat buttons: 8 dp around them and 8 dp between them, each at least 64 dp wide with 8 dp of internal padding. The affirmative action sits at the right edge and the dismissive action directly to its left. Under the alert, focus starts on the dismissive action, so an accidental Enter cannot erase anything.
:::

::: ds-example
/systems/md1/dialog/stacked

### Stacked actions

Side-by-side buttons fit only while each label fits the maximum button width, (dialog width - 8 - 8 - 8) / 2: 128 dp on a 280 dp dialog. `Md1Dialog.Actions` measures its labels and stacks itself when one is longer. Stacked buttons span the dialog as 48 dp touch targets, affirmative above dismissive, with the label text ending 16 dp from the right edge and the last target 8 dp from the bottom.

Pass `stacked` to force either layout. Keep labels to verbs that name the outcome. A dialog has at most two actions; a third, such as "Learn more", navigates away from the decision, so Material Design 1 warns in development when the row holds more than two.
:::

::: ds-example
/systems/md1/dialog/simple

### Simple dialog

A simple dialog is a list of choices with no buttons: choosing an option commits it and closes the dialog, and a tap outside or Escape cancels. The rows here are 56 dp single-line rows with 40 dp avatars, the avatar at the 24 dp keyline and the text at 80 dp, and the list ends 8 dp above the sheet's edge.

Each row calls `commit(value)` from the root's slot, which writes `v-model:value` and closes at once. On a handset the guidelines prefer a simple menu, which is less disruptive; reach for the simple dialog when menu text would wrap. The rows in this example are a v0 `Button.Root` with a ripple, standing in for the Material Design 1 list items.
:::

::: ds-example
/systems/md1/dialog/confirmation

### Confirmation dialog

A confirmation dialog holds one choice until the user confirms it. The radio group calls `commit` as the selection moves, but `v-model:value` changes only on OK. Cancel, Escape or a tap outside discards the change and the next opening starts from the committed value.

`Confirm` stays disabled while nothing is chosen: the affirmative action waits for a choice, and its label drops to the disabled ink, 26% black on the light theme and 30% white on the dark one. The dismissive action is never disabled. The radios in this example are v0 `Radio` parts in the accent colour, standing in for the Material Design 1 radio.
:::

::: ds-example
/systems/md1/dialog/scrolling

### Scrolling content

Dialogs avoid scrolling content, but some lists, such as ringtones, must scroll. The sheet stays at least 24 dp from the top and bottom of the screen and 40 dp from the sides; past that height the content scrolls inside it. While it does, the dialog is marked `data-scrolled` and a 12% stroke appears above the actions, within the button area.

The actions stay in place while the list scrolls. In a simple or confirmation dialog the title is pinned too, so it and the selected item stay visible together; over plain text, the title scrolls off with the content.
:::

::: ds-example
/systems/md1/dialog/dismissible

### Dismissal disabled

A dialog dismisses on a tap outside and on Escape, the web's Back gesture. `dismissible` set to `false` disables both, so one of the actions must be chosen. The page allows it for decisions the user cannot defer.

Keep a dismissive action in the row when dismissal is disabled. Without one, a keyboard user has no way out but the affirmative action.
:::

::: ds-example
/systems/md1/dialog/full-screen

### Full-screen dialog

Full-screen dialogs are a handset form for complex tasks: changes are not saved in real time and nothing is kept until the verb is tapped. Under 600 px the dialog fills the screen with no corners and no shadow; the app bar carries the depth. From 600 px the same tree renders as a 560 px sheet at 24 dp.

The app bar has the discard X at the left, the title on the 72 dp keyline and the verb (save, send, create; never done or OK) at the right. The X calls the root's `close`. With `dirty` set, closing by the X, Cancel or Escape first asks "Discard changes?" in a nested alert, the one dialog a dialog may open. Full-screen dialogs ignore taps outside: there is no outside. The app bar in this example is styled by the docs page and stands in for the Material Design 1 toolbar.
:::

## Props

<!-- Hand-authored, temporarily. These pages predate DocsApi extraction for
     @paper/* packages; once the generator covers the design systems this table
     is replaced by <DocsApi />. Keep it in sync with Md1Dialog.vue until then. -->

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `boolean` | `false` | Open state; bind with `v-model` |
| `value` | `unknown` | | The committed choice of a simple or confirmation dialog; bind with `v-model:value`. Written on OK, or at once by a simple dialog's `commit` |
| `variant` | `'alert' \| 'simple' \| 'confirmation' \| 'full-screen'` | `'alert'` | The dialogs page's four types. `alert` composes v0 `AlertDialog` (role `alertdialog`); the rest compose v0 `Dialog` |
| `dismissible` | `boolean` | `true` | `false` disables the outside tap and Escape, so an action must be chosen |
| `dirty` | `boolean` | `false` | A full-screen dialog with unsaved changes: closing it asks before discarding. Set on another variant, it warns in development |
| `id` | `string` | | The dialog's id; generated when unset |
| `namespace` | `string` | | The v0 context key the parts resolve. Leave it unset unless two dialogs must not collide |

The root's default slot receives `isOpen`, `open`, `close`, `value` (the choice held while open) and `commit(value)`.

### Parts

| Part | Props | Notes |
|------|-------|-------|
| `Md1Dialog.Activator` | `namespace` | Renderless. Spread its `attrs` slot prop onto an `Md1Button`: `aria-haspopup`, `aria-expanded` and the open handler |
| `Md1Dialog.Content` | `namespace` | The `<dialog>`: `::backdrop` in `--md1-scrim`, a sheet between 280 and 560 px at 24 dp (22 dp under a mouse and keyboard), `data-variant`, `data-open`, `data-dismissible`, `data-scrolled`. Names the dialog by its text when there is no title |
| `Md1Dialog.Title` | `namespace` | `<h2>`, Medium 20 sp on 28 dp; names the dialog. Pinned in simple and confirmation dialogs |
| `Md1Dialog.Text` | `namespace` | Body 1 at the secondary ink; describes the dialog. Takes 24 dp from the top when there is no title |
| `Md1Dialog.Actions` | `stacked` | The 52 dp action row. Stacks itself when a label exceeds (width - 24) / 2; `stacked` forces either layout (`data-stacked`) |
| `Md1Dialog.Cancel` | `namespace` | Flat button, "Cancel" by default. Closes and discards; a dirty full-screen dialog prompts first |
| `Md1Dialog.Confirm` | `namespace`, `disabled` | Flat button, "OK" by default. Commits `value`, emits `confirm` with it and closes. Disabled while a confirmation dialog holds no choice |

Labels come from the locale (`Md1.cancel`, `Md1.ok`, `Md1.discard`, `Md1.discardChanges`) with English fallbacks; a part's default slot replaces its label. There are no named slots.

## Accessibility

`Md1Dialog.Content` is a native modal `<dialog>`: the page behind it is inert, focus moves inside on open and returns to the activator on close. The alert renders `role="alertdialog"` and the other variants `role="dialog"`, both with `aria-modal="true"`. The title is the accessible name and the text the description. Most alerts have no title, so an alert without one is named by its text, the question it asks, and carries no separate description. A consumer `aria-label` on `Md1Dialog.Content` takes precedence. A simple dialog may omit its title too; its list is not a name, so give its `Md1Dialog.Content` an `aria-label`.

### Keyboard

| Key | Behavior |
|-----|----------|
| Tab, Shift+Tab | Moves focus through the dialog's controls; the page behind is inert |
| Escape | Dismisses the dialog. Ignored when `dismissible` is `false`; a dirty full-screen dialog asks before discarding |
| Enter, Space | Activates the focused action or choice |

### Focus

An alert focuses its dismissive action on open, so a stray Enter does not confirm a destructive choice. Other dialogs focus their first focusable control. When the dialog closes, focus returns to the element that opened it.

### Actions

The visible label is each action's accessible name. Labels are uppercased by the stylesheet, so assistive technology reads the sentence-case source. A disabled `Confirm` is a native disabled button: skipped by Tab and announced as unavailable.
