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

<DocsMd1Reference
  href="https://m1.material.io/patterns/navigation.html"
  title="Navigation"
/>

> [!NOTE]
> Read with [Navigational transitions](https://m1.material.io/patterns/navigational-transitions.html) and the [navigation drawer](https://m1.material.io/patterns/navigation-drawer.html) page.

## Usage

Pick the navigation from the shape of the app: tabs or bottom navigation for a few equally important views, a drawer for many destinations, and lists and cards for moving from a collection down into one of its items. Every child screen gets an up arrow in its app bar.

::: ds-example
/systems/md1/navigation/tabs

The tab bar sits in the app bar's `Md1Toolbar.Extension`, and the `Md1Tabs` root wraps the whole toolbar so its panels can sit under it. `Md1Tabs.Panel` draws the sibling slide itself and drops it under reduced motion.
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

Combined forms follow from the same parts: a drawer with tabs for two levels of navigation, and on desktop a drawer with nested navigation plus tabs for three. Gestural navigation between siblings is limited to what `Md1Tabs` provides: the package's `SPEC.md` rules gestures out of scope and lists swipe navigation, panel swipe among it, under its [known limitations](https://github.com/vuetifyjs/0/blob/master/packages/md1/SPEC.md#known-limitations), each with a button, keyboard or scrim path instead.

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
| Parent to child | The touched surface lifts and expands into place from its origin, on the standard curve; the elevation change marks the shift in focus | Composed by the app. The list example uses a Vue `Transition` on `--md1-duration-enter` and `--md1-easing-standard`; the card example uses `useMorph` for a rectangular transform with a shared image |
| Sibling to sibling | No elevation change; the new content slides in from the right while the old content leaves to the left | Built into `Md1Tabs.Panel`, mirrored under `dir="rtl"` |

## Examples

::: ds-example
/systems/md1/navigation/clusters

### Bundles

Structure can come from the content itself. The inbox groups related messages into bundles, Promos, Social and Finance, each a single row above the messages that stand alone; each bundle's row is a parent, and choosing it descends into its own list, where the up arrow returns to the inbox.

Each bundle carries its own hue on its icon and title so the three read as separate places at a glance. The 700 shades keep 4.5:1 on the white surface, and the 200 shades replace them on dark.[^bundle-hues]
:::

::: ds-example
/systems/md1/navigation/embedded

### Embedded navigation

An app with a strong primary view, few alternate views and short, infrequent sessions needs no navigation component at all. The calculator is one screen: the keypad is the view, and its one alternate view, the advanced functions, slides in over it from the end edge on the standard curve when the handle is pressed. There is no app bar, drawer or tab bar.

Choosing a function applies it and puts the panel away, returning the reader to the primary view. The panel is `inert` while closed, so its keys leave the tab order with it.
:::

::: ds-example
/systems/md1/navigation/desktop-tabs

### Tabs under an extended header

On desktop the tabs align to the start of the window, under a title in an extended header, instead of centring. `scrollable` tabs start at the 80 dp keyline under a mouse, the keyline of the large title in `Md1Toolbar.Extension`, so the title, the tabs and the content below line up in one column. The actions stay in the toolbar row above.
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
/systems/md1/navigation/drawer-scroll

### A drawer that scrolls

When the destinations outgrow the screen, the whole drawer scrolls as one sheet: the account header scrolls away with the list rather than staying pinned, and the sections, dividers and the closing Settings and Help & feedback rows follow in order. Long labels truncate at the drawer's edge with an ellipsis.
:::

::: ds-example
/systems/md1/navigation/expanding

### Expanding drawer

A deep hierarchy can expand inside the drawer. Each section is an `Md1List.Group`: selecting a collapsed section expands its level in-line. The guidelines ask that opening one section hide every level outside it, so the example holds one open section and closes the others; `Md1List.Group` exposes its open state through `v-model` for exactly this.

The expanded section's title takes the primary colour, and its children indent to the 72 dp keyline. The desktop alternative, the cascading drawer, presents each level in its own panel; compose it from `Md1Menu.Sub` panels, which close a level when a subsection is chosen.
:::

::: ds-example
/systems/md1/navigation/cascading

### Cascading drawer

On desktop a deep hierarchy can cascade instead of expanding: choosing World opens its regions as a second sheet beside the pinned drawer, at the drawer's 16 dp elevation over the content.[^cascade-sheet] Choosing a region navigates and closes the level it came from; choosing World again closes it without navigating. Sections without children, such as Politics, are pages of their own and close any open level.

The second level is a `nav` landmark named for its section. Material Design 1 ships no cascading part, so the panel is the app's; `Md1Menu.Sub` is the alternative when the levels should behave as a menu.
:::

::: ds-example
/systems/md1/navigation/forward-list

### Forward through a list

Descending navigation moves from a collection to one of its items. Each `Md1List.Item` with a click listener (or an `href`) is the link to its child. The child screen's app bar swaps the menu icon for the up arrow, named after the parent it returns to.

The parent-to-child transition is the guidelines' marker for going deeper: the surface the reader touched lifts and expands into place on the standard curve. The child here is a raised sheet that scales in from the top over `--md1-duration-enter` (225 ms on handsets, 150 ms under a mouse) with `--md1-easing-standard`.[^list-transition] Material Design 1 ships no route transition; this one belongs to the app, and it is dropped under reduced motion.
:::

::: ds-example
/systems/md1/navigation/forward-card

### Forward through cards

Cards are entry points too: a collection of cards leads to the detail of one. The card's action, here a flat "Explore" button in `Md1Card.Actions`, opens the child screen, and the up arrow returns to the collection.

The card expands into the child screen with `useMorph`, the transform the [FAB](/systems/md1/fab) page uses. The detail screen is laid out in its final place and revealed by an `inset()` clip that starts at the card's rectangle and grows to the screen, the transforming-material page's rectangular transformation. The width starts first and the height 15% of the duration later, the page's rule for an expanding rectangle (`lead: 'width'`, `lag: 0.15`).[^card-lag] The centre of the clip travels on an arc, and the whole transform runs on `--md1-duration-standard` and the standard curve.[^transform-duration]

The card's image is the shared element. The choreography page keeps a focal point by carrying elements across a transition: a collapsed card's elements become the expanded card's header. A second `useMorph` call with `scale: true` moves the header image from the card's media to its place and scales it from the card's width, keeping its aspect ratio as the page requires, with the same lead and lag so it stays inside the growing clip. The text below it is not shared, so it fades in over the last 60% of the transform, cropped by the growing surface.[^text-fade] The up arrow plays both transforms backwards into the card.

Parent-to-child expansion is a composition, not a card prop: the destination is the app's own screen, and only the app knows where it is.
:::

::: ds-example
/systems/md1/navigation/integrated

### Navigation in the content

Navigation can live in the content instead of an app bar. The shop's menu icon and search field sit in the content's own header, and every product card is a link into its detail, where an up arrow returns to the shop. The grid takes two columns on a handset and adds columns as the window widens, so the same composition serves the tablet and desktop figures.
:::

::: ds-example
/systems/md1/navigation/combined

### Drawer and tabs

Two levels of navigation combine a drawer and tabs: the drawer chooses the section, and the tabs choose the view inside it. On a handset or tablet the drawer is temporary and opens in front of the tabs from the menu icon. From 600 px the example lays out as a desktop window: the drawer is pinned, and each section expands in-line to its own views, so the drawer and the tabs both show the second level and stay in step.

The width comes from the frame through v0's `useResizeObserver`, so the example switches as the docs column resizes; an app would read `useBreakpoints` instead. The 600 px switch, the tablet breakpoint, is the example's own choice.[^combined-switch]
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

[^bundle-hues]: Our call: the figure gives each bundle its own hue; Blue, Pink and Green 700 and 200 are chosen for contrast on each theme.

[^cascade-sheet]: Our call: the figure shows a second column without metrics; the 16 dp elevation is the drawer's and the four-increment width is ours.

[^list-transition]: Our call: the page names the standard curve but no duration for this move; the enter duration is ours.

[^card-lag]: Our call: the page says only that width leads height; the 0.15 lag is ours.

[^transform-duration]: Our call: the pages give transforms no duration, so the card uses the standard one.

[^text-fade]: Our call: the fade over the last 60% is the example's.

[^combined-switch]: Our call: the figures show the mobile, tablet and desktop forms without a width; 600 px is the tablet breakpoint.
