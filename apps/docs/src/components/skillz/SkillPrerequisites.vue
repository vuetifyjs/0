<script setup lang="ts">
  withDefaults(defineProps<{
    /** Array of prerequisite skill IDs */
    prerequisites: string[]
    /** Display variant */
    variant?: 'inline' | 'box'
  }>(), {
    variant: 'inline',
  })
</script>

<template>
  <div v-if="prerequisites.length > 0" class="skill-prerequisites" :class="`skill-prerequisites--${variant}`">
    <span class="skill-prerequisites__label">
      {{ variant === 'box' ? 'Prerequisites:' : 'Requires:' }}
    </span>
    <template v-if="variant === 'box'">
      <RouterLink
        v-for="prereq in prerequisites"
        :key="prereq"
        class="skill-prerequisites__link"
        :to="`/skillz/${prereq}`"
      >
        {{ prereq }}
      </RouterLink>
    </template>
    <span v-else class="skill-prerequisites__list">
      {{ prerequisites.join(', ') }}
    </span>
  </div>
</template>

<style scoped>
.skill-prerequisites--inline {
  font-size: 0.75rem;
  color: var(--v0-warning);
  padding-top: 0.5rem;
  border-top: 1px solid var(--v0-divider);
}

.skill-prerequisites--box {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  font-size: 0.875rem;
  background: color-mix(in srgb, var(--v0-warning) 10%, transparent);
  border: 1px solid var(--v0-warning);
  border-radius: 8px;
}

.skill-prerequisites__label {
  font-weight: 500;
}

.skill-prerequisites--box .skill-prerequisites__label {
  color: var(--v0-warning);
}

.skill-prerequisites__link {
  color: var(--v0-primary);
  text-decoration: none;
}

.skill-prerequisites__link:hover {
  text-decoration: underline;
}
</style>
