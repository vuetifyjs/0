<script setup lang="ts">
  // Components
  import SkillCard from './SkillCard.vue'

  // Utilities
  import { computed } from 'vue'

  // Types
  import type { SkillLevel, SkillMeta } from '@/types/skill'

  // Stores
  import { useSkillzStore } from '@/stores/skillz'
  import { SKILL_LEVEL_META } from '@/types/skill'

  const props = defineProps<{
    items: SkillMeta[]
  }>()

  const store = useSkillzStore()

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
</script>

<template>
  <div v-if="skillsByLevel.length > 0" class="mt-8 flex flex-col gap-10">
    <div v-for="{ level, meta, skills } in skillsByLevel" :key="level">
      <h2 class="m-0 mb-1 text-xl">{{ meta.label }}</h2>
      <p class="m-0 mb-4 text-sm text-on-surface-variant">{{ meta.title }}</p>
      <div class="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4">
        <SkillCard v-for="skill in skills" :key="skill.id" :skill="skill" />
      </div>
    </div>
  </div>

  <div v-else class="text-center p-12 text-on-surface-variant">
    <p>No skills available yet. Check back soon!</p>
  </div>
</template>
