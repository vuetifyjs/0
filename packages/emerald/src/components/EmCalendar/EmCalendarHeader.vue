<script lang="ts">
  export interface EmCalendarHeaderProps {
    namespace?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmCalendarHeader' })

  // Layout-only shell; `namespace` is declared so header composition reads the
  // same as every other child, and so it never leaks onto the element.
  defineProps<EmCalendarHeaderProps>()
</script>

<template>
  <header class="emerald-calendar__header">
    <slot />
  </header>
</template>

<style>
  .emerald-calendar__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--emerald-spacing-m, 16px);
    padding: var(--emerald-spacing-s, 12px) var(--emerald-spacing-m, 16px);
    border-bottom: var(--emerald-stroke-s, 1px) solid var(--emerald-neutral-300, #ccd6e7);
  }

  @media (max-width: 640px) {
    .emerald-calendar__header {
      flex-wrap: wrap;
      gap: var(--emerald-spacing-xs, 8px);
    }
  }
</style>
