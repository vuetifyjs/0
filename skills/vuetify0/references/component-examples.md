# Component Examples

Real-world examples of v0 headless components with styling.

## Tabs Component

### Basic Tabs
```vue
<template>
  <Tabs.Root v-model="activeTab" class="custom-tabs">
    <Tabs.List class="tab-list">
      <Tabs.Item 
        v-for="tab in tabs"
        :key="tab.value"
        :value="tab.value"
        class="tab-item"
      >
        {{ tab.label }}
      </Tabs.Item>
    </Tabs.List>

    <Tabs.Panel 
      v-for="tab in tabs"
      :key="tab.value"
      :value="tab.value"
      class="tab-panel"
    >
      <component :is="tab.component" />
    </Tabs.Panel>
  </Tabs.Root>
</template>

<script setup lang="ts">
import { Tabs } from '@vuetify/v0/components'
import { ref } from 'vue'

const activeTab = ref('profile')

const tabs = [
  { value: 'profile', label: 'Profile', component: 'ProfilePanel' },
  { value: 'settings', label: 'Settings', component: 'SettingsPanel' },
  { value: 'billing', label: 'Billing', component: 'BillingPanel' }
]
</script>

<style scoped>
.custom-tabs {
  width: 100%;
}

.tab-list {
  display: flex;
  border-bottom: 2px solid #e0e0e0;
}

.tab-item {
  padding: 12px 24px;
  border: none;
  background: none;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.2s;
}

.tab-item[data-selected] {
  border-bottom-color: #1976d2;
  color: #1976d2;
}

.tab-item:hover {
  background: #f5f5f5;
}

.tab-panel {
  padding: 24px;
}
</style>
```

### Vertical Tabs
```vue
<template>
  <Tabs.Root v-model="activeTab" class="vertical-tabs">
    <div class="tabs-container">
      <Tabs.List class="vertical-tab-list">
        <Tabs.Item 
          v-for="tab in tabs"
          :key="tab.value"
          :value="tab.value"
          class="vertical-tab-item"
        >
          <Icon :name="tab.icon" />
          {{ tab.label }}
        </Tabs.Item>
      </Tabs.List>

      <div class="tab-content">
        <Tabs.Panel 
          v-for="tab in tabs"
          :key="tab.value"
          :value="tab.value"
          class="vertical-tab-panel"
        >
          <h2>{{ tab.label }}</h2>
          <component :is="tab.component" />
        </Tabs.Panel>
      </div>
    </div>
  </Tabs.Root>
</template>

<style scoped>
.vertical-tabs {
  height: 100%;
}

.tabs-container {
  display: flex;
  height: 100%;
}

.vertical-tab-list {
  display: flex;
  flex-direction: column;
  width: 200px;
  background: #f8f9fa;
  border-right: 1px solid #dee2e6;
}

.vertical-tab-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px;
  border: none;
  background: none;
  cursor: pointer;
  text-align: left;
}

.vertical-tab-item[data-selected] {
  background: #e3f2fd;
  border-right: 3px solid #1976d2;
}

.tab-content {
  flex: 1;
  overflow-y: auto;
}
</style>
```

## Dialog Component

### Confirmation Dialog
```vue
<template>
  <Dialog.Root v-model="isOpen">
    <Dialog.Activator>
      <button class="delete-button">Delete Item</button>
    </Dialog.Activator>

    <Dialog.Content class="dialog-overlay">
      <div class="dialog-content">
        <Dialog.Title class="dialog-title">
          Confirm Deletion
        </Dialog.Title>
        
        <Dialog.Description class="dialog-description">
          This action cannot be undone. Are you sure you want to delete this item?
        </Dialog.Description>

        <div class="dialog-actions">
          <Dialog.Close class="button button-secondary">
            Cancel
          </Dialog.Close>
          
          <button 
            class="button button-danger"
            @click="handleDelete"
          >
            Delete
          </button>
        </div>
      </div>
    </Dialog.Content>
  </Dialog.Root>
</template>

<script setup lang="ts">
import { Dialog } from '@vuetify/v0/components'
import { ref } from 'vue'

const isOpen = ref(false)

const handleDelete = () => {
  // Perform deletion
  console.log('Item deleted')
  isOpen.value = false
}
</script>

<style scoped>
.dialog-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.dialog-content {
  background: white;
  border-radius: 8px;
  padding: 24px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

.dialog-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 16px 0;
}

.dialog-description {
  color: #666;
  margin: 0 0 24px 0;
  line-height: 1.5;
}

.dialog-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.button {
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-size: 14px;
}

.button-secondary {
  background: #f5f5f5;
  color: #333;
}

.button-danger {
  background: #dc3545;
  color: white;
}
</style>
```

## Popover Component

