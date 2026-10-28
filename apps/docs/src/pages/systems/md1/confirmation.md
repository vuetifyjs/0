---
title: Confirmation - Material Design 1 Confirmation and Acknowledgement for Vue
meta:
- name: description
  content: The Material Design 1 confirmation and acknowledgement pattern. Confirm a destructive action in a dialog, acknowledge an implicit one in a snackbar, offer undo.
- name: keywords
  content: md1 confirmation, material design 1 confirmation, acknowledgement, confirm dialog, undo snackbar, toast, vue confirm delete, paper md1
features:
  category: Guide
  label: 'Confirmation'
  level: 2
  renderless: false
  group: patterns
  order: 7
related:
  - /systems/md1
  - /systems/md1/dialog
  - /systems/md1/snackbar
  - /systems/md1/list
---

# Confirmation and acknowledgement

<DocsPageFeatures :frontmatter />

Ask before an action the user may regret, and say so after an action the app took on its own, with a way back when there is one.

<DocsMd1Reference
  href="https://m1.material.io/patterns/confirmation-acknowledgement.html"
  title="Confirmation and acknowledgement"
/>

## Usage

Two text responses to an action, each with its own surface:

- **Confirming** asks the user to verify, before it happens, that they want the action they just invoked. It is an `Md1Dialog`.
- **Acknowledging** tells the user, after it happened, that the action is complete. It is an `Md1Snackbar`, with an Undo action when the action can be reversed.

Not every action needs either. Skip confirmation when the consequences are reversible or negligible: selecting a photo already shows a check mark, and asking again would only slow the user down. An action that can be undone is better acknowledged with Undo than confirmed in advance.

::: ds-example
/systems/md1/confirmation/dialog

The dialog is `Md1Dialog`'s default `alert` variant, titled with the action, Delete "Summer 2016"?, never "Are you sure?", so the user can check they pressed the right thing. Do not confuse it with the `confirmation` variant, which in the dialogs page's vocabulary holds a choice, such as a ringtone, until OK commits it.
:::

## Choosing the response

| Action | Response | Surface | Stays |
|--------|----------|---------|-------|
| Destructive and permanent, such as deleting an album from every device | Confirm | `Md1Dialog`, alert variant, titled with the action | Until the user chooses |
| Implicit, such as a draft saved when the user leaves the compose screen | Acknowledge | `Md1Snackbar` with no action, the toast form | A few seconds, then fades |
| Reversible, such as deleting a conversation | Acknowledge with undo | `Md1Snackbar` with `action="Undo"` | Until an unrelated action, such as scrolling the list |
| Negligible or already visible, such as selecting an item | Neither | None | |

A confirmation can carry the warning or critical information the user needs to decide. An acknowledgement removes doubt about something the system did without being asked.

## Examples

::: ds-example
/systems/md1/confirmation/toast

### Acknowledging an implicit action

Saving a draft when the user navigates back or up from the compose screen is an implicit operation: the user did not press Save, so they may wonder whether their text survived. Press the Up arrow in the app bar. The compose screen closes and a toast says "Draft saved".

A toast is a snackbar with no action. It fades after a few seconds; Material Design 1's snackbar leaves after its 6000 ms default (`timeout`), a duration the guidelines do not state.[^snackbar-timeout] Hovering or focusing the snackbar pauses the timer, so it does not disappear while it is being read.[^snackbar-pause]

Keep the message short and in the past tense. It reports a fact, not a choice, so it needs no button.
:::

::: ds-example
/systems/md1/confirmation/undo

### Acknowledging with undo

Delete a conversation. It leaves the list at once, and the snackbar acknowledges it with an Undo action. Undo puts the conversation back where it was. Because the action can be reversed, it is not confirmed first: undo is cheaper for the user than a dialog on every delete.

The guidelines keep this acknowledgement on screen until the user takes an unrelated action, such as scrolling the list. The example closes the snackbar on the list's `scroll` event for that reason. Material Design 1's snackbar is never persistent (the snackbars page), so it also leaves after the 6000 ms default[^snackbar-timeout]; keep your undo window at least that long in the data layer, and commit the delete only when the snackbar is gone.

Each row's delete button is an `Md1Button` icon in `Md1List.Action`, the end column that is its own target, and carries an `aria-label` that names the conversation.
:::

## Accessibility

| Surface | What the user hears | Focus |
|---------|--------------------|-------|
| Confirmation dialog | The `alertdialog` role with the title as its name and the body as its description | Moves into the dialog on open and back to the trigger on close; Escape cancels |
| Toast | The message, through the snackbar's `role="status"` live region | Stays where it was |
| Undo snackbar | The message, then the Undo action as a button | Stays where it was; Undo is reachable by Tab |

A snackbar that leaves on a timer is hard to reach for someone moving slowly through the page, which is why it pauses while hovered or focused. Do not make Undo the only way to recover something important: deleted items should still be recoverable from a trash or history view when the action matters.

[^snackbar-timeout]: Vuetify 1.5.24, components/VSnackbar/VSnackbar.ts:22-24. The 6000 ms `timeout` default.

[^snackbar-pause]: Our call: the snackbars page says nothing about pausing; the timer holds while the message has hover or focus.
