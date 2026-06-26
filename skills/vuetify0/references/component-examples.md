# Component Examples

Real-world examples of v0 headless components. All styling uses UnoCSS utility classes.

> **Styling guide:** v0 components are headless — they emit `data-*` attributes as styling hooks.
> See the [v0 styling docs](https://0.vuetifyjs.com/guide/fundamentals/styling) for UnoCSS setup and data attribute patterns.

## Contents

- Tabs Component — compound root/list/item/panel pattern
- Dialog Component — modal with scrim, focus trap, and portal
- Popover Component — floating UI with anchor positioning
- Checkbox Component — controlled + uncontrolled variants
- Radio Component — grouped single-selection

---

## Tabs Component

### Basic Tabs

```vue
<script setup lang="ts">
import { Tabs } from '@vuetify/v0/components'
import { shallowRef } from 'vue'

const activeTab = shallowRef('profile')

const tabs = [
  { value: 'profile', label: 'Profile', component: 'ProfilePanel' },
  { value: 'settings', label: 'Settings', component: 'SettingsPanel' },
  { value: 'billing', label: 'Billing', component: 'BillingPanel' },
]
</script>

<template>
  <Tabs.Root v-model="activeTab" class="w-full">
    <Tabs.List class="flex border-b-2 border-gray-200">
      <Tabs.Item
        v-for="tab in tabs"
        :key="tab.value"
        :value="tab.value"
        class="px-6 py-3 bg-transparent border-none cursor-pointer border-b-2 border-transparent -mb-0.5 transition-colors data-[selected]:border-blue-600 data-[selected]:text-blue-600 hover:bg-gray-50"
      >
        {{ tab.label }}
      </Tabs.Item>
    </Tabs.List>

    <Tabs.Panel
      v-for="tab in tabs"
      :key="tab.value"
      :value="tab.value"
      class="p-6"
    >
      <component :is="tab.component" />
    </Tabs.Panel>
  </Tabs.Root>
</template>
```

### Vertical Tabs

```vue
<script setup lang="ts">
import { Tabs } from '@vuetify/v0/components'
import { shallowRef } from 'vue'

const activeTab = shallowRef('profile')

const tabs = [
  { value: 'profile', label: 'Profile', icon: 'i-mdi-account' },
  { value: 'settings', label: 'Settings', icon: 'i-mdi-cog' },
  { value: 'billing', label: 'Billing', icon: 'i-mdi-credit-card' },
]
</script>

<template>
  <Tabs.Root v-model="activeTab" class="h-full">
    <div class="flex h-full">
      <Tabs.List class="flex flex-col w-48 bg-gray-50 border-r border-gray-200">
        <Tabs.Item
          v-for="tab in tabs"
          :key="tab.value"
          :value="tab.value"
          class="flex items-center gap-2 px-4 py-4 border-none bg-transparent cursor-pointer text-left border-r-3 border-transparent data-[selected]:bg-blue-50 data-[selected]:border-blue-600 hover:bg-gray-100"
        >
          <span :class="tab.icon" class="text-base" />
          {{ tab.label }}
        </Tabs.Item>
      </Tabs.List>

      <div class="flex-1 overflow-y-auto">
        <Tabs.Panel
          v-for="tab in tabs"
          :key="tab.value"
          :value="tab.value"
          class="p-6"
        >
          <slot :name="tab.value" />
        </Tabs.Panel>
      </div>
    </div>
  </Tabs.Root>
</template>
```

---

## Dialog Component

### Confirmation Dialog

```vue
<script setup lang="ts">
import { Dialog } from '@vuetify/v0/components'
import { shallowRef } from 'vue'

const isOpen = shallowRef(false)

function onDelete() {
  console.log('Item deleted')
  isOpen.value = false
}
</script>

<template>
  <Dialog.Root v-model="isOpen">
    <Dialog.Activator>
      <button class="px-4 py-2 bg-red-600 text-white rounded cursor-pointer hover:bg-red-700">
        Delete Item
      </button>
    </Dialog.Activator>

    <Dialog.Content class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-[90%] max-w-md shadow-xl">
        <Dialog.Title class="text-xl font-semibold mb-4">
          Confirm Deletion
        </Dialog.Title>

        <Dialog.Description class="text-gray-500 mb-6 leading-relaxed">
          This action cannot be undone. Are you sure you want to delete this item?
        </Dialog.Description>

        <div class="flex gap-3 justify-end">
          <Dialog.Close class="px-4 py-2 bg-gray-100 text-gray-800 rounded cursor-pointer hover:bg-gray-200">
            Cancel
          </Dialog.Close>

          <button
            class="px-4 py-2 bg-red-600 text-white rounded cursor-pointer hover:bg-red-700"
            @click="onDelete"
          >
            Delete
          </button>
        </div>
      </div>
    </Dialog.Content>
  </Dialog.Root>
</template>
```

---

## Popover Component

### Dropdown Menu

```vue
<script setup lang="ts">
import { Popover } from '@vuetify/v0/components'

const menuOptions = [
  { value: 'edit', label: 'Edit', icon: 'i-mdi-pencil' },
  { value: 'copy', label: 'Copy', icon: 'i-mdi-content-copy' },
  { value: 'delete', label: 'Delete', icon: 'i-mdi-trash-can' },
]

function onOption(value: string) {
  console.log('Selected:', value)
}
</script>

<template>
  <Popover.Root>
    <Popover.Activator>
      <button class="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded cursor-pointer hover:bg-gray-50">
        Options
        <span class="i-mdi-chevron-down text-base" />
      </button>
    </Popover.Activator>

    <Popover.Content class="z-10 mt-1">
      <div class="bg-white border border-gray-200 rounded shadow-lg min-w-40">
        <button
          v-for="option in menuOptions"
          :key="option.value"
          class="flex items-center gap-2 w-full px-4 py-3 border-none bg-transparent text-left text-sm cursor-pointer hover:bg-gray-50 first:rounded-t last:rounded-b"
          @click="onOption(option.value)"
        >
          <span :class="option.icon" class="text-base" />
          {{ option.label }}
        </button>
      </div>
    </Popover.Content>
  </Popover.Root>
</template>
```

---

## Checkbox Component

### Custom Styled Checkboxes

```vue
<script setup lang="ts">
import { Checkbox } from '@vuetify/v0/components'
import { reactive } from 'vue'

const options = reactive([
  { id: '1', label: 'Email notifications', checked: true },
  { id: '2', label: 'SMS notifications', checked: false },
  { id: '3', label: 'Push notifications', checked: true },
])
</script>

<template>
  <div class="flex flex-col gap-3">
    <label
      v-for="option in options"
      :key="option.id"
      class="flex items-center gap-3 cursor-pointer"
    >
      <Checkbox.Root v-model="option.checked">
        <Checkbox.Indicator
          class="size-4.5 border-2 border-gray-300 rounded flex items-center justify-center transition-colors data-[checked]:bg-blue-600 data-[checked]:border-blue-600"
        >
          <span class="i-mdi-check text-white text-xs opacity-0 data-[checked]:opacity-100 transition-opacity" />
        </Checkbox.Indicator>
      </Checkbox.Root>

      <span class="text-sm text-gray-700 select-none">{{ option.label }}</span>
    </label>
  </div>
</template>
```

---

## Radio Component

### Radio Button Group

```vue
<script setup lang="ts">
import { Radio } from '@vuetify/v0/components'
import { shallowRef } from 'vue'

const selected = shallowRef('light')

const themes = [
  { value: 'light', label: 'Light Theme', description: 'Clean and bright interface' },
  { value: 'dark', label: 'Dark Theme', description: 'Easy on the eyes' },
  { value: 'auto', label: 'Auto', description: 'Matches system preference' },
]
</script>

<template>
  <Radio.Group v-model="selected" class="flex flex-col gap-4">
    <Radio.Root
      v-for="theme in themes"
      :key="theme.value"
      :value="theme.value"
      class="flex items-start gap-3 cursor-pointer p-3 rounded-lg border border-gray-200 transition-colors hover:bg-gray-50 data-[checked]:border-blue-600 data-[checked]:bg-blue-50"
    >
      <Radio.Indicator
        class="mt-0.5 size-5 border-2 border-gray-300 rounded-full flex items-center justify-center transition-colors data-[checked]:border-blue-600"
      >
        <div class="size-2 bg-blue-600 rounded-full opacity-0 data-[checked]:opacity-100 transition-opacity" />
      </Radio.Indicator>

      <span class="flex-1">
        <strong class="block text-base text-gray-900">{{ theme.label }}</strong>
        <span class="block text-sm text-gray-500 mt-1">{{ theme.description }}</span>
      </span>
    </Radio.Root>
  </Radio.Group>
</template>
```
