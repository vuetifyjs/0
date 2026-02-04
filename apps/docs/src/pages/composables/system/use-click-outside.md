---
title: useClickOutside - Click Outside Detection for Vue 3
meta:
- name: description
  content: Vue 3 composable for detecting clicks outside elements. Features two-phase detection, touch scroll handling, iframe focus detection, and auto cleanup.
- name: keywords
  content: useClickOutside, click outside, dismiss, popover, dropdown, modal, Vue 3, composable
features:
  category: Composable
  label: 'E: useClickOutside'
  github: /composables/useClickOutside/
  level: 2
related:
  - /composables/system/use-event-listener
---

# useClickOutside

A composable for detecting clicks outside of specified element(s) with automatic cleanup.

<DocsPageFeatures :frontmatter />

## Usage

The `useClickOutside` composable detects when users click outside target elements. It uses two-phase detection (pointerdown → pointerup) to prevent false positives when dragging, and includes touch scroll handling for mobile.

::: example
/composables/use-click-outside/basic
:::

## Architecture

`useClickOutside` builds on `useEventListener` for pointer and focus event detection:

```mermaid "Click Outside Hierarchy"
flowchart TD
  useEventListener --> useClickOutside
  useClickOutside --> Dropdowns
  useClickOutside --> Modals
  useClickOutside --> Popovers
```

## Reactivity

| Property/Method | Reactive | Notes |
| - | :-: | - |
| `isActive` | <AppSuccessIcon /> | Computed from `!isPaused` |
| `isPaused` | <AppSuccessIcon /> | ShallowRef, readonly |

<DocsApi />
