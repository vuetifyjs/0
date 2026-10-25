---
title: Writing - Material Design 1 UI Copy Guidelines for Vue
meta:
- name: description
  content: The Material Design 1 writing guidelines on real components. Sentence-case source text, uppercase button labels by CSS, the stock button labels and default copy through useLocale.
- name: keywords
  content: md1 writing, material design 1 writing, ui copy, button labels, sentence case, capitalization, punctuation, useLocale, vue, paper md1
features:
  category: Guide
  label: 'Writing'
  level: 1
  group: style
  order: 6
related:
  - /systems/md1
  - /systems/md1/typography
  - /systems/md1/dialog
  - /systems/md1/snackbar
  - /composables/plugins/use-locale
---

# Writing

<DocsPageFeatures :frontmatter />

Material Design 1's copy rules, set in the components they govern: dialogs, snackbars, buttons, lists, fields and empty states, each carrying the guidelines' own wording.

> [!NOTE]
> Reference: [Writing, Material Design 1 guidelines](https://m1.material.io/style/writing.html), the archived page Material Design 1 is pinned to. Language, tone, capitalization and punctuation, button text and global writing. This page is the Vue.

## Usage

Write every string in sentence case, the way the guidelines print it, and let the components do the rest. The one place the guidelines require capitals is button text, and Material Design 1 applies it with `text-transform: uppercase` in the Button style, so the source string stays "Learn more" and the screen shows LEARN MORE:

```vue
<script setup lang="ts">
  import { Md1Button } from '@paper/md1'
</script>

<template>
  <Md1Button>Learn more</Md1Button>
</template>
```

Screen readers announce the source text, so a label written in capitals would be spelled out letter by letter on some readers; sentence case in the source avoids that. Copy that a component writes itself, such as the Cancel and OK of a dialog or the Continue of a stepper, comes from the guidelines' button table through `useLocale` (see [Default copy](#default-copy)).

## Default copy

Material Design 1 ships no message catalogue. Every component that writes its own text asks the app's locale first and falls back to an English string inline: `useLocale().ti('Md1.ok') ?? 'OK'`. Register the keys under `Md1.` in your locale plugin's messages and every component picks them up; leave them out and the English defaults apply.

| Key | English default | Written by |
|-----|-----------------|------------|
| `Md1.ok` | OK | `Md1Dialog.Confirm` |
| `Md1.cancel` | Cancel | `Md1Dialog.Cancel`, `Md1Stepper.Actions`, the data table's inline edit |
| `Md1.dismiss` | Dismiss | no visible label: the snackbar refuses it, and Cancel, as an action in dev |
| `Md1.continue` | Continue | `Md1Stepper.Actions` |
| `Md1.back` | Back | the mobile stepper bar; the accessible name of the toolbar and search bar back buttons |
| `Md1.next` | Next | the mobile stepper bar |
| `Md1.discard`, `Md1.discardChanges` | Discard, Discard changes? | the full-screen dialog's discard prompt |
| `Md1.save`, `Md1.edit` | Save, Edit | the data table's inline edit |

The guidelines' table also names Done, Got it, Learn more, No thanks, Not now and Skip. No component writes those for you; they are labels you place on your own buttons, and the first example shows each with its use. The full key list, accessible names included, is in the package's `SPEC.md` under "Locale keys with inline English fallbacks".

::: ds-example
/systems/md1/writing/labels
:::

## Examples

::: ds-example
/systems/md1/writing/language

### Language

The guidelines' language rules, each set in the component that would carry it. Address the user as "you", and use "we" only when a person acts for them, as in the appeal snackbar. Keep sentences short and in the present tense, drop introductory phrases ("Save changes?", "Message sent", "Register to vote") and prefer everyday words: "Turn on", not "Enable"; "Preparing video…", not "Buffering…".

Name a control by its label, not its type ("Click Continue"), and keep one verb for one action: the list item, the dialog title and its confirm button all say "Remove". Numbers are numerals, the objective comes before the instruction, detail is revealed only when it is needed, and absolutes such as "never" are left out.

The dialogs are drawn in place from the dialog tokens, because a modal dialog shows one at a time; open a real one from the [Dialog](/systems/md1/dialog) page. The snackbars are real `Md1Snackbar`s held on screen.
:::

::: ds-example
/systems/md1/writing/tone

### Tone

Friendly, humble, inviting, positive and essential. The unresponsive-app dialog states the problem and asks one question, without an apology or the activity's internal name. Feature copy says what a feature does without promising ("All your savings in one place", "More restaurant reviews") and leads with the benefit, as the Location mode setting does.

Errors say what to do rather than what went wrong: the file name helper states the limit as a goal, and the snackbar's action reads "Try again". The sign-in progress keeps only the detail the user needs to wait it out.
:::

::: ds-example
/systems/md1/writing/punctuation

### Capitalization and punctuation

Sentence case for titles, labels and menu items, as in the "Search settings" placeholder; the button below the welcome card is still all caps, because the Button style capitalises it. A solitary sentence takes no period, as in the bulk-edit dialog's body, but a sentence followed by a link does, before the link. Labels take no colon ("Share with"), contractions are welcome where they read more easily, and the exclamation point is kept for greetings.
:::

::: ds-example
/systems/md1/writing/global

### Global writing

The same screen in English, Japanese, Thai and Arabic. Only the strings and the `lang` and `dir` attributes change: the type scale switches to its dense and tall rules on `lang` (see [Typography](/systems/md1/typography)), and under `dir="rtl"` the Arabic screen mirrors, the navigation and actions trading sides and the directional icons flipping. Dates come from `Intl.DateTimeFormat` in each language rather than from a string.

Write the English in plain words so it translates, and avoid "left" and "right" in copy, since a mirrored interface reverses them. The Japanese and Thai screens load Noto Sans JP and Noto Sans Thai from Google Fonts; your app must load a font for every script it ships.
:::

## Accessibility

Sentence-case source text is what assistive technology reads: the uppercase button labels are a CSS transform, so "Learn more" is announced as words. Give the Material Design 1 locale keys translations as well as your own strings, because several of them are accessible names, not visible text (`Md1.loading`, `Md1.selectAll`, `Md1.navigation`). Set `lang` on any passage in another language and `dir` on any right-to-left subtree, as the global example does, so a screen reader picks the right voice and the layout mirrors.
