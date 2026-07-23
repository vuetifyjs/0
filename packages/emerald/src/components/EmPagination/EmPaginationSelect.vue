<script lang="ts">
  // Framework
  import { isNumber, SelectActivator, SelectContent, SelectCue, SelectItem, SelectRoot } from '@vuetify/v0'

  // Utilities
  import { computed } from 'vue'

  // Types
  import type { ID } from '@vuetify/v0'

  export interface EmPaginationSelectProps {
    options?: number[]
    disabled?: boolean
  }

  export interface EmPaginationSelectSlotProps {
    /** Current items-per-page value */
    value: number
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmPaginationSelect' })

  defineSlots<{
    default: (props: EmPaginationSelectSlotProps) => any
  }>()

  const {
    options = [10, 25, 50, 100],
    disabled = false,
  } = defineProps<EmPaginationSelectProps>()

  const model = defineModel<number>({ default: 10 })

  const proxy = computed<ID | ID[] | undefined>({
    get: () => model.value,
    set (value) {
      if (isNumber(value)) model.value = value
    },
  })
</script>

<template>
  <span class="emerald-pagination__select">
    <SelectRoot
      v-model="proxy"
      :disabled
      mandatory
    >
      <SelectActivator class="emerald-pagination__select-activator">
        <slot :value="model">{{ model }}/page</slot>

        <SelectCue class="emerald-pagination__select-cue">
          <svg
            fill="none"
            viewBox="0 0 16 16"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4 6l4 4 4-4"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
            />
          </svg>
        </SelectCue>
      </SelectActivator>

      <SelectContent class="emerald-pagination__select-content">
        <SelectItem
          v-for="option in options"
          :key="option"
          class="emerald-pagination__select-item"
          :value="option"
        >
          {{ option }}/page
        </SelectItem>
      </SelectContent>
    </SelectRoot>
  </span>
</template>

<style>
.emerald-pagination__select {
  display: inline-flex;
  font-family: var(--emerald-font-sans);
  font-size: var(--emerald-text-b2-size);
  font-weight: var(--emerald-text-b2-weight);
  line-height: var(--emerald-text-b2-height);
  color: var(--emerald-on-background);
}

.emerald-pagination__select-activator {
  display: inline-flex;
  align-items: center;
  gap: var(--emerald-spacing-2xs);
  box-sizing: border-box;
  height: 28px;
  padding: var(--emerald-spacing-2xs) var(--emerald-spacing-xs);
  background: var(--emerald-surface);
  border: var(--emerald-stroke-s) solid var(--emerald-border);
  border-radius: var(--emerald-radius-m);
  color: inherit;
  font: inherit;
  cursor: pointer;
  transition: border-color 120ms ease, box-shadow 120ms ease;
}

.emerald-pagination__select-activator:focus-visible {
  outline: none;
  box-shadow: var(--emerald-shadow-focus);
}

.emerald-pagination__select-activator[data-disabled] {
  color: var(--emerald-neutral-400);
  cursor: not-allowed;
}

.emerald-pagination__select-cue {
  display: inline-flex;
  transition: transform 180ms cubic-bezier(0.4, 0, 0.2, 1);
}

.emerald-pagination__select-cue[data-state="open"] {
  transform: rotate(180deg);
}

.emerald-pagination__select-cue > svg {
  width: 16px;
  height: 16px;
}

.emerald-pagination__select-content {
  flex-direction: column;
  align-items: stretch;
  padding: var(--emerald-spacing-2xs);
  margin-top: var(--emerald-spacing-2xs);
  background: var(--emerald-surface);
  border: var(--emerald-stroke-s) solid var(--emerald-divider);
  border-radius: var(--emerald-radius-m);
  box-shadow: var(--emerald-shadow-m);
  font-family: var(--emerald-font-sans);
  font-size: var(--emerald-text-b2-size);
  font-weight: var(--emerald-text-b2-weight);
  line-height: var(--emerald-text-b2-height);
  color: var(--emerald-on-surface);
}

.emerald-pagination__select-content:popover-open {
  display: flex;
}

.emerald-pagination__select-item {
  display: flex;
  align-items: center;
  padding: var(--emerald-spacing-2xs) var(--emerald-spacing-xs);
  border-radius: var(--emerald-radius-xs);
  cursor: pointer;
  user-select: none;
  transition: background-color 120ms ease;
}

.emerald-pagination__select-item[data-focused],
.emerald-pagination__select-item:hover {
  background: var(--emerald-neutral-200);
}

.emerald-pagination__select-item[data-selected] {
  background: var(--emerald-primary-100);
  font-weight: var(--emerald-text-b2-bold-weight);
}

.emerald-pagination__select-item[data-disabled] {
  color: var(--emerald-neutral-400);
  cursor: not-allowed;
}
</style>
