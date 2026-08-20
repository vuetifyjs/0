<script lang="ts">
  // Context
  import { EM_CALENDAR_NAMESPACE, useEmCalendarContext } from './context'

  // Components
  import EmIcon from '../EmIcon/EmIcon.vue'

  export interface EmCalendarNextProps {
    namespace?: string
    label?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmCalendarNext' })

  const {
    namespace = EM_CALENDAR_NAMESPACE,
    label = 'Next month',
  } = defineProps<EmCalendarNextProps>()

  const context = useEmCalendarContext(namespace)
</script>

<template>
  <!-- Shares `.emerald-calendar__nav` with EmCalendarPrev — one 28px treatment
       on the root, so either button can be used alone. -->
  <button
    :aria-label="label"
    class="emerald-calendar__nav"
    :disabled="context.disabled.value"
    type="button"
    @click="context.next()"
  >
    <slot>
      <EmIcon name="chevron-right" size="s" />
    </slot>
  </button>
</template>
