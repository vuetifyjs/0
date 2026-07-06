<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  // Framework
  import { PopoverContent, useRovingFocus } from '@vuetify/v0'

  import { provideMenuContext } from './context'

  // Utilities
  import { ref } from 'vue'

  // Types
  import type { EmMenuTicket } from './context'
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

  const tickets = ref<EmMenuTicket[]>([])

  const focus = useRovingFocus(() => tickets.value, {
    orientation: 'vertical',
    circular: true,
  })

  function register (ticket: EmMenuTicket) {
    tickets.value.push(ticket)

    return () => {
      tickets.value = tickets.value.filter(item => item.id !== ticket.id)
    }
  }

  provideMenuContext({ focus, register })
</script>

<template>
  <PopoverContent
    class="emerald-menu__popover"
    :position-area
    :position-try
  >
    <template #default="slotProps">
      <V0Paper
        v-bind="paperProps"
        as="div"
        class="emerald-menu__content"
        role="menu"
        @keydown="focus.onKeydown"
      >
        <slot v-bind="slotProps" />
      </V0Paper>
    </template>
  </PopoverContent>
</template>

<style>
.emerald-menu__popover {
  padding: 0;
  margin: var(--emerald-spacing-2xs) 0 0;
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
  min-width: 210px;
  width: max-content;
  padding: var(--emerald-spacing-xs) var(--emerald-spacing-xs) var(--emerald-spacing-m);
  background: var(--emerald-surface);
  border: var(--emerald-stroke-s) solid var(--emerald-neutral-alpha-gray-20);
  border-radius: var(--emerald-radius-m);
  box-shadow: var(--emerald-shadow-m);
  font-family: var(--emerald-font-sans);
  font-size: var(--emerald-text-b1-size);
  line-height: var(--emerald-text-b1-height);
  color: var(--emerald-on-surface);
}
</style>
