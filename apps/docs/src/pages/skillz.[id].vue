<script setup lang="ts">
  import { useHead } from '@unhead/vue'
  import { definePage } from 'vue-router/auto'

  // Framework
  import { useBreakpoints } from '@vuetify/v0'

  // Components
  import SkillMasteredBadge from '@/components/skillz/SkillMasteredBadge.vue'

  // Composables
  import { useAsk } from '@/composables/useAsk'
  import { useDiscovery } from '@/composables/useDiscovery'
  import { useNavigation } from '@/composables/useNavigation'
  import { useParams } from '@/composables/useRoute'
  import { useSearch } from '@/composables/useSearch'
  import { useSettings } from '@/composables/useSettings'

  // Utilities
  import { computed } from 'vue'
  import { useRouter } from 'vue-router'

  // Stores
  import { useSkillzStore } from '@/stores/skillz'

  definePage({
    meta: {
      layout: 'fullscreen',
      level: 1,
    },
  })

  const settings = useSettings()
  const params = useParams<{ id: string }>()
  const discovery = useDiscovery()
  const store = useSkillzStore()
  const ask = useAsk()
  const navigation = useNavigation()
  const search = useSearch()
  const breakpoints = useBreakpoints()
  const router = useRouter()
  const tour = computed(() => discovery.tours.get(params.value.id))

  const done = computed(() => store.steps(params.value.id))
  const progress = computed(() => store.get(params.value.id))
  const isCompleted = computed(() => progress.value?.status === 'completed')
  const label = computed(() => {
    if (!progress.value) return 'Start'
    if (isCompleted.value) return 'Restart'
    return 'Resume'
  })

  // Find next tour in the same track by order
  const nextTour = computed(() => {
    if (!tour.value) return null
    return discovery.tours.values()
      .filter(t => t.track === tour.value!.track && t.order > tour.value!.order)
      .toSorted((a, b) => a.order - b.order)[0] ?? null
  })

  useHead({
    title: () => tour.value ? `${tour.value.name} - Skillz` : 'Skill Not Found - Skillz',
    meta: [
      { key: 'description', name: 'description', content: () => tour.value?.description ?? 'The requested skill could not be found.' },
      { key: 'og:title', property: 'og:title', content: () => tour.value ? `${tour.value.name} - Vuetify0 Skillz` : 'Skill Not Found' },
      { key: 'og:description', property: 'og:description', content: () => tour.value?.description ?? 'The requested skill could not be found.' },
    ],
  })

  async function onClick (stepId?: string) {
    const currentTour = tour.value
    if (!currentTour) return

    await router.push(currentTour.startRoute)

    store.start(currentTour.id, {
      stepId,
      context: {
        ask,
        breakpoints,
        navigation,
        router,
        search,
        settings,
      },
    })
  }

  function onClickNext () {
    if (!nextTour.value) return

    router.push(`/skillz/${nextTour.value.id}`)
  }
</script>

<template>
  <div class="min-h-[calc(100vh-64px)]">
    <!-- Not found state -->
    <div v-if="!tour" class="flex flex-col items-center justify-center py-16 px-8 text-center">
      <h1 class="m-0 mb-2 text-2xl">Skill Not Found</h1>

      <p class="m-0 mb-6 text-on-surface-variant">The skill "{{ params.id }}" doesn't exist.</p>

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

          <div class="flex items-center gap-4">
            <SkillDuration class="text-sm text-on-surface-variant" :minutes="tour.minutes" />

            <!-- Completed with next tour: Next is primary, Restart is secondary -->
            <template v-if="isCompleted && nextTour">
              <button
                class="px-4 py-1.5 text-sm font-semibold text-on-surface-variant bg-transparent border border-divider rounded-lg cursor-pointer transition-colors hover:bg-surface-variant hover:text-on-surface"
                @click="onClick()"
              >
                Restart
              </button>
              <button
                class="px-4 py-1.5 text-sm font-semibold bg-primary text-on-primary border border-primary rounded-lg cursor-pointer transition-[filter] hover:brightness-110"
                @click="onClickNext()"
              >
                Next: {{ nextTour.name }}
              </button>
            </template>

            <!-- Otherwise: single primary button -->
            <button
              v-else
              class="px-4 py-1.5 text-sm font-semibold bg-primary text-on-primary border border-primary rounded-lg cursor-pointer transition-[filter] hover:brightness-110"
              @click="onClick()"
            >
              {{ label }}
            </button>
          </div>
        </header>

        <div
          class="border border-divider rounded-xl p-4 md:p-6"
          :class="settings.showBgGlass ? 'bg-glass-surface' : 'bg-surface'"
        >
          <div class="flex items-center gap-2 mb-3">
            <SkillLevelBadge :level="tour.level" />

            <SkillModeBadge :mode="tour.mode" />

            <SkillMasteredBadge
              v-if="progress?.status === 'completed'"
              class="position-absolute top-2 right-0 md:top-4"
              :size="breakpoints.mdAndDown.value ? 72 : 128"
            />
          </div>

          <!-- <div v-if="tour.categories.length > 0" class="flex items-center gap-2 mb-4 text-xs text-on-surface-variant">
            <span class="font-medium">Category:</span>
            <SkillCategoryTags :categories="tour.categories" />
          </div> -->

          <h1 class="text-2xl font-bold m-0 mb-3 text-on-surface">{{ tour.name }}</h1>
          <p class="text-base text-on-surface-variant m-0 mb-6 leading-relaxed md:pr-26">{{ tour.description }}</p>

          <h2 class="text-base font-semibold m-0 mb-4 text-on-surface">You'll learn how to:</h2>

          <ol class="list-none p-0 m-0">
            <li
              v-for="(step, index) in tour.steps"
              :key="index"
              class="flex items-center gap-3 py-3 border-b border-divider last:border-b-0"
            >
              <span
                v-if="done.includes(String(step.id))"
                class="flex items-center justify-center w-6 h-6 shrink-0 text-success"
              >
                <AppIcon icon="check" :size="18" />
              </span>
              <span
                v-else
                class="flex items-center justify-center w-6 h-6 text-xs font-semibold rounded-full shrink-0 bg-surface-variant text-on-surface-variant"
              >
                {{ index + 1 }}
              </span>

              <span
                class="text-sm"
                :class="done.includes(String(step.id)) ? 'text-on-surface-variant line-through' : 'text-on-surface'"
              >
                {{ step.learn }}
              </span>
            </li>
          </ol>

          <!-- Not completed: Start/Resume -->
          <button
            v-if="!isCompleted"
            class="w-full px-6 py-2 text-base font-semibold bg-primary text-on-primary border-none rounded-lg cursor-pointer transition-[filter] hover:not-disabled:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed mt-8"
            @click="onClick()"
          >
            {{ label }} Skill
          </button>
        </div>
      </div>
    </template>
  </div>
</template>
