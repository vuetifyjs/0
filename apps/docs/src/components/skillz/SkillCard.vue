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
    class="skill-card"
    :class="{ 'skill-card--completed': completed }"
    :to="`/skillz/${skill.id}`"
  >
    <div class="skill-card__header">
      <SkillLevelBadge :level="skill.level" />
      <span v-if="completed" class="skill-card__check">
        <AppIcon icon="check" :size="16" />
      </span>
    </div>

    <h3 class="skill-card__title">{{ skill.name }}</h3>
    <p class="skill-card__description">{{ skill.description }}</p>

    <SkillCategoryTags :categories="skill.categories" class="skill-card__categories" />

    <div class="skill-card__footer">
      <span class="skill-card__time">~{{ skill.minutes }} min</span>
    </div>

    <SkillPrerequisites class="skill-card__prereqs" :prerequisites="skill.prerequisites" />
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
  margin-bottom: 0.75rem;
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
}
</style>
