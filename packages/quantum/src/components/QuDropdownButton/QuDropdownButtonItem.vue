<script lang="ts">
  // Framework
  import { isNull, isString, Menu, useLogger, useMenuRoot } from '@vuetify/v0'

  // Context
  import { useQuDropdownButton } from './QuDropdownButton.vue'

  // Utilities
  import { onBeforeUnmount, useTemplateRef } from 'vue'

  // Types
  import type { QuIconName } from '../../icons'
  import type { MenuRadioItemProps } from '@vuetify/v0'

  // Components
  import QuIcon from '../QuIcon/QuIcon.vue'
  import QuRipple from '../QuRipple/QuRipple.vue'

  /**
   * Quantum withholds `id` and `namespace` from v0's radio item: the ticket id
   * is v0's, and a dropdown button owns its menu, so there is no other key to
   * reach. `label` stays as v0's typeahead text, which is also the text the
   * button draws while the state is selected.
   */
  export interface QuDropdownButtonItemProps extends Pick<MenuRadioItemProps, 'value' | 'label'> {
    /**
     * Keeps the state in place at the disabled ink, inert to a press and
     * skipped by the arrow keys. A plain boolean rather than v0's getter form,
     * so the bare `disabled` attribute casts to `true`.
     */
    disabled?: boolean
    /** A glyph role for the state, drawn in the row and on the button while selected: the icon or palette form of the buttons page. */
    icon?: QuIconName
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'QuDropdownButtonItem' })

  defineSlots<{
    /** The state's text. */
    default?: () => any
  }>()

  const { value, label, disabled = false, icon } = defineProps<QuDropdownButtonItemProps>()

  const logger = useLogger()
  const context = useQuDropdownButton()

  // Menu.RadioItem throws outside a menu, so an orphan renders nothing rather than break its parent.
  if (__DEV__ && isNull(context)) {
    logger.warn('[QuDropdownButtonItem] rendered outside <QuDropdownButton>; its state is inert')
  }

  const menu = isNull(context) ? null : useMenuRoot('v0:menu')
  const text = useTemplateRef<HTMLElement>('text')

  const ticket = context?.register({
    value,
    text: () => (isString(label) && label.length > 0 ? label : text.value?.textContent?.trim() ?? ''),
    icon: () => icon,
  })

  onBeforeUnmount(() => {
    ticket?.unregister()
  })

  // v0 radio items keep the menu open; a dropdown commits and closes on the choice (buttons and menus pages).
  function inert () {
    return disabled || (menu?.disabled.value ?? true)
  }

  function onClick () {
    if (!inert()) menu?.dismiss()
  }

  function onKeydown (event: KeyboardEvent) {
    if (event.key !== 'Enter' && event.key !== ' ') return
    if (!inert()) menu?.dismiss()
  }
</script>

<template>
  <Menu.RadioItem
    v-if="context"
    v-slot="{ isChecked }"
    class="quantum-dropdown-button__item"
    :disabled
    :label
    :value
    @click="onClick"
    @keydown="onKeydown"
  >
    <QuRipple />

    <QuIcon v-if="icon" class="quantum-dropdown-button__lead" :name="icon" />

    <QuIcon v-else-if="isChecked" class="quantum-dropdown-button__lead" name="check" />

    <span ref="text" class="quantum-dropdown-button__text"><slot /></span>

    <QuIcon v-if="icon && isChecked" class="quantum-dropdown-button__trail" name="check" />
  </Menu.RadioItem>
</template>
