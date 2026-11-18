<script lang="ts">
  // Framework
  import { isNullOrUndefined, isUndefined, useIntersectionObserver } from '@vuetify/v0'

  // Context
  import { useBScrollSpy } from './BScrollSpy.vue'

  // Utilities
  import { onBeforeUnmount, onMounted, shallowRef, useTemplateRef, watch } from 'vue'

  // Types
  import type { IntersectionObserverOptions } from '@vuetify/v0'

  export interface BScrollSpySectionProps {
    /** Id the matching link points at. */
    id: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'BScrollSpySection' })

  defineSlots<{
    default?: () => any
  }>()

  const { id } = defineProps<BScrollSpySectionProps>()

  const spy = useBScrollSpy()
  const el = useTemplateRef<HTMLElement>('el')
  // Observed only once the scrollport exists. Creating earlier snapshots
  // root: null, and useIntersectionObserver does not read root again.
  const armed = shallowRef<HTMLElement | null>(null)

  const options: IntersectionObserverOptions = {
    threshold: [0, 0.25, 0.5, 1],
  }

  function arm () {
    const root = spy.root.value
    options.root = root ?? null
    armed.value = root ? el.value : null
  }

  watch(el, arm, { flush: 'sync' })
  watch(() => spy.root.value, arm, { flush: 'sync' })

  function onEntries (list: { isIntersecting: boolean, intersectionRatio: number }[]) {
    const entry = list[0]
    if (isUndefined(entry)) return
    spy.report(id, entry.isIntersecting, entry.intersectionRatio)
  }

  useIntersectionObserver(armed, onEntries, options)

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
  <div
    :id
    ref="el"
  >
    <slot />
  </div>
</template>
