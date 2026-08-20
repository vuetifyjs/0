<script lang="ts">
  // Context
  import { EM_CALENDAR_NAMESPACE, useEmCalendarContext } from './context'

  export interface EmCalendarTodayProps {
    namespace?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmCalendarToday' })

  const { namespace = EM_CALENDAR_NAMESPACE } = defineProps<EmCalendarTodayProps>()

  const context = useEmCalendarContext(namespace)
</script>

<template>
  <button
    class="emerald-calendar__today"
    :disabled="context.disabled.value"
    type="button"
    @click="context.today()"
  >
    <slot>Today</slot>
  </button>
</template>

<style>
  .emerald-calendar__today {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex: none;
    height: 28px;
    padding: 0 var(--emerald-spacing-s, 12px);
    border: var(--emerald-stroke-s, 1px) solid var(--emerald-neutral-300, #ccd6e7);
    border-radius: var(--emerald-radius-m, 8px);
    background: var(--emerald-background, #fefefe);
    color: var(--emerald-on-surface, #2b2d2e);
    font-family: inherit;
    font-size: var(--emerald-text-b3-size, 12px);
    font-weight: var(--emerald-text-b3-bold-weight, 600);
    cursor: pointer;
  }

  .emerald-calendar__today:hover:not(:disabled) {
    background: var(--emerald-neutral-200, #f6f8fa);
  }

  .emerald-calendar__today:disabled {
    color: var(--emerald-neutral-400, #aeb6be);
    cursor: not-allowed;
  }

  .emerald-calendar__today:focus-visible {
    outline: var(--emerald-stroke-m, 2px) solid var(--emerald-primary-600, #1fae60);
    outline-offset: 1px;
  }
</style>
