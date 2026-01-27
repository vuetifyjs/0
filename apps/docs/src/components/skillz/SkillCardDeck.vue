<script setup lang="ts">
  // Components
  import SkillCard from './SkillCard.vue'

  // Utilities
  import { computed } from 'vue'

  // Types
  import type { SkillMeta, SkillTrack } from '@/types/skill'

  import { SKILL_TRACK_META } from '@/types/skill'

  const props = defineProps<{
    items: SkillMeta[]
  }>()

  // Group skills by track
  const tracks: SkillTrack[] = ['essentials', 'fundamentals', 'features', 'integration']

  const skillsByTrack = computed(() => {
    return tracks.map(track => ({
      track,
      meta: SKILL_TRACK_META[track],
      skills: props.items
        .filter(s => s.track === track)
        .toSorted((a, b) => {
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
      <h2 class="m-0 mb-1 text-xl">{{ meta.label }}</h2>
      <p class="m-0 mb-4 text-sm text-on-surface-variant">{{ meta.description }}</p>
      <div class="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4">
        <SkillCard v-for="skill in skills" :key="skill.id" :skill="skill" />
      </div>
    </div>
  </div>

  <div v-else class="text-center p-12 text-on-surface-variant">
    <p>No skills available yet. Check back soon!</p>
  </div>
</template>
