<script setup lang="ts">
  // Composables
  import { useSkillProgress } from '@/composables/skillz/useSkillProgress'

  // Utilities
  import { computed } from 'vue'

  // Types
  import type { SkillMeta } from '@/types/skill'

  import { SKILL_CATEGORY_META, SKILL_LEVEL_META } from '@/types/skill'

  const props = defineProps<{
    skill: SkillMeta
  }>()

  const { isSkillComplete } = useSkillProgress()
  const completed = computed(() => isSkillComplete(props.skill.id))
  const levelMeta = computed(() => SKILL_LEVEL_META[props.skill.level])
</script>

<template>
  <RouterLink
    class="skill-card"
    :class="{ 'skill-card--completed': completed }"
    :to="`/skillz/${skill.id}`"
  >
    <div class="skill-card__header">
      <span
        class="skill-card__level"
        :style="{ '--level-color': levelMeta.color }"
      >
        <AppIcon :icon="levelMeta.icon" :size="14" />
        {{ levelMeta.label }}
      </span>
      <span v-if="completed" class="skill-card__check">
        <AppIcon icon="check" :size="16" />
      </span>
    </div>

    <h3 class="skill-card__title">{{ skill.name }}</h3>
    <p class="skill-card__description">{{ skill.description }}</p>

    <div v-if="skill.categories.length > 0" class="skill-card__categories">
      <span
        v-for="cat in skill.categories"
        :key="cat"
        class="skill-card__category"
      >
        {{ SKILL_CATEGORY_META[cat].label }}
      </span>
    </div>

    <div class="skill-card__footer">
      <span class="skill-card__time">~{{ skill.estimatedMinutes }} min</span>
    </div>

    <div v-if="skill.prerequisites.length > 0" class="skill-card__prereqs">
      Requires: {{ skill.prerequisites.join(', ') }}
    </div>
  </RouterLink>
</template>

<style scoped>
.skill-card {
  display: block;
  padding: 1rem;
  border: 1px solid var(--v0-divider);
  border-radius: 8px;
  background: var(--v0-surface);
  text-decoration: none;
  color: inherit;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.skill-card:hover {
  border-color: var(--v0-primary);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.skill-card--completed {
  border-color: var(--v0-success);
}

.skill-card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.skill-card__level {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 4px;
  background: color-mix(in srgb, var(--level-color) 15%, transparent);
  color: var(--level-color);
}

.skill-card__check {
  color: var(--v0-success);
  display: flex;
  align-items: center;
}

.skill-card__title {
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0 0 0.5rem;
  color: var(--v0-on-surface);
}

.skill-card__description {
  font-size: 0.875rem;
  color: var(--v0-on-surface-variant);
  margin: 0 0 0.75rem;
  line-height: 1.5;
}

.skill-card__categories {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-bottom: 0.75rem;
}

.skill-card__category {
  font-size: 0.625rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.025em;
  padding: 2px 6px;
  border-radius: 3px;
  background: var(--v0-surface-variant);
  color: var(--v0-on-surface-variant);
}

.skill-card__footer {
  display: flex;
  justify-content: flex-end;
  font-size: 0.75rem;
  color: var(--v0-on-surface-variant);
}

.skill-card__time {
  opacity: 0.8;
}

.skill-card__prereqs {
  margin-top: 0.5rem;
  font-size: 0.75rem;
  color: var(--v0-warning);
  padding-top: 0.5rem;
  border-top: 1px solid var(--v0-divider);
}
</style>
