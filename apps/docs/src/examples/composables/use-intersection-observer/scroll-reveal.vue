<script setup lang="ts">
  import { useIntersectionObserver } from '@vuetify/v0'
  import { computed, onMounted, shallowRef, useTemplateRef } from 'vue'

  const cards = [
    { id: 1, title: 'Lazy Loading', desc: 'Load images only when entering viewport' },
    { id: 2, title: 'Infinite Scroll', desc: 'Fetch more content as users scroll' },
    { id: 3, title: 'Analytics', desc: 'Track visibility for engagement metrics' },
    { id: 4, title: 'Animations', desc: 'Trigger entrance animations on scroll' },
    { id: 5, title: 'Video Playback', desc: 'Auto-play videos when visible' },
    { id: 6, title: 'Ad Viewability', desc: 'Measure ad impressions accurately' },
  ]

  const scrollContainer = useTemplateRef('scrollContainer')
  const cardRefs = useTemplateRef<HTMLElement[]>('cardRefs')
  const ratios = shallowRef<number[]>(cards.map(() => 0))
  const revealed = shallowRef<Set<number>>(new Set())

  onMounted(() => {
    const root = scrollContainer.value
    const elements = cardRefs.value

    if (!root || !elements) return

    for (const [index, card] of cards.entries()) {
      const el = elements[index]
      if (!el) continue

      useIntersectionObserver(
        el,
        entries => {
          const entry = entries.at(-1)
          if (!entry) return

          const newRatios = [...ratios.value]
          newRatios[index] = entry.intersectionRatio
          ratios.value = newRatios

          if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
            revealed.value = new Set([...revealed.value, card.id])
          }
        },
        {
          root,
          threshold: Array.from({ length: 21 }, (_, i) => i / 20),
        },
      )
    }
  })

  function isRevealed (id: number) {
    return revealed.value.has(id)
  }
  const visibleCount = computed(() => revealed.value.size)
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="sticky top-0 z-10 py-2 px-3 bg-surface border border-divider rounded-lg">
      <div class="flex items-center justify-between text-sm">
        <span class="text-on-surface-variant">Scroll to reveal cards</span>
        <span class="font-mono text-primary">{{ visibleCount }}/{{ cards.length }} revealed</span>
      </div>
    </div>

    <div ref="scrollContainer" class="h-[400px] overflow-y-auto border border-divider rounded-lg p-4 space-y-6">
      <div class="h-24 flex items-center justify-center text-on-surface-variant text-sm opacity-60">
        Scroll down to see the magic
      </div>

      <div
        v-for="(card, index) in cards"
        :key="card.id"
        ref="cardRefs"
        class="relative p-5 bg-surface-tint border border-divider rounded-xl transition-all duration-700 ease-out"
        :class="isRevealed(card.id)
          ? 'opacity-100 translate-y-0 scale-100'
          : 'opacity-0 translate-y-8 scale-95'"
        :style="{ transitionDelay: `${index * 75}ms` }"
      >
        <div class="flex items-start justify-between gap-4">
          <div>
            <h3 class="text-base font-semibold text-on-surface mb-1">{{ card.title }}</h3>
            <p class="text-sm text-on-surface-variant">{{ card.desc }}</p>
          </div>
          <div
            class="min-w-10 h-10 px-2 rounded-full flex items-center justify-center text-xs font-mono border transition-all duration-300"
            :class="isRevealed(card.id)
              ? 'bg-success text-on-success border-success'
              : 'bg-surface-variant text-on-surface-variant border-divider'"
          >
            {{ Math.round(ratios[index] * 100) }}%
          </div>
        </div>

        <div class="mt-3 h-1 bg-surface-variant rounded-full overflow-hidden">
          <div
            class="h-full bg-primary rounded-full transition-all duration-150"
            :style="{ width: `${ratios[index] * 100}%` }"
          />
        </div>
      </div>

      <div class="h-24 flex items-center justify-center text-on-surface-variant text-sm opacity-60">
        You've reached the end
      </div>
    </div>
  </div>
</template>
