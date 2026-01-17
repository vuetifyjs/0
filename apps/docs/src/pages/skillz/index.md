---
title: Skillz - Interactive v0 Tutorials
meta:
  - name: description
    content: Master Vuetify0 through interactive tutorials. Learn by doing with hands-on coding challenges.
  - name: keywords
    content: vuetify0, tutorial, interactive, learning, skills, v0
features:
  label: Skillz
  level: 1
---

<script setup>
import { computed } from 'vue'
import { getSkillsForTrack, getAllSkills } from '@/data/skillz'
import { SKILL_LEVEL_META, SKILL_TRACK_META } from '@/types/skill'
import SkillCard from '@/components/skillz/SkillCard.vue'
import AppIcon from '@/components/app/AppIcon.vue'
import { useSkillProgress } from '@/composables/skillz/useSkillProgress'

const skills = getAllSkills()
const { getCompletedSkillsCount, isSkillComplete, progress } = useSkillProgress()

const completedCount = computed(() => getCompletedSkillsCount())
const totalCount = computed(() => skills.length)
const progressPercent = computed(() => totalCount.value > 0 ? Math.round((completedCount.value / totalCount.value) * 100) : 0)

// Get skills grouped by track
const tracks = ['fundamentals', 'features', 'integration']
const skillsByTrack = computed(() => {
  return tracks.map(track => ({
    track,
    meta: SKILL_TRACK_META[track],
    skills: getSkillsForTrack(track),
  })).filter(t => t.skills.length > 0)
})

// Track progress stats
const trackStats = computed(() => {
  return skillsByTrack.value.map(({ track, meta, skills: trackSkills }) => ({
    track,
    label: meta.label,
    completed: trackSkills.filter(s => isSkillComplete(s.id)).length,
    total: trackSkills.length,
  }))
})

// Circle progress calculations
const circleRadius = 54
const circleCircumference = 2 * Math.PI * circleRadius
const circleOffset = computed(() => circleCircumference - (progressPercent.value / 100) * circleCircumference)
</script>

# Vuetify0 Skillz

Master v0 through interactive coding challenges. Each skill teaches a focused concept with hands-on practice.

<DocsPageFeatures :frontmatter />

<div v-if="totalCount > 0" class="my-6 px-5 py-4 bg-surface border border-divider rounded-xl flex items-center gap-5">
  <div class="relative size-16 shrink-0">
    <svg class="size-full -rotate-90" viewBox="0 0 128 128">
      <circle
        cx="64"
        cy="64"
        fill="none"
        :r="circleRadius"
        stroke="var(--v0-surface-variant)"
        stroke-width="12"
      />
      <circle
        cx="64"
        cy="64"
        fill="none"
        :r="circleRadius"
        stroke="var(--v0-primary)"
        :stroke-dasharray="circleCircumference"
        :stroke-dashoffset="circleOffset"
        stroke-linecap="round"
        stroke-width="12"
        style="transition: stroke-dashoffset 0.5s ease"
      />
    </svg>
    <div class="absolute inset-0 flex items-center justify-center">
      <span class="text-sm font-bold text-on-surface">{{ progressPercent }}%</span>
    </div>
  </div>
  <div class="flex-1 min-w-0">
    <div class="flex items-center gap-4">
      <div class="flex items-baseline gap-1.5">
        <AppIcon class="text-warning" icon="trophy" size="18" />
        <span class="text-2xl font-bold text-on-surface leading-none">{{ completedCount }}</span>
        <span class="text-sm text-on-surface-variant">/ {{ totalCount }} completed</span>
      </div>
      <div class="hidden sm:flex items-center gap-3 ml-auto">
        <div v-for="stat in trackStats" :key="stat.track" class="flex items-center gap-1.5">
          <span class="text-xs text-on-surface-variant">{{ stat.label }}</span>
          <span class="text-xs font-semibold text-on-surface px-1.5 py-0.5 bg-surface-variant rounded-full">{{ stat.completed }}/{{ stat.total }}</span>
        </div>
      </div>
    </div>
  </div>
</div>

<div v-if="skillsByTrack.length > 0" class="mt-8 flex flex-col gap-10">
  <div v-for="{ track, meta, skills: trackSkills } in skillsByTrack" :key="track">
    <h2 class="m-0 mb-1 text-xl">{{ meta.label }}</h2>
    <p class="m-0 mb-4 text-sm text-on-surface-variant">{{ meta.description }}</p>
    <div class="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4">
      <SkillCard v-for="skill in trackSkills" :key="skill.id" :skill="skill" />
    </div>
  </div>
</div>

<div v-else class="text-center p-12 text-on-surface-variant">
  <p>No skills available yet. Check back soon!</p>
</div>
