<script setup lang="ts">
  // Types
  import type { SkillMeta } from '@/types/skill'

  defineProps<{
    /** Skill metadata object */
    skill: SkillMeta
  }>()
</script>

<template>
  <div class="skill-metadata">
    <div class="skill-metadata__item">
      <span class="skill-metadata__label">Estimated time</span>
      <span class="skill-metadata__value">~{{ skill.minutes }} minutes</span>
    </div>

    <div class="skill-metadata__item">
      <span class="skill-metadata__label">Steps</span>
      <span class="skill-metadata__value">{{ skill.steps.length }} steps</span>
    </div>

    <div v-if="skill.categories.length > 0" class="skill-metadata__item">
      <span class="skill-metadata__label">Categories</span>
      <SkillCategoryTags :categories="skill.categories" variant="compact" />
    </div>
  </div>
</template>

<style scoped>
.skill-metadata {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  padding: 16px;
  background: var(--v0-surface-variant);
  border-radius: 8px;
}

.skill-metadata__item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.skill-metadata__label {
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  color: var(--v0-on-surface-variant);
}

.skill-metadata__value {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--v0-on-surface);
}
</style>
