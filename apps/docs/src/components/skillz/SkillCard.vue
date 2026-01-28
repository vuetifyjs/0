<script setup lang="ts">
  // Types
  import type { SkillMeta } from '@/types/skill'

  defineProps<{
    skill: SkillMeta
  }>()

  const completed = false // TODO: hook up progress tracking
</script>

<template>
  <RouterLink
    class="flex flex-col h-full p-4 border border-divider rounded-lg bg-surface no-underline text-inherit transition-[border-color,box-shadow] duration-200 hover:border-primary hover:shadow-md"
    :class="{ 'border-success': completed }"
    :to="`/skillz/${skill.id}`"
  >
    <div class="flex justify-between items-center mb-2">
      <div class="flex items-center gap-3">
        <SkillLevelBadge :level="skill.level" />
        <SkillModeBadge :mode="skill.mode" />
      </div>
      <span v-if="completed" class="text-success flex items-center">
        <AppIcon icon="check" :size="16" />
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
  </RouterLink>
</template>
