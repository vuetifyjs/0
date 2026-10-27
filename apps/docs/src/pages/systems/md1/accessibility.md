---
title: Accessibility - Material Design 1 Focus Order, Scaling and Labels for Vue
meta:
- name: description
  content: Material Design 1 accessibility. Focus order that follows the layout, UI that survives magnification, accessible names written as actions, with contrast and touch targets.
- name: keywords
  content: md1 accessibility, material design 1 accessibility, focus order, screen reader labels, aria-label, magnification, large text, touch targets, contrast, paper md1
features:
  category: Guide
  label: 'Accessibility'
  level: 2
  group: style
  order: 7
related:
  - /systems/md1
  - /systems/md1/layout
  - /systems/md1/color
  - /systems/md1/bidirectionality
---

# Accessibility

<DocsPageFeatures :frontmatter />

Material Design 1 components carry their own roles, keyboard handling and touch targets; what is left to the app is the order of the screen, how it survives magnification, and the words a screen reader speaks.

<DocsMd1Reference
  href="https://m1.material.io/usability/accessibility.html"
  title="Accessibility"
/>

## Where the rest lives

The accessibility page's other figures are shown where the rule is implemented:

| Rule | Page |
|------|------|
| Text and icons meet the contrast ratio against their background | [Color](/systems/md1/color) |
| An error is shown by colour, text and an icon, never colour alone | [Errors](/systems/md1/errors) |
| Touch targets are at least 48 x 48 dp, with 8 dp between them | [Layout](/systems/md1/layout) |
| A slider's value sits close to the control | [Slider](/systems/md1/slider) |
| Use the standard dialog for a standard dialog task | [Dialog](/systems/md1/dialog) |
| Label icon-only controls | [Md1Icon](/systems/md1/icon) |
| Right-to-left layouts mirror | [Bidirectionality](/systems/md1/bidirectionality) |

## Examples

::: ds-example
/systems/md1/accessibility/focus-order

### Focus order

Place the most important actions at the top of the screen, where they lead the hierarchy, and let focus follow the same order the eye does: top to bottom, start to end, most important first. The green circles number each stop in the order Tab reaches it. The navigation button, the toolbar's actions, the messages and finally the FAB.

Focus order is source order, so lay the template out in reading order rather than repositioning elements with CSS. The toolbar's actions are one stop: inside it the arrow keys move between them, the roving tab stop that `Md1Toolbar.Actions` provides. The FAB is fixed to the screen's corner but comes last in the source, so it is reached last. Tab into the screen to see the numbers follow focus.
:::

::: ds-example
/systems/md1/accessibility/large-text

### Magnification and large text

A layout has to survive magnification and large text without overlapping or clipping its content. Material Design 1 writes every size in px, following the units page's rule that dp and sp are written as px, so browser zoom and screen magnifiers scale the whole UI together. The screen keeps its physical width and its content gets fewer pixels to lay out in: at 200% this 360 dp screen has 180 px of room.[^zoom-magnification]

The components take the space they are given. The title truncates in the app bar, the card's actions wrap to a second line, the list's text wraps under its keyline, and the screen scrolls instead of letting content collide. Build app layouts the same way: flexible widths, wrapping rows, and no fixed heights around text.
:::

::: ds-example
/systems/md1/accessibility/labels

### Accessible names

An icon-only control needs a name, and the name should say what happens, not what the control is or looks like. Each card's caption is the accessible name read back from the DOM, the text a screen reader announces.

- Name the action and its target: "Switch to heyfromjonathan@gmail.com", not "Account switcher".
- Leave out the control's type and state. The role is announced already, so "Search", not "Search field"; the checkbox announces whether it is checked, so its label is "Download over Wi-Fi only".
- Describe the action, not the picture: "Edit", not "Pencil".
- Name the navigation button by what it does: "Show/hide navigation menu" is preferred and "Show/hide main menu" acceptable; "Side drawer" says nothing about the result.
- Pair the task with the input method when it matters, "Voice search", and never write "Tap": a control can be activated by a keyboard, a switch or a voice command too.
:::

## Accessibility

`Md1Button` with `icon` and `Md1IconToggle` warn in development when an icon-only control has no accessible name. `Md1Toolbar.Nav` names itself from its glyph when no `aria-label` is passed; pass one when the button's action needs more words, as the focus order example does. The ink ripple and transitions follow the reduced-motion preference, as the [Motion](/systems/md1/motion) page describes.

[^zoom-magnification]: Our call: the example scales a fixed 360 dp screen with CSS `zoom` at 100%, 150% and 200%, an approximation of browser zoom and magnification.
