<script lang="ts">
  // Framework
  import { Atom, IN_BROWSER, isElement, isNull, isUndefined, toElement } from '@vuetify/v0'

  // Utilities
  import { nextTick, onMounted, shallowRef, useTemplateRef } from 'vue'

  // Types
  import type { AtomExpose } from '@vuetify/v0'

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

  const root = useTemplateRef<AtomExpose>('root')
  const pressed = shallowRef(false)

  function host (): HTMLElement | null {
    if (!isUndefined(target) && target !== '') {
      if (!IN_BROWSER) return null
      const id = target.startsWith('#') ? target.slice(1) : target
      const found = document.querySelector(`#${CSS.escape(id)}`)
      if (!isElement(found)) return null
      return found as HTMLElement
    }
    const node = toElement(root.value?.element)
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

  function onKeydown (event: KeyboardEvent) {
    if (as === 'button' || attribute !== 'class') return
    if (event.key !== 'Enter' && event.key !== ' ') return
    event.preventDefault()
    onClick()
  }

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
  <Atom
    ref="root"
    :aria-pressed="attribute === 'class' ? pressed : undefined"
    :as
    :role="as !== 'button' && attribute === 'class' ? 'button' : undefined"
    :tabindex="as !== 'button' && attribute === 'class' ? 0 : undefined"
    :type="as === 'button' ? 'button' : undefined"
    @click="onClick"
    @keydown="onKeydown"
  >
    <slot />
  </Atom>
</template>
