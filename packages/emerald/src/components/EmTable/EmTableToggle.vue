<script lang="ts">
  export interface EmTableToggleProps {
    disabled?: boolean
    label?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmTableToggle' })

  const { disabled = false, label = 'Toggle row details' } = defineProps<EmTableToggleProps>()

  const expanded = defineModel<boolean>({ default: false })

  function onToggle () {
    if (disabled) return

    expanded.value = !expanded.value
  }
</script>

<template>
  <td
    class="emerald-table__toggle"
    :data-disabled="disabled || undefined"
    :data-expanded="expanded || undefined"
  >
    <button
      :aria-expanded="expanded"
      :aria-label="label"
      class="emerald-table__toggle-button"
      :disabled="disabled || undefined"
      type="button"
      @click="onToggle"
    >
      <svg
        fill="none"
        viewBox="0 0 20 20"
      >
        <path
          d="M6 7.5 10 12.5 14 7.5"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="1.5"
        />
      </svg>
    </button>
  </td>
</template>

<style>
.emerald-table__toggle {
  padding: var(--emerald-spacing-s);
  vertical-align: middle;
  background: transparent;
  transition: background 120ms ease;
}

.emerald-table__toggle-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  padding: 0;
  background: none;
  border: 0;
  color: inherit;
  cursor: pointer;
  border-radius: var(--emerald-radius-2xs);
}

.emerald-table__toggle-button svg {
  width: 100%;
  height: 100%;
  transition: transform 120ms ease;
}

.emerald-table__toggle[data-expanded] .emerald-table__toggle-button svg {
  transform: rotate(180deg);
}

.emerald-table__toggle[data-disabled] .emerald-table__toggle-button {
  color: var(--emerald-neutral-400);
  cursor: default;
}
</style>
