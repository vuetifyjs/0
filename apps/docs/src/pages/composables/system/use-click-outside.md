---
title: useClickOutside - Click Outside Detection for Vue 3
meta:
- name: description
  content: Detect clicks outside of elements with two-phase detection, touch scroll handling, iframe focus detection, and automatic cleanup.
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

<script setup>
import BasicExample from '@/examples/composables/use-click-outside/basic.vue'
import BasicExampleRaw from '@/examples/composables/use-click-outside/basic.vue?raw'
</script>

# useClickOutside

A composable for detecting clicks outside of specified element(s) with automatic cleanup.

<DocsPageFeatures :frontmatter />

## Usage

The `useClickOutside` composable detects when users click outside target elements. It uses two-phase detection (pointerdown → pointerup) to prevent false positives when dragging, and includes touch scroll handling for mobile.

<DocsExample file="basic.vue" title="Dropdown Menu" :code="BasicExampleRaw">
  <BasicExample />
</DocsExample>

## Architecture

`useClickOutside` builds on `useEventListener` for pointer and focus event detection:

```mermaid
flowchart TD
  useEventListener --> useClickOutside
  useClickOutside --> Dropdowns
  useClickOutside --> Modals
  useClickOutside --> Popovers
```

<DocsApi />
