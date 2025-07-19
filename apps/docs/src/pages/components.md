# Components

Vuetify 0 provides a collection of foundational components that serve as building blocks for more complex UI elements. These components are designed to be headless, accessible, and highly customizable through slots and CSS variables.

## Available Components

### Core Components

| Component | Description |
| - | - |
| [Atom](#atom) | Base element wrapper with renderless capabilities and dynamic element types |
| [Avatar](#avatar) | Image/fallback avatar system with priority loading and automatic fallback |
| [Context](#context) | Context injection/provision system for sharing state across components |
| [Group](#group) | Selection grouping with multiple/single modes and model binding |
| [Hydration](#hydration) | Client-side hydration utilities for SSR applications |
| [Popover](#popover) | CSS anchor-positioned popup components with automatic positioning |
| [Step](#step) | Step-based navigation system for wizards and multi-step forms |
| [Theme](#theme) | Theme management and CSS variable injection system |

### Layout Components

| Component | Description |
| - | - |
| [Breakpoints](#breakpoints) | Responsive breakpoint utilities for adaptive layouts |
| [Markdown](#markdown) | Markdown rendering interface with customizable adapters |

## Component Architecture

All components follow these principles:

- **Headless First**: Provide logic and accessibility without imposed styling
- **Slot-Driven**: Maximum flexibility through comprehensive slot APIs  
- **CSS Variables**: All styling configurable via CSS custom properties
- **Renderless Option**: Can render without DOM elements for maximum flexibility
- **Type Safety**: Full TypeScript support with proper generic constraints

## Atom

The foundational component that all other components build upon. Provides dynamic element rendering and renderless capabilities.

```vue
<script setup>
import { Atom } from '@vuetify/0'
</script>

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
import { Avatar } from '@vuetify/0'
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
import { Group } from '@vuetify/0'
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
import { Step } from '@vuetify/0'
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
import { Popover } from '@vuetify/0'
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
import { Context } from '@vuetify/0'

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
import { Breakpoints } from '@vuetify/0'
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
import { Theme } from '@vuetify/0'
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
import { Hydration } from '@vuetify/0'
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
import { Group, Step, Theme } from '@vuetify/0'
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
