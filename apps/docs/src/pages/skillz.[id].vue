<script setup lang="ts">
  import { definePage, useRoute } from 'vue-router/auto'

  // Composables
  import { useSettings } from '@/composables/useSettings'

  // Utilities
  import { computed } from 'vue'

  // Stores
  import { useSkillzStore } from '@/stores/skillz'
  import {
    SKILL_CATEGORY_META,
    SKILL_LEVEL_META,
    SKILL_TRACK_META,
  } from '@/types/skill'

  definePage({
    meta: {
      layout: 'fullscreen',
      level: 1,
    },
  })

  const route = useRoute()
  const skillz = useSkillzStore()
  const settings = useSettings()

  const skillId = computed(() => route.params.id as string)
  const skill = computed(() => skillz.items.find(s => s.id === skillId.value))

  // TODO: hook up progress tracking
  const completed = false
  const progress = { completedSteps: [] as number[] }

  // Metadata
  const levelMeta = computed(() => skill.value ? SKILL_LEVEL_META[skill.value.level] : null)
  const trackMeta = computed(() => skill.value ? SKILL_TRACK_META[skill.value.track] : null)

  function startSkill () {
    if (!skill.value) return
    skillz.start(skill.value)
  }
</script>

<template>
  <div class="min-h-[calc(100vh-64px)]">
    <!-- Not found state -->
    <div v-if="!skill" class="flex flex-col items-center justify-center py-16 px-8 text-center">
      <h1 class="m-0 mb-2 text-2xl">Skill Not Found</h1>
      <p class="m-0 mb-6 text-on-surface-variant">The skill "{{ skillId }}" doesn't exist.</p>
      <RouterLink class="text-primary no-underline hover:underline" to="/skillz">
        Back to Skillz
      </RouterLink>
    </div>

    <!-- Skill detail -->
    <template v-else>
      <div class="max-w-3xl mx-auto p-4">
        <header class="flex justify-between items-center mb-4">
          <RouterLink class="flex items-center gap-2 text-on-surface-variant no-underline text-sm transition-colors hover:text-on-surface" to="/skillz">
            <span class="text-xl">←</span>
            Back to Skillz
          </RouterLink>

          <div v-if="completed" class="flex items-center gap-2 px-4 py-2 bg-success/15 text-success rounded-full text-sm font-medium">
            <span class="font-bold">✓</span>
            Completed
          </div>
        </header>

        <div
          class="border border-divider rounded-xl p-4 md:p-8"
          :class="settings.showBgGlass ? 'bg-glass-surface' : 'bg-surface'"
        >
          <div class="flex gap-2 mb-4">
            <span
              v-if="levelMeta"
              class="level-badge inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded"
              :style="{ '--level-color': levelMeta.color }"
            >
              <AppIcon :icon="levelMeta.icon" :size="14" />
              {{ levelMeta.label }}
            </span>
            <span v-if="trackMeta" class="text-xs font-medium px-2.5 py-1 rounded bg-surface-variant text-on-surface-variant">
              {{ trackMeta.label }}
            </span>
          </div>

          <h1 class="text-2xl font-bold m-0 mb-3 text-on-surface">{{ skill.name }}</h1>
          <p class="text-base text-on-surface-variant m-0 mb-6 leading-relaxed">{{ skill.description }}</p>

          <div class="flex flex-wrap gap-6 p-4 bg-surface-variant rounded-lg mb-6">
            <div class="flex flex-col gap-1">
              <span class="text-xs font-medium uppercase text-on-surface-variant">Estimated time</span>
              <span class="text-sm font-semibold text-on-surface">~{{ skill.estimatedMinutes }} minutes</span>
            </div>
            <div class="flex flex-col gap-1">
              <span class="text-xs font-medium uppercase text-on-surface-variant">Steps</span>
              <span class="text-sm font-semibold text-on-surface">{{ skill.steps.length }} steps</span>
            </div>
            <div v-if="skill.categories.length > 0" class="flex flex-col gap-1">
              <span class="text-xs font-medium uppercase text-on-surface-variant">Categories</span>
              <div class="flex flex-wrap gap-1">
                <span
                  v-for="cat in skill.categories"
                  :key="cat"
                  class="text-[10px] font-medium uppercase px-1.5 py-0.5 rounded-sm bg-surface text-on-surface-variant"
                >
                  {{ SKILL_CATEGORY_META[cat].label }}
                </span>
              </div>
            </div>
          </div>

          <div v-if="skill.prerequisites.length > 0" class="flex flex-wrap items-center gap-2 px-4 py-3 bg-warning/10 border border-warning rounded-lg mb-6 text-sm">
            <span class="font-medium text-warning">Prerequisites:</span>
            <RouterLink
              v-for="prereq in skill.prerequisites"
              :key="prereq"
              class="text-primary no-underline hover:underline"
              :to="`/skillz/${prereq}`"
            >
              {{ prereq }}
            </RouterLink>
          </div>

          <h2 class="text-base font-semibold m-0 mb-4 text-on-surface">What you'll learn</h2>
          <ol class="list-none p-0 m-0 mb-8">
            <li
              v-for="(step, index) in skill.steps"
              :key="index"
              class="flex items-center gap-3 py-3 border-b border-divider last:border-b-0"
            >
              <span
                class="flex items-center justify-center w-6 h-6 text-xs font-semibold rounded-full shrink-0"
                :class="progress.completedSteps.includes(index)
                  ? 'bg-success text-on-success'
                  : 'bg-surface-variant text-on-surface-variant'"
              >
                {{ index + 1 }}
              </span>
              <span
                class="text-sm"
                :class="progress.completedSteps.includes(index)
                  ? 'line-through text-on-surface-variant'
                  : 'text-on-surface'"
              >
                {{ step.learn }}
              </span>
            </li>
          </ol>

        </div>

        <!-- Sticky button on mobile, inline on desktop -->
        <div class="fixed bottom-0 left-0 right-0 p-4 bg-surface border-t border-divider md:relative md:mt-8 md:p-0 md:bg-transparent md:border-0">
          <button
            class="w-full px-6 py-2 md:py-3.5 text-base font-semibold bg-primary text-on-primary border-none rounded-lg cursor-pointer transition-[filter] hover:not-disabled:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
            @click="startSkill"
          >
            Start Skill
          </button>
        </div>

        <!-- Spacer for fixed button on mobile -->
        <div class="h-20 md:hidden" />
      </div>
    </template>
  </div>
</template>

<style scoped>
/* Level badge needs dynamic color via CSS variable */
.level-badge {
  background: color-mix(in srgb, var(--level-color) 15%, transparent);
  color: var(--level-color);
}
</style>
