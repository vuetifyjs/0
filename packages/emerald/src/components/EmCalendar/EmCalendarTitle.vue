<script lang="ts">
  // Framework
  import { Atom } from '@vuetify/v0'

  // Context
  import { EM_CALENDAR_NAMESPACE, useEmCalendarContext } from './context'

  // Types
  import type { AtomProps } from '@vuetify/v0'

  export interface EmCalendarTitleProps {
    namespace?: string
    /**
     * Heading level for the month label. Non-nullable: the grid is labelled by
     * the id stamped on this element, and a renderless title would drop it.
     */
    as?: NonNullable<AtomProps['as']>
    /** Announce month changes. Turn off on a second title over the same state. */
    live?: boolean
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmCalendarTitle' })

  const {
    namespace = EM_CALENDAR_NAMESPACE,
    as = 'h2',
    live = true,
  } = defineProps<EmCalendarTitleProps>()

  const context = useEmCalendarContext(namespace)
</script>

<template>
  <!-- The grid names itself after this element, and a month change is otherwise
       a silent update for anyone not watching the cells. -->
  <Atom
    :id="context.title"
    :aria-live="live ? 'polite' : undefined"
    :as
    class="emerald-calendar__title"
  >
    <slot>{{ context.label.value }}</slot>
  </Atom>
</template>

<style>
  .emerald-calendar__title {
    margin: 0;
    font-size: var(--emerald-text-h4-size, 20px);
    font-weight: 700;
    letter-spacing: -0.01em;
  }
</style>
