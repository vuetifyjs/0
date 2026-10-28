<script lang="ts">
  // Framework
  import { isNullOrUndefined, isString } from '@vuetify/v0'

  // Context
  import { useBScrollSpy } from './BScrollSpy.vue'

  // Utilities
  import { onBeforeUnmount, onMounted, toRef, useTemplateRef } from 'vue'

  export interface BScrollSpyLinkProps {
    href?: string
    /** Section id this link activates. */
    id: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'BScrollSpyLink' })

  defineSlots<{
    default?: () => any
  }>()

  const { href, id } = defineProps<BScrollSpyLinkProps>()

  const spy = useBScrollSpy()
  const el = useTemplateRef<HTMLAnchorElement>('el')
  const target = toRef(() => isString(href) && href.length > 0 ? href : `#${id}`)
  const current = toRef(() => spy.active.value === id ? 'true' as const : undefined)
  const classes = toRef(() => {
    const list = ['nav-link']
    if (spy.active.value === id) list.push('active')
    return list
  })

  function onClick (event: MouseEvent) {
    if (!spy.smooth.value) return
    const section = spy.section(id)
    if (isNullOrUndefined(section)) return
    event.preventDefault()
    section.scrollIntoView({ behavior: 'smooth' })
  }

  onMounted(() => {
    const node = el.value
    if (isNullOrUndefined(node)) return
    spy.register({ id, el: node })
  })

  onBeforeUnmount(() => {
    const node = el.value
    if (isNullOrUndefined(node)) return
    spy.unregister(id, node)
  })
</script>

<template>
  <a
    ref="el"
    :aria-current="current"
    :class="classes"
    :href="target"
    @click="onClick"
  >
    <slot />
  </a>
</template>
