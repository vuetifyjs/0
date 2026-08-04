<script lang="ts">
  // Framework
  import { createContext, useClickOutside, useId, useToggleScope } from '@vuetify/v0'

  // Utilities
  import { useTemplateRef } from 'vue'

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

  export interface BuDropdownContext {
    /** Id of `.dropdown-menu` — mirrored on the trigger's `aria-controls`. */
    id: string
    /** Whether the dropdown is open. */
    isOpen: () => boolean
    /** Whether items should be announced as menu items. */
    isMenu: () => boolean
    /** Toggle the dropdown (no-op when `hoverable`). */
    toggle: () => void
    /** Close the dropdown. */
    close: () => void
  }

  // Only the parent provides, so the provider stays module-local; parts import
  // the hook.
  const [useBuDropdown, provideBuDropdown] = createContext<BuDropdownContext | null>('bulma:dropdown', null)

  export { useBuDropdown }
</script>

<script setup lang="ts">
  defineOptions({ name: 'BuDropdown' })

  defineSlots<{
    /** `.dropdown` children — BuDropdownTrigger and BuDropdownMenu. */
    default?: () => any
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

  function toggle () {
    if (hoverable) return
    model.value = !model.value
  }

  provideBuDropdown({
    id,
    isOpen: () => model.value,
    isMenu: () => menu,
    toggle,
    close,
  })

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
    <slot />
  </div>
</template>
