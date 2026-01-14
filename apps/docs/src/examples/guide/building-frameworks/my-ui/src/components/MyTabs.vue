<script lang="ts">
  export interface MyTabsProps {
    modelValue?: string | number
    items: Array<{ value: string | number, label: string }>
  }
</script>

<script setup lang="ts">
  // Composables
  import { createSingle, useProxyRegistry } from '@vuetify/v0'
  // Utilities
  import { useId, watch } from 'vue'

  const props = defineProps<MyTabsProps>()
  const emit = defineEmits<{
    'update:modelValue': [value: string | number | undefined]
  }>()

  const uid = useId()
  const tabs = createSingle({ mandatory: 'force', events: true })
  const proxy = useProxyRegistry(tabs)

  // Sync items to registry
  watch(() => props.items, items => {
    tabs.clear()
    tabs.onboard(items.map(item => ({ id: item.value, value: item.label })))
  }, { immediate: true })

  // Sync modelValue to selection
  watch(() => props.modelValue, value => {
    if (value !== undefined && tabs.get(value)) {
      tabs.select(value)
    }
  }, { immediate: true })

  // Emit changes
  tabs.on('select', ({ id }) => {
    emit('update:modelValue', id)
  })

  function onKeydown (event: KeyboardEvent) {
    const items = Array.from(proxy.values)
    const current = items.findIndex(t => t.isSelected.value)
    let next = current

    switch (event.key) {
      case 'ArrowRight': {
        next = current < items.length - 1 ? current + 1 : 0
        break
      }
      case 'ArrowLeft': {
        next = current > 0 ? current - 1 : items.length - 1
        break
      }
      case 'Home': {
        next = 0
        break
      }
      case 'End': {
        next = items.length - 1
        break
      }
      default: { return
      }
    }

    if (next !== current) {
      event.preventDefault()
      items[next].select()
      document.querySelector<HTMLButtonElement>(`#${CSS.escape(`${uid}-tab-${items[next].id}`)}`)?.focus()
    }
  }
</script>

<template>
  <div class="my-tabs">
    <div
      class="my-tabs__list"
      role="tablist"
      @keydown="onKeydown"
    >
      <button
        v-for="tab in proxy.values"
        :id="`${uid}-tab-${tab.id}`"
        :key="tab.id"
        :aria-controls="`${uid}-panel-${tab.id}`"
        :aria-selected="tab.isSelected.value"
        class="my-tabs__tab"
        :data-selected="tab.isSelected.value || undefined"
        role="tab"
        :tabindex="tab.isSelected.value ? 0 : -1"
        @click="tab.select"
      >
        {{ tab.value }}
      </button>
    </div>

    <div class="my-tabs__panels">
      <div
        v-for="tab in proxy.values"
        :id="`${uid}-panel-${tab.id}`"
        :key="tab.id"
        :aria-labelledby="`${uid}-tab-${tab.id}`"
        class="my-tabs__panel"
        :hidden="!tab.isSelected.value"
        role="tabpanel"
      >
        <slot :name="tab.id" />
      </div>
    </div>
  </div>
</template>

<style>
.my-tabs__list {
  display: flex;
  gap: 0.25rem;
  border-bottom: 1px solid var(--v0-color-divider);
}

.my-tabs__tab {
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--v0-color-on-surface-variant);
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
  cursor: pointer;
  transition: all 150ms;
}

.my-tabs__tab:hover {
  color: var(--v0-color-on-surface);
}

.my-tabs__tab[data-selected] {
  color: var(--v0-color-primary);
  border-bottom-color: var(--v0-color-primary);
}

.my-tabs__tab:focus-visible {
  outline: 2px solid var(--v0-color-primary);
  outline-offset: -2px;
}

.my-tabs__panel {
  padding: 1rem 0;
}
</style>
