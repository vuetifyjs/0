<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Composables
  import { createContext } from '#v0/composables/createContext'
  import { useSelection } from '#v0/composables/useSelection'

  // Utilities
  import { computed, onUnmounted, toValue } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'
  import type { SelectionTicket } from '#v0/composables/useSelection'
  import type { ComputedRef, MaybeRef } from 'vue'

  export interface ExpansionPanelItemProps extends AtomProps {
    id?: string
    value?: any
    disabled?: MaybeRef<boolean>
    namespace?: string
    itemNamespace?: string
  }

  export interface ExpansionPanelItemContext {
    ticket: SelectionTicket
    headerId: ComputedRef<string>
    contentId: ComputedRef<string>
    isDisabled: ComputedRef<boolean>
  }
</script>

<script lang="ts" setup>
  defineOptions({ name: 'ExpansionPanelItem' })

  defineSlots<{ default: () => any }>()

  const {
    as,
    renderless,
    id,
    value,
    disabled,
    namespace = 'v0:expansion-panel',
    itemNamespace = 'v0:expansion-panel-item',
  } = defineProps<ExpansionPanelItemProps>()

  const expansion = useSelection(namespace)
  const ticket = expansion.register({ id, value, disabled })

  const headerId = computed(() => `${ticket.id}-header`)
  const contentId = computed(() => `${ticket.id}-content`)
  const isDisabled = computed(() => toValue(ticket.disabled) || toValue(expansion.disabled))

  const [, provideItemContext] = createContext<ExpansionPanelItemContext>(itemNamespace)

  provideItemContext({
    ticket,
    headerId,
    contentId,
    isDisabled,
  })

  onUnmounted(() => {
    expansion.unregister(ticket.id)
  })
</script>

<template>
  <Atom :as :renderless>
    <slot />
  </Atom>
</template>
