<script lang="ts">
  export interface HxNavGroupProps {
    label: string
  }
</script>

<script setup lang="ts">
  // Utilities
  import { useId } from 'vue'

  defineOptions({ name: 'HxNavGroup' })

  const { label } = defineProps<HxNavGroupProps>()

  const groupId = useId()

  const expanded = defineModel<boolean>('expanded', { default: true })

  function onToggle () {
    expanded.value = !expanded.value
  }
</script>

<template>
  <li class="helix-nav-group">
    <button
      :aria-controls="groupId"
      :aria-expanded="expanded"
      class="helix-nav-group__header"
      @click="onToggle"
    >
      <span class="helix-nav-group__label">{{ label }}</span>

      <svg
        aria-hidden="true"
        class="helix-nav-group__chevron"
        :data-expanded="expanded || undefined"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M9 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
      </svg>
    </button>

    <Transition name="expand">
      <ul
        v-if="expanded"
        :id="groupId"
        :aria-label="label"
        class="helix-nav-group__items"
        role="group"
      >
        <slot />
      </ul>
    </Transition>
  </li>
</template>

<style scoped>
.helix-nav-group {
  list-style: none;
}

.helix-nav-group__header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.375rem 0.75rem;
  border: none;
  border-radius: 0.375rem;
  background: none;
  color: var(--v0-on-surface);
  font-weight: 600;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  cursor: pointer;
  user-select: none;
  transition: background-color 150ms ease;
}

.helix-nav-group__header:hover {
  background-color: var(--v0-surface-tint);
}

.helix-nav-group__header:focus-visible {
  outline: 2px solid var(--v0-primary);
  outline-offset: -2px;
}

.helix-nav-group__label {
  flex: 1;
  text-align: start;
}

.helix-nav-group__chevron {
  width: 0.875rem;
  height: 0.875rem;
  transition: transform 200ms ease;
  flex-shrink: 0;
  color: var(--v0-on-surface-variant);
}

.helix-nav-group__chevron[data-expanded] {
  transform: rotate(90deg);
}

.helix-nav-group__items {
  list-style: none;
  padding: 0;
  margin: 0;
  background-color: var(--v0-surface);
}
</style>
