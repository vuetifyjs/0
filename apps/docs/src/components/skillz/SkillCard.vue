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
    class="block p-4 border border-divider rounded-lg bg-surface no-underline text-inherit transition-[border-color,box-shadow] duration-200 hover:border-primary hover:shadow-md"
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

    <h3 class="text-lg font-semibold m-0 mb-2 text-on-surface">{{ skill.name }}</h3>
    <p class="text-sm text-on-surface-variant m-0 mb-3 leading-relaxed">{{ skill.description }}</p>

    <SkillCategoryTags :categories="skill.categories" class="mb-3" />

    <div class="flex justify-end text-xs text-on-surface-variant">
      <SkillDuration :minutes="skill.minutes" />
    </div>

    <SkillPrerequisites class="mt-2" :prerequisites="skill.prerequisites" />
  </RouterLink>
</template>
