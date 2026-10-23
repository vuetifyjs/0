---
title: Errors - MD1 Material Design 1 Errors Pattern for Vue
meta:
- name: description
  content: The Material Design 1 errors pattern in MD1. Inline field errors, form submission summaries, blocking alert dialogs, peripheral snackbars with retry and failed-to-load states.
- name: keywords
  content: md1 errors, material design 1 errors, form validation, error text, error dialog, snackbar retry, empty state, vue form errors, paper md1
features:
  category: Guide
  label: 'Errors'
  level: 2
  renderless: false
  group: patterns
  order: 5
related:
  - /systems/md1
  - /systems/md1/text-field
  - /systems/md1/dialog
  - /systems/md1/snackbar
  - /components/forms/form
---

# Errors

<DocsPageFeatures :frontmatter />

How an MD1 app reports what went wrong: next to the field that caused it, in a dialog when work cannot continue, or in a snackbar when it can.

> [!NOTE]
> Reference: [Errors, Material Design 1 guidelines](http://web.archive.org/web/20181225002255/https://material.io/archive/guidelines/patterns/errors.html), the archived page MD1 is pinned to. Error types, form rules, text metrics and app errors. This page is the Vue.

## Usage

Errors are a pattern, not a component. MD1 ships no error surface of its own; every error on this page is an `Md1TextField`, an `Md1Dialog`, an `Md1Snackbar` or plain content, composed the way the guidelines describe. Three rules apply to all of them:

- Say clearly what happened.
- Say how to fix it.
- Keep as much of what the user entered as possible.

Prevent errors before reporting them. Accept common formats, so a phone number typed with spaces or brackets is still a phone number.

::: ds-example
/systems/md1/errors/inline
:::

## Where an error goes

The guidelines sort errors into three types. Each type maps to one surface.

| Error | Example | Surface |
|-------|---------|---------|
| User input | A field the app cannot understand | Error text under the field (`Md1TextField` `rules` or `errorMessages`) |
| User input, on submit | Fields that are empty or disagree | Error text on each field, plus a summary at the top of the form |
| App, blocking | Storage full, account suspended | `Md1Dialog` alert with an action that resolves it |
| App, peripheral | A refresh that failed | `Md1Snackbar` with a Retry action; transient, never for critical, persistent or bulk errors |
| App, failed to load | A section of the screen did not arrive | An empty state with an action, inside that section only |
| App, unavailable feature | An action that cannot run yet | The control disabled, with text that says why |
| Incompatible state | Calling in airplane mode | A snackbar, plus a persistent indicator of the mode the user chose |

When sync is down or a section fails to load, the rest of the app stays usable. Keep loading indicators up until the error message replaces them, and offer an action only when it can work: no Try again when the app can already tell the operation will fail.

A permission the app needs is not an error. Ask for it in the flow, at the moment the feature needs it, or in the first-run experience when the app cannot start without it.

## Text field metrics

The errors page restates the text field metrics for the error state. The [text field](/systems/md1/text-field) page owns them; they are listed here because the pattern depends on them.

| Measure | Value |
|---------|-------|
| Space between fields, and below the error text | 16 dp |
| Error text | Roboto Regular 12 sp, the Caption style |
| Hint and helper text | Black at 38% on light, white at 50% on dark (`--md1-text-hint`) |
| Error color | A warm, contrasting hue; MD1's is Red A400 (`--md1-error`, `#FF1744`) |
| Single line with error text | 64 dp tile; 16 dp above the input, 8 dp below it, 4 dp above and below the error |
| Floating label with error text | 80 dp tile; 8 dp above the label, 8 dp above and below the input, 4 dp above and below the error |
| Character counter | Roboto Regular 12 sp; 88 dp input area; 16 dp extra bottom padding; 8 dp above the counter |

## Examples

::: ds-example
/systems/md1/errors/inline

### Helper text that becomes error text

Helper text can show before, during and after the user works in a field. Error text shows only after the user has interacted with it. Here the Phone field carries helper text from the start; the rule runs when focus leaves the field, and if fewer than seven digits were typed the helper line turns into the error message in the same place, in the error color, while the underline turns red.

Validation on blur is `Md1TextField`'s default (`validateOn: 'blur'`), which is the guideline's timing: an empty field the user never touched is not an error. The rule counts digits only, so "(555) 010-2030" and "5550102030" are the same answer; accepting both is the cheaper way to avoid an error than explaining one.

Keep form text to the essentials. Not every field needs helper text, and not every field needs a rule: the Name field below has neither.
:::

::: ds-example
/systems/md1/errors/counter

### Over the character count

A counter can show before, during and after interaction, but the guidelines suggest holding it back until the user approaches the limit. This example passes `counter` only once the text reaches 80% of the 60-character limit, so a short status never shows "12 / 60".

The status starts past the limit. Over it, `Md1TextField` turns to its error state on its own: the counter and the underline take the error color and the field reports itself invalid. No rule is needed for the limit. The counter is 12 sp Roboto Regular at the end of the details row, 8 dp under the line. The guidelines also give a field with a counter 16 dp of extra bottom padding and an 88 dp input area (see Text field metrics above). `counter` also takes `{ words: n }` when the limit is a word count.
:::

::: ds-example
/systems/md1/errors/submission

### Errors on submission

The submit button is enabled by default. Disabling it is allowed only when inline validation already marks the field in error, because a disabled button cannot tell the user what is missing. Press Create account with the form empty to see the submission path.

The form is v0's `Form`, and each `Md1TextField` registers with it. Calling the `submit` slot function validates every field, so each empty or incompatible field shows its own error text below it. A summary at the top of the form lists the fixes needed, and the form scrolls back to the top so the summary is the first thing read. The summary is derived from the same rules, so it shrinks as each field is fixed; the individual errors resolve the same way.

Confirm email shows the incompatible values rule: when two fields disagree, the field that needs the fix carries the message, and the summary explains it. Display an incomplete-form error as soon as the user moves past a field they skipped; when the app cannot tell how far the user got, wait for the submit, as this example does.

`Md1Button` always renders `type="button"`, so the form is submitted by calling the slot's `submit()` from the button's click rather than by a native submit.
:::

::: ds-example
/systems/md1/errors/blocking

### Blocking error

An error that stops normal operation is an alert dialog. Press Send: the message cannot go out because storage is full, and the dialog says so in plain words, says what to do, and offers the action that fixes it. Manage storage is the resolution; Not now is the way out.

The dialog has no title. An alert's message is short enough to be read whole, and a title such as "Error" would add a word without adding information. Name the cause instead. Never imply the user is at fault.

Use a dialog only when the app truly cannot continue. Most errors are peripheral, and a modal for each one turns a small failure into an interruption; the next example is the usual alternative.
:::

::: ds-example
/systems/md1/errors/snackbar

### Peripheral error with retry

A snackbar carries a peripheral error: something failed, but the rest of the app still works. The feed below is from 10:42 and stays on screen; the snackbar at the bottom edge says the refresh failed and offers Retry. Retry runs the refresh again, with a linear progress indicator across the top edge while it works, and succeeds. Press Refresh to see the failure again: in this example a plain refresh always fails.

Snackbars are transient. This one leaves after MD1's 6000 ms default and never comes back on its own, which is why it suits a failure the user can ignore. Do not use a snackbar for a critical error, for one that persists until the user acts, or for a batch of errors at once.

Offer Retry only when it can succeed. When the app can tell the connection is down, it is offline, and the [offline states](/systems/md1/offline-states) pattern applies instead.
:::

::: ds-example
/systems/md1/errors/failed-load

### Failed to load

When one section of a screen fails to load, the error belongs to that section. The article here loaded; its comments did not. The comments section reports the failure in its own space with a Retry action, and everything around it stays readable and usable.

A failed section is an empty state with an action, sized to the container it replaces. Reach for a full-screen empty state only when the whole screen depends on the missing content, such as a screen that only works online.
:::

::: ds-example
/systems/md1/errors/disabled

### Unavailable feature

Not every error needs its own surface. A feature that cannot run yet can be shown disabled, paired with text that explains why and when it will be available. Here Export report is disabled while the report processes, and the caption under it gives the reason and the wait.

A disabled control cannot take focus, so the explanation must be visible text, not a tooltip on the button. The caption is also linked to the button with `aria-describedby` for screen readers that read it in browse mode.
:::

## Accessibility

Error text from `Md1TextField` is tied to its input: the input sets `aria-invalid` and points `aria-errormessage` at the message, so a screen reader reports the error when focus returns to the field. Color is never the only signal. The message is text, and the underline thickens as it turns red.

| Surface | Announced through |
|---------|-------------------|
| Field error | `aria-invalid` and `aria-errormessage` on the input; helper text through `aria-describedby` while the field is valid |
| Submission summary | `role="alert"` on the summary, read as soon as it appears |
| Blocking dialog | The `alertdialog` role; focus moves into the dialog and returns to the trigger |
| Snackbar | The snackbar's `role="status"` live region; the Retry action is reachable by Tab |

Error text uses the Caption style at 12 sp, so check its contrast against the surface it sits on: the guidelines ask for noticeable contrast, and the 4.5:1 floor applies.
