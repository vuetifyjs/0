<script lang="ts">
  // Framework
  import { Collapsible, isNullOrUndefined, useLogger } from '@vuetify/v0'

  // Context
  import { orphan, useQuList } from './context'

  // Types
  import type { QuIconName } from '../../icons'

  // Components
  import QuIcon from '../QuIcon/QuIcon.vue'
  import QuRipple from '../QuRipple/QuRipple.vue'

  export interface QuListGroupProps {
    /** The header's text and the group's accessible name. */
    title: string
    /** A glyph role drawn at the 16 dp edge of the header, as an item's `Icon`. */
    icon?: QuIconName
    /** Inert: the header neither expands nor collapses. */
    disabled?: boolean
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'QuListGroup' })

  defineSlots<{
    /** The nested `QuList.Item` children, indented to the content keyline. */
    default?: () => any
  }>()

  defineEmits<{
    'update:model-value': [value: boolean]
  }>()

  const { title, icon, disabled = false } = defineProps<QuListGroupProps>()

  const model = defineModel<boolean>({ default: false })

  const list = useQuList()

  orphan('QuListGroup', 'QuList', list)

  // A disclosure button cannot sit among a listbox's options.
  if (__DEV__ && !isNullOrUndefined(list) && list.select.value !== 'none') {
    useLogger().warn('[QuListGroup] expandable groups belong to select="none" lists; a listbox can hold options only')
  }
</script>

<template>
  <Collapsible.Root
    v-model="model"
    as="li"
    class="quantum-list__group"
    :disabled
  >
    <Collapsible.Activator class="quantum-list__tile quantum-list__header">
      <QuRipple />

      <span class="quantum-list__body">
        <span v-if="icon" class="quantum-list__icon">
          <span class="quantum-list__face">
            <QuIcon :name="icon" />
          </span>
        </span>

        <span class="quantum-list__content">
          <span class="quantum-list__primary">{{ title }}</span>
        </span>
      </span>

      <Collapsible.Cue class="quantum-list__cue">
        <QuIcon name="expand-more" />
      </Collapsible.Cue>
    </Collapsible.Activator>

    <Collapsible.Content class="quantum-list__children">
      <ul class="quantum-list__nested">
        <slot />
      </ul>
    </Collapsible.Content>
  </Collapsible.Root>
</template>
