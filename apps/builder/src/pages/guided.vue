<script setup lang="ts">
  import { mdiArrowLeft, mdiArrowRight } from '@mdi/js'

  // Utilities
  import { useRouter } from 'vue-router'

  // Types
  import type { Intent } from '@/data/types'

  import { useBuilderStore } from '@/stores/builder'

  const store = useBuilderStore()
  const router = useRouter()

  const intents: Array<{ id: Intent, title: string, description: string }> = [
    { id: 'spa', title: 'SPA', description: 'Single-page application with routing and state' },
    { id: 'component-library', title: 'Component Library', description: 'Reusable components for your team' },
    { id: 'design-system', title: 'Design System', description: 'Full design system with tokens and patterns' },
    { id: 'admin-dashboard', title: 'Admin Dashboard', description: 'Data-heavy internal tools and panels' },
    { id: 'content-site', title: 'Content Site', description: 'Blog, docs, or marketing pages' },
    { id: 'mobile-first', title: 'Mobile-First', description: 'Touch-optimized responsive application' },
  ]

  const categoryOrder = [
    'foundation',
    'selection',
    'forms',
    'data',
    'plugins',
    'system',
    'registration',
    'reactivity',
    'semantic',
  ]

  const steps = ['Intent', ...categoryOrder.filter(c => store.categories.has(c)), 'Review']

  function onIntent (id: Intent) {
    store.setIntent(id)
  }

  function onNext () {
    if (store.step < steps.length - 1) {
      store.step++
    }
  }

  function onBack () {
    if (store.step > 0) {
      store.step--
    } else {
      router.push('/')
    }
  }

  function onSwitchToFree () {
    store.mode = 'free'
    router.push('/free')
  }
</script>

<template>
  <div class="min-h-screen bg-background text-on-background">
    <div class="max-w-2xl mx-auto px-6 py-12">
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
      <div class="flex gap-1.5 mb-8">
        <div
          v-for="(s, index) in steps"
          :key="s"
          class="h-1 flex-1 rounded-full transition-colors"
          :class="index <= store.step ? 'bg-primary' : 'bg-divider'"
        />
      </div>

      <!-- Intent step -->
      <template v-if="store.step === 0">
        <h2 class="text-xl font-bold mb-2">What are you building?</h2>
        <p class="text-on-surface-variant mb-6">This helps us recommend the right features for your project.</p>

        <div class="grid grid-cols-2 gap-3">
          <IntentCard
            v-for="item in intents"
            :key="item.id"
            :active="store.intent === item.id"
            :description="item.description"
            :title="item.title"
            @click="onIntent(item.id)"
          />
        </div>
      </template>

      <!-- Category steps -->
      <template v-else-if="store.step < steps.length - 1">
        <h2 class="text-xl font-bold mb-2 capitalize">{{ steps[store.step] }}</h2>
        <p class="text-on-surface-variant mb-6">Select the features you need from this category.</p>

        <div class="flex flex-col gap-3">
          <FeatureCard
            v-for="feature in store.categories.get(steps[store.step]) ?? []"
            :key="feature.id"
            :active="store.selected.has(feature.id)"
            :auto="!store.selected.has(feature.id) && store.resolved.autoIncluded.includes(feature.id)"
            :feature
            @click="store.toggle(feature.id)"
          />
        </div>

        <p
          v-if="(store.categories.get(steps[store.step]) ?? []).length === 0"
          class="text-on-surface-variant text-sm"
        >
          No features in this category yet.
        </p>
      </template>

      <!-- Review step (inline for now, Task 10 creates the full review page) -->
      <template v-else>
        <h2 class="text-xl font-bold mb-2">Review</h2>
        <p class="text-on-surface-variant mb-4">
          {{ store.resolved.selected.length }} selected, {{ store.resolved.autoIncluded.length }} auto-included.
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
          :class="{ 'opacity-50 cursor-not-allowed': store.step === 0 && !store.intent }"
          :disabled="store.step === 0 && !store.intent"
          @click="onNext"
        >
          {{ store.step === steps.length - 2 ? 'Review' : 'Continue' }}
          <svg class="w-4 h-4 inline ml-1" viewBox="0 0 24 24"><path :d="mdiArrowRight" fill="currentColor" /></svg>
        </button>
      </div>
    </div>
  </div>
</template>
