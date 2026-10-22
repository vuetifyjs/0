<script lang="ts">
  // Framework
  import { isArray, isNullOrUndefined, isNumber, isObject, isString, isUndefined } from '@vuetify/v0'

  // Context
  import { hasKeep, useBNavOverflow } from './BNavOverflow.vue'

  // Utilities
  import { h, isVNode, onBeforeUnmount, toRef, useAttrs, useId, useTemplateRef, watch } from 'vue'

  // Types
  import type { Slots, VNode, VNodeArrayChildren } from 'vue'

  function classNames (value: unknown): string[] {
    if (isString(value)) return value.split(/\s+/).filter(name => name.length > 0)
    if (isArray(value)) return value.flatMap(item => classNames(item))
    if (isObject(value)) {
      return Object.entries(value).filter(([, on]) => Boolean(on)).map(([name]) => name)
    }
    return []
  }

  // The row keeps `nav-link`. The menu copy is a `menu-item`, which is what
  // Bootstrap's overflow plugin clones. Leaving `nav-link` on a direct child
  // of `.menu.show` matches `.nav-pills .show > .nav-link` and paints every
  // overflowed link as the active pill.
  function asMenuItem (node: VNode): VNode {
    if (!isVNode(node)) return node

    if (isString(node.type)) {
      const names = classNames(node.props?.class).filter(name => name !== 'nav-link')
      if (!names.includes('menu-item')) names.unshift('menu-item')
      return h(node.type, { ...node.props, class: names }, node.children as VNodeArrayChildren)
    }

    // A slot outlet is a fragment. The link is one of its children.
    if (isArray(node.children)) {
      return h(node, {}, node.children.map(child => isVNode(child) ? asMenuItem(child) : child))
    }

    return node
  }

  function menuCopy (_props: object, { slots }: { slots: Slots }) {
    return (slots.default?.() ?? []).map(node => asMenuItem(node))
  }

  export interface BNavOverflowItemProps {
    /** Stays visible. The class `nav-overflow-keep` means the same thing. */
    keep?: boolean
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'BNavOverflowItem' })

  const MenuCopy = menuCopy

  defineSlots<{
    default?: () => any
  }>()

  const { keep = false } = defineProps<BNavOverflowItemProps>()

  const overflow = useBNavOverflow()
  const attrs = useAttrs()
  const el = useTemplateRef<HTMLElement>('el')
  const id = useId()
  let last: number | undefined

  const isKeep = toRef(() => keep || hasKeep(attrs.class))

  const classes = toRef(() => {
    const list = ['nav-item']
    if (isKeep.value) list.push('nav-overflow-keep')
    return list
  })

  const shown = toRef(() => {
    if (isKeep.value) return true
    const index = overflow.indexOf(id)
    if (index === -1) return true
    const cap = overflow.capacity.value
    if (!isNumber(cap) || cap === Infinity) return true
    return index < cap
  })

  overflow.register({ id, keep: isKeep.value, el: null })

  function onMeasure () {
    if (isKeep.value) {
      if (!isUndefined(last)) overflow.measure(last, undefined)
      last = undefined
      return
    }
    const index = overflow.indexOf(id)
    const node = el.value
    if (isNullOrUndefined(node) || index === -1) return
    if (!isUndefined(last) && last !== index) overflow.measure(last, undefined)
    // v-show hides with display:none, which would record a 0 width.
    const hidden = node.style.display === 'none'
    if (hidden) node.style.display = ''
    overflow.measure(index, node)
    if (hidden) node.style.display = 'none'
    last = index
  }

  watch([el, () => overflow.indexOf(id), isKeep], onMeasure)

  watch(el, node => {
    overflow.update(id, { el: node ?? null })
  })

  watch(isKeep, value => {
    overflow.update(id, { keep: value })
  })

  onBeforeUnmount(() => {
    if (!isUndefined(last)) overflow.measure(last, undefined)
    overflow.unregister(id)
  })
</script>

<template>
  <Teleport
    v-if="!shown && overflow.menuReady.value"
    :to="`#${overflow.bucketId}`"
  >
    <MenuCopy>
      <slot />
    </MenuCopy>
  </Teleport>

  <li
    v-show="shown"
    ref="el"
    :class="classes"
  >
    <slot />
  </li>
</template>
