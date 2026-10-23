---
title: Help and Feedback - Material Design 1 Help and Feedback for Vue
meta:
- name: description
  content: The Material Design 1 help and feedback pattern. Where Help and Send feedback go in the drawer, overflow menu and app bar, the help screen, the feedback dialog and help tooltips.
- name: keywords
  content: md1 help, material design 1 help and feedback, send feedback, help screen, overflow menu, navigation drawer order, help tooltip, vue help, paper md1
features:
  category: Guide
  label: 'Help and feedback'
  level: 2
  renderless: false
  group: patterns
  order: 20
related:
  - /systems/md1
  - /systems/md1/toolbar
  - /systems/md1/menu
  - /systems/md1/navigation-drawer
  - /systems/md1/dialog
---

# Help and feedback

<DocsPageFeatures :frontmatter />

Where people find answers inside a Material Design 1 app, and how they send comments, bug reports and questions the answers do not cover.

> [!NOTE]
> Reference: [Help and feedback, Material Design 1 guidelines](http://web.archive.org/web/20181225002255/https://material.io/archive/guidelines/patterns/help-feedback.html), the archived page Material Design 1 is pinned to. Placement, behavior, icons and writing. This page is the Vue.

## Usage

Help is placed in the app's navigation, usually under the labels "Help" and "Send feedback". Where it goes depends on the app:

| App | Help goes in |
|-----|--------------|
| Has a navigation drawer | The drawer: "Help" last, "Send feedback" directly above it |
| Has no drawer | The overflow menu: "Help" and "Send feedback" (or "Feedback") |
| Complex, or with urgent issues such as payments | The drawer and a Help action on the app bar; desktop apps may add the app bar action too |
| Either, with "Sign out" | "Sign out" is the last item, below Help |

Settings sit above Help and Send feedback, the order the settings pattern sets. Selecting Help goes straight to help content; never to an intermediate screen that asks the user to choose between Help and something else.

::: ds-example
/systems/md1/help-feedback/drawer
:::

## Icons

Help and Send feedback icons are 24 dp. Help tooltip icons are 18 dp. Use the standard glyphs only: no speech bubbles, circled or outlined variants for Help, and no chat or bug glyphs for Send feedback.

| Glyph | Role | Size | Used for |
|-------|------|------|----------|
| Help | `help` | 24 dp | Help in the drawer, the menu and the app bar |
| Feedback | `feedback` | 24 dp | Send feedback |
| Help outline | `help-outline` | 18 dp | Help tooltips, and nothing else |

Icon opacity follows the icons page, and Material Design 1 carries it as theme tokens:

| Theme | Active (`--md1-icon-active`) | Inactive (`--md1-icon-inactive`) |
|-------|----------------------------------|--------------------------------------|
| Light | Black at 54% | Black at 38% |
| Dark | White at 100% | White at 50% |

> [!WARNING]
> Material Design 1's pinned icon set ships `help` but not `feedback` or `help-outline`. Until it does, register them app-wide through `createMd1IconsPlugin({ icons })`. The examples on this page register them for their own subtree with `createMd1IconsContext({ icons })`, which takes the same options. The path data is the Material Icons source at the commit the set is pinned to.

## Examples

::: ds-example
/systems/md1/help-feedback/drawer

### In the navigation drawer

An app with a navigation drawer puts Help last in it, with Send feedback directly above. Here the drawer's second group reads Settings, Send feedback, Help. If the app had Sign out in the drawer, it would go below Help as the very last item.

The drawer is a permanent `Md1NavigationDrawer` with two `Md1List` groups split by an `Md1Divider`. Each destination draws its glyph through `Md1List.Icon` at 24 dp in the active icon ink.
:::

::: ds-example
/systems/md1/help-feedback/overflow

### In the overflow menu

Without a drawer, Help and Send feedback go in the app bar's overflow menu. Open the menu from the more-vert button: Settings comes first, then Send feedback, then Help, and Sign out closes the list.

The menu is an `Md1Menu` opened from an `Md1Button` icon in `Md1Toolbar.Actions`. The arrow keys, Home and End move between the app bar actions, and the menu has its own keyboard model once open.
:::

::: ds-example
/systems/md1/help-feedback/app-bar

### On the app bar

A complex app, or one where people come for help with something urgent such as a refund, promotes Help to an action on the app bar so it is one press away. It stays in the drawer too; the app bar action is a shortcut, not a move.

The Help action is an `Md1Button` with `icon="help"` and an `aria-label`, ahead of the overflow button. Desktop apps have the room to do the same even when they are not complex.
:::

::: ds-example
/systems/md1/help-feedback/screen

### The help screen

Help opens on content relevant to where the user was. This user came from the account screen, so the help screen leads with account topics under an `Md1Subheader`, each an `Md1List` row.

A Send feedback button sits on the help screen for questions the articles do not answer. Pages people visit less often, About, Privacy policy and Terms of service, go in the screen's overflow menu instead of taking space on the page. The Up arrow in the app bar returns to where the user came from.

Write help content to be scanned: one question per article, short explanations, plain words instead of technical terms, headings, and the labels of buttons and links in bold when the text refers to them. Show images or icons for step-by-step instructions.
:::

::: ds-example
/systems/md1/help-feedback/feedback

### Sending feedback

Send feedback opens a dialog with one multi-line `Md1TextField` for the message. The dialog is `Md1Dialog` with the `confirmation` variant: the text is held while the dialog is open, Send commits it through `v-model:value`, and Cancel or leaving the dialog discards it. Send is disabled while the field is empty: the dialog's own rule keeps it off until a value is held, and the example's `disabled` binding keeps it off again if the text is cleared.

The guidelines place the Send feedback entry points and leave the form itself to the app. This one keeps to a single field, with helper text asking people not to include passwords or other personal details.
:::

::: ds-example
/systems/md1/help-feedback/tooltip

### Help tooltips

A help tooltip explains one field in place. Its activator is the help-outline glyph at 18 dp, smaller than the 24 dp system icon and never the solid Help glyph, so it reads as a hint and not as a destination.

The activator is an icon-only `Md1Button` with an `aria-label` that states the question, wrapped in `Md1Tooltip`, so the tip opens on hover, on focus and on long press. Keep the tip to a sentence; anything longer belongs in the help screen.

Unsolicited help, content that appears without being asked for, is limited to new features and new gestures, because it interrupts. Material Design 1's [feature discovery](/systems/md1/feature-discovery) component is the surface for it.
:::

## Accessibility

Help and Send feedback are destinations, so they are named by their visible labels in the drawer and the menu. Icon-only entry points, the app bar Help action and the tooltip activator, carry an `aria-label` that says where they lead or what they answer.

| Entry point | Name | Keyboard |
|-------------|------|----------|
| Drawer item | Its label | Tab into the list, Enter or Space to select |
| Overflow menu item | Its label | Arrow keys inside the open menu, Enter to select, Escape to close |
| App bar Help action | `aria-label="Help"` | Arrow keys between app bar actions |
| Help tooltip | The button's `aria-label`; the tip is its description | Focus opens the tip, Escape closes it |
| Feedback dialog | The dialog title | Focus moves into the field; Escape cancels |
