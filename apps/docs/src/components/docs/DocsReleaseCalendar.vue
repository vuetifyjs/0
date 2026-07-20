<script setup lang="ts">
  // Constants
  import { MATURITY_LEVELS as levels } from '@/constants/maturity'
  import { type FeatureType, releases } from '@/constants/roadmap-buckets'

  // Utilities
  import { RouterLink } from 'vue-router'

  const items = releases()

  const stableColor = levels.stable.color

  const typeIcon: Record<FeatureType, string> = {
    composable: 'code',
    component: 'puzzle',
    utility: 'typescript',
  }
</script>

<template>
  <div class="my-6">
    <div class="relative ps-5 border-s-2 border-divider ms-3 space-y-8">
      <section
        v-for="release in items"
        :key="release.title"
        class="relative"
      >
        <!-- Timeline dot -->
        <div class="absolute -start-[calc(0.5rem+1px)] top-1.5 w-4 h-4 rounded-full border-2 border-primary bg-background" />

        <!-- Release header -->
        <div class="flex items-baseline gap-3 flex-wrap ms-4">
          <h3 class="text-lg font-semibold">{{ release.title }}</h3>
          <span class="text-sm text-on-surface-variant">{{ release.date }}</span>
        </div>

        <!-- Tracks -->
        <div class="ms-4 mt-3 space-y-4">
          <!-- Net-new features -->
          <div v-if="release.features.length > 0">
            <div class="text-xs font-semibold uppercase tracking-wide opacity-60 mb-2">New in this release</div>

            <div class="flex flex-wrap gap-2">
              <component
                :is="feature.level === 'draft' ? 'span' : RouterLink"
                v-for="feature in release.features"
                :key="feature.id"
                class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border no-underline"
                :class="feature.level === 'draft' ? 'cursor-default' : 'hover:bg-surface-tint transition-colors'"
                :style="{ borderColor: levels[feature.level].color, color: levels[feature.level].color }"
                :to="feature.level !== 'draft' ? feature.path : undefined"
              >
                <AppIcon :icon="typeIcon[feature.type]" :size="12" />
                {{ feature.name }}
              </component>
            </div>
          </div>

          <!-- Graduating to stable -->
          <div v-if="release.stabilizing.length > 0">
            <div class="text-xs font-semibold uppercase tracking-wide opacity-60 mb-2">
              Graduating to stable
              <span class="opacity-70">({{ release.stabilizing.length }})</span>
            </div>

            <div class="flex flex-wrap gap-2">
              <RouterLink
                v-for="feature in release.stabilizing"
                :key="feature.id"
                class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border no-underline hover:bg-surface-tint transition-colors"
                :style="{ borderColor: stableColor, color: stableColor }"
                :to="feature.path"
              >
                <AppIcon :icon="typeIcon[feature.type]" :size="12" />
                {{ feature.name }}
              </RouterLink>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- Disclaimer -->
    <p class="mt-8 text-sm opacity-60 text-center">
      Expected dates and graduations are strategic targets, not commitments — they may shift with community feedback and technical requirements.
    </p>
  </div>
</template>
