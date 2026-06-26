<script setup lang="ts">
  // Framework
  import { createOverflow } from '@vuetify/v0'

  // Utilities
  import { computed, onBeforeUnmount, onMounted, ref, shallowRef, watch } from 'vue'

  const ITEM_WIDTH = 40
  const GAP = 8

  const count = ref(5)
  const containerWidth = ref(240)

  const container = shallowRef<HTMLElement | null>(null)

  // Two overflow contexts side-by-side — same config, same width, same items —
  // to make the difference visible: one with items registering via measure()
  // (post-fix correct behavior), one with no measure() calls (the bug shape
  // AvatarGroup hit in feat-avatar-group).
  const withMeasure = createOverflow({
    container,
    itemWidth: ITEM_WIDTH,
    gap: GAP,
  })

  const withoutMeasure = createOverflow({
    container,
    itemWidth: ITEM_WIDTH,
    gap: GAP,
  })

  const items = computed(() => Array.from({ length: count.value }, (_, i) => i))

  // Register every item with the "with measure" context only.
  watch(items, (now, prev = []) => {
    const fakeEl = document.createElement('div')
    Object.defineProperty(fakeEl, 'offsetWidth', { value: ITEM_WIDTH })
    for (const i of now) withMeasure.measure(i, fakeEl)
    for (const i of prev) if (!now.includes(i)) withMeasure.measure(i, undefined)
  }, { immediate: true })

  // Drive containerWidth into the actual element so ResizeObserver picks it up.
  onMounted(() => {
    if (container.value) container.value.style.width = `${containerWidth.value}px`
  })
  watch(containerWidth, w => {
    if (container.value) container.value.style.width = `${w}px`
  })

  onBeforeUnmount(() => withMeasure.reset())
</script>

<template>
  <div class="p-6 space-y-6 max-w-2xl mx-auto">
    <header class="space-y-2">
      <h1 class="text-2xl font-semibold">createOverflow · uniform-mode isOverflowing</h1>

      <p class="text-sm text-on-surface-variant">
        Two contexts with identical config. The left one calls
        <code>measure(i, el)</code> on every item; the right one doesn't.
        Watch <code>isOverflowing</code> as you change the count or container width.
      </p>
    </header>

    <div class="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 items-center text-sm">
      <label for="count">Item count</label>

      <div class="flex items-center gap-3">
        <input
          id="count"
          v-model.number="count"
          class="flex-1"
          max="20"
          min="0"
          type="range"
        >

        <span class="font-mono w-8 text-right">{{ count }}</span>
      </div>

      <label for="width">Container width</label>

      <div class="flex items-center gap-3">
        <input
          id="width"
          v-model.number="containerWidth"
          class="flex-1"
          max="600"
          min="40"
          step="20"
          type="range"
        >

        <span class="font-mono w-12 text-right">{{ containerWidth }}px</span>
      </div>
    </div>

    <div ref="container" class="border border-divider rounded p-2 flex" :style="{ gap: `${GAP}px` }">
      <div
        v-for="i in items"
        :key="i"
        class="rounded bg-primary text-on-primary flex items-center justify-center font-mono text-xs"
        :style="{ width: `${ITEM_WIDTH}px`, height: `${ITEM_WIDTH}px` }"
      >
        {{ i }}
      </div>
    </div>

    <div class="grid grid-cols-2 gap-4 text-sm">
      <div class="border border-divider rounded p-4 space-y-1">
        <div class="font-semibold text-success">With measure() calls (correct)</div>

        <dl class="font-mono text-xs grid grid-cols-[auto_1fr] gap-x-2">
          <dt class="text-on-surface-variant">capacity</dt><dd>{{ withMeasure.capacity.value }}</dd>
          <dt class="text-on-surface-variant">isOverflowing</dt>

          <dd :class="withMeasure.isOverflowing.value ? 'text-warning' : ''">
            {{ withMeasure.isOverflowing.value }}
          </dd>
        </dl>
      </div>

      <div class="border border-divider rounded p-4 space-y-1">
        <div class="font-semibold text-error">Without measure() calls (legacy bug)</div>

        <dl class="font-mono text-xs grid grid-cols-[auto_1fr] gap-x-2">
          <dt class="text-on-surface-variant">capacity</dt><dd>{{ withoutMeasure.capacity.value }}</dd>
          <dt class="text-on-surface-variant">isOverflowing</dt>

          <dd :class="withoutMeasure.isOverflowing.value ? 'text-warning' : ''">
            {{ withoutMeasure.isOverflowing.value }}
          </dd>
        </dl>
      </div>
    </div>

    <p class="text-xs text-on-surface-variant">
      Both sides compute the same <code>capacity</code> — that's driven by
      <code>itemWidth</code> and the container width, not by registration.
      Only the left side reports <code>isOverflowing</code> correctly because
      the right side never told createOverflow how many items exist.
    </p>
  </div>
</template>
