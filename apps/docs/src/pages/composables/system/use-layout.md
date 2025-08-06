---
meta:
  title: useLayout
  description: Creates a layout context for managing the dimensions and positions of layout elements.
  keywords: useLayout, layout, composable, Vue, dimensions, positioning
category: System
performance: 0
---

# useLayout

The `useLayout` composable creates a layout context for managing the dimensions and positions of layout elements within an application. It provides reactive properties for the overall window size, and calculated bounds for different layout sections (top, bottom, left, right), as well as the main content area.

## API

### `useLayout(options?)`

* **Type**
    
  ```ts
  export interface LayoutTicket extends GroupTicket {
    order: number
    position: LayoutLocation
    value: number
  }

  export interface LayoutContext<Z extends LayoutTicket> extends GroupContext<Z> {
    bounds: {
      top: ComputedRef<number>
      bottom: ComputedRef<number>
      left: ComputedRef<number>
      right: ComputedRef<number>
    }
    main: {
      x: ComputedRef<number>
      y: ComputedRef<number>
      width: ComputedRef<number>
      height: ComputedRef<number>
    }
    sizes: ShallowReactive<Map<ID, number>>
    height: ShallowRef<number>
    width: ShallowRef<number>
  }

  export interface LayoutOptions extends GroupOptions {}

  export function useLayout<
    Z extends LayoutTicket = LayoutTicket,
    E extends LayoutContext<Z> = LayoutContext<Z>,
  > (_options: LayoutOptions = {}): E
  ```
    
* **Details**
    
  - `_options`: Optional configuration for layout behavior. Extends `GroupOptions` from `useGroup`.

  Returns a layout context object (`LayoutContext`) that includes:
  - `bounds`: Computed properties for the total `top`, `bottom`, `left`, and `right` occupied by registered layout elements.
  - `main`: Computed properties for the `x`, `y`, `width`, and `height` of the main content area, excluding the space taken by layout elements.
  - `sizes`: A `ShallowReactive` map storing the sizes of registered layout elements.
  - `height`: A `ShallowRef` for the current window height.
  - `width`: A `ShallowRef` for the current window width.
  - `register`: A function to register new layout elements.

## Examples

### Basic Layout Usage

```html
<template>
  <div class="app-container">
    <header :style="{ height: `${bounds.top.value}px` }">Header (Top)</header>
    <aside class="left-sidebar" :style="{ width: `${bounds.left.value}px` }">Left Sidebar</aside>
    <main :style="{
      marginLeft: `${bounds.left.value}px`,
      marginRight: `${bounds.right.value}px`,
      marginTop: `${bounds.top.value}px`,
      marginBottom: `${bounds.bottom.value}px`,
      width: `${main.width.value}px`,
      height: `${main.height.value}px`,
    }">
      Main Content Area
      <p>Window Width: {{ width }}px</p>
      <p>Window Height: {{ height }}px</p>
      <p>Main Content Width: {{ main.width }}px</p>
      <p>Main Content Height: {{ main.height }}px</p>
    </main>
    <aside class="right-sidebar" :style="{ width: `${bounds.right.value}px` }">Right Sidebar</aside>
    <footer :style="{ height: `${bounds.bottom.value}px` }">Footer (Bottom)</footer>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, onUnmounted } from 'vue'
  import { useLayout } from '@vuetify/v0/composables/useLayout'

  const { register, bounds, main, width, height } = useLayout()

  // Simulate registering layout elements
  onMounted(() => {
    register({
      id: 'header',
      position: 'top',
      value: 64, // height of header
      isActive: { value: true },
    })
    register({
      id: 'footer',
      position: 'bottom',
      value: 48, // height of footer
      isActive: { value: true },
    })
    register({
      id: 'left-sidebar',
      position: 'left',
      value: 200, // width of left sidebar
      isActive: { value: true },
    })
    register({
      id: 'right-sidebar',
      position: 'right',
      value: 150, // width of right sidebar
      isActive: { value: true },
    })
  })

  // Note: In a real application, you would typically have components that register themselves
  // using useLayout within their setup functions.
</script>

<style>
.app-container {
  display: grid;
  grid-template-columns: auto 1fr auto;
  grid-template-rows: auto 1fr auto;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}

header {
  grid-column: 1 / -1;
  grid-row: 1;
  background-color: #f0f0f0;
  padding: 10px;
  text-align: center;
}

.left-sidebar {
  grid-column: 1;
  grid-row: 2;
  background-color: #e0e0e0;
  padding: 10px;
}

main {
  grid-column: 2;
  grid-row: 2;
  background-color: #ffffff;
  padding: 10px;
  overflow: auto;
}

.right-sidebar {
  grid-column: 3;
  grid-row: 2;
  background-color: #e0e0e0;
  padding: 10px;
}

footer {
  grid-column: 1 / -1;
  grid-row: 3;
  background-color: #f0f0f0;
  padding: 10px;
  text-align: center;
}
</style>


