# useBreakpoints

The `useBreakpoints` composable provides responsive breakpoint detection for your application. It allows you to create responsive layouts that adapt to different screen sizes and provides convenient boolean flags for common breakpoint scenarios.

## Usage

```ts
// src/app.ts
import { createApp } from 'vue'
import { createBreakpoints } from 'v0'

const app = createApp(App)

app.use(createBreakpoints())
```

```vue
<script lang="ts" setup>
import { useBreakpoints } from 'v0'

const { name, width, height, mobile, xs, mdAndUp } = useBreakpoints()
</script>

<template>
  <div>
    <div v-if="xs">Mobile view</div>
    <div v-if="mdAndUp">Desktop view</div>
    <div v-if="mobile">Mobile device</div>

    <p>Current breakpoint: {{ name }}</p>
    <p>Window dimensions: {{ width }}x{{ height }}</p>
  </div>
</template>
```

## API Reference

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `breakpoints` | `Record<BreakpointName, number>` | The current breakpoint configuration |
| `name` | `BreakpointName` | The current active breakpoint name |
| `width` | `number` | Current window width |
| `height` | `number` | Current window height |
| `mobile` | `boolean` | Whether the current viewport is considered mobile |

### Breakpoint Flags

| Property | Type | Description |
|----------|------|-------------|
| `xs` | `boolean` | True when viewport matches xs breakpoint |
| `sm` | `boolean` | True when viewport matches sm breakpoint |
| `md` | `boolean` | True when viewport matches md breakpoint |
| `lg` | `boolean` | True when viewport matches lg breakpoint |
| `xl` | `boolean` | True when viewport matches xl breakpoint |
| `xxl` | `boolean` | True when viewport matches xxl breakpoint |

### Range Flags

| Property | Type | Description |
|----------|------|-------------|
| `smAndUp` | `boolean` | True when viewport is sm or larger |
| `mdAndUp` | `boolean` | True when viewport is md or larger |
| `lgAndUp` | `boolean` | True when viewport is lg or larger |
| `xlAndUp` | `boolean` | True when viewport is xl or larger |
| `xxlAndUp` | `boolean` | True when viewport is xxl or larger |
| `smAndDown` | `boolean` | True when viewport is sm or smaller |
| `mdAndDown` | `boolean` | True when viewport is md or smaller |
| `lgAndDown` | `boolean` | True when viewport is lg or smaller |
| `xlAndDown` | `boolean` | True when viewport is xl or smaller |
| `xxlAndDown` | `boolean` | True when viewport is xxl or smaller |

## Default Breakpoints

The default breakpoint configuration is:

```ts
{
  xs: 0,      // 0px and up
  sm: 600,    // 600px and up
  md: 960,    // 960px and up
  lg: 1280,   // 1280px and up
  xl: 1920,   // 1920px and up
  xxl: 2560,  // 2560px and up
}
```

## Configuration

### Custom Breakpoints

You can customize the breakpoints when installing the plugin:

```ts
import { createBreakpoints } from 'v0'

app.use(createBreakpoints({
  breakpoints: {
    xs: 0,
    sm: 480,
    md: 768,
    lg: 1024,
    xl: 1440,
    xxl: 1920,
  }
}))
```

### Custom Mobile Breakpoint

By default, the mobile breakpoint is set to `md` (960px). You can customize this:

```ts
// Using a breakpoint name
app.use(createBreakpoints({
  mobileBreakpoint: 'lg'
}))

// Using a custom pixel value
app.use(createBreakpoints({
  mobileBreakpoint: 800
}))
```

## Examples

### Responsive Layout

```vue
<script lang="ts" setup>
import { useBreakpoints } from 'v0'

const { xs, sm, lgAndUp, smAndUp } = useBreakpoints()
</script>

<template>
  <div class="container">
    <aside v-if="lgAndUp" class="sidebar">
      <!-- Desktop sidebar -->
    </aside>

    <main class="content">
      <h1 :class="{ 'text-xl': xs, 'text-2xl': smAndUp, 'text-3xl': lgAndUp }">
        Responsive Title
      </h1>

      <div :class="{ 'grid-cols-1': xs, 'grid-cols-2': sm, 'grid-cols-3': lgAndUp }">
        <!-- Responsive grid -->
      </div>
    </main>
  </div>
</template>
```

### Conditional Rendering

```vue
<script lang="ts" setup>
import { useBreakpoints } from 'v0'

const { xs, sm, md, mobile } = useBreakpoints()
</script>

<template>
  <div>
    <!-- Mobile navigation -->
    <nav v-if="mobile" class="mobile-nav">
      <button @click="toggleMenu">☰</button>
    </nav>

    <!-- Desktop navigation -->
    <nav v-else class="desktop-nav">
      <a href="/">Home</a>
      <a href="/about">About</a>
      <a href="/contact">Contact</a>
    </nav>

    <!-- Different components based on screen size -->
    <MobileGallery v-if="xs" />
    <TabletGallery v-else-if="sm || md" />
    <DesktopGallery v-else />
  </div>
</template>
```

### Reactive Computed Properties

```vue
<script lang="ts" setup>
import { computed } from 'vue'
import { useBreakpoints } from 'v0'

const { xs, sm, md, lg, xl } = useBreakpoints()

const columns = computed(() => {
  if (xs) return 1
  if (sm) return 2
  if (md) return 3
  if (lg) return 4
  return 5
})

const containerClass = computed(() => {
  return {
    'container-mobile': xs,
    'container-tablet': sm || md,
    'container-desktop': lg || xl
  }
})
</script>

<template>
  <div>
    <p>Columns: {{ columns }}</p>
    <p>Container class: {{ containerClass }}</p>
  </div>
</template>
```

## TypeScript Support

The composable is fully typed with TypeScript:

```ts
export type BreakpointName = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'

export interface BreakpointsContext {
  breakpoints: Readonly<Record<BreakpointName, number>>
  name: BreakpointName
  width: number
  height: number
  mobile: boolean
  xs: boolean
  sm: boolean
  md: boolean
  lg: boolean
  xl: boolean
  xxl: boolean
  smAndUp: boolean
  mdAndUp: boolean
  lgAndUp: boolean
  xlAndUp: boolean
  xxlAndUp: boolean
  smAndDown: boolean
  mdAndDown: boolean
  lgAndDown: boolean
  xlAndDown: boolean
  xxlAndDown: boolean
}

export interface BreakpointsOptions {
  mobileBreakpoint?: BreakpointName | number
  breakpoints?: Partial<Record<BreakpointName, number>>
}
```

## SSR Support

The composable is designed to work with Server-Side Rendering (SSR). It integrates with the [useHydration](./use-hydration) composable to ensure proper hydration behavior:

- On the server, breakpoints start with default values
- After hydration, breakpoints are updated based on the actual window dimensions
- This prevents hydration mismatches between server and client
