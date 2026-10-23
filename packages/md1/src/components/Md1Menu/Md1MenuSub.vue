<script lang="ts">
  // Framework
  import { isString, Menu } from '@vuetify/v0'

  // Context
  import { orphan, useMd1Menu } from './Md1Menu.vue'

  // Utilities
  import { toRef } from 'vue'

  // Types
  import type { Md1IconName } from '../../icons'
  import type { MenuSubActivatorProps, MenuSubContentProps } from '@vuetify/v0'

  // Components
  import Md1Icon from '../Md1Icon/Md1Icon.vue'
  import Md1Ripple from '../Md1Ripple/Md1Ripple.vue'

  /**
   * One part for the cascading menu: v0's `Menu.Sub`, `Menu.SubActivator` and
   * `Menu.SubContent` folded together. The row is the parent item; the default
   * slot is the sub menu's items. Placement is the spec's (flush with the
   * parent's trailing edge, top aligned with the parent item, flipped near a
   * screen edge), so `positionArea` and `positionTry` are withheld.
   */
  export interface Md1MenuSubProps extends Pick<MenuSubActivatorProps, 'id' | 'namespace'>, Pick<MenuSubContentProps, 'eager'> {
    /** The parent item's text. */
    label: string
    /** A glyph role drawn at the parent row's leading keyline. */
    icon?: Md1IconName
    /** Kept in place at the disabled ink; the sub menu cannot open. */
    disabled?: boolean
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'Md1MenuSub' })

  defineSlots<{
    /** The sub menu's items. */
    default?: () => any
  }>()

  const {
    id,
    namespace: _namespace,
    eager = false,
    label,
    icon,
    disabled = false,
  } = defineProps<Md1MenuSubProps>()

  const context = useMd1Menu()

  orphan('Md1MenuSub', context)

  const namespace = toRef(() => _namespace ?? context?.namespace.value ?? 'v0:menu')
  const inert = toRef(() => disabled || (context?.disabled.value ?? false))
  const dense = toRef(() => context?.dense.value ?? false)
  const desktop = toRef(() => context?.desktop.value ?? false)
</script>

<template>
  <Menu.Sub>
    <Menu.SubActivator
      :id
      class="md1-menu__item"
      :data-icon="isString(icon) || undefined"
      :disabled="inert"
      :label
      :namespace
    >
      <Md1Ripple />

      <span v-if="icon" aria-hidden="true" class="md1-menu__icon">
        <Md1Icon :name="icon" :size="desktop ? 's' : 'm'" />
      </span>

      <span class="md1-menu__label">{{ label }}</span>

      <span aria-hidden="true" class="md1-menu__cue">
        <Md1Icon name="arrow-right" :size="desktop ? 's' : 'm'" />
      </span>
    </Menu.SubActivator>

    <Menu.SubContent
      class="md1-menu"
      :data-dense="dense || undefined"
      :data-desktop="desktop || undefined"
      :data-sub="true"
      :eager
      :namespace
      position-area="inline-end span-block-end"
      position-try="flip-inline, flip-block, --md1-menu-sub-fit"
    >
      <div class="md1-menu__list">
        <slot />
      </div>
    </Menu.SubContent>
  </Menu.Sub>
</template>
