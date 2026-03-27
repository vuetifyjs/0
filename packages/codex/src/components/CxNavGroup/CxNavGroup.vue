<script lang="ts">
  export interface CxNavGroupProps {
    label: string
  }
</script>

<script setup lang="ts">
  // Utilities
  import { useId } from 'vue'

  defineOptions({ name: 'CxNavGroup' })

  const { label } = defineProps<CxNavGroupProps>()

  const groupId = useId()

  const expanded = defineModel<boolean>('expanded', { default: true })

  function onToggle () {
    expanded.value = !expanded.value
  }
</script>

<template>
  <li class="codex-nav-group">
    <button
      :aria-controls="groupId"
      :aria-expanded="expanded"
      class="codex-nav-group__header"
      @click="onToggle"
    >
      <span class="codex-nav-group__label">{{ label }}</span>

      <svg
        class="codex-nav-group__chevron"
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
        class="codex-nav-group__items"
        role="group"
      >
        <slot />
      </ul>
    </Transition>
  </li>
</template>

<style scoped>
.codex-nav-group {
  list-style: none;
}

.codex-nav-group__header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.375rem 0.75rem;
  border: none;
  background: none;
  font-weight: 600;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  cursor: pointer;
  user-select: none;
}

.codex-nav-group__label {
  flex: 1;
  text-align: start;
}

.codex-nav-group__chevron {
  width: 0.875rem;
  height: 0.875rem;
  transition: transform 200ms ease;
  flex-shrink: 0;
}

.codex-nav-group__chevron[data-expanded] {
  transform: rotate(90deg);
}

.codex-nav-group__items {
  list-style: none;
  padding: 0;
  margin: 0;
}
</style>
