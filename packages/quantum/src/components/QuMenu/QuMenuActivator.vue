<script lang="ts">
  // Framework
  import { IN_BROWSER, isNullOrUndefined, Menu, useMenuRoot } from '@vuetify/v0'

  // Context
  import { orphan, useQuMenu } from './QuMenu.vue'

  // Utilities
  import { onBeforeUnmount, toRef } from 'vue'

  // Types
  import type { MenuActivatorProps, MenuActivatorSlotProps } from '@vuetify/v0'

  export interface QuMenuActivatorProps extends Pick<MenuActivatorProps, 'namespace'> {
    /** Disables this trigger only; `disabled` on QuMenu disables the trigger and every item. */
    disabled?: boolean
  }

  /**
   * `attrs` carries `id`, `type`, `aria-haspopup`, `aria-expanded`,
   * `aria-controls`, `disabled`, `data-open`, `data-state`, the anchor name the
   * sheet positions against, and the `click`, `keydown`, `pointerenter`,
   * `pointerleave` and `focus` handlers.
   */
  export type QuMenuActivatorSlotProps = MenuActivatorSlotProps
</script>

<script setup lang="ts">
  defineOptions({ name: 'QuMenuActivator' })

  defineSlots<{
    /** The emitting control. Spread `attrs` onto it; a `QuButton` is the usual host. */
    default?: (props: QuMenuActivatorSlotProps) => any
  }>()

  const { namespace: _namespace, disabled = false } = defineProps<QuMenuActivatorProps>()

  const context = useQuMenu()

  orphan('QuMenuActivator', context)

  const namespace = toRef(() => _namespace ?? context?.namespace.value ?? 'v0:menu')

  // A renderless activator gives v0 no element, so the sheet still positions
  // (the anchor name rides on `attrs`) but Escape and an item press have
  // nowhere to return focus. The trigger renders the activator id from
  // `attrs`; v0's `returnTo` hands it back to the menu by that id.
  const menu = useMenuRoot(namespace.value)
  const layer = menu.defaultLayer

  function trigger (): Element | null {
    return IN_BROWSER ? document.querySelector(`#${CSS.escape(menu.triggerId(layer))}`) : null
  }

  menu.content.upsert(layer, { returnTo: trigger })

  onBeforeUnmount(() => {
    const ticket = menu.content.get(layer)

    if (!isNullOrUndefined(ticket) && ticket.returnTo === trigger) menu.content.upsert(layer, { returnTo: undefined })
  })
</script>

<!--
  Renderless on purpose: the trigger is the consumer's QuButton, and a button
  rendered around another button is invalid markup with two click targets.
-->
<template>
  <Menu.Activator v-slot="slotProps" :disabled :namespace renderless>
    <slot v-bind="slotProps" />
  </Menu.Activator>
</template>
