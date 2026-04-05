<script setup lang="ts">
  import { mdiApplication, mdiArrowLeft, mdiArrowRight, mdiCellphone, mdiFileDocument, mdiPackageVariant, mdiPaletteAdvanced, mdiViewDashboard } from '@mdi/js'

  // Utilities
  import { computed } from 'vue'
  import { useRouter } from 'vue-router'

  // Types
  import type { Intent } from '@/data/types'

  import { CATEGORY_ICONS } from '@/data/features'
  import { useBuilderStore } from '@/stores/builder'

  const store = useBuilderStore()
  const router = useRouter()

  const intents: Array<{ id: Intent, title: string, description: string, icon: string }> = [
    { id: 'spa', title: 'SPA', description: 'Single-page application with routing and state', icon: mdiApplication },
    { id: 'component-library', title: 'Component Library', description: 'Reusable components for your team', icon: mdiPackageVariant },
    { id: 'design-system', title: 'Design System', description: 'Full design system with tokens and patterns', icon: mdiPaletteAdvanced },
    { id: 'admin-dashboard', title: 'Admin Dashboard', description: 'Data-heavy internal tools and panels', icon: mdiViewDashboard },
    { id: 'content-site', title: 'Content Site', description: 'Blog, docs, or marketing pages', icon: mdiFileDocument },
    { id: 'mobile-first', title: 'Mobile-First', description: 'Touch-optimized responsive application', icon: mdiCellphone },
  ]

  const categoryInfo: Record<string, { title: string, description: string }> = {
    foundation: {
      title: 'Foundation',
      description: 'Core building blocks that power everything else. These provide dependency injection, structured APIs, and plugin architecture.',
    },
    selection: {
      title: 'Selection',
      description: 'State management for selected items — tabs, dropdowns, toggles, and multi-select patterns.',
    },
    forms: {
      title: 'Forms',
      description: 'Input handling, validation, and specialized form controls like sliders, ratings, and autocomplete.',
    },
    data: {
      title: 'Data',
      description: 'Tools for displaying and navigating large datasets — tables, filters, pagination, and virtual scrolling.',
    },
    plugins: {
      title: 'Plugins',
      description: 'App-level features that install once and are available everywhere — theming, i18n, storage, permissions, and more.',
    },
    system: {
      title: 'System',
      description: 'Low-level browser integration — event listeners, keyboard shortcuts, popovers, observers, and overlay management.',
    },
    registration: {
      title: 'Registration',
      description: 'Track and manage groups of child components — used by tabs, accordions, carousels, and similar patterns.',
    },
    reactivity: {
      title: 'Reactivity',
      description: 'Vue reactivity utilities for proxy models, scoped effects, and reactive transformations.',
    },
    semantic: {
      title: 'Semantic',
      description: 'Domain-specific composables for breadcrumbs, overflow detection, and content organization.',
    },
  }

  const steps = store.wizardSteps

  const stepIndex = computed(() => store.stepper.selectedIndex ?? 0)

  function onIntent (id: Intent) {
    store.setIntent(id)
  }

  function onNext () {
    store.stepper.next()
  }

  function onBack () {
    if (stepIndex.value > 0) {
      store.stepper.prev()
    } else {
      router.push('/')
    }
  }

  function onSwitchToFree () {
    store.mode.select('free')
    router.push('/free')
  }

  function currentStep () {
    return steps[stepIndex.value ?? 0] ?? 'intent'
  }
</script>

