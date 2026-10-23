<script lang="ts">
  // Framework
  import { isString, Menu } from '@vuetify/v0'

  // Context
  import { orphan, useQuMenu } from './QuMenu.vue'

  // Utilities
  import { toRef } from 'vue'

  // Types
  import type { QuIconName } from '../../icons'
  import type { MenuSubActivatorProps, MenuSubContentProps } from '@vuetify/v0'

  // Components
  import QuIcon from '../QuIcon/QuIcon.vue'
  import QuRipple from '../QuRipple/QuRipple.vue'

  /**
   * One part for the cascading menu: v0's `Menu.Sub`, `Menu.SubActivator` and
   * `Menu.SubContent` folded together. The row is the parent item; the default
   * slot is the sub menu's items. Placement is the spec's (flush with the
   * parent's trailing edge, top aligned with the parent item, flipped near a
   * screen edge), so `positionArea` and `positionTry` are withheld.
   */
  export interface QuMenuSubProps extends Pick<MenuSubActivatorProps, 'id' | 'namespace'>, Pick<MenuSubContentProps, 'eager'> {
    /** The parent item's text. */
    label: string
    /** A glyph role drawn at the parent row's leading keyline. */
    icon?: QuIconName
    /** Kept in place at the disabled ink; the sub menu cannot open. */
    disabled?: boolean
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'QuMenuSub' })

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
  } = defineProps<QuMenuSubProps>()

  const context = useQuMenu()

  orphan('QuMenuSub', context)

  const namespace = toRef(() => _namespace ?? context?.namespace.value ?? 'v0:menu')
  const inert = toRef(() => disabled || (context?.disabled.value ?? false))
  const dense = toRef(() => context?.dense.value ?? false)
  const desktop = toRef(() => context?.desktop.value ?? false)
</script>

<template>
  <Menu.Sub>
    <Menu.SubActivator
      :id
      class="quantum-menu__item"
      :data-icon="isString(icon) || undefined"
      :disabled="inert"
      :label
      :namespace
    >
      <QuRipple />

      <span v-if="icon" aria-hidden="true" class="quantum-menu__icon">
        <QuIcon :name="icon" :size="desktop ? 's' : 'm'" />
      </span>

      <span class="quantum-menu__label">{{ label }}</span>

      <span aria-hidden="true" class="quantum-menu__cue">
        <QuIcon name="arrow-right" :size="desktop ? 's' : 'm'" />
      </span>
    </Menu.SubActivator>

    <Menu.SubContent
      class="quantum-menu"
      :data-dense="dense || undefined"
      :data-desktop="desktop || undefined"
      :data-sub="true"
      :eager
      :namespace
      position-area="inline-end span-block-end"
      position-try="flip-inline, flip-block, --quantum-menu-sub-fit"
    >
      <div class="quantum-menu__list">
        <slot />
      </div>
    </Menu.SubContent>
  </Menu.Sub>
</template>
