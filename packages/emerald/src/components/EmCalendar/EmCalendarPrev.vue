<script lang="ts">
  // Context
  import { EM_CALENDAR_NAMESPACE, useEmCalendarContext } from './context'

  // Components
  import EmIcon from '../EmIcon/EmIcon.vue'

  export interface EmCalendarPrevProps {
    namespace?: string
    label?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmCalendarPrev' })

  const {
    namespace = EM_CALENDAR_NAMESPACE,
    label = 'Previous month',
  } = defineProps<EmCalendarPrevProps>()

  const context = useEmCalendarContext(namespace)
</script>

<template>
  <!-- Shares `.emerald-calendar__nav` with EmCalendarNext; the treatment lives
       on the root so either button can be used alone. -->
  <button
    :aria-label="label"
    class="emerald-calendar__nav"
    :disabled="context.disabled.value"
    type="button"
    @click="context.prev()"
  >
    <slot>
      <EmIcon name="chevron-left" size="s" />
    </slot>
  </button>
</template>
