<script lang="ts">
  // Framework
  import { createContext, useId } from '@vuetify/v0'

  // Utilities
  import { toRef } from 'vue'

  export interface BuNavbarProps {
    /** Id applied to `.navbar-menu` and mirrored on the burger's `data-target` */
    id?: string
    /** Accessible label for the `<nav>` landmark */
    label?: string
    /** Color modifier applied to `.navbar` */
    color?: 'primary' | 'link' | 'info' | 'success' | 'warning' | 'danger'
  }

  export interface BuNavbarContext {
    /** Id shared by `.navbar-menu` and the burger's `data-target`. */
    id: () => string
    /** Whether the mobile menu is open. */
    isOpen: () => boolean
    /** Toggle the mobile menu. */
    toggle: () => void
    /** Close the mobile menu. */
    close: () => void
  }

  export interface BuNavbarSlotProps {
    /** Whether the mobile menu is open */
    isOpen: boolean
    /** Toggle the mobile menu */
    toggle: () => void
    /** Close the mobile menu */
    close: () => void
  }

  // Only the parent provides, so the provider stays module-local; parts import
  // the hook.
  const [useBuNavbar, provideBuNavbar] = createContext<BuNavbarContext | null>('bulma:navbar', null)

  export { useBuNavbar }
</script>

<script setup lang="ts">
  defineOptions({ name: 'BuNavbar' })

  defineSlots<{
    /** `nav.navbar` children — BuNavbarBrand and BuNavbarMenu. */
    default: (props: BuNavbarSlotProps) => any
  }>()

  defineEmits<{
    'update:model-value': [value: boolean]
  }>()

  const {
    id,
    label = 'main navigation',
    color,
  } = defineProps<BuNavbarProps>()

  const model = defineModel<boolean>({ default: false })

  // useId must run in the setup body — as a prop-default factory it executes
  // outside the component instance and falls back to a non-SSR-safe counter.
  const fallback = useId()
  const menu = toRef(() => id ?? fallback)

  function toggle () {
    model.value = !model.value
  }

  function close () {
    model.value = false
  }

  provideBuNavbar({
    id: () => menu.value,
    isOpen: () => model.value,
    toggle,
    close,
  })

  const slotProps = toRef((): BuNavbarSlotProps => ({
    isOpen: model.value,
    toggle,
    close,
  }))
</script>

<template>
  <nav
    :aria-label="label"
    class="navbar"
    :class="color && `is-${color}`"
    role="navigation"
  >
    <slot v-bind="slotProps" />
  </nav>
</template>