<template>
  <div class="py-12">
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <button class="text-sm text-on-surface-variant hover:text-on-surface transition-colors" @click="onBack">
        <svg class="w-4 h-4 inline mr-1" viewBox="0 0 24 24"><path :d="mdiArrowLeft" fill="currentColor" /></svg>
        Back
      </button>
      <button class="text-sm text-primary hover:underline" @click="onSwitchToFree">
        Switch to Free Pick
      </button>
    </div>

    <!-- Step indicator -->
    <div class="flex items-center gap-0 mb-8">
      <template v-for="(s, index) in steps" :key="s">
        <div
          class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 transition-colors"
          :class="[
            index < stepIndex
              ? 'bg-primary text-on-primary'
              : index === stepIndex
                ? 'bg-primary text-on-primary ring-4 ring-primary/20'
                : 'bg-surface-variant text-on-surface-variant',
          ]"
        >
          <template v-if="index < stepIndex">&#10003;</template>
          <template v-else>{{ index + 1 }}</template>
        </div>
        <div
          v-if="index < steps.length - 1"
          class="h-0.5 flex-1 transition-colors"
          :class="index < stepIndex ? 'bg-primary' : 'bg-divider'"
        />
      </template>
    </div>

    <!-- Intent step -->
    <template v-if="currentStep() === 'intent'">
      <p class="text-xs text-on-surface-variant uppercase tracking-wide mb-1">
        Step {{ stepIndex + 1 }} of {{ steps.length }}
      </p>
      <h2 class="text-xl font-bold mb-2">What are you building?</h2>
      <p class="text-on-surface-variant mb-6">Pick a project type and we'll seed the right features for you.</p>

      <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
        <IntentCard
          v-for="item in intents"
          :key="item.id"
          :active="store.intent.selectedId === item.id"
          :description="item.description"
          :icon="item.icon"
          :title="item.title"
          @click="onIntent(item.id)"
        />
      </div>

      <div
        v-if="store.intent.selectedId"
        class="bg-primary/5 text-primary text-sm p-3 rounded-lg mt-4"
      >
        Great choice! We've pre-selected {{ store.selectedCount }} features for you.
      </div>
    </template>

    <!-- Category steps -->
    <template v-else-if="currentStep() !== 'review'">
      <p class="text-xs text-on-surface-variant uppercase tracking-wide mb-1">
        Step {{ stepIndex + 1 }} of {{ steps.length }}
      </p>
      <h2 class="text-xl font-bold mb-2 capitalize flex items-center gap-2">
        <svg v-if="CATEGORY_ICONS[currentStep()]" class="w-6 h-6 text-primary" viewBox="0 0 24 24">
          <path :d="CATEGORY_ICONS[currentStep()]" fill="currentColor" />
        </svg>
        {{ categoryInfo[currentStep()]?.title ?? currentStep() }}
      </h2>
      <p class="text-on-surface-variant mb-6">
        {{ categoryInfo[currentStep()]?.description ?? 'Select the features you need from this category.' }}
      </p>

      <div class="flex flex-col gap-3">
        <FeatureCard
          v-for="feature in store.categories.get(currentStep()) ?? []"
          :key="feature.id"
          :active="store.isSelected(feature.id)"
          :auto="!store.isSelected(feature.id) && store.resolved.autoIncluded.includes(feature.id)"
          :feature
          @click="store.toggle(feature.id)"
        />
      </div>

      <p
        v-if="(store.categories.get(currentStep()) ?? []).length === 0"
        class="text-on-surface-variant text-sm"
      >
        No features in this category yet.
      </p>

      <div class="mt-8 pt-6 border-t border-divider flex items-center justify-between">
        <div class="text-sm text-on-surface-variant">
          <span class="font-semibold text-on-surface">{{ store.selectedCount }}</span> features selected
          <span v-if="store.resolved.autoIncluded.length > 0" class="ml-2">
            + <span class="font-semibold text-accent">{{ store.resolved.autoIncluded.length }}</span> auto-included
          </span>
        </div>
      </div>
    </template>

    <!-- Review step -->
    <template v-else>
      <p class="text-xs text-on-surface-variant uppercase tracking-wide mb-1">
        Step {{ stepIndex + 1 }} of {{ steps.length }}
      </p>
      <h2 class="text-xl font-bold mb-2">Review</h2>
      <p class="text-on-surface-variant mb-4">
        {{ store.selectedCount }} selected, {{ store.resolved.autoIncluded.length }} auto-included.
      </p>
      <button
        class="px-4 py-2 bg-primary text-on-primary rounded-lg font-semibold hover:opacity-90"
        @click="store.openInPlayground()"
      >
        Open in Playground
      </button>
    </template>

    <!-- Navigation -->
    <div class="flex justify-between mt-12">
      <button
        class="px-4 py-2 text-sm text-on-surface-variant hover:text-on-surface transition-colors"
        @click="onBack"
      >
        Back
      </button>
      <button
        class="px-4 py-2 text-sm bg-primary text-on-primary rounded-lg font-semibold hover:opacity-90 transition-opacity"
        :class="{ 'opacity-50 cursor-not-allowed': currentStep() === 'intent' && !store.intent.selectedId }"
        :disabled="currentStep() === 'intent' && !store.intent.selectedId"
        @click="onNext"
      >
        {{ currentStep() === steps[steps.length - 2] ? 'Review' : 'Continue' }}
        <svg class="w-4 h-4 inline ml-1" viewBox="0 0 24 24"><path :d="mdiArrowRight" fill="currentColor" /></svg>
      </button>
    </div>
  </div>
</template>
