# Components

A collection of foundational components designed to be headless, accessible, and highly customizable.

<DocsPageFeatures />

## Available Components

| Component | Description |
| - | - |
| Atom | Base element wrapper with dynamic element types |
| Avatar | Image/fallback avatar system with priority loading |
| Context | Context injection/provision for sharing state |
| Group | Selection grouping with multiple/single modes |
| Hydration | Client-side hydration utilities for SSR |
| Popover | CSS anchor-positioned popup components |
| Step | Step-based navigation for wizards and forms |
| Theme | Theme management and CSS variable injection |
| Breakpoints | Responsive breakpoint utilities |

- **Headless First**: Provide logic and accessibility without imposed styling
- **Slot-Driven**: Maximum flexibility through comprehensive slot APIs
- **CSS Variables**: All styling configurable via CSS custom properties
- **Renderless Option**: Can render without DOM elements for maximum flexibility
- **Type Safety**: Full TypeScript support with proper generic constraints

## Atom

The foundational component that all other components build upon. Provides dynamic element rendering and renderless capabilities.

```vue
<script setup>
import { Atom } from '@vuetify/v0'
</#>

<template>
  <!-- Render as different elements -->
  <Atom as="button" @click="handleClick">Button</Atom>
  <Atom as="div" class="container">Container</Atom>

  <!-- Renderless mode -->
  <Atom renderless #default="{ attrs }">
    <custom-element v-bind="attrs">Content</custom-element>
  </Atom>
</template>
```

## Avatar

Multi-source avatar component with automatic fallback priority and loading states.

```vue
<script setup>
import { Avatar } from '@vuetify/v0'
</script>

<template>
  <Avatar.Root class="avatar">
    <!-- Multiple images with priority -->
    <Avatar.Image
      :priority="1"
      src="/high-res-avatar.jpg"
      alt="User Avatar"
    />
    <Avatar.Image
      :priority="2"
      src="/low-res-avatar.jpg"
      alt="User Avatar Backup"
    />

    <!-- Fallback when images fail -->
    <Avatar.Fallback>JD</Avatar.Fallback>
  </Avatar.Root>
</template>
```

## Group

Selection management for collections of items with single/multiple selection modes.

```vue
<script setup>
import { Group } from '@vuetify/v0'
import { ref } from 'vue'

const selected = ref([])
</script>

<template>
  <Group.Root v-model="selected" :multiple="true">
    <Group.Item value="option1" #default="{ isActive, toggle }">
      <button @click="toggle" :class="{ active: isActive }">
        Option 1
      </button>
    </Group.Item>

    <Group.Item value="option2" #default="{ isActive, toggle }">
      <button @click="toggle" :class="{ active: isActive }">
        Option 2
      </button>
    </Group.Item>
  </Group.Root>
</template>
```

## Step

Step-based navigation for wizards and multi-step processes.

```vue
<script setup>
import { Step } from '@vuetify/v0'
import { ref } from 'vue'

const currentStep = ref('step1')
</script>

<template>
  <Step.Root v-model="currentStep" namespace="wizard">
    <Step.Item value="step1" #default="{ isActive }">
      <div :class="{ active: isActive }">Step 1 Content</div>
    </Step.Item>

    <Step.Item value="step2" #default="{ isActive }">
      <div :class="{ active: isActive }">Step 2 Content</div>
    </Step.Item>
  </Step.Root>
</template>
```

## Popover

CSS anchor-positioned popover system with automatic positioning.

```vue
<script setup>
import { Popover } from '@vuetify/v0'
</script>

<template>
  <Popover.Root>
    <Popover.Anchor as="button">
      Click me
    </Popover.Anchor>

    <Popover.Content position-area="bottom">
      <div class="popover-content">
        Popover content here
      </div>
    </Popover.Content>
  </Popover.Root>
</template>
```

## Context

Provide and inject context for sharing state across component trees.

```vue
<script setup>
import { Context } from '@vuetify/v0'

const contextValue = { user: 'John', theme: 'dark' }
</script>

<template>
  <Context.Root :value="contextValue" context-key="app-context">
    <Context.Item context-key="app-context" #default="{ value }">
      <p>User: {{ value.user }}</p>
      <p>Theme: {{ value.theme }}</p>
    </Context.Item>
  </Context.Root>
</template>
```

## Breakpoints

Responsive utilities for adaptive layouts.

```vue
<script setup>
import { Breakpoints } from '@vuetify/v0'
</script>

<template>
  <Breakpoints.Root>
    <Breakpoints.Item #default="{ mobile, tablet, desktop }">
      <div v-if="mobile">Mobile Layout</div>
      <div v-else-if="tablet">Tablet Layout</div>
      <div v-else>Desktop Layout</div>
    </Breakpoints.Item>
  </Breakpoints.Root>
</template>
```

## Theme

Theme management with CSS variable injection.

```vue
<script setup>
import { Theme } from '@vuetify/v0'
</script>

<template>
  <Theme.Root>
    <Theme.Item #default="{ theme, setTheme }">
      <button @click="setTheme('light')">Light</button>
      <button @click="setTheme('dark')">Dark</button>
      <p>Current: {{ theme }}</p>
    </Theme.Item>
  </Theme.Root>
</template>
```

## Hydration

SSR hydration management.

```vue
<script setup>
import { Hydration } from '@vuetify/v0'
</script>

<template>
  <Hydration #default="{ isHydrated }">
    <div v-if="isHydrated">
      Client-side content
    </div>
    <div v-else>
      Server-side content
    </div>
  </Hydration>
</template>
```

## Component Integration

Components can be composed together for complex functionality:

```vue
<script setup>
import { Group, Step, Theme } from '@vuetify/v0'
</script>

<template>
  <Theme.Root>
    <Step.Root namespace="wizard">
      <Group.Root :multiple="false">
        <!-- Complex component composition -->
      </Group.Root>
    </Step.Root>
  </Theme.Root>
</template>
```
