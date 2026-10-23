<script lang="ts">
  // Framework
  import { Collapsible, isNullOrUndefined, useLogger } from '@vuetify/v0'

  // Context
  import { orphan, useMd1List } from './context'

  // Types
  import type { Md1IconName } from '../../icons'

  // Components
  import Md1Icon from '../Md1Icon/Md1Icon.vue'
  import Md1Ripple from '../Md1Ripple/Md1Ripple.vue'

  export interface Md1ListGroupProps {
    /** The header's text and the group's accessible name. */
    title: string
    /** A glyph role drawn at the 16 dp edge of the header, as an item's `Icon`. */
    icon?: Md1IconName
    /** Inert: the header neither expands nor collapses. */
    disabled?: boolean
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'Md1ListGroup' })

  defineSlots<{
    /** The nested `Md1List.Item` children, indented to the content keyline. */
    default?: () => any
  }>()

  defineEmits<{
    'update:model-value': [value: boolean]
  }>()

  const { title, icon, disabled = false } = defineProps<Md1ListGroupProps>()

  const model = defineModel<boolean>({ default: false })

  const list = useMd1List()

  orphan('Md1ListGroup', 'Md1List', list)

  // A disclosure button cannot sit among a listbox's options.
  if (__DEV__ && !isNullOrUndefined(list) && list.select.value !== 'none') {
    useLogger().warn('[Md1ListGroup] expandable groups belong to select="none" lists; a listbox can hold options only')
  }
</script>

<template>
  <Collapsible.Root
    v-model="model"
    as="li"
    class="md1-list__group"
    :disabled
  >
    <Collapsible.Activator class="md1-list__tile md1-list__header">
      <Md1Ripple />

      <span class="md1-list__body">
        <span v-if="icon" class="md1-list__icon">
          <span class="md1-list__face">
            <Md1Icon :name="icon" />
          </span>
        </span>

        <span class="md1-list__content">
          <span class="md1-list__primary">{{ title }}</span>
        </span>
      </span>

      <Collapsible.Cue class="md1-list__cue">
        <Md1Icon name="expand-more" />
      </Collapsible.Cue>
    </Collapsible.Activator>

    <Collapsible.Content class="md1-list__children">
      <ul class="md1-list__nested">
        <slot />
      </ul>
    </Collapsible.Content>
  </Collapsible.Root>
</template>
