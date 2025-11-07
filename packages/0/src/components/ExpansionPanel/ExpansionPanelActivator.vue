<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Composables
  import { useContext } from '#v0/composables'

  // Utilities
  import { computed } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'
  import type { ExpansionPanelItemContext } from './ExpansionPanelItem.vue'

  export interface ExpansionPanelActivatorProps extends AtomProps {
    itemNamespace?: string
  }
</script>

<script lang="ts" setup>
  defineOptions({ name: 'ExpansionPanelActivator' })

  defineSlots<{
    default: (props: {
      'id': string
      'role': 'button'
      'tabindex': number
      'aria-expanded': boolean
      'aria-controls': string
      'aria-disabled': boolean
      'isSelected': boolean
      'toggle': () => void
      'onClick': () => void
      'onKeydown': (e: KeyboardEvent) => void
    }) => any
  }>()

  const {
    as = 'button',
    renderless,
    itemNamespace = 'v0:expansion-panel-item',
  } = defineProps<ExpansionPanelActivatorProps>()

  const context = useContext<ExpansionPanelItemContext>(itemNamespace)

  const bindableProps = computed(() => ({
    'id': context.headerId.value,
    'role': 'button' as const,
    'tabindex': context.isDisabled.value ? -1 : 0,
    'aria-expanded': context.ticket.isSelected.value,
    'aria-controls': context.contentId.value,
    'aria-disabled': context.isDisabled.value,
    'isSelected': context.ticket.isSelected.value,
    'toggle': context.ticket.toggle,
    'onClick': context.ticket.toggle,
    'onKeydown': (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        context.ticket.toggle()
      }
    },
  }))
</script>

<template>
  <Atom
    :id="!renderless && bindableProps.id"
    :aria-controls="!renderless && bindableProps['aria-controls']"
    :aria-disabled="!renderless && bindableProps['aria-disabled']"
    :aria-expanded="!renderless && bindableProps['aria-expanded']"
    :as
    :renderless
    :role="!renderless && bindableProps.role"
    :tabindex="!renderless && bindableProps.tabindex"
    @click="bindableProps.onClick"
    @keydown="bindableProps.onKeydown"
  >
    <slot v-bind="bindableProps" />
  </Atom>
</template>
