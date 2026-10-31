<script lang="ts">
  // Framework
  import { createContext, isNullOrUndefined, isUndefined } from '@vuetify/v0'

  // Utilities
  import { shallowRef, toRef, useTemplateRef, watch } from 'vue'

  // Types
  import type { Ref } from 'vue'

  export interface BScrollSpyProps {
    /**
     * Element whose scrollport the sections are observed against.
     * Omit it and this component's own element is the scroll container.
     */
    root?: HTMLElement | null
    /** Link clicks call `scrollIntoView({ behavior: 'smooth' })`. */
    smooth?: boolean
  }

  export interface BScrollSpyRegistration {
    el: Element
    id: string
  }

  interface Entry {
    id: string
    link?: Element
    section?: Element
  }

  export interface BScrollSpyContext {
    active: Ref<string | undefined>
    register: (item: BScrollSpyRegistration) => void
    report: (id: string, intersecting: boolean, ratio: number) => void
    root: Readonly<Ref<HTMLElement | null>>
    section: (id: string) => Element | undefined
    smooth: Readonly<Ref<boolean>>
    unregister: (id: string, el: Element) => void
  }

  const [useBScrollSpy, provideBScrollSpy] = createContext<BScrollSpyContext>('bootstrap:scrollspy')

  export { useBScrollSpy }
</script>

<script setup lang="ts">
  defineOptions({ name: 'BScrollSpy' })

  defineSlots<{
    /** Links and sections, paired by id. */
    default?: () => any
  }>()

  defineEmits<{
    'update:model-value': [value: string | undefined]
  }>()

  const { root: _root = null, smooth = false } = defineProps<BScrollSpyProps>()

  const active = defineModel<string>()
  const host = useTemplateRef<HTMLElement>('root')
  const entries = shallowRef(new Map<string, Entry>())
  const ratios = new Map<string, number>()

  const scroller = toRef(() => _root ?? host.value ?? null)
  const smoothOn = toRef(() => smooth)

  function register ({ id, el }: BScrollSpyRegistration) {
    const next = new Map(entries.value)
    const current = next.get(id) ?? { id }
    if (el.matches('a, button')) current.link = el
    else {
      current.section = el
      if (isUndefined(active.value)) active.value = id
    }
    next.set(id, current)
    entries.value = next
  }

  function unregister (id: string, el: Element) {
    const next = new Map(entries.value)
    const current = next.get(id)
    if (isUndefined(current)) return
    if (current.section === el) current.section = undefined
    if (current.link === el) current.link = undefined
    if (isUndefined(current.section) && isUndefined(current.link)) {
      next.delete(id)
      ratios.delete(id)
    }
    entries.value = next
  }

  function section (id: string) {
    return entries.value.get(id)?.section
  }

  function report (id: string, intersecting: boolean, ratio: number) {
    ratios.set(id, intersecting ? ratio : 0)
    let best: string | undefined
    let score = 0
    for (const [key, value] of ratios) {
      if (value > score) {
        score = value
        best = key
      }
    }
    if (score > 0 && !isUndefined(best)) active.value = best
  }

  provideBScrollSpy({
    active,
    register,
    report,
    root: scroller,
    section,
    smooth: smoothOn,
    unregister,
  })

  // Drop ratios for sections that left, so a stale winner cannot stick.
  watch(entries, map => {
    for (const key of ratios.keys()) {
      if (isNullOrUndefined(map.get(key)?.section)) ratios.delete(key)
    }
  })
</script>

<template>
  <div ref="root">
    <slot />
  </div>
</template>
