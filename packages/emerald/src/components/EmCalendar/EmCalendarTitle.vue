<script lang="ts">
  // Context
  import { EM_CALENDAR_NAMESPACE, useEmCalendarContext } from './context'

  export interface EmCalendarTitleProps {
    namespace?: string
    /** Heading level for the month label. */
    as?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmCalendarTitle' })

  const { namespace = EM_CALENDAR_NAMESPACE, as = 'h2' } = defineProps<EmCalendarTitleProps>()

  const context = useEmCalendarContext(namespace)
</script>

<template>
  <component :is="as" :id="context.title" class="emerald-calendar__title">
    <slot>{{ context.label.value }}</slot>
  </component>
</template>

<style>
  .emerald-calendar__title {
    margin: 0;
    font-size: var(--emerald-text-h4-size, 20px);
    font-weight: 700;
    letter-spacing: -0.01em;
  }
</style>
