<script setup lang="ts">
  // Framework
  import { useBreakpoints } from '@vuetify/v0'

  // Composables
  import { useAsk } from '@/composables/useAsk'
  import { useNavigation } from '@/composables/useNavigation'
  import { useSearch } from '@/composables/useSearch'
  import { useSettings } from '@/composables/useSettings'

  // Utilities
  import { computed, toRef } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  // Stores
  import { useSkillzStore } from '@/stores/skillz'
  // Types
  import { SKILL_LEVEL_META } from '@/types/skill'

  const store = useSkillzStore()
  const route = useRoute()
  const router = useRouter()

  const isSkillzPage = toRef(() => route.path.startsWith('/skillz/'))
  const ask = useAsk()
  const breakpoints = useBreakpoints()
  const navigation = useNavigation()
  const search = useSearch()
  const settings = useSettings()

  const levelMeta = computed(() => {
    const level = store.pendingTour?.tour.level ?? 1
    return SKILL_LEVEL_META[level]
  })

  const completedCount = computed(() => store.pendingTour?.progress.steps.length ?? 0)
  const totalCount = computed(() => store.pendingTour?.tour.steps.length ?? 0)
  const progressPct = computed(() => totalCount.value > 0 ? Math.round(completedCount.value / totalCount.value * 100) : 0)

  async function onResume () {
    const pending = store.pendingTour
    if (!pending) return

    const { tour, progress } = pending

    if (tour.mode === 'tutorial' && tour.tutorialRoute) {
      const stepNum = progress.lastStep
        ? Number.parseInt(progress.lastStep.replace('step-', ''), 10)
        : 1
      await router.push({
        path: tour.tutorialRoute,
        query: stepNum > 1 ? { step: stepNum } : undefined,
      })
      return
    }

    await router.push(tour.startRoute)

    store.start(tour.id, {
      context: {
        ask,
        breakpoints,
        navigation,
        search,
        settings,
      },
    })
  }

  function onDismiss () {
    const pending = store.pendingTour
    if (pending) {
      store.dismiss(pending.tour.id)
    }
  }

  function onSnooze () {
    const pending = store.pendingTour
    if (pending) {
      store.snooze(pending.tour.id)
    }
  }
</script>

<template>
  <Teleport to="body">
    <Transition name="slide-up">
      <div
        v-if="store.pendingTour && !isSkillzPage"
        class="fixed top-14 inset-x-0 mx-auto z-50 w-[300px] bg-surface border border-divider rounded-xl shadow-xl overflow-hidden"
      >
        <AppDotGrid :coverage="50" :density="14" origin="bottom left" />

        <div class="relative p-4">
          <!-- Title row -->
          <div class="flex items-start justify-between gap-2 mb-1">
            <p class="text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
              Skill in Progress
            </p>
            <AppCloseButton label="Dismiss" size="sm" @click="onDismiss" />
          </div>

          <!-- Tour name -->
          <p class="text-sm font-semibold text-on-surface leading-snug mb-2">
            {{ store.pendingTour.tour.name }}
          </p>

          <!-- Meta row: level · step X of Y · duration -->
          <div class="flex items-center gap-1.5 text-xs text-on-surface-variant mb-3">
            <SkillLevelBadge :icon-size="11" :level="store.pendingTour.tour.level" />
            <span class="opacity-30">·</span>
            <span>Step {{ completedCount + 1 }} of {{ totalCount }}</span>
            <span class="opacity-30">·</span>
            <AppIcon icon="clock" :size="11" />
            <span>~{{ store.pendingTour.tour.minutes }} min</span>
          </div>

          <!-- Progress bar -->
          <div class="h-1 bg-surface-tint rounded-full overflow-hidden mb-4">
            <div
              class="h-full rounded-full transition-all duration-300"
              :style="{ width: `${progressPct}%`, background: levelMeta.color }"
            />
          </div>

          <!-- Actions -->
          <div class="flex items-center justify-between gap-3">
            <button
              class="text-xs text-on-surface-variant hover:text-on-surface transition-colors"
              type="button"
              @click="onSnooze"
            >
              Remind me later
            </button>
            <button
              class="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-primary text-on-primary rounded-lg hover:brightness-110 transition-[filter]"
              type="button"
              @click="onResume"
            >
              Resume
              <AppIcon class="opacity-100" icon="chevron-right" :size="13" />
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
  .slide-up-enter-active,
  .slide-up-leave-active {
    transition: transform 0.25s ease, opacity 0.25s ease;
  }

  .slide-up-enter-from,
  .slide-up-leave-to {
    transform: translateY(-12px);
    opacity: 0;
  }
</style>
