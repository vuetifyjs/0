# Selection Patterns

Complete guide to v0 selection composables with real-world examples.

## Contents

- Single Selection — exclusive pick (tabs, theme picker, accordion)
- Multi Selection — non-exclusive pick (filters, tag pickers)
- Group Selection — multi + tri-state select-all (data tables)
- Step Navigation — ordered progression (wizards, carousels)
- Advanced Patterns — mandatory modes, disabled items, value mapping

## Single Selection {#single}

For exclusive selection - tabs, theme pickers, accordion panels.

### Basic Usage
```ts
import { createSingle } from '@vuetify/v0'

const single = createSingle()

// Register items
single.register({ id: 'light', value: 'Light Theme' })  
single.register({ id: 'dark', value: 'Dark Theme' })

// Select programmatically
single.select('dark')

// Access selected
single.selectedValue.value // 'Dark Theme'
single.selectedId.value    // 'dark'
single.selectedIds         // Set { 'dark' }
```

### Mandatory Selection
```ts
// 'force' selects the first non-disabled item when it registers
const themePicker = createSingle({ mandatory: 'force' })

// true keeps the last selection. Clicking the selected item does nothing.
const tabs = createSingle({ mandatory: true })
```

### Theme Switcher Example
```vue
<template>
  <div class="theme-switcher">
    <button 
      v-for="theme in themes"
      :key="theme.id"
      :class="{ active: single.selected(theme.id) }"
      @click="single.select(theme.id)"
    >
      {{ theme.value }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { createSingle } from '@vuetify/v0'

const themes = [
  { id: 'light', value: 'Light' },
  { id: 'dark', value: 'Dark' }, 
  { id: 'auto', value: 'Auto' }
]

const single = createSingle({ mandatory: 'force' })

// Register all themes
themes.forEach(theme => single.register(theme))

// Set initial selection
single.select('light')
</script>
```

## Multi Selection {#multi}

For multiple independent selections - tags, filters, permissions.

### Basic Usage
```ts
import { createSelection } from '@vuetify/v0'

const selection = createSelection({ multiple: true })

selection.register({ id: 'tag1' })
selection.register({ id: 'tag2' })
selection.toggle('tag1')
selection.toggle('tag2')

selection.selected('tag1') // true
selection.selectedIds      // Set { 'tag1', 'tag2' }
```

### Tag Selector Example
```vue
<template>
  <div class="tag-selector">
    <button
      v-for="tag in availableTags"
      :key="tag"
      :class="{ selected: selection.selected(tag) }"
      @click="selection.toggle(tag)"
    >
      {{ tag }}
      <span v-if="selection.selected(tag)">✓</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { createSelection } from '@vuetify/v0'

const availableTags = ['vue', 'typescript', 'css', 'javascript']
const selection = createSelection({ multiple: true })

// Register all available tags
availableTags.forEach(tag => {
  selection.register({ id: tag, value: tag })
})
</script>
```

## Group Selection {#group}

For grouped selection with "select all" functionality - data tables, file managers.

### Basic Usage
```ts
import { createGroup } from '@vuetify/v0'

const group = createGroup()

// Register items
users.forEach(user => {
  group.register({ id: user.id, value: user })
})

// Group operations
group.selectAll()
group.unselectAll()
group.toggleAll()

group.isAllSelected.value // true when every item is selected
group.isMixed.value       // true when the selection is partial
```

### Data Table Example
```vue
<template>
  <table>
    <thead>
      <tr>
        <th>
          <input 
            type="checkbox"
            :checked="group.isAllSelected.value"
            :indeterminate="group.isMixed.value"
            @click="group.toggleAll()"
          />
        </th>
        <th>Name</th>
        <th>Email</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="user in users" :key="user.id">
        <td>
          <input
            type="checkbox" 
            :checked="group.selected(user.id)"
            @click="group.toggle(user.id)"
          />
        </td>
        <td>{{ user.name }}</td>
        <td>{{ user.email }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
import { createGroup } from '@vuetify/v0'

const users = [
  { id: 1, name: 'John', email: 'john@example.com' },
  { id: 2, name: 'Jane', email: 'jane@example.com' }
]

const group = createGroup()

// Register all users
users.forEach(user => {
  group.register({ id: user.id, value: user })
})
</script>
```

## Step Navigation {#step}

For sequential navigation - wizards, carousels, onboarding flows.

### Basic Usage
```ts
import { createStep } from '@vuetify/v0'

const stepper = createStep({ 
  circular: true,  // Allow wrap-around
})

// Navigation
stepper.next()    // Go forward
stepper.prev()    // Go backward
stepper.first()   // Jump to start
stepper.last()    // Jump to end

// State
stepper.selectedIndex.value  // Current step index (-1 if none selected)
stepper.selectedId.value     // Id of the current step
```

### Wizard Example
```vue
<template>
  <div class="wizard">
    <!-- Progress indicator -->
    <div class="steps">
      <div 
        v-for="(step, index) in steps"
        :key="index"
        :class="{ 
          active: stepper.selectedIndex.value === index,
          completed: stepper.selectedIndex.value > index 
        }"
      >
        {{ step.title }}
      </div>
    </div>

    <!-- Step content -->
    <div class="step-content">
      <component :is="currentStep.component" />
    </div>

    <!-- Navigation -->
    <div class="step-nav">
      <button 
        :disabled="stepper.selectedIndex.value <= 0" 
        @click="stepper.prev()"
      >
        Previous
      </button>
      
      <button 
        :disabled="stepper.selectedIndex.value >= steps.length - 1"
        @click="stepper.next()"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { createStep } from '@vuetify/v0'
import { computed } from 'vue'

const steps = [
  { title: 'Profile', component: 'ProfileStep' },
  { title: 'Preferences', component: 'PreferencesStep' },
  { title: 'Review', component: 'ReviewStep' }
]

const stepper = createStep()

steps.forEach((step, index) => stepper.register({ id: String(index), value: step }))
stepper.first()

const currentStep = computed(() => steps[stepper.selectedIndex.value] ?? steps[0])
</script>
```

## Advanced Patterns

### Nested Selection
For hierarchical data like file trees:

```ts
import { createNested } from '@vuetify/v0'

const tree = createNested()

// Register parent-child relationships
tree.register({ id: 'folder1', value: 'Folder' })
tree.register({ id: 'file1', value: 'File 1', parentId: 'folder1' })
tree.register({ id: 'file2', value: 'File 2', parentId: 'folder1' })

// Default mode is cascade: selecting a parent selects its descendants.
tree.select('folder1')
```

### Selection with Dependencies
```ts
const selection = createSelection({ multiple: true })

// Custom logic for dependent selections
watch(() => Array.from(selection.selectedIds), ids => {
  if (ids.includes('premium') && !ids.includes('basic')) {
    selection.select('basic')
  }
})
```

### Persistent Selection
```ts
import { createSelection, useStorage } from '@vuetify/v0'

const selection = createSelection({ multiple: true })
const storage = useStorage()
const stored = storage.get<string[]>('selected-items', [])

// Restore saved selection on mount
onMounted(() => {
  stored.value.forEach(id => selection.select(id))
})

// Persist selection changes
watch(() => Array.from(selection.selectedIds), ids => {
  stored.value = ids
})
```