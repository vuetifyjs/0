<script setup lang="ts">
  // Framework
  import { useEventListener, useResizeObserver } from '@vuetify/v0'

  // Utilities
  import { shallowRef, toRef, useTemplateRef } from 'vue'

  export interface Option {
    id: string
    label: string
    icon: string
  }

  const { label, options, selected } = defineProps<{
    label: string
    options: Option[]
    selected: string
  }>()

  const emit = defineEmits<{
    select: [id: string]
  }>()

  const container = useTemplateRef<HTMLElement>('container')
  const active = shallowRef(0)
  const dots = toRef(() => Math.ceil(options.length / 2))

  function onScroll () {
    const el = container.value
    if (!el) return
    const max = el.scrollWidth - el.clientWidth
    if (max <= 0) {
      active.value = 0
      return
    }
    const ratio = el.scrollLeft / max
    active.value = Math.min(Math.round(ratio * (dots.value - 1)), dots.value - 1)
  }

  function scrollTo (index: number) {
    const el = container.value
    if (!el) return
    const max = el.scrollWidth - el.clientWidth
    const target = dots.value <= 1 ? 0 : (index / (dots.value - 1)) * max
    el.scrollTo({ left: target, behavior: 'smooth' })
  }

  // Pointer drag state
  let dragging = false
  let captured = false
  let startX = 0
  let startScroll = 0
  let pointerId = 0

  function onPointerDown (e: PointerEvent) {
    const el = container.value
    if (!el) return
    dragging = true
    captured = false
    startX = e.clientX
    startScroll = el.scrollLeft
    pointerId = e.pointerId
  }

  function onPointerMove (e: PointerEvent) {
    if (!dragging) return
    const el = container.value!
    const delta = e.clientX - startX
    if (!captured && Math.abs(delta) > 5) {
      captured = true
      el.setPointerCapture(pointerId)
      el.style.scrollSnapType = 'none'
      el.style.cursor = 'grabbing'
    }
    if (captured) {
      el.scrollLeft = startScroll - delta
    }
  }

  function onPointerUp () {
    if (!dragging) return
    dragging = false
    if (!captured) return
    const el = container.value!
    el.releasePointerCapture(pointerId)
    el.style.scrollBehavior = 'smooth'
    el.style.scrollSnapType = ''
    el.style.cursor = ''
    el.addEventListener('click', ev => ev.stopPropagation(), { once: true, capture: true })
    useEventListener(el, 'scrollend', () => {
      el.style.scrollBehavior = ''
    }, { once: true })
  }

  useResizeObserver(container, onScroll)
</script>

<template>
  <div>
    <div class="text-xs font-medium text-on-surface-variant mb-2">{{ label }}</div>

    <div
      ref="container"
      class="carousel flex gap-2 overflow-x-auto snap-x snap-mandatory cursor-grab select-none"
      @pointerdown="onPointerDown"
      @pointermove="onPointerMove"
      @pointerup="onPointerUp"
      @scroll.passive="onScroll"
    >
      <button
        v-for="option in options"
        :key="option.id"
        :aria-pressed="selected === option.id"
        :class="[
          'flex-none w-[44%] snap-start flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-colors',
          selected === option.id
            ? 'border-primary bg-primary/10 text-primary'
            : 'border-divider hover:border-primary/50 text-on-surface',
        ]"
        type="button"
        @click="emit('select', option.id)"
      >
        <AppIcon :icon="option.icon" size="14" />
        <span class="font-medium truncate">{{ option.label }}</span>
      </button>
    </div>

    <div v-if="dots > 1" class="flex gap-1 justify-center mt-2">
      <button
        v-for="i in dots"
        :key="i"
        :aria-label="`Page ${i}`"
        :class="[
          'w-1.5 h-1.5 rounded-full transition-colors cursor-pointer',
          active === i - 1 ? 'bg-primary' : 'bg-divider hover:bg-primary/50',
        ]"
        type="button"
        @click="scrollTo(i - 1)"
      />
    </div>
  </div>
</template>

<style scoped>
  .carousel {
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }
  }
</style>
