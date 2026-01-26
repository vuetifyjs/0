<script setup lang="ts">
  // Types
  import type { SkillCategory } from '@/types/skill'

  import { SKILL_CATEGORY_META } from '@/types/skill'

  withDefaults(defineProps<{
    /** Array of category identifiers */
    categories: SkillCategory[]
    /** Visual variant */
    variant?: 'default' | 'compact'
  }>(), {
    variant: 'default',
  })
</script>

<template>
  <div v-if="categories.length > 0" class="skill-category-tags" :class="`skill-category-tags--${variant}`">
    <span
      v-for="cat in categories"
      :key="cat"
      class="skill-category-tag"
    >
      {{ SKILL_CATEGORY_META[cat].label }}
    </span>
  </div>
</template>

<style scoped>
.skill-category-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.skill-category-tag {
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.025em;
  border-radius: 3px;
  background: var(--v0-surface-variant);
  color: var(--v0-on-surface-variant);
}

.skill-category-tags--default .skill-category-tag {
  font-size: 0.625rem;
  padding: 2px 6px;
}

.skill-category-tags--compact .skill-category-tag {
  font-size: 10px;
  padding: 2px 6px;
}
</style>
