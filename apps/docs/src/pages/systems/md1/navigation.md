---
title: Navigation - Material Design 1 Navigation Pattern for Vue
meta:
- name: description
  content: The Material Design 1 navigation pattern. Lateral navigation with tabs, drawers and bottom navigation, forward navigation through lists and cards, and the up and back buttons.
- name: keywords
  content: md1 navigation, material design 1 navigation, navigation drawer, bottom navigation, tabs, up button, back button, vue navigation, paper md1
features:
  category: Guide
  label: 'Navigation'
  level: 2
  renderless: false
  group: 'patterns'
  order: 9
related:
  - /systems/md1
  - /systems/md1/tabs
  - /systems/md1/navigation-drawer
  - /systems/md1/bottom-navigation
  - /systems/md1/toolbar
---

# Navigation

<DocsPageFeatures :frontmatter />

How a reader moves through an app: sideways between sibling views, down into a child, and back up again. Material Design 1 ships the surfaces the guidelines name for each move; this page shows which one to reach for and how they combine.

> [!NOTE]
> Reference: [Navigation, Material Design 1 guidelines](http://web.archive.org/web/20181225002243/https://material.io/archive/guidelines/patterns/navigation.html), the archived page Material Design 1 is pinned to, with [Navigational transitions](http://web.archive.org/web/20181225002137/https://material.io/archive/guidelines/patterns/navigational-transitions.html) and the [navigation drawer](http://web.archive.org/web/20181225002300/https://material.io/archive/guidelines/patterns/navigation-drawer.html) page. Hierarchy, patterns, the up and back buttons, and transitions. This page is the Vue.

## Usage

Pick the navigation from the shape of the app: tabs or bottom navigation for a few equally important views, a drawer for many destinations, and lists and cards for moving from a collection down into one of its items. Every child screen gets an up arrow in its app bar.

::: ds-example
/systems/md1/navigation/tabs
:::

## Hierarchy

The guidelines describe an app as a hierarchy of scenes, and name each move through it.

| Term | Meaning | Material Design 1 surface |
|------|---------|-----------------|
| Home | The entrance to the app; the parent of every other screen | |
| Parent and child | A higher level of the hierarchy and the levels below it | |
| Siblings | Scenes that share a parent | |
| Lateral navigation | Moving between siblings | `Md1Tabs`, `Md1BottomNavigation`, `Md1NavigationDrawer` |
| Descending navigation | Moving from a parent to a child | `Md1List.Item` and `Md1Card` as links into the child |
| Ascending navigation | Moving from a child to its parent | `Md1Toolbar.Nav icon="up"` |
| Crosslink | A link to a scene that is not adjacent in the hierarchy | A plain link or list item |

Navigation history is not created by switching views with tabs, swiping or a dropdown, by filtering or sorting a list, or by zooming. Following a link from a related detail view, such as an artist from an album, does create history.

## Choosing a pattern

| Pattern | Material Design 1 surface | Recommended for |
|---------|-----------------|-----------------|
| Embedded navigation | Controls inside the content | Apps with a strong primary view, few alternate views, and infrequent use |
| Tabs | `Md1Tabs` | Frequent switching between a small number of equally important views; promoting awareness of the alternatives |
| Bottom navigation | `Md1BottomNavigation` | The same, for three to five top-level views on mobile, where the bar sits within reach of the thumb |
| Navigation drawer | `Md1NavigationDrawer` | Many top-level views, quick movement between unrelated views, deep structures, infrequent destinations |
| Expanding drawer | `Md1NavigationDrawer` with `Md1List.Group` | Deep hierarchies shown in-line in the drawer |
| Cascading drawer (desktop) | `Md1NavigationDrawer` with `Md1Menu.Sub` panels | Deep hierarchies shown as horizontal panels; a level closes when a subsection is chosen |
| In-context navigation | `Md1List`, `Md1Card` and links in the content | Large sets of child scenes; the up arrow returns to the previous level |

Combined forms follow from the same parts: a drawer with tabs for two levels of navigation, and on desktop a drawer with nested navigation plus tabs for three. Gestural navigation between siblings is limited to what `Md1Tabs` provides; Material Design 1 ships no swipe gestures.

## Up and back

App bars provide the two ascending buttons.

| Button | Where it goes | Material Design 1 |
|--------|---------------|---------|
| Up | One level up the app's hierarchy, until the home screen; it never leaves the app | `Md1Toolbar.Nav icon="up"`, a 48 dp button with the `arrow-back` glyph; emits `click`, and the app routes to the parent |
| Back | Back through the history of recently viewed screens, in reverse order; it may leave the app | The browser's Back button and history; Material Design 1 renders no Back button |

Back also dismisses floating surfaces, clears a contextual action bar along with its selection, and hides the on-screen keyboard. On the web, Escape is the in-page counterpart: it closes `Md1Dialog`, a temporary `Md1NavigationDrawer` and `Md1Menu`, and clears the selection from `Md1Toolbar.Contextual` and `Md1DataTable.Contextual`.

## Transitions

| Move | Transition | Material Design 1 |
|------|------------|---------|
| Parent to child | The touched surface lifts and expands into place from its origin, on the standard curve; the elevation change marks the shift in focus | Composed by the app; the examples below show it with a Vue `Transition` on `--md1-duration-enter` and `--md1-easing-standard` |
| Sibling to sibling | No elevation change; the new content slides in from the right while the old content leaves to the left | Built into `Md1Tabs.Panel`, mirrored under `dir="rtl"` |

## Examples

::: ds-example
/systems/md1/navigation/tabs

### Tabs

Tabs move between a small number of equally important views: a group of siblings, or a parent's embedded child views. They suit frequent switching and keep the alternatives in sight. The tab bar sits in the app bar's `Md1Toolbar.Extension`, and the `Md1Tabs` root wraps the whole toolbar so its panels can sit under it.

Switching tabs is a sibling transition: the panels stay at the same elevation, and the new panel slides in from the right while the old one slides off to the left. `Md1Tabs.Panel` draws that slide itself and drops it under reduced motion. Tab switches do not add to navigation history, so Back does not step through tabs.
:::

::: ds-example
/systems/md1/navigation/bottom-navigation

### Bottom navigation

Bottom navigation moves between three to five top-level views and is the mobile choice for the same job as tabs: the bar sits within reach of the thumb. Each destination is an `Md1BottomNavigation.Action` with an icon and a label; fixed bars show every label at all times, and `shifting` bars show only the active one.

The bar is fixed to the bottom of the viewport. Here it sits inside a docs screen frame that contains its fixed position, so it rests at the bottom of the frame rather than the page. The app bar title follows the chosen view, because each destination is a top-level screen of its own.
:::

::: ds-example
/systems/md1/navigation/drawer

### Navigation drawer

The drawer is the alternative to tabs when there is no room for them: it holds many destinations at once and stays hidden until the reader opens it from the menu icon. On a handset it is the temporary type, a modal sheet at 16 dp over the scrim, `min(100vw - 56px, 280px)` wide. Choosing a destination closes it.

List the most used destinations first. Group the rest with full-bleed dividers, and end with Settings, then Help & feedback, the order the settings and help pages require. The current destination takes the primary colour for its text and icon.

On tablets the persistent type opens beside the content and pushes it narrower; on desktop the permanent type is pinned open. `type` is explicit; the [navigation drawer page](/systems/md1/navigation-drawer) shows the `useBreakpoints` recipe that switches it by width.
:::

::: ds-example
/systems/md1/navigation/expanding

### Expanding drawer

A deep hierarchy can expand inside the drawer. Each section is an `Md1List.Group`: selecting a collapsed section expands its level in-line. The guidelines ask that opening one section hide every level outside it, so the example holds one open section and closes the others; `Md1List.Group` exposes its open state through `v-model` for exactly this.

The expanded section's title takes the primary colour, and its children indent to the 72 dp keyline. The desktop alternative, the cascading drawer, presents each level in its own panel; compose it from `Md1Menu.Sub` panels, which close a level when a subsection is chosen.
:::

::: ds-example
/systems/md1/navigation/forward-list

### Forward through a list

Descending navigation moves from a collection to one of its items. Each `Md1List.Item` with a click listener (or an `href`) is the link to its child. The child screen's app bar swaps the menu icon for the up arrow, named after the parent it returns to.

The parent-to-child transition is the guidelines' marker for going deeper: the surface the reader touched lifts and expands into place on the standard curve. The child here is a raised sheet that scales in from the top over `--md1-duration-enter` (225 ms on handsets, 150 ms under a mouse) with `--md1-easing-standard`. Material Design 1 ships no route transition; this one belongs to the app, and it is dropped under reduced motion.
:::

::: ds-example
/systems/md1/navigation/forward-card

### Forward through cards

Cards are entry points too: a collection of cards leads to the detail of one. The card's action, here a flat "Explore" button in `Md1Card.Actions`, opens the child screen, and the up arrow returns to the collection.

The same parent-to-child transition applies: the elevation change says the reader has moved down a level. Keep a card's primary action to one destination, so the transition has a single origin to expand from.
:::

::: ds-example
/systems/md1/navigation/up-back

### Up and back

Up and Back diverge after a crosslink. Open Kind of Blue, follow "More by Miles Davis" to the artist, then compare the two buttons. Up goes to Artists, the artist's parent in the hierarchy, whatever path led there. Back, the browser's button stood in for by the button under the frame, returns to the album, because Back follows history and the crosslink created a history entry.

Up never leaves the app; Back can. Give every screen below home an up arrow, and let the browser own Back. Within one screen, Back's other duties (closing a dialog, clearing a contextual action bar) are Escape in Material Design 1's components.
:::

## Accessibility

Lateral navigation surfaces carry their own semantics: `Md1Tabs` is the WAI-ARIA Tabs pattern, `Md1BottomNavigation` is a `nav` landmark whose current action carries `aria-current="page"`, and `Md1NavigationDrawer` is a modal dialog when temporary and a `nav` landmark otherwise. Name each landmark with `aria-label` when a page has more than one.

The up arrow is a button whose accessible name should be its destination ("Inbox", "Artists"), not "Up"; without an `aria-label`, `Md1Toolbar.Nav` falls back to "Back", which describes the other button. A menu icon is named "Menu" by default; name it for what it opens ("Open navigation").

Move focus to the new screen's heading or main region after a descending or ascending move, as a router would; the examples swap content in place and leave focus where it was.

| Key | Behavior |
|-----|----------|
| Tab, Shift+Tab | Moves through the app bar, the tabs or bar, and the content |
| Arrow Left, Arrow Right | Moves between tabs in an `Md1Tabs` bar |
| Enter, Space | Follows a list item, a card action, a tab, a bottom navigation action or the up arrow |
| Escape | Closes a temporary drawer and returns focus to the menu icon |
