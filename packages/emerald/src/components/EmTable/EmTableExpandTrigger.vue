<script lang="ts">
  export interface EmTableExpandTriggerProps {
    /** Whether the row's detail panel is currently expanded. */
    expanded?: boolean
    /** Whether the trigger is disabled. */
    disabled?: boolean
    /** Accessible label for the trigger. */
    label?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmTableExpandTrigger' })

  const {
    expanded = false,
    disabled = false,
    label = 'Toggle row details',
  } = defineProps<EmTableExpandTriggerProps>()

  const emit = defineEmits<{
    toggle: []
  }>()

  function onToggle () {
    if (disabled) return
    emit('toggle')
  }
</script>

<template>
  <button
    :aria-expanded="expanded"
    :aria-label="label"
    class="emerald-table__expand-trigger"
    :data-expanded="expanded || undefined"
    :disabled="disabled || undefined"
    type="button"
    @click="onToggle"
  >
    <slot :expanded>
      <svg
        aria-hidden="true"
        class="emerald-table__expand-chevron"
        fill="none"
        height="16"
        viewBox="0 0 16 16"
        width="16"
      >
        <path
          d="M6 4l4 4-4 4"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="1.5"
        />
      </svg>
    </slot>
  </button>
</template>

<style>
.emerald-table__expand-trigger {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  padding: 0;
  background: none;
  border: 0;
  border-radius: 4px;
  color: inherit;
  cursor: pointer;
  transition: background 120ms ease, transform 120ms ease;
}

.emerald-table__expand-trigger:hover:not(:disabled) {
  background: rgb(var(--emerald-neutral-channels, 26 28 30) / 0.06);
}

.emerald-table__expand-trigger:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.emerald-table__expand-chevron {
  transition: transform 120ms ease;
}

.emerald-table__expand-trigger[data-expanded] .emerald-table__expand-chevron {
  transform: rotate(90deg);
}
</style>
