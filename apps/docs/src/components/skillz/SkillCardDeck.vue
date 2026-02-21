<script setup lang="ts">
  // Framework
  import { useResizeObserver } from '@vuetify/v0'

  // Components
  import SkillCard from './SkillCard.vue'

  // Composables
  import { useSettings } from '@/composables/useSettings'

  // Utilities
  import { computed, nextTick, onMounted, shallowRef, useTemplateRef, watch } from 'vue'

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

  // Template refs
  const deckRef = useTemplateRef<HTMLElement>('deck')
  const scrollerRefs = useTemplateRef<HTMLElement[]>('scrollers')

  // Calculate right offset to extend carousel to viewport edge
  const rightOffset = shallowRef(16)

  useResizeObserver(deckRef, () => {
    if (!deckRef.value) return
    const rect = deckRef.value.getBoundingClientRect()
    rightOffset.value = document.documentElement.clientWidth - rect.right
  }, { immediate: true })

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

  // Track scroll state per level (for fade masks and arrow visibility)
  const scrolledLevels = shallowRef(new Set<SkillLevel>())
  const atEndLevels = shallowRef(new Set<SkillLevel>())

  function updateScrollState (el: HTMLElement, level: SkillLevel) {
    const isScrolled = el.scrollLeft > 0
    const isAtEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 1

    if (scrolledLevels.value.has(level) !== isScrolled) {
      const next = new Set(scrolledLevels.value)
      if (isScrolled) next.add(level)
      else next.delete(level)
      scrolledLevels.value = next
    }

    if (atEndLevels.value.has(level) !== isAtEnd) {
      const next = new Set(atEndLevels.value)
      if (isAtEnd) next.add(level)
      else next.delete(level)
      atEndLevels.value = next
    }
  }

  function checkAllCarousels () {
    const scrollers = scrollerRefs.value
    if (!scrollers) return
    const levelList = skillsByLevel.value
    for (const [i, el] of scrollers.entries()) {
      if (levelList[i]) updateScrollState(el, levelList[i].level)
    }
  }

  onMounted(() => nextTick(checkAllCarousels))
  watch(rightOffset, () => nextTick(checkAllCarousels))

  function maskImage (level: SkillLevel): string | undefined {
    const left = scrolledLevels.value.has(level)
    const end = atEndLevels.value.has(level)
    if (left && end) return 'linear-gradient(to right, transparent, black 4rem)'
    if (left) return 'linear-gradient(to right, transparent, black 4rem, black calc(100% - 4rem), transparent)'
    if (!end) return 'linear-gradient(to right, black, black calc(100% - 4rem), transparent)'
    return undefined
  }

  function onScroll (e: Event, level: SkillLevel) {
    updateScrollState(e.currentTarget as HTMLElement, level)
  }

  function scrollCarousel (level: SkillLevel, direction: -1 | 1) {
    const index = skillsByLevel.value.findIndex(g => g.level === level)
    const el = index === -1 ? undefined : scrollerRefs.value?.[index]
    if (el) {
      el.scrollBy({ left: direction * 300, behavior: 'smooth' })
    }
  }

  function onKeyDown (e: KeyboardEvent) {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return

    const container = e.currentTarget as HTMLElement
    const focusable = [...container.querySelectorAll<HTMLElement>('a, [tabindex="0"]')]
    const current = focusable.indexOf(document.activeElement as HTMLElement)
    if (current === -1) return

    const next = e.key === 'ArrowRight' ? current + 1 : current - 1
    if (next < 0 || next >= focusable.length) return

    e.preventDefault()
    focusable[next].focus()
    focusable[next].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' })
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
        class="group relative"
        :style="{ marginRight: `-${rightOffset}px`, paddingRight: '1rem' }"
      >
        <div
          ref="scrollers"
          :aria-label="`${meta.label} skills`"
          class="hide-scrollbar flex gap-4 overflow-x-auto touch-pan-x [scrollbar-width:none]"
          :class="[dragging ? 'cursor-grabbing select-none' : 'cursor-grab']"
          role="list"
          :style="{ maskImage: maskImage(level) }"
          @click.capture="onClickCapture"
          @dragstart.prevent
          @keydown="onKeyDown"
          @pointercancel="onPointerUp"
          @pointerdown="onPointerDown"
          @pointermove="onPointerMove"
          @pointerup="onPointerUp"
          @scroll="onScroll($event, level)"
        >
          <SkillCard
            v-for="skill in skills"
            :key="skill.id"
            class="shrink-0 w-[280px]"
            role="listitem"
            :skill="skill"
          />
        </div>

        <!-- Left arrow -->
        <button
          v-if="scrolledLevels.has(level)"
          aria-label="Scroll left"
          class="absolute left-2 top-50% -translate-y-50% z-1 flex items-center justify-center w-9 h-9 rounded-full border border-divider bg-surface text-on-surface cursor-pointer opacity-0 group-hover:opacity-100 focus-visible:opacity-100 shadow-sm hover:shadow-md transition-[opacity,box-shadow] duration-200"
          @click="scrollCarousel(level, -1)"
        >
          <svg
            fill="none"
            height="20"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            viewBox="0 0 24 24"
            width="20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        <!-- Right arrow -->
        <button
          v-if="!atEndLevels.has(level)"
          aria-label="Scroll right"
          class="absolute right-2 top-50% -translate-y-50% z-1 flex items-center justify-center w-9 h-9 rounded-full border border-divider bg-surface text-on-surface cursor-pointer opacity-0 group-hover:opacity-100 focus-visible:opacity-100 shadow-sm hover:shadow-md transition-[opacity,box-shadow] duration-200"
          @click="scrollCarousel(level, 1)"
        >
          <svg
            fill="none"
            height="20"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            viewBox="0 0 24 24"
            width="20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
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
  .hide-scrollbar::-webkit-scrollbar {
    display: none;
  }
</style>
