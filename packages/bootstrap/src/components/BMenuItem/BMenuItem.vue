<script lang="ts">
  // Framework
  import { Atom, isNullOrUndefined, isString, toElement, useId } from '@vuetify/v0'

  // Utilities
  import { orphan } from '../../utilities/context'
  import { onBeforeUnmount, toRef, useTemplateRef, watch } from 'vue'

  // Types
  import type { AtomExpose } from '@vuetify/v0'

  import { useBMenu } from '../BMenu/BMenu.vue'

  export interface BMenuItemProps {
    /** Renders an anchor. Omit for a button. */
    href?: string
    disabled?: boolean
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'BMenuItem' })

  defineSlots<{
    default?: () => any
  }>()

  const { href, disabled = false } = defineProps<BMenuItemProps>()

  const menu = useBMenu()
  const el = useTemplateRef<AtomExpose>('item')
  const id = useId()
  const link = toRef(() => isString(href) && href.length > 0)

  orphan('BMenuItem', 'BMenu', menu)

  function onClick (event: MouseEvent) {
    if (!disabled) {
      menu?.activate()
      return
    }
    event.preventDefault()
  }

  watch(() => toElement(el.value?.element), element => {
    if (!(element instanceof HTMLElement) || isNullOrUndefined(menu)) return
    menu.register({
      id,
      el: element,
      disabled: () => disabled,
    })
  })

  onBeforeUnmount(() => {
    menu?.unregister(id)
  })
</script>

<template>
  <Atom
    ref="item"
    :aria-disabled="disabled || undefined"
    :as="link ? 'a' : 'button'"
    class="menu-item"
    :class="{ disabled }"
    :disabled="link ? undefined : disabled || undefined"
    :href="link ? href : undefined"
    tabindex="-1"
    :type="link ? undefined : 'button'"
    @click="onClick"
  >
    <slot />
  </Atom>
</template>
