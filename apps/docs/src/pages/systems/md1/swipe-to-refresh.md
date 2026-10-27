---
title: Swipe to Refresh - Material Design 1 Swipe to Refresh Pattern for Vue
meta:
- name: description
  content: The Material Design 1 swipe to refresh pattern. A pull gesture past a threshold, the refresh indicator on a 40 dp disc, its resting position and how it enters surfaces at different elevations.
- name: keywords
  content: md1 swipe to refresh, material design 1 pull to refresh, refresh indicator, circular progress, vue pull to refresh, paper md1
features:
  category: Guide
  label: 'Swipe to refresh'
  level: 2
  renderless: false
  group: 'patterns'
  order: 12
related:
  - /systems/md1
  - /systems/md1/progress-circular
  - /systems/md1/toolbar
  - /systems/md1/list
---

# Swipe to refresh

<DocsPageFeatures :frontmatter />

Swipe to refresh lets the reader ask for new content by pulling down at the start of a list, grid or card collection sorted by recency. Material Design 1 ships the refresh indicator as `Md1ProgressCircular`; the gesture, the threshold and the placement are a composition in the app.

<DocsMd1Reference
  href="https://m1.material.io/patterns/swipe-to-refresh.html"
  title="Swipe to refresh"
/>

## Usage

Syncing is the preferred way to keep content current, and it shows no indicator. Manual refresh supplements it, and keeps the reader's scroll position while it runs.

::: ds-example
/systems/md1/progress-circular/swipe-to-refresh
:::

Pull the list down from its top. The indicator follows the pull on a 40 dp disc at 3 dp, its arc growing with the distance; past the threshold it slows to a third of the pull's speed and turns fully opaque, the cue that letting go now refreshes.[^threshold-cue] Released short of the threshold, it slides back out of sight. The app bar's refresh button is the same action for keyboard and pointer users who never swipe, the guidelines' refresh via an app bar action.

| Rule | Material Design 1 |
|------|-------------------|
| Where | The start of a list, grid list or card collection with the most recent item first; the bottom for a collection that grows downward, such as a chat |
| Not in | Navigation drawers, home screen widgets, and pannable content such as a map |
| Indicator | `Md1ProgressCircular`, 28 px, on a 40 dp disc in the surface colour at `--md1-elevation-3` |
| Resting position | Centred horizontally on the refreshing content, near its top edge |
| Duration | In view until the refresh finishes and the new content is visible, or the reader leaves |

Material Design 1 ships no swipe primitive, and mobile browsers own pull-to-refresh on the page itself, so the gesture belongs inside a scrolling region of the app, as in the example.

## Examples

::: ds-example
/systems/md1/swipe-to-refresh/surfaces

### Surfaces and elevation

The indicator always enters from the top edge of the surface that refreshes, and stays inside it. Each frame's refresh button runs the indicator the way a released pull does.

Under an extended app bar the indicator drops from the bottom of the flexible space and rests just below it. When the content is a raised sheet over the background, the indicator enters from the sheet's edge, not the app bar's, because only the sheet refreshes. When the bar and the content share one plane, the divider between them is the edge. When the content is below another surface, the cards here under a 4 dp app bar, the indicator slides out from under that surface and over the cards.

The indicator's exact resting height may move to sit on a material edge or a grid line, as long as it stays near the top of the refreshing content. Each frame clips the disc with its refreshing region, so it can never scroll off on its own or read as belonging to one card.
:::

## Accessibility

The gesture has no keyboard or screen reader equivalent, so every screen with swipe to refresh needs another path to the same action: a refresh button in the app bar or the overflow menu. Mirror the start and the end of the refresh in a polite live region; the examples use a visually hidden `role="status"`. The indicator is hidden from assistive technology while it only tracks a pull, and becomes a named progressbar once the refresh runs.

[^threshold-cue]: Our call: the page names a threshold without values; the 72 dp threshold, the one-third drag and the opacity cue are the example's.
