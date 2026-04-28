<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  // Framework
  import { PopoverContent } from '@vuetify/v0'

  // Types
  import type { V0PaperProps } from '@vuetify/paper'

  export interface EmMenuContentProps extends V0PaperProps {
    positionArea?: string
    positionTry?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmMenuContent' })

  const {
    positionArea,
    positionTry,
    ...paperProps
  } = defineProps<EmMenuContentProps>()
</script>

<template>
  <PopoverContent
    class="emerald-menu__popover"
    :position-area
    :position-try
  >
    <V0Paper
      v-bind="paperProps"
      as="div"
      class="emerald-menu__content"
      role="menu"
    >
      <slot />
    </V0Paper>
  </PopoverContent>
</template>

<style>
.emerald-menu__popover {
  padding: 0;
  margin: 4px 0 0;
  background: transparent;
  border: 0;
  overflow: visible;
}

.emerald-menu__popover::backdrop {
  background: transparent;
}

.emerald-menu__content {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  width: 176px;
  padding: 8px;
  background: #ffffff;
  border: 1px solid rgb(var(--emerald-neutral-channels, 26 28 30) / 0.1);
  border-radius: 12px;
  box-shadow:
    0 3px 6px 0 rgba(5, 0, 18, 0.09),
    0 8px 20px 0 rgba(5, 0, 18, 0.13);
  font-family: Manrope, system-ui, -apple-system, sans-serif;
  font-size: 14px;
  line-height: 20px;
  color: var(--emerald-primary-950);
}
</style>
