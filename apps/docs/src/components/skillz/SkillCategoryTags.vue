<script setup lang="ts">
  // Types
  import type { SkillCategory } from '@/types/skill'

  import { SKILL_CATEGORY_META } from '@/types/skill'

  const { categories, variant = 'default' } = defineProps<{
    /** Array of category identifiers */
    categories: SkillCategory[]
    /** Visual variant */
    variant?: 'default' | 'compact'
  }>()
</script>

<template>
  <div v-if="categories.length > 0" class="flex flex-wrap gap-1.5">
    <span
      v-for="cat in categories"
      :key="cat"
      class="px-2 py-1 text-[10px] font-medium tracking-wide rounded-lg bg-surface-variant-60 text-on-surface-variant border border-divider-50"
      :class="variant === 'compact' ? 'text-[9px] px-1.5' : ''"
    >
      {{ SKILL_CATEGORY_META[cat].label }}
    </span>
  </div>
</template>
