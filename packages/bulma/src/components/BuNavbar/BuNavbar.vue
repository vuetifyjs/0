<script lang="ts">
  // Framework
  import { Toggle, useId } from '@vuetify/v0'

  // Utilities
  import { toRef } from 'vue'

  export interface BuNavbarProps {
    /** Id applied to `.navbar-menu` and mirrored on the burger's `data-target` */
    id?: string
    /** Accessible label for the `<nav>` landmark */
    label?: string
    /** Color modifier applied to `.navbar` */
    color?: 'primary' | 'link' | 'info' | 'success' | 'warning' | 'danger'
    /** Renders the `.navbar-burger` toggle */
    burger?: boolean
  }

  export interface BuNavbarSlotProps {
    /** Whether the mobile menu is open */
    isOpen: boolean
    /** Toggle the mobile menu */
    toggle: () => void
    /** Close the mobile menu */
    close: () => void
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'BuNavbar' })

  defineSlots<{
    /** Menu content — rendered inside `.navbar-menu` (`.navbar-start` / `.navbar-end` markup is userland) */
    default: (props: BuNavbarSlotProps) => any
    /** Brand content — rendered inside `.navbar-brand`, before the burger */
    brand?: (props: BuNavbarSlotProps) => any
  }>()

  defineEmits<{
    'update:model-value': [value: boolean]
  }>()

  const {
    id,
    label = 'main navigation',
    color,
    burger = true,
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
    <div class="navbar-brand">
      <slot
        name="brand"
        v-bind="slotProps"
      />

      <Toggle.Root
        v-if="burger"
        v-model="model"
        :aria-expanded="model ? 'true' : 'false'"
        aria-label="menu"
        as="a"
        class="navbar-burger"
        :class="{ 'is-active': model }"
        :data-target="menu"
      >
        <span aria-hidden="true" />
        <span aria-hidden="true" />
        <span aria-hidden="true" />
        <span aria-hidden="true" />
      </Toggle.Root>
    </div>

    <div
      :id="menu"
      class="navbar-menu"
      :class="{ 'is-active': model }"
    >
      <slot v-bind="slotProps" />
    </div>
  </nav>
</template>
