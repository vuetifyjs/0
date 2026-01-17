<script setup lang="ts">
  import { definePage, useRoute, useRouter } from 'vue-router/auto'

  // Components
  import SkillTutorial from '@/components/skillz/SkillTutorial.vue'

  // Composables
  import { useGuidedTour } from '@/composables/skillz/useGuidedTour'
  import { useSkillProgress } from '@/composables/skillz/useSkillProgress'

  // Utilities
  import { computed } from 'vue'

  definePage({
    meta: {
      layout: 'fullscreen',
      level: 1,
    },
  })

  // Data
  import { getSkill } from '@/data/skillz'
  // Types
  import {
    isGuidedSkill,
    isPlaygroundSkill,
    SKILL_CATEGORY_META,
    SKILL_LEVEL_META,
    SKILL_TRACK_META,
  } from '@/types/skill'

  const route = useRoute()
  const router = useRouter()

  const skillId = computed(() => route.params.id as string)
  const skill = computed(() => getSkill(skillId.value))

  // Progress
  const { isSkillComplete, getSkillProgress, resetSkillProgress } = useSkillProgress()
  const completed = computed(() => isSkillComplete(skillId.value))
  const progress = computed(() => getSkillProgress(skillId.value))

  // Guided tour
  const { startTour, isActive } = useGuidedTour()

  // Metadata
  const levelMeta = computed(() => skill.value ? SKILL_LEVEL_META[skill.value.level] : null)
  const trackMeta = computed(() => skill.value ? SKILL_TRACK_META[skill.value.track] : null)

  // Start the skill
  function handleStart () {
    if (!skill.value) return

    if (isGuidedSkill(skill.value)) {
      startTour(skill.value.id)
    }
    // Playground skills are handled inline below
  }

  // Reset progress
  function handleReset () {
    resetSkillProgress(skillId.value)
  }

  // Handle playground completion
  function handlePlaygroundComplete () {
    router.push('/skillz')
  }
</script>

<template>
  <div class="skill-page">
    <!-- Not found state -->
    <div v-if="!skill" class="skill-page__not-found">
      <h1>Skill Not Found</h1>
      <p>The skill "{{ skillId }}" doesn't exist.</p>
      <RouterLink class="skill-page__back-link" to="/skillz">
        Back to Skillz
      </RouterLink>
    </div>

    <!-- Playground skill - render inline -->
    <template v-else-if="isPlaygroundSkill(skill)">
      <SkillTutorial :skill="skill" @complete="handlePlaygroundComplete" />
    </template>

    <!-- Guided skill - show details page with start button -->
    <template v-else-if="isGuidedSkill(skill)">
      <div class="skill-detail">
        <header class="skill-detail__header">
          <RouterLink class="skill-detail__back" to="/skillz">
            <span class="skill-detail__back-arrow">←</span>
            Back to Skillz
          </RouterLink>

          <div v-if="completed" class="skill-detail__completed">
            <span class="skill-detail__completed-icon">✓</span>
            Completed
          </div>
        </header>

        <div class="skill-detail__content">
          <div class="skill-detail__meta">
            <span
              v-if="levelMeta"
              class="skill-detail__level"
              :style="{ '--level-color': levelMeta.color }"
            >
              {{ levelMeta.label }}
            </span>
            <span v-if="trackMeta" class="skill-detail__track">
              {{ trackMeta.label }}
            </span>
          </div>

          <h1 class="skill-detail__title">{{ skill.name }}</h1>
          <p class="skill-detail__description">{{ skill.description }}</p>

          <div class="skill-detail__info">
            <div class="skill-detail__info-item">
              <span class="skill-detail__info-label">Estimated time</span>
              <span class="skill-detail__info-value">~{{ skill.estimatedMinutes }} minutes</span>
            </div>
            <div class="skill-detail__info-item">
              <span class="skill-detail__info-label">Steps</span>
              <span class="skill-detail__info-value">{{ skill.steps.length }} steps</span>
            </div>
            <div v-if="skill.categories.length > 0" class="skill-detail__info-item">
              <span class="skill-detail__info-label">Categories</span>
              <div class="skill-detail__categories">
                <span
                  v-for="cat in skill.categories"
                  :key="cat"
                  class="skill-detail__category"
                >
                  {{ SKILL_CATEGORY_META[cat].label }}
                </span>
              </div>
            </div>
          </div>

          <div v-if="skill.prerequisites.length > 0" class="skill-detail__prereqs">
            <span class="skill-detail__prereqs-label">Prerequisites:</span>
            <RouterLink
              v-for="prereq in skill.prerequisites"
              :key="prereq"
              class="skill-detail__prereq-link"
              :to="`/skillz/${prereq}`"
            >
              {{ prereq }}
            </RouterLink>
          </div>

          <h2 class="skill-detail__steps-title">What you'll learn</h2>
          <ol class="skill-detail__steps">
            <li
              v-for="(step, index) in skill.steps"
              :key="index"
              class="skill-detail__step"
              :class="{ 'skill-detail__step--completed': progress.completedSteps.includes(index) }"
            >
              <span class="skill-detail__step-number">{{ index + 1 }}</span>
              <span class="skill-detail__step-title">{{ step.title }}</span>
            </li>
          </ol>

          <div class="skill-detail__actions">
            <button
              class="skill-detail__start-btn"
              :disabled="isActive"
              @click="handleStart"
            >
              {{ completed ? 'Start Again' : progress.completedSteps.length > 0 ? 'Continue' : 'Start Skill' }}
            </button>

            <button
              v-if="completed || progress.completedSteps.length > 0"
              class="skill-detail__reset-btn"
              @click="handleReset"
            >
              Reset Progress
            </button>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.skill-page {
  min-height: calc(100vh - 64px);
}

