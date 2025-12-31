<script setup lang="ts">
  // Framework
  import { ExpansionPanel } from '@vuetify/v0'

  // Utilities
  import { computed, onBeforeMount, watch } from 'vue'

  import { type Milestone, type TimeHorizon, useRoadmapStore } from '@/stores/roadmap'

  const store = useRoadmapStore()
  const expanded = defineModel<number[]>({ default: () => [] })

  const horizons: { key: TimeHorizon, label: string, icon: string }[] = [
    { key: 'now', label: 'Now', icon: 'create' },
    { key: 'next', label: 'Next', icon: 'calendar-clock' },
    { key: 'later', label: 'Later', icon: 'telescope' },
    { key: 'done', label: 'Completed', icon: 'check-circle' },
  ]

  const groupedMilestones = computed(() => {
    return horizons.map(h => ({
      ...h,
      milestones: store.byHorizon(h.key),
    })).filter(g => g.milestones.length > 0)
  })

  function formatDate (date: string | null): string {
    if (!date) return 'No due date'
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
    })
  }

  function getProgress (milestone: Milestone): number {
    const total = milestone.open_issues + milestone.closed_issues
    if (total === 0) return 0
    return Math.round((milestone.closed_issues / total) * 100)
  }

  function getSummary (description: string | null | undefined): string {
    if (!description) return ''
    return description.split('\n')[0]
  }

  function getDetails (description: string | null | undefined): string[] {
    if (!description) return []
    return description.split('\n').slice(1).map(line => line.trim()).filter(Boolean).map(line => line.replace(/^[•\-\*]\s*/, '')) // Strip leading bullets
  }

  watch(expanded, (newVal, oldVal) => {
    const added = newVal.filter(id => !oldVal?.includes(id))
    for (const id of added) {
      store.fetchIssues(id)
    }
  })

  onBeforeMount(() => {
    store.fetch()
  })
</script>

