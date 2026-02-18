<script setup lang="ts">
  // Framework
  import { useResizeObserver } from '@vuetify/v0'

  // Components
  import SkillCard from './SkillCard.vue'

  // Composables
  import { useSettings } from '@/composables/useSettings'

  // Utilities
  import { computed, shallowRef, useTemplateRef } from 'vue'

  // Types
  import type { SkillLevel, SkillMeta } from '@/types/skill'

  // Stores
  import { useSkillzStore } from '@/stores/skillz'
  import { SKILL_LEVEL_META } from '@/types/skill'

  const props = defineProps<{
    items: SkillMeta[]
  }>()

  const store = useSkillzStore()
  const { carousel } = useSettings()

  // Group skills by level, available first then locked
  const levels: SkillLevel[] = [1, 2, 3]

  const skillsByLevel = computed(() => {
    return levels.map(level => ({
      level,
      meta: SKILL_LEVEL_META[level],
      skills: props.items
        .filter(s => s.level === level)
        .toSorted((a, b) => {
          const aLocked = store.locked(a.id) ? 1 : 0
          const bLocked = store.locked(b.id) ? 1 : 0
          if (aLocked !== bLocked) return aLocked - bLocked
          return a.order - b.order
        }),
    })).filter(g => g.skills.length > 0)
  })

  // Calculate right offset to extend carousel to viewport edge
  const deckRef = useTemplateRef<HTMLElement>('deck')
  const rightOffset = shallowRef(16)

  useResizeObserver(deckRef, () => {
    if (!deckRef.value) return
    const rect = deckRef.value.getBoundingClientRect()
    rightOffset.value = document.documentElement.clientWidth - rect.right
  })

  // Drag scroll state (non-reactive per-interaction tracking)
  let activeEl: HTMLElement | null = null
  let dragStartX = 0
  let dragScrollLeft = 0
  let didDrag = false
  const dragging = shallowRef(false)

  function onPointerDown (e: PointerEvent) {
    const el = e.currentTarget as HTMLElement
    activeEl = el
    dragging.value = true
    didDrag = false
    dragStartX = e.pageX - el.offsetLeft
    dragScrollLeft = el.scrollLeft
  }

  function onPointerMove (e: PointerEvent) {
    if (!activeEl || !dragging.value) return
    e.preventDefault()
    const x = e.pageX - activeEl.offsetLeft
    const walk = x - dragStartX
    if (Math.abs(walk) > 3) didDrag = true
    activeEl.scrollLeft = dragScrollLeft - walk
  }

  function onPointerUp () {
    activeEl = null
    dragging.value = false
  }

  // Track which levels have been scrolled (for left fade mask)
  const scrolledLevels = shallowRef(new Set<SkillLevel>())

  function onScroll (e: Event, level: SkillLevel) {
    const el = e.currentTarget as HTMLElement
    const isScrolled = el.scrollLeft > 0
    if (scrolledLevels.value.has(level) !== isScrolled) {
      const next = new Set(scrolledLevels.value)
      if (isScrolled) next.add(level)
      else next.delete(level)
      scrolledLevels.value = next
    }
  }

  function onClickCapture (e: MouseEvent) {
    if (didDrag) {
      e.preventDefault()
      e.stopPropagation()
      didDrag = false
    }
  }
</script>

<template>
  <div v-if="skillsByLevel.length > 0" ref="deck" class="mt-8 flex flex-col gap-10">
    <div v-for="{ level, meta, skills } in skillsByLevel" :key="level">
      <h2 class="m-0 mb-1 text-xl">{{ meta.label }}</h2>

      <p class="m-0 mb-4 text-sm text-on-surface-variant">{{ meta.title }}</p>

      <!-- Carousel layout -->
      <div
        v-if="carousel"
        class="carousel-scroll flex gap-4 overflow-x-auto touch-pan-x"
        :class="[dragging ? 'cursor-grabbing select-none' : 'cursor-grab', scrolledLevels.has(level) && 'is-scrolled']"
        :style="{ marginRight: `-${rightOffset}px`, paddingRight: '1rem' }"
        @click.capture="onClickCapture"
        @dragstart.prevent
        @pointercancel="onPointerUp"
        @pointerdown="onPointerDown"
        @pointermove="onPointerMove"
        @pointerup="onPointerUp"
        @scroll="onScroll($event, level)"
      >
        <SkillCard v-for="skill in skills" :key="skill.id" class="shrink-0 w-[280px]" :skill="skill" />
      </div>

      <!-- Grid layout -->
      <div v-else class="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4">
        <SkillCard v-for="skill in skills" :key="skill.id" :skill="skill" />
      </div>
    </div>
  </div>

  <div v-else class="text-center p-12 text-on-surface-variant">
    <p>No skills available yet. Check back soon!</p>
  </div>
</template>

<style scoped>
  .carousel-scroll {
    scrollbar-width: none;
  }

  .carousel-scroll::-webkit-scrollbar {
    display: none;
  }

  .carousel-scroll {
    mask-image: linear-gradient(to right, black, black calc(100% - 4rem), transparent);
  }

  .carousel-scroll.is-scrolled {
    mask-image: linear-gradient(to right, transparent, black 4rem, black calc(100% - 4rem), transparent);
  }
</style>
