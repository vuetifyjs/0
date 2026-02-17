<script setup lang="ts">
  // Components
  import SkillMasteredBadge from './SkillMasteredBadge.vue'
  import DocsCard from '@/components/docs/DocsCard.vue'

  // Utilities
  import { computed } from 'vue'

  // Types
  import type { SkillMeta } from '@/types/skill'

  // Stores
  import { useSkillzStore } from '@/stores/skillz'
  import { SKILL_TRACK_META } from '@/types/skill'

  const props = defineProps<{
    skill: SkillMeta
  }>()

  const store = useSkillzStore()
  const done = computed(() => store.completed(props.skill.id))
  const isLocked = computed(() => store.locked(props.skill.id))
  const href = computed(() => {
    if (isLocked.value) return undefined
    return `/skillz/${props.skill.id}`
  })
</script>

<template>
  <DocsCard
    class="flex flex-col h-full"
    :class="{ 'border-success': done }"
    :disabled="isLocked"
    hoverable
    :to="href"
  >
    <div class="flex justify-between items-center mb-2">
      <div class="flex items-center gap-2">
        <SkillLevelBadge :level="skill.level" />
        <SkillModeBadge :mode="skill.mode" />
      </div>
      <SkillMasteredBadge v-if="done" :show-label="false" />
      <span v-else-if="isLocked" class="text-on-surface-variant flex items-center">
        <AppIcon icon="lock" :size="16" />
      </span>
    </div>

    <h3 class="text-lg font-semibold m-0 mb-2 text-on-surface line-clamp-1">{{ skill.name }}</h3>
    <p class="text-sm text-on-surface-variant m-0 mb-3 leading-relaxed line-clamp-2">{{ skill.description }}</p>

    <div class="mt-auto pt-4">
      <SkillPrerequisites class="mb-3" :prerequisites="skill.prerequisites" />

      <div class="flex justify-between items-center text-xs text-on-surface-variant">
        <span class="px-2 py-1 text-[10px] font-medium tracking-wide rounded-lg bg-surface-variant-60 text-on-surface-variant border border-divider-50">
          {{ SKILL_TRACK_META[skill.track].label }}
        </span>
        <SkillDuration :minutes="skill.minutes" />
      </div>
    </div>
  </DocsCard>
</template>