<template>
  <div class="my-6">
    <!-- Loading -->
    <div v-if="store.isLoading" class="space-y-8">
      <div v-for="i in 3" :key="i" class="space-y-4">
        <div class="h-6 bg-surface-tint rounded animate-pulse w-24" />
        <div class="border border-divider rounded-lg p-4 space-y-3">
          <div class="h-5 bg-surface-tint rounded animate-pulse w-1/3" />
          <div class="h-4 bg-surface-tint rounded animate-pulse w-full" />
          <div class="h-2 bg-surface-tint rounded animate-pulse w-full" />
        </div>
      </div>
    </div>

    <!-- Error -->
    <div
      v-else-if="store.error"
      class="border border-error/30 bg-error/10 rounded-lg p-4 text-error"
      role="alert"
    >
      <div class="flex items-center gap-2">
        <AppIcon icon="alert-circle" :size="20" />
        <span>{{ store.error }}</span>
      </div>
      <button
        class="mt-3 px-4 py-2 bg-error text-on-error rounded-lg hover:bg-error/90 transition-colors"
        type="button"
        @click="store.fetch()"
      >
        Try again
      </button>
    </div>

    <!-- Timeline -->
    <ExpansionPanel.Root v-else v-model="expanded" class="space-y-10" multiple>
      <section v-for="group in groupedMilestones" :key="group.key">
        <!-- Horizon Header -->
        <div class="flex items-center gap-3 mb-4">
          <div
            class="w-10 h-10 rounded-full flex items-center justify-center"
            :class="{
              'bg-primary/15 text-primary': group.key === 'now',
              'bg-secondary/15 text-secondary': group.key === 'next',
              'bg-surface-tint text-on-surface/60': group.key === 'later',
              'bg-success/15 text-success': group.key === 'done',
            }"
          >
            <AppIcon :icon="group.icon" :size="20" />
          </div>
          <h2 class="text-xl font-semibold">{{ group.label }}</h2>
        </div>

        <!-- Timeline line + milestones -->
        <div class="relative pl-5 border-l-2 border-divider ml-5 space-y-6">
          <ExpansionPanel.Item
            v-for="milestone in group.milestones"
            :key="milestone.id"
            v-slot="{ isSelected }"
            as="article"
            class="relative"
            :value="milestone.number"
          >
            <!-- Timeline dot -->
            <div
              class="absolute -left-[calc(0.5rem+1px)] top-6 w-4 h-4 rounded-full border-2 bg-background"
              :class="{
                'border-primary': group.key === 'now',
                'border-secondary': group.key === 'next',
                'border-divider': group.key === 'later',
                'border-success': group.key === 'done',
              }"
            />

            <!-- Milestone card -->
            <div class="border border-divider rounded-lg overflow-hidden bg-surface ml-4">
              <!-- Header -->
              <ExpansionPanel.Header class="!mb-0">
                <ExpansionPanel.Activator class="w-full px-4 py-3 text-left flex items-start gap-3 hover:bg-surface-tint transition-colors">
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2 flex-wrap">
                      <h3 class="font-semibold">{{ milestone.title }}</h3>
                      <span
                        v-if="milestone.due_on"
                        class="text-xs px-2 py-0.5 rounded-full bg-surface-tint"
                      >
                        {{ formatDate(milestone.due_on) }}
                      </span>
                    </div>

                    <p v-if="milestone.description" class="text-sm opacity-70 mt-1">
                      {{ getSummary(milestone.description) }}
                    </p>

                    <!-- Progress bar -->
                    <div class="mt-3 flex items-center gap-3">
                      <div class="flex-1 h-2 bg-surface-tint rounded-full overflow-hidden">
                        <div
                          class="h-full rounded-full transition-all duration-300"
                          :class="group.key === 'done' ? 'bg-success' : 'bg-primary'"
                          :style="{ width: `${getProgress(milestone)}%` }"
                        />
                      </div>
                      <span class="text-xs font-medium tabular-nums w-12 text-right">
                        {{ getProgress(milestone) }}%
                      </span>
                    </div>

                    <div class="mt-2 text-xs opacity-60 flex items-center gap-2">
                      <span>{{ milestone.closed_issues }} closed · {{ milestone.open_issues }} open</span>
                      <span v-if="!isSelected" class="text-primary/70">· View details</span>
                    </div>
                  </div>

                  <AppIcon
                    class="opacity-50 mt-1 shrink-0 transition-transform"
                    :class="{ 'rotate-180': isSelected }"
                    icon="chevron-down"
                    :size="20"
                  />
                </ExpansionPanel.Activator>
              </ExpansionPanel.Header>

              <!-- Expanded content -->
              <ExpansionPanel.Content class="border-t border-divider">
                <!-- Details from description -->
                <div v-if="getDetails(milestone.description).length > 0" class="py-3 border-b border-divider">
                  <ul class="list-disc ml-3 pl-5 pr-4 space-y-1">
                    <li
                      v-for="(line, i) in getDetails(milestone.description)"
                      :key="i"
                      class="text-sm opacity-80"
                    >
                      {{ line }}
                    </li>
                  </ul>
                </div>

                <!-- Loading issues -->
                <div v-if="milestone.issuesLoading" class="p-4 space-y-2">
                  <div v-for="i in 3" :key="i" class="h-4 bg-surface-tint rounded animate-pulse" />
                </div>

                <!-- Issues list -->
                <div v-else-if="milestone.issues?.length" class="divide-y divide-divider">
                  <a
                    v-for="issue in milestone.issues"
                    :key="issue.id"
                    class="flex items-center gap-3 px-4 py-2 hover:bg-surface-tint transition-colors"
                    :href="issue.html_url"
                    rel="noopener"
                    target="_blank"
                  >
                    <AppIcon
                      :class="issue.state === 'closed' ? 'text-success' : 'text-primary'"
                      :icon="issue.state === 'closed' ? 'check-circle' : 'circle-outline'"
                      :size="16"
                    />
                    <span class="flex-1 truncate text-sm">{{ issue.title }}</span>
                    <span class="text-xs opacity-50">#{{ issue.number }}</span>
                  </a>
                </div>

                <!-- No issues -->
                <div v-else class="p-4 text-center text-sm opacity-50">
                  No issues in this milestone
                </div>

                <!-- View on GitHub -->
                <a
                  class="block px-4 py-2 text-center text-sm text-primary hover:bg-surface-tint transition-colors border-t border-divider"
                  :href="`https://github.com/vuetifyjs/0/milestone/${milestone.number}`"
                  rel="noopener"
                  target="_blank"
                >
                  View on GitHub
                  <span class="text-xs opacity-60 ml-0.5">↗</span>
                </a>
              </ExpansionPanel.Content>
            </div>
          </ExpansionPanel.Item>
        </div>
      </section>
    </ExpansionPanel.Root>

    <!-- Disclaimer -->
    <p class="mt-8 text-sm opacity-60 text-center">
      Priorities may shift based on community feedback and technical requirements.
    </p>
  </div>
</template>
