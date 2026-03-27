<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  // Framework
  import { PopoverContent } from '@vuetify/v0'

  // Types
  import type { V0PaperProps } from '@vuetify/paper'

  export interface CxDropdownContentProps extends V0PaperProps {
    align?: 'start' | 'end'
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'CxDropdownContent' })

  const {
    align = 'start',
    ...paperProps
  } = defineProps<CxDropdownContentProps>()
</script>

<template>
  <PopoverContent
    :position-area="align === 'end' ? 'bottom span-left' : 'bottom span-right'"
    position-try="flip-block"
  >
    <template #default="slotProps">
      <V0Paper
        v-bind="paperProps"
        as="div"
        class="codex-dropdown__content"
        :data-align="align"
        role="menu"
      >
        <slot v-bind="slotProps" />
      </V0Paper>
    </template>
  </PopoverContent>
</template>

<style scoped>
.codex-dropdown__content {
  min-width: 8rem;
}
</style>
