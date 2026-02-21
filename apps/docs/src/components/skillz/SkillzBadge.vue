<script setup lang="ts">
  // Utilities
  import { toRef } from 'vue'

  // Types
  import type { SkillLevel } from '@/types/skill'

  import { SKILL_LEVEL_META } from '@/types/skill'

  const props = defineProps<{
    level?: SkillLevel
  }>()

  const levelMeta = toRef(() => props.level ? SKILL_LEVEL_META[props.level] : undefined)
</script>

<template>
  <span
    class="skillz-badge inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wide px-2 py-1 rounded"
    :style="levelMeta ? { '--level-color': levelMeta.color } : undefined"
    :title="levelMeta ? `${levelMeta.label} level` : undefined"
  >
    SKILLZ
    <AppIcon v-if="levelMeta" :icon="levelMeta.icon" :size="14" />
  </span>
</template>

<style scoped>
.skillz-badge {
  background: color-mix(in srgb, var(--level-color, var(--v0-primary)) 15%, transparent);
  color: var(--level-color, var(--v0-primary));
}
</style>
