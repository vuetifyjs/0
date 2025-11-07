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

  export interface ExpansionPanelContentProps extends AtomProps {
    itemNamespace?: string
  }
</script>

<script lang="ts" setup>
  defineOptions({ name: 'ExpansionPanelContent' })

  defineSlots<{
    default: (props: {
      'id': string
      'role': 'region'
      'aria-labelledby': string
      'isSelected': boolean
    }) => any
  }>()

  const {
    as,
    renderless,
    itemNamespace = 'v0:expansion-panel-item',
  } = defineProps<ExpansionPanelContentProps>()

  const context = useContext<ExpansionPanelItemContext>(itemNamespace)

  const bindableProps = computed(() => ({
    'id': context.contentId.value,
    'role': 'region' as const,
    'aria-labelledby': context.headerId.value,
    'isSelected': context.ticket.isSelected.value,
  }))
</script>

<template>
  <Atom
    :id="!renderless && bindableProps.id"
    :aria-labelledby="!renderless && bindableProps['aria-labelledby']"
    :as
    :renderless
    :role="!renderless && bindableProps.role"
  >
    <slot v-bind="bindableProps" />
  </Atom>
</template>
