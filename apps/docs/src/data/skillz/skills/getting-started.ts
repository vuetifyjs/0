// Types
import type { PlaygroundSkill } from '@/types/skill'

export const gettingStarted: PlaygroundSkill = {
  mode: 'playground',
  id: 'getting-started',
  name: 'Getting Started',
  level: 1,
  track: 'fundamentals',
  categories: ['components', 'composables'],
  order: 1,
  prerequisites: [],
  description: 'Build your first headless components with Vuetify0.',
  estimatedMinutes: 10,
  steps: [
    {
      title: 'Build a Tabs component',
      task: 'Import `TabsRoot`, `TabsList`, `TabsTab`, `TabsPanels`, and `TabsPanel` from @vuetify/v0 to create a tabbed interface. These are headless components - you provide all the styling.',
      hint: 'Tabs components work together: TabsRoot provides context, TabsList contains TabsTab items, TabsPanels contains TabsPanel items',
      startCode: `<script setup>
// Import Tabs components from @vuetify/v0


</script>

<template>
  <div style="border: 1px solid #ccc; border-radius: 8px; overflow: hidden;">
    <!-- Add TabsRoot with default-value="tab-1" -->

      <!-- Add TabsList with tabs -->

        <!-- Add TabsTab for each tab -->


      <!-- Add TabsPanels with panels -->

        <!-- Add TabsPanel for each panel -->



  </div>
</template>

<style scoped>
/* Style your tabs however you want! */
</style>`,
      validate: 'import.*Tabs(Root|List|Tab|Panels|Panel).*from.*@vuetify/v0',
      solution: `<script setup>
import { TabsRoot, TabsList, TabsTab, TabsPanels, TabsPanel } from '@vuetify/v0'
</script>

<template>
  <div style="border: 1px solid #ccc; border-radius: 8px; overflow: hidden;">
    <TabsRoot default-value="tab-1">
      <TabsList style="display: flex; border-bottom: 1px solid #ccc;">
        <TabsTab value="tab-1" style="padding: 12px 24px; cursor: pointer;">Home</TabsTab>
        <TabsTab value="tab-2" style="padding: 12px 24px; cursor: pointer;">Profile</TabsTab>
        <TabsTab value="tab-3" style="padding: 12px 24px; cursor: pointer;">Settings</TabsTab>
      </TabsList>
      <TabsPanels style="padding: 16px;">
        <TabsPanel value="tab-1">Welcome to the home tab!</TabsPanel>
        <TabsPanel value="tab-2">This is your profile.</TabsPanel>
        <TabsPanel value="tab-3">Adjust your settings here.</TabsPanel>
      </TabsPanels>
    </TabsRoot>
  </div>
</template>

<style scoped>
/* Style your tabs however you want! */
</style>`,
    },
    {
      title: 'Create a Dialog',
      task: 'Build a complete dialog using `DialogRoot`, `DialogTrigger`, `DialogPortal`, `DialogBackdrop`, `DialogContent`, `DialogTitle`, `DialogDescription`, and `DialogClose` from @vuetify/v0.',
      hint: 'Dialog components: DialogRoot wraps everything, DialogTrigger opens it, DialogPortal teleports content, DialogBackdrop is the overlay, DialogContent is the modal, DialogClose closes it',
      startCode: `<script setup>
// Import all Dialog components from @vuetify/v0


</script>

<template>
  <div>
    <!-- Build a dialog with trigger, backdrop, content, title, description, and close button -->

  </div>
</template>`,
      validate: 'import.*Dialog(Root|Trigger|Portal|Content).*from.*@vuetify/v0',
      solution: `<script setup>
import {
  DialogRoot,
  DialogTrigger,
  DialogPortal,
  DialogBackdrop,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@vuetify/v0'
</script>

<template>
  <div>
    <DialogRoot>
      <DialogTrigger style="padding: 8px 16px; cursor: pointer;">
        Open Dialog
      </DialogTrigger>

      <DialogPortal>
        <DialogBackdrop style="position: fixed; inset: 0; background: rgba(0,0,0,0.5);" />
        <DialogContent style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; padding: 24px; border-radius: 8px; min-width: 300px;">
          <DialogTitle style="margin: 0 0 8px; font-size: 18px; font-weight: bold;">
            Welcome!
          </DialogTitle>
          <DialogDescription style="margin: 0 0 16px; color: #666;">
            This is a headless dialog. You control all the styling!
          </DialogDescription>
          <DialogClose style="padding: 8px 16px; cursor: pointer;">
            Close
          </DialogClose>
        </DialogContent>
      </DialogPortal>
    </DialogRoot>
  </div>
</template>`,
    },
    {
      title: 'Use createSingle for selection',
      task: 'Import `createSingle` from @vuetify/v0 and use it to manage single selection. Create a selection with createSingle() and use `selected` and `select` to track which item is chosen.',
      hint: 'createSingle returns selected (the current value) and select (function to change it)',
      startCode: `<script setup>
// Import createSingle from @vuetify/v0


// Create a single selection


const items = ['Apple', 'Banana', 'Cherry']
</script>

<template>
  <div>
    <p>Selected: {{ selected || 'None' }}</p>
    <button
      v-for="item in items"
      :key="item"
      :style="{ fontWeight: selected === item ? 'bold' : 'normal' }"
      @click="select(item)"
    >
      {{ item }}
    </button>
  </div>
</template>`,
      validate: 'import.*createSingle.*from.*@vuetify/v0',
      solution: `<script setup>
import { createSingle } from '@vuetify/v0'

const { selected, select } = createSingle()

const items = ['Apple', 'Banana', 'Cherry']
</script>

<template>
  <div>
    <p>Selected: {{ selected || 'None' }}</p>
    <button
      v-for="item in items"
      :key="item"
      :style="{ fontWeight: selected === item ? 'bold' : 'normal' }"
      @click="select(item)"
    >
      {{ item }}
    </button>
  </div>
</template>`,
    },
    {
      title: 'Add keyboard navigation',
      task: 'Import `useHotkey` from @vuetify/v0 to add a keyboard shortcut. Make pressing "Escape" close the panel by setting `isOpen` to false.',
      hint: 'useHotkey takes a key name and a callback function: useHotkey("Escape", () => { ... })',
      startCode: `<script setup>
import { ref } from 'vue'
// Import useHotkey from @vuetify/v0


const isOpen = ref(false)

// Add a hotkey for "Escape" that sets isOpen to false

</script>

<template>
  <div>
    <p>Panel is: {{ isOpen ? 'OPEN' : 'CLOSED' }}</p>
    <p style="font-size: 12px; color: #666;">Press Escape to close</p>
    <button @click="isOpen = !isOpen">{{ isOpen ? 'Close' : 'Open' }} Panel</button>

    <div v-if="isOpen" style="margin-top: 16px; padding: 16px; border: 1px solid #ccc; border-radius: 8px;">
      This panel can be closed with Escape!
    </div>
  </div>
</template>`,
      validate: 'useHotkey.*Escape',
      solution: `<script setup>
import { ref } from 'vue'
import { useHotkey } from '@vuetify/v0'

const isOpen = ref(false)

useHotkey('Escape', () => { isOpen.value = false })
</script>

<template>
  <div>
    <p>Panel is: {{ isOpen ? 'OPEN' : 'CLOSED' }}</p>
    <p style="font-size: 12px; color: #666;">Press Escape to close</p>
    <button @click="isOpen = !isOpen">{{ isOpen ? 'Close' : 'Open' }} Panel</button>

    <div v-if="isOpen" style="margin-top: 16px; padding: 16px; border: 1px solid #ccc; border-radius: 8px;">
      This panel can be closed with Escape!
    </div>
  </div>
</template>`,
    },
  ],
}
