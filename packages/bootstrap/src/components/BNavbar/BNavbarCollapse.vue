<script lang="ts">
  // Framework
  import { isElement, useLocale } from '@vuetify/v0'

  // Context
  import { useBNavbar } from './BNavbar.vue'

  // Utilities
  import { toRef, useTemplateRef } from 'vue'

  // Types
  import type { BDrawerPlacement } from '../BDrawer'
  import type { ComponentPublicInstance } from 'vue'

  // Components
  import { BButton } from '../BButton'
  import { BDrawer } from '../BDrawer'

  export interface BNavbarCollapseProps {
    /** Toggler name. Omitted, `Navbar.toggle`, or "Toggle navigation". */
    label?: string
    /** Passed to `BDrawer`. The docs navbar uses `end`. */
    placement?: BDrawerPlacement
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'BNavbarCollapse' })

  defineSlots<{
    /** Drawer header and body. Rendered inside `BDrawer`. */
    default?: () => any
  }>()

  const {
    label,
    placement = 'end',
  } = defineProps<BNavbarCollapseProps>()

  const navbar = useBNavbar()
  const open = navbar.open
  const locale = useLocale()
  const togglerRef = useTemplateRef<ComponentPublicInstance>('toggler')

  const name = toRef(() => label ?? locale.ti('Navbar.toggle') ?? 'Toggle navigation')

  // BDrawer’s root is a renderless Dialog, so its `$el` is not the `<dialog>`.
  // The dialog is the next element after this button.
  const controls = toRef(() => {
    const button = togglerRef.value?.$el
    if (!isElement(button)) return undefined
    const dialog = button.nextElementSibling
    if (!isElement(dialog) || dialog.tagName !== 'DIALOG') return undefined
    return dialog.id || undefined
  })

  function onToggle () {
    open.value = !open.value
  }

  function onModel (value: boolean) {
    open.value = value
  }
</script>

<template>
  <BButton
    ref="toggler"
    :aria-controls="controls"
    :aria-expanded="open"
    :aria-label="name"
    class="navbar-toggler"
    icon
    @click="onToggle"
  >
    <span
      aria-hidden="true"
      class="navbar-toggler-icon"
    />
  </BButton>

  <BDrawer
    :model-value="open"
    :placement
    @update:model-value="onModel"
  >
    <slot />
  </BDrawer>
</template>
