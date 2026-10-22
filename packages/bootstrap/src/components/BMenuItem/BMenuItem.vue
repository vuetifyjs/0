<script lang="ts">
  // Framework
  import { isNullOrUndefined, isUndefined, useId } from '@vuetify/v0'

  // Utilities
  import { orphan } from '../../utilities/context'
  import { onBeforeUnmount, onMounted, useTemplateRef } from 'vue'

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
  const el = useTemplateRef<HTMLElement>('item')
  const id = useId()

  orphan('BMenuItem', 'BMenu', menu)

  function onClick () {
    if (disabled) return
    menu?.activate()
  }

  onMounted(() => {
    const element = el.value
    if (isNullOrUndefined(element) || isNullOrUndefined(menu)) return
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
  <component
    :is="isUndefined(href) ? 'button' : 'a'"
    ref="item"
    :aria-disabled="disabled || undefined"
    class="menu-item"
    :class="{ disabled }"
    :disabled="isUndefined(href) ? disabled || undefined : undefined"
    :href
    tabindex="-1"
    :type="isUndefined(href) ? 'button' : undefined"
    @click="onClick"
  >
    <slot />
  </component>
</template>