### Dropdown Menu
```vue
<template>
  <Popover.Root>
    <Popover.Activator class="menu-trigger">
      <button class="trigger-button">
        Options
        <Icon name="chevron-down" />
      </button>
    </Popover.Activator>

    <Popover.Content class="dropdown-content">
      <div class="dropdown-menu">
        <button 
          v-for="option in menuOptions"
          :key="option.value"
          class="dropdown-item"
          @click="handleOption(option)"
        >
          <Icon :name="option.icon" />
          {{ option.label }}
        </button>
      </div>
    </Popover.Content>
  </Popover.Root>
</template>

<script setup lang="ts">
import { Popover } from '@vuetify/v0/components'

const menuOptions = [
  { value: 'edit', label: 'Edit', icon: 'edit' },
  { value: 'copy', label: 'Copy', icon: 'copy' },
  { value: 'delete', label: 'Delete', icon: 'trash' }
]

const handleOption = (option: any) => {
  console.log('Selected:', option.value)
}
</script>

<style scoped>
.menu-trigger {
  position: relative;
}

.trigger-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
}

.dropdown-content {
  position: absolute;
  z-index: 100;
  margin-top: 4px;
}

.dropdown-menu {
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  min-width: 160px;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 12px 16px;
  border: none;
  background: none;
  text-align: left;
  cursor: pointer;
  font-size: 14px;
}

.dropdown-item:hover {
  background: #f5f5f5;
}

.dropdown-item:first-child {
  border-radius: 4px 4px 0 0;
}

.dropdown-item:last-child {
  border-radius: 0 0 4px 4px;
}
</style>
```

## Checkbox Component

### Custom Styled Checkboxes
```vue
<template>
  <div class="checkbox-group">
    <Checkbox.Root
      v-for="option in options"
      :key="option.id"
      v-model="option.checked"
      class="custom-checkbox"
    >
      <Checkbox.Indicator class="checkbox-indicator">
        <Icon name="check" class="check-icon" />
      </Checkbox.Indicator>
      
      <Checkbox.Label class="checkbox-label">
        {{ option.label }}
      </Checkbox.Label>
    </Checkbox.Root>
  </div>
</template>

<script setup lang="ts">
import { Checkbox } from '@vuetify/v0/components'
import { reactive } from 'vue'

const options = reactive([
  { id: '1', label: 'Email notifications', checked: true },
  { id: '2', label: 'SMS notifications', checked: false },
  { id: '3', label: 'Push notifications', checked: true }
])
</script>

<style scoped>
.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.custom-checkbox {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
}

.checkbox-indicator {
  width: 18px;
  height: 18px;
  border: 2px solid #ddd;
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.custom-checkbox[data-checked] .checkbox-indicator {
  background: #1976d2;
  border-color: #1976d2;
}

.check-icon {
  width: 12px;
  height: 12px;
  color: white;
  opacity: 0;
  transition: opacity 0.2s;
}

.custom-checkbox[data-checked] .check-icon {
  opacity: 1;
}

.checkbox-label {
  font-size: 14px;
  color: #333;
  user-select: none;
}
</style>
```

## Radio Component

### Radio Button Group
```vue
<template>
  <div class="radio-group">
    <h3>Select Theme</h3>
    
    <Radio.Root
      v-for="theme in themes"
      :key="theme.value"
      v-model="selectedTheme"
      :value="theme.value"
      class="custom-radio"
    >
      <Radio.Indicator class="radio-indicator">
        <div class="radio-dot" />
      </Radio.Indicator>
      
      <Radio.Label class="radio-label">
        <div class="theme-option">
          <strong>{{ theme.label }}</strong>
          <span class="theme-description">{{ theme.description }}</span>
        </div>
      </Radio.Label>
    </Radio.Root>
  </div>
</template>

<script setup lang="ts">
import { Radio } from '@vuetify/v0/components'
import { ref } from 'vue'

const selectedTheme = ref('light')

const themes = [
  {
    value: 'light',
    label: 'Light Theme',
    description: 'Clean and bright interface'
  },
  {
    value: 'dark', 
    label: 'Dark Theme',
    description: 'Easy on the eyes'
  },
  {
    value: 'auto',
    label: 'Auto',
    description: 'Matches system preference'
  }
]
</script>

<style scoped>
.radio-group {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.custom-radio {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  cursor: pointer;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  transition: all 0.2s;
}

.custom-radio:hover {
  background: #f5f5f5;
}

.custom-radio[data-checked] {
  border-color: #1976d2;
  background: #e3f2fd;
}

.radio-indicator {
  width: 20px;
  height: 20px;
  border: 2px solid #ddd;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 2px;
  transition: all 0.2s;
}

.custom-radio[data-checked] .radio-indicator {
  border-color: #1976d2;
}

.radio-dot {
  width: 8px;
  height: 8px;
  background: #1976d2;
  border-radius: 50%;
  opacity: 0;
  transition: opacity 0.2s;
}

.custom-radio[data-checked] .radio-dot {
  opacity: 1;
}

.radio-label {
  flex: 1;
}

.theme-option strong {
  display: block;
  font-size: 16px;
  color: #333;
}

.theme-description {
  display: block;
  font-size: 14px;
  color: #666;
  margin-top: 4px;
}
</style>
```