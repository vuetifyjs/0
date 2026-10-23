<script lang="ts">
  // Framework
  import { IN_BROWSER, isElement, isNull, isUndefined } from '@vuetify/v0'

  // Utilities
  import { nextTick, onMounted, shallowRef, useTemplateRef } from 'vue'

  export interface BTogglerProps {
    /** Class token, or the value written when toggling an attribute on. */
    value?: string
    /** `class` toggles a class. Any other name toggles that attribute. */
    attribute?: string
    /** Id of the element to toggle. A leading `#` is stripped. Omit to toggle the root. */
    target?: string
    /** Root tag. The pin uses a `div` or a `button`. */
    as?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'BToggler' })

  defineSlots<{
    default?: () => any
  }>()

  const {
    value = '',
    attribute = 'class',
    target,
    as = 'div',
  } = defineProps<BTogglerProps>()

  const root = useTemplateRef<HTMLElement>('root')
  const pressed = shallowRef(false)

  function host (): HTMLElement | null {
    if (!isUndefined(target) && target !== '') {
      if (!IN_BROWSER) return null
      const id = target.startsWith('#') ? target.slice(1) : target
      const found = document.querySelector(`#${CSS.escape(id)}`)
      if (!isElement(found)) return null
      return found as HTMLElement
    }
    const node = root.value
    if (!isElement(node)) return null
    return node as HTMLElement
  }

  function syncPressed () {
    if (attribute !== 'class' || value === '') return
    const node = host()
    if (isNull(node)) return
    pressed.value = node.classList.contains(value)
  }

  onMounted(() => {
    syncPressed()
    void nextTick(syncPressed)
  })

  function onClick () {
    const node = host()
    if (isNull(node)) return
    if (attribute === 'class') {
      if (value === '' || value.includes(' ')) return
      node.classList.toggle(value)
      pressed.value = node.classList.contains(value)
      return
    }
    if (node.hasAttribute(attribute)) {
      node.removeAttribute(attribute)
      pressed.value = false
      return
    }
    node.setAttribute(attribute, value)
    pressed.value = true
  }
</script>

<template>
  <component
    :is="as"
    ref="root"
    :aria-pressed="attribute === 'class' ? pressed : undefined"
    :type="as === 'button' ? 'button' : undefined"
    @click="onClick"
  >
    <slot />
  </component>
</template>