.skill-page__not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
}

.skill-page__not-found h1 {
  margin: 0 0 0.5rem;
  font-size: 1.5rem;
}

.skill-page__not-found p {
  margin: 0 0 1.5rem;
  color: var(--v0-on-surface-variant);
}

.skill-page__back-link {
  color: var(--v0-primary);
  text-decoration: none;
}

.skill-page__back-link:hover {
  text-decoration: underline;
}

/* Skill detail */
.skill-detail {
  max-width: 720px;
  margin: 0 auto;
  padding: 2rem;
}

.skill-detail__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.skill-detail__back {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--v0-on-surface-variant);
  text-decoration: none;
  font-size: 0.875rem;
  transition: color 0.15s;
}

.skill-detail__back:hover {
  color: var(--v0-on-surface);
}

.skill-detail__back-arrow {
  font-size: 1.25rem;
}

.skill-detail__completed {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: color-mix(in srgb, var(--v0-success) 15%, transparent);
  color: var(--v0-success);
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
}

.skill-detail__completed-icon {
  font-weight: bold;
}

.skill-detail__content {
  background: var(--v0-surface);
  border: 1px solid var(--v0-divider);
  border-radius: 12px;
  padding: 2rem;
}

.skill-detail__meta {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.skill-detail__level {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 4px;
  background: color-mix(in srgb, var(--level-color) 15%, transparent);
  color: var(--level-color);
}

.skill-detail__track {
  font-size: 0.75rem;
  font-weight: 500;
  padding: 4px 10px;
  border-radius: 4px;
  background: var(--v0-surface-variant);
  color: var(--v0-on-surface-variant);
}

.skill-detail__title {
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0 0 0.75rem;
  color: var(--v0-on-surface);
}

.skill-detail__description {
  font-size: 1rem;
  color: var(--v0-on-surface-variant);
  margin: 0 0 1.5rem;
  line-height: 1.6;
}

.skill-detail__info {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  padding: 1rem;
  background: var(--v0-surface-variant);
  border-radius: 8px;
  margin-bottom: 1.5rem;
}

.skill-detail__info-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.skill-detail__info-label {
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  color: var(--v0-on-surface-variant);
}

.skill-detail__info-value {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--v0-on-surface);
}

.skill-detail__categories {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.skill-detail__category {
  font-size: 0.625rem;
  font-weight: 500;
  text-transform: uppercase;
  padding: 2px 6px;
  border-radius: 3px;
  background: var(--v0-surface);
  color: var(--v0-on-surface-variant);
}

.skill-detail__prereqs {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: color-mix(in srgb, var(--v0-warning) 10%, transparent);
  border: 1px solid var(--v0-warning);
  border-radius: 8px;
  margin-bottom: 1.5rem;
  font-size: 0.875rem;
}

.skill-detail__prereqs-label {
  font-weight: 500;
  color: var(--v0-warning);
}

.skill-detail__prereq-link {
  color: var(--v0-primary);
  text-decoration: none;
}

.skill-detail__prereq-link:hover {
  text-decoration: underline;
}

.skill-detail__steps-title {
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 1rem;
  color: var(--v0-on-surface);
}

.skill-detail__steps {
  list-style: none;
  padding: 0;
  margin: 0 0 2rem;
}

.skill-detail__step {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--v0-divider);
}

.skill-detail__step:last-child {
  border-bottom: none;
}

.skill-detail__step-number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  font-size: 0.75rem;
  font-weight: 600;
  background: var(--v0-surface-variant);
  color: var(--v0-on-surface-variant);
  border-radius: 50%;
  flex-shrink: 0;
}

.skill-detail__step--completed .skill-detail__step-number {
  background: var(--v0-success);
  color: var(--v0-on-success);
}

.skill-detail__step-title {
  font-size: 0.875rem;
  color: var(--v0-on-surface);
}

.skill-detail__step--completed .skill-detail__step-title {
  text-decoration: line-through;
  color: var(--v0-on-surface-variant);
}

.skill-detail__actions {
  display: flex;
  gap: 1rem;
}

.skill-detail__start-btn {
  flex: 1;
  padding: 0.875rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  background: var(--v0-primary);
  color: var(--v0-on-primary);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: filter 0.15s;
}

.skill-detail__start-btn:hover:not(:disabled) {
  filter: brightness(1.1);
}

.skill-detail__start-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.skill-detail__reset-btn {
  padding: 0.875rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  background: transparent;
  color: var(--v0-on-surface-variant);
  border: 1px solid var(--v0-divider);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s;
}

.skill-detail__reset-btn:hover {
  background: var(--v0-surface-variant);
  color: var(--v0-on-surface);
}
</style>

<route lang="yaml">
meta:
  layout: fullscreen
</route>
