<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  // Framework
  import { PopoverContent } from '@vuetify/v0'

  // Types
  import type { V0PaperProps } from '@vuetify/paper'

  export interface HxDropdownContentProps extends V0PaperProps {
    align?: 'start' | 'end'
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'HxDropdownContent' })

  const {
    align = 'start',
    ...paperProps
  } = defineProps<HxDropdownContentProps>()
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
        class="helix-dropdown__content"
        :data-align="align"
      >
        <slot v-bind="slotProps" />
      </V0Paper>
    </template>
  </PopoverContent>
</template>

<style scoped>
.helix-dropdown__content {
  min-width: 8rem;
}
</style>
