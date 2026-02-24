<script setup lang="ts">
  // Framework
  import { clamp, useDocumentEventListener, useStorage, useToggleScope } from '@vuetify/v0'

  // Utilities
  import { shallowRef, toRef } from 'vue'

  const {
    direction,
    storageKey,
    min = 100,
    max = 1000,
    reverse = false,
  } = defineProps<{
    direction: 'horizontal' | 'vertical'
    min?: number
    max?: number
    storageKey?: string
    reverse?: boolean
  }>()

  const isResizing = defineModel('resizing', { default: false })
  const modelValue = defineModel<number>('modelValue')

  const storage = useStorage()

  const stored = storage.get(storageKey || 'playground-resize', modelValue.value)

  if (stored.value != null) {
    modelValue.value = stored.value
  }

  const emit = defineEmits<{
    pointerdown: [event: PointerEvent]
    dblclick: []
  }>()

  const isVertical = toRef(() => direction === 'vertical')

  const startPosition = shallowRef(0)
  const startSize = shallowRef(0)
  const parentSize = shallowRef(0)

  let rafId = 0
  let latestPos = 0

  function onPointerDown (event: PointerEvent) {
    const target = event.target as Element
    target.setPointerCapture(event.pointerId)
    startPosition.value = isVertical.value ? event.clientY : event.clientX
    startSize.value = modelValue.value ?? 0
    if (isVertical.value) {
      parentSize.value = (event.currentTarget as HTMLElement).parentElement?.offsetHeight || 1
    }
    emit('pointerdown', event)
    document.documentElement.style.cursor = 'grabbing'
    isResizing.value = true
  }

  useToggleScope(() => isResizing.value, () => {
    useDocumentEventListener('pointermove', (e: PointerEvent) => {
      latestPos = isVertical.value ? e.clientY : e.clientX
      if (rafId) return
      rafId = requestAnimationFrame(() => {
        const delta = latestPos - startPosition.value
        modelValue.value = isVertical.value
          ? clamp(startSize.value + (delta / parentSize.value) * 100, min, max)
          : clamp(startSize.value + (reverse ? -delta : delta), min, max)
        rafId = 0
      })
    })
    useDocumentEventListener('pointerup', () => {
      if (rafId) cancelAnimationFrame(rafId)
      rafId = 0
      stored.value = modelValue.value ?? startSize.value
      document.documentElement.style.cursor = ''
      isResizing.value = false
    })
  })
</script>

<template>
  <div
    class="bg-divider relative hover:bg-primary transition-colors"
    :class="[
      !isResizing && (direction === 'horizontal' ? 'cursor-col-resize' : 'cursor-row-resize'),
      direction === 'horizontal' && 'w-[4px]',
      direction === 'vertical' && 'h-[4px]',
    ]"
    @dblclick="emit('dblclick')"
    @pointerdown="onPointerDown"
  >
    <span
      class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded inline-flex items-center justify-center bg-surface text-on-surface border border-divider"
      :class="[
        direction === 'horizontal' ? 'w-4 h-6' : 'w-6 h-4',
        isResizing ? 'cursor-grabbing' : 'cursor-grab',
      ]"
    >
      <AppIcon
        :icon="direction === 'horizontal' ? 'drag-vertical' : 'drag-horizontal'"
        :size="16"
      />
    </span>
  </div>
</template>
