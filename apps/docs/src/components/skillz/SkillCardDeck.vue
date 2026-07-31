<script setup lang="ts">
  // Framework
  import { useHydration } from '@vuetify/v0'

  // Context
  import SkillCard from './SkillCard.vue'

  import { SKILL_TRACK_META } from '@/types/skill'

  // Stores
  import { useSkillzStore } from '@/stores/skillz'

  // Utilities
  import { computed } from 'vue'

  // Types
  import type { SkillMeta, SkillTrack } from '@/types/skill'

  const props = defineProps<{
    items: SkillMeta[]
  }>()

  const store = useSkillzStore()
  const { isHydrated } = useHydration()

  // Group skills by track
  const tracks: SkillTrack[] = ['essentials', 'fundamentals', 'features', 'integration']

  const skillsByTrack = computed(() => {
    return tracks.map(track => ({
      track,
      meta: SKILL_TRACK_META[track],
      skills: props.items
        .filter(s => s.track === track)
        .toSorted((a, b) => {
          // Locked cards sink to the end of their track. Applied only after
          // hydration - lock state lives in localStorage, so sorting by it
          // during SSR/first paint would mismatch the SSG payload.
          if (isHydrated.value) {
            const lockDiff = Number(store.locked(a.id)) - Number(store.locked(b.id))
            if (lockDiff !== 0) return lockDiff
          }
          const levelDiff = a.level - b.level
          if (levelDiff !== 0) return levelDiff
          return a.order - b.order
        }),
    })).filter(t => t.skills.length > 0)
  })
</script>

<template>
  <div v-if="skillsByTrack.length > 0" class="mt-8 flex flex-col gap-10">
    <div v-for="{ track, meta, skills } in skillsByTrack" :key="track">
      <h2 :id="track" class="m-0 mb-1 text-xl">{{ meta.label }}</h2>
      <p class="m-0 mb-4 text-sm text-on-surface-variant">{{ meta.description }}</p>

      <div class="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4">
        <SkillCard v-for="skill in skills" :key="skill.id" :skill />
      </div>
    </div>
  </div>

  <div v-else class="text-center p-12 text-on-surface-variant">
    <p>No skills available yet. Check back soon!</p>
  </div>
</template>
