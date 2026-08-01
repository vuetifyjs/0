<script lang="ts">
  // Framework
  import { useClickOutside, useId, useToggleScope } from '@vuetify/v0'

  // Utilities
  import { toRef, useTemplateRef } from 'vue'

  export interface BuDropdownProps {
    /** Show the menu on hover via Bulma CSS only (`is-hoverable`) — no JS wiring when set. */
    hoverable?: boolean
    /** Align the menu to the right edge (`is-right`). */
    right?: boolean
    /** Open the menu upwards (`is-up`). */
    up?: boolean
    /**
     * Emit `role="menu"` on `.dropdown-menu`. Only set this when every item is an
     * actionable link rendered with the `item` slot-prop attrs (`role="menuitem"`);
     * arbitrary-content dropdowns must leave it off.
     */
    menu?: boolean
  }

  export interface BuDropdownTriggerSlotProps {
    /** Whether the dropdown is open. */
    isOpen: boolean
    /** Toggle the dropdown (no-op when `hoverable`). */
    toggle: () => void
    /** Attributes to bind to the trigger element. */
    attrs: {
      'aria-haspopup': 'true'
      'aria-controls': string
      'aria-expanded': 'true' | 'false'
      'onClick': () => void
    }
  }

  export interface BuDropdownSlotProps {
    /** Whether the dropdown is open. */
    isOpen: boolean
    /** Close the dropdown. */
    close: () => void
    /** Attrs to bind to each actionable item when `menu` is set; empty otherwise. */
    item: { role?: 'menuitem' }
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'BuDropdown' })

  defineSlots<{
    trigger: (props: BuDropdownTriggerSlotProps) => any
    default: (props: BuDropdownSlotProps) => any
  }>()

  defineEmits<{
    'update:model-value': [value: boolean]
  }>()

  const {
    hoverable = false,
    right = false,
    up = false,
    menu = false,
  } = defineProps<BuDropdownProps>()

  const model = defineModel<boolean>({ default: false })

  const id = useId()
  const root = useTemplateRef('root')

  function close () {
    model.value = false
  }

  function onToggle () {
    if (hoverable) return
    model.value = !model.value
  }

  // Dismissal listeners engage only while open (and never for the pure-CSS
  // hoverable mode) so closed dropdowns are fully inert — a document-level
  // hotkey would preventDefault every Escape page-wide and race sibling
  // surfaces (v0 Dialog cancel, other dropdowns).
  useToggleScope(() => model.value && !hoverable, () => {
    useClickOutside(root, close)
  })

  // Esc is scoped to the dropdown subtree: nearest surface wins, so a
  // dropdown open inside a modal closes without also closing the modal.
  function onKeydown (event: KeyboardEvent) {
    if (event.key !== 'Escape' || !model.value || hoverable) return
    event.stopPropagation()
    close()
  }

  const trigger = toRef((): BuDropdownTriggerSlotProps => ({
    isOpen: model.value,
    toggle: onToggle,
    attrs: {
      'aria-haspopup': 'true',
      'aria-controls': id,
      'aria-expanded': model.value ? 'true' : 'false',
      'onClick': onToggle,
    },
  }))

  const slotProps = toRef((): BuDropdownSlotProps => ({
    isOpen: model.value,
    close,
    item: menu ? { role: 'menuitem' } : {},
  }))
</script>

<template>
  <div
    ref="root"
    class="dropdown"
    :class="{
      'is-active': model,
      'is-hoverable': hoverable,
      'is-right': right,
      'is-up': up,
    }"
    @keydown="onKeydown"
  >
    <div class="dropdown-trigger">
      <slot name="trigger" v-bind="trigger" />
    </div>

    <div
      :id
      class="dropdown-menu"
      :role="menu ? 'menu' : undefined"
    >
      <div class="dropdown-content">
        <slot v-bind="slotProps" />
      </div>
    </div>
  </div>
</template>
