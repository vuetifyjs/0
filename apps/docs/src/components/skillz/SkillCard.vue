<script setup lang="ts">
  // Utilities
  import { computed } from 'vue'

  // Types
  import type { SkillMeta } from '@/types/skill'

  // Stores
  import { useSkillzStore } from '@/stores/skillz'

  const props = defineProps<{
    skill: SkillMeta
  }>()

  const store = useSkillzStore()
  const done = computed(() => store.completed(props.skill.id))
  const isLocked = computed(() => store.locked(props.skill.id))
</script>

<template>
  <component
    :is="isLocked ? 'div' : 'RouterLink'"
    class="flex flex-col h-full p-4 border border-divider rounded-lg bg-surface no-underline text-inherit transition-[border-color,box-shadow] duration-200"
    :class="{
      'border-success': done,
      'opacity-60 cursor-not-allowed': isLocked,
      'hover:border-primary hover:shadow-md': !isLocked,
    }"
    :to="isLocked ? undefined : `/skillz/${skill.id}`"
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
        <SkillCategoryTags :categories="skill.categories" />
        <SkillDuration :minutes="skill.minutes" />
      </div>
    </div>
  </component>
</template>
