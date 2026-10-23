<script lang="ts">
  // Framework
  import { Dialog, useLogger } from '@vuetify/v0'

  // Context
  import { orphan, useMd1NavigationDrawer } from './context'

  // Utilities
  import { toRef, watch } from 'vue'

  export interface Md1NavigationDrawerActivatorSlotProps {
    /** Whether the drawer is open. */
    isOpen: boolean
    /**
     * Spread onto the trigger. Temporary: `type`, `tabindex`,
     * `aria-haspopup="dialog"`, `aria-expanded`, `data-open` and the `click`
     * that opens. Persistent: `type`, `aria-expanded`, `aria-controls`,
     * `data-open` and the `click` that toggles the drawer. Permanent: empty,
     * since a permanent drawer cannot be toggled.
     */
    attrs: Record<string, unknown>
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'Md1NavigationDrawerActivator' })

  defineSlots<{
    /** The trigger. Spread `attrs` onto it; an `Md1Button` or `Md1Toolbar.Nav` is the usual host. */
    default?: (props: Md1NavigationDrawerActivatorSlotProps) => any
  }>()

  const context = useMd1NavigationDrawer()

  orphan('Md1NavigationDrawerActivator', context)

  const logger = useLogger()

  const type = toRef(() => context?.type.value ?? 'temporary')
  const modal = toRef(() => !!context && type.value === 'temporary')
  const isOpen = toRef(() => context?.isOpen.value ?? false)

  if (__DEV__) {
    watch(() => !!context && type.value === 'permanent', wrong => {
      if (wrong) logger.warn('[Md1NavigationDrawerActivator] a permanent drawer cannot be opened or closed (pattern page); the trigger is inert')
    }, { immediate: true })
  }

  function onClick () {
    context?.toggle()
  }

  // A persistent drawer is a landmark beside the content, not a dialog: the
  // trigger is a disclosure button that controls it.
  const attrs = toRef((): Record<string, unknown> => {
    if (!context || type.value === 'permanent') return {}

    return {
      'type': 'button',
      'aria-expanded': isOpen.value,
      'aria-controls': context.id.value,
      'data-open': isOpen.value || undefined,
      'onClick': onClick,
    }
  })
</script>

<!--
  Renderless on purpose: the trigger is the consumer's Md1Button, and a button
  rendered around another button is invalid markup with two click targets.
-->
<template>
  <Dialog.Activator v-if="modal" v-slot="slotProps" renderless>
    <slot :attrs="{ ...slotProps.attrs }" :is-open="slotProps.isOpen" />
  </Dialog.Activator>

  <slot v-else :attrs :is-open />
</template>
