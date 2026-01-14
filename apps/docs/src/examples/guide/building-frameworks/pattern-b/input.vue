<script setup lang="ts">
  // Components
  import { Checkbox } from '@vuetify/v0'
  // Utilities
  import { shallowRef } from 'vue'

  const selected = shallowRef<string[]>(['notifications', 'updates'])

  const options = [
    {
      value: 'notifications',
      title: 'Email notifications',
      description: 'Receive emails about account activity',
    },
    {
      value: 'marketing',
      title: 'Marketing emails',
      description: 'Receive tips, tutorials, and product updates',
    },
    {
      value: 'updates',
      title: 'Security updates',
      description: 'Get notified about security and privacy changes',
    },
  ]
</script>

<template>
  <div class="space-y-4">
    <p class="text-sm text-on-surface-variant mb-4">
      Wrapping v0's Checkbox with custom styling:
    </p>

    <Checkbox.Group v-model="selected" class="space-y-3">
      <label
        v-for="option in options"
        :key="option.value"
        class="my-checkbox"
      >
        <Checkbox.Root
          class="my-checkbox__root"
          :value="option.value"
        >
          <Checkbox.Indicator class="my-checkbox__indicator">
            <span class="i-mdi-check" />
          </Checkbox.Indicator>
        </Checkbox.Root>

        <span class="my-checkbox__label">
          <span class="my-checkbox__title">{{ option.title }}</span>
          <span class="my-checkbox__description">{{ option.description }}</span>
        </span>
      </label>
    </Checkbox.Group>

    <div class="mt-4 p-3 bg-surface-variant rounded-lg text-xs text-on-surface-variant">
      <strong>Selected:</strong> {{ selected.join(', ') || 'none' }}
    </div>
  </div>
</template>

<style scoped>
.my-checkbox {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  cursor: pointer;
}

.my-checkbox__root {
  flex-shrink: 0;
  width: 1.25rem;
  height: 1.25rem;
  margin-top: 0.125rem;
  border: 2px solid var(--v0-color-divider);
  border-radius: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 150ms;
  background: var(--v0-color-surface);
}

.my-checkbox__root[data-state="checked"] {
  background: var(--v0-color-primary);
  border-color: var(--v0-color-primary);
}

.my-checkbox__root:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px rgba(var(--v0-color-primary-rgb, 25, 118, 210), 0.2);
}

.my-checkbox__indicator {
  color: var(--v0-color-on-primary);
  font-size: 0.875rem;
}

.my-checkbox__label {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.my-checkbox__title {
  font-weight: 500;
  color: var(--v0-color-on-surface);
  font-size: 0.875rem;
}

.my-checkbox__description {
  color: var(--v0-color-on-surface-variant);
  font-size: 0.75rem;
}
</style>
