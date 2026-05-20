<script lang="ts">
  // Framework
  import { useComboboxContext } from '@vuetify/v0'

  // Utilities
  import { toRef } from 'vue'

  // Types
  import type { ID } from '@vuetify/v0'

  export interface EmAutoCompleteChipsProps {
    /** Override the displayed label for a value */
    formatter?: (value: unknown, id: ID) => string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmAutoCompleteChips' })

  const { formatter } = defineProps<EmAutoCompleteChipsProps>()

  const combobox = useComboboxContext('v0:combobox')

  const chips = toRef(() => {
    const out: { id: ID, label: string }[] = []
    for (const id of combobox.selection.selectedIds) {
      const ticket = combobox.selection.get(id)
      if (!ticket) continue
      out.push({
        id: ticket.id,
        label: formatter ? formatter(ticket.value, ticket.id) : String(ticket.value ?? ticket.id),
      })
    }
    return out
  })

  function onRemove (id: ID, event: MouseEvent) {
    event.stopPropagation()
    combobox.selection.unselect(id)
  }
</script>

<template>
  <span class="emerald-auto-complete__chips">
    <span
      v-for="chip in chips"
      :key="chip.id"
      class="emerald-auto-complete__chip"
    >
      <span class="emerald-auto-complete__chip-label">{{ chip.label }}</span>

      <button
        :aria-label="`Remove ${chip.label}`"
        class="emerald-auto-complete__chip-remove"
        tabindex="-1"
        type="button"
        @click="(event) => onRemove(chip.id, event)"
      >
        <svg
          aria-hidden="true"
          fill="none"
          height="10"
          viewBox="0 0 10 10"
          width="10"
        >
          <path
            d="M2.5 2.5l5 5m0-5l-5 5"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-width="1.5"
          />
        </svg>
      </button>
    </span>
  </span>
</template>

<style>
.emerald-auto-complete__chips {
  display: inline-flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px;
  min-width: 0;
}

.emerald-auto-complete__chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 4px 2px 8px;
  background: rgb(var(--emerald-primary-500-channels, 124 92 246) / 0.12);
  color: var(--emerald-primary-700, #4c2bd9);
  border-radius: 4px;
  font-family: Manrope, system-ui, -apple-system, sans-serif;
  font-size: 12px;
  font-weight: 500;
  line-height: 16px;
  max-width: 100%;
}

.emerald-auto-complete__chip-label {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.emerald-auto-complete__chip-remove {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 14px;
  height: 14px;
  padding: 0;
  border: 0;
  border-radius: 999px;
  background: transparent;
  color: inherit;
  cursor: pointer;
  outline: none;
  transition: background-color 120ms ease;
}

.emerald-auto-complete__chip-remove:hover {
  background: rgb(var(--emerald-primary-500-channels, 124 92 246) / 0.2);
}

.emerald-auto-complete__chip-remove:focus-visible {
  box-shadow: 0 0 0 2px rgb(var(--emerald-primary-500-channels, 124 92 246) / 0.35);
}
</style>
