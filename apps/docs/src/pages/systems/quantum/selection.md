---
title: Selection - Quantum Material Design 1 Selection Pattern for Vue
meta:
- name: description
  content: The Material Design 1 selection pattern in Quantum. Selected lists, grid lists, cards and table rows, the contextual action bar, and text selection in the accent colour.
- name: keywords
  content: quantum selection, material design 1 selection, multi select list, contextual action bar, selected state, text selection color, vue selection, paper quantum
features:
  category: Guide
  label: 'Selection'
  level: 2
  renderless: false
  group: 'patterns'
  order: 9
related:
  - /systems/quantum
  - /systems/quantum/list
  - /systems/quantum/toolbar
  - /systems/quantum/data-table
  - /composables/selection/create-selection
---

# Selection

<DocsPageFeatures :frontmatter />

Selection lets the reader pick items and then act on them together, or highlight a run of text. Quantum draws the selected state on lists, grid lists, cards and table rows, and turns the app bar into a contextual action bar while anything is selected.

> [!NOTE]
> Reference: [Selection, Material Design 1 guidelines](http://web.archive.org/web/20181225002148/https://material.io/archive/guidelines/patterns/selection.html), the archived page Quantum is pinned to, with the [Navigation](http://web.archive.org/web/20181225002243/https://material.io/archive/guidelines/patterns/navigation.html) page for the Back rule and [Gestures](http://web.archive.org/web/20181225002235/https://material.io/archive/guidelines/patterns/gestures.html) for the selection gestures. Item selection, text selection and the contextual toolbar. This page is the Vue.

## Usage

`select="multiple"` turns a `QuList` into a selectable set bound to an array with `v-model`. A selected item shows a check mark in place of its avatar and the selection scrim over its row.

::: ds-example
/systems/quantum/selection/list
:::

## Item selection

| Surface | How to select | Selected state |
|---------|---------------|----------------|
| List | `QuList select="multiple"` (or `"single"`) with `v-model` | Check mark in place of the avatar or icon, `--quantum-selection` scrim on the row |
| Grid list | `selected` on `QuGridList.Tile`, toggled from the tile's click | Scrim and check mark over the image |
| Card | `selected` on `QuCard` | Scrim and check mark, in place of the header avatar when there is one |
| Data table | `selectable` on `QuDataTable` with `v-model:selected` | A checkbox column; selected rows turn Grey 100 in the light theme |
| Actions on the selection | `QuToolbar.Contextual` (app bar) or `QuDataTable.Contextual` (table header) | Replaces the bar's normal content while anything is selected |

The selection scrim is `--quantum-selection`: the accent at 30%, Pink A200 in the default theme, the same in both themes. The guidelines name the accent for selection and state no opacity; 30% is Quantum's decision.

### How selection starts

The guidelines' gesture is a long press, or a press held in place, on touch, and a check mark revealed on hover on desktop. Quantum keeps the desktop rule as the default for every pointer, because a long press on the web collides with the browser's context menu and text selection:

| Rule | Quantum |
|------|---------|
| Hovering an item reveals a single check mark you can click (desktop) | Under `(pointer: fine)`, `QuList` shows the mark on the hovered or focused item |
| After one item is selected, check marks appear on every remaining item in the set | `QuList` marks every item while the selection is not empty |
| Once an item is selected, a tap toggles it | Every option toggles on click, Enter or Space |
| Avoid showing a checkbox on every item at all times | Lists, grid lists and cards draw marks only on demand; the data table keeps its checkbox column, as its own page's figures do |
| Long press, two-finger touch and drag to select a range | Not shipped; gestures are the app's, if it wants them |

### Leaving selection mode

Selection mode ends when the reader deselects every item or performs an action from the contextual bar. The Back button dismisses the contextual action bar and clears the highlight; in Quantum the bar's close button and Escape inside the bar do the same, and an app adds Escape on the selectable content.

## Text selection

Text selection is the browser's: a contiguous highlight, with handles and a floating Cut, Copy, Paste toolbar on mobile. Those are browser chrome and Quantum does not draw them. The guidelines ask only that the highlight use the accent colour and keep the text legible.

```css
::selection {
  background: var(--quantum-selection, rgba(255, 64, 129, 0.3));
  color: var(--quantum-text-primary, rgba(0, 0, 0, 0.87));
}
```

Put the rule in your app stylesheet, on the root or on the subtree you want themed. The keyboard shortcuts the guidelines list (Shift with the arrows to extend, Ctrl or Command with A to select all) are the browser's own.

## Examples

::: ds-example
/systems/quantum/selection/list

### Lists

A multiple-select `QuList` is a WAI-ARIA listbox: each tile is an option with `aria-selected`, and `v-model` holds the array of selected values. A selected option swaps its avatar for a check mark in the accent and lays the selection scrim over its row. The guidelines prefer the check mark to replace the icon or avatar when there is room; `QuList` always has the room, because the mark takes the avatar's 40 dp slot.

Under a mouse, hovering or focusing an item reveals its check mark before anything is selected, the desktop affordance the guidelines describe. Once one item is selected, every item shows its mark, so the reader can see the set is now in selection mode. `select="single"` gives the same selected state with one value.
:::

::: ds-example
/systems/quantum/selection/contextual

### Contextual action bar

While items are selected, the app bar becomes a contextual action bar. Set `contextual` on `QuToolbar` while the selection is not empty and put `QuToolbar.Contextual` in it: the bar's navigation and title give way to a close button, the count ("2 selected") in the title's place and style, and the actions that apply to the selection.

The close button, and Escape pressed anywhere inside the bar, emit `clear`; clearing the array ends selection mode and the normal bar returns. Focus usually sits in the list rather than the bar, so the example also clears on Escape from the list, the in-page counterpart of Back. Performing an action ends it too: Delete here removes the selected files and empties the selection. The count is a polite live region, so each change is announced. The count reads from the `Quantum.selectedCount` locale key.
:::

::: ds-example
/systems/quantum/selection/grid-list

### Grid lists

A grid list tile takes `selected` and draws the selection scrim and a check mark over its image. The tile becomes a button when it has a click listener, so the example toggles membership in an array from each tile's click and reads `selected` back from it. Use the same model for a contextual action bar over the grid.

Tiles have no hover-revealed mark of their own; when the reader needs to see that tiles are selectable before choosing one, enter selection mode from an action ("Select") and show the count.
:::

::: ds-example
/systems/quantum/selection/card

### Cards

`selected` on `QuCard` lays the selection scrim over the card and draws the check mark in place of the header's avatar, the selection pattern's rule that the mark replaces the avatar when there is space. A card has no selection gesture of its own; the example toggles it from a flat button whose label, Select or Deselect, names the next action. The button is not a toggle button: `QuButton` reserves `aria-pressed` for v0's button groups, so the label carries the state, and the check mark is announced as "Selected".

Select cards when the collection supports acting on several at once, such as archiving. A card's own primary action still leads to its detail.
:::

::: ds-example
/systems/quantum/selection/data-table

### Data tables

`selectable` adds a checkbox column with a select-all box in the header row; `v-model:selected` holds the selected row records. A selected row turns Grey 100, the data tables page's value; the page gives no dark value, so the dark theme takes Vuetify 1.5's near-`#505050`. While rows are selected, `QuDataTable.Contextual` replaces the title header: "2 items selected" on the accent's light value (`--quantum-accent-light`), with the actions that apply to the rows.

The data tables page draws the checkbox column at all times, and Quantum follows that page rather than the selection pattern's hover-only check mark. Escape inside the contextual header clears the selection, the keyboard counterpart of Back.
:::

::: ds-example
/systems/quantum/selection/text

### Text selection

Select some of the paragraph, or press the button to select its second sentence. The highlight is the selection token, the accent at 30%, under the primary text ink, so selected text stays legible on both themes. The example scopes the rule to its paragraph; an app puts it on the root.

The guidelines also allow outlines, text treatments, motion or check marks as alternatives when the highlight alone would not contrast. The floating toolbar and the handles stay the browser's.
:::

## Accessibility

A selectable `QuList` is a listbox with one tab stop: arrow keys move between options, Space or Enter toggles one, and `aria-multiselectable` marks a multiple-select list. Name the list with `aria-label`. A grid list tile with a click listener is a button that points `aria-describedby` at its check mark, so a selected tile is announced with "Selected". A card's toggle is an ordinary button; let its label say what it does (Select, Deselect), because `QuButton` keeps `aria-pressed` for v0's button groups. Data table checkboxes are named "Select all" and "Select row", and select-all reports `aria-checked="mixed"` for a partial page.

The contextual bar's count is announced through a polite live region. Its close button is named "Close" by default.

| Key | Behavior |
|-----|----------|
| Arrow Down, Arrow Up | Moves focus between options in a selectable list |
| Space, Enter | Toggles the focused option, tile or row checkbox |
| Escape | Clears the selection when focus is in a contextual action bar or a table's contextual header (and, in the example, in the list) |
| Shift with the arrow keys | Extends a text selection by character or by line |
| Ctrl+A, Command+A | Selects all text |
