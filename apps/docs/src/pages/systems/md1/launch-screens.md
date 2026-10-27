---
title: Launch Screens - Material Design 1 Launch Screens Pattern for Vue
meta:
- name: description
  content: The Material Design 1 launch screens pattern. A placeholder UI shows the app bar and structure from the first frame, then fills in the content.
- name: keywords
  content: md1 launch screen, material design 1 launch screens, placeholder ui, skeleton screen, branded launch, perceived performance, vue launch screen, paper md1
features:
  category: Guide
  label: 'Launch screens'
  level: 2
  renderless: false
  group: patterns
  order: 19
related:
  - /systems/md1
  - /systems/md1/toolbar
  - /systems/md1/list
  - /systems/md1/loading-images
---

# Launch screens

<DocsPageFeatures :frontmatter />

Never launch into a blank canvas: show the app's structure while its content loads, or a short branded screen on a cold start.

<DocsMd1Reference
  href="https://m1.material.io/patterns/launch-screens.html"
  title="Launch screens"
/>

> [!NOTE]
> Reference: [Launch screens, Material Design 1 guidelines](https://m1.material.io/patterns/launch-screens.html), the archived page Material Design 1 is pinned to. Placeholder UI and branded launch. This page is the Vue.

## Usage

A blank screen while the app loads makes the wait feel longer. The guidelines offer two kinds of launch screen:

- **Placeholder UI**, the most seamless transition, suits apps with short load times or no strong branding need, and works for in-app transitions as well as launches.
- **Branded launch** shows the logo, and at most a tagline, on a cold start from the home screen only. It is never shown while the app is already running or when another app opens it. It is a platform splash screen, so this page does not draw one.

## Examples

::: ds-example
/systems/md1/launch-screens/placeholder

### Placeholder UI

On launch the core structure is on screen from the first frame: the app bar in the app's colour and the content surface, both empty. When the content has loaded, the title, the actions and the list fill in where they belong, so nothing moves and the first frame already looks like the app.

Launch again replays the start: the bar and the surface stay, and only their content leaves and returns. The content arrives after 1.5 seconds, long enough to see the empty frame,[^load-time] and the bar is the standard 56 dp app bar rather than the figure's taller one.[^bar-height]
:::

## Accessibility

While the content is loading the screen carries `aria-busy="true"`, so assistive technology waits for it instead of announcing an empty region; the attribute goes when the content arrives.[^busy]

[^load-time]: Our call: the page gives no load time; 1500 ms and the replay button exist so the transition can be seen.

[^bar-height]: Our call: the figure draws a 112 dp bar; the standard app bar keeps the example to the toolbar's own metrics.

[^busy]: Our call: the page says nothing about assistive technology; `aria-busy` is the ARIA way to mark a region that is still loading.
