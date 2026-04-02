<script setup lang="ts">
  // Framework
  import { createStep } from '@vuetify/v0'

  // Utilities
  import { computed } from 'vue'

  interface Milestone {
    id: string
    label: string
    date?: string
    description?: string
    active?: boolean
  }

  const { milestones } = defineProps<{
    milestones: Milestone[]
  }>()

  const step = createStep({ mandatory: 'force' })

  step.onboard(milestones.map((m, index) => ({
    id: m.id,
    value: index,
  })))

  const active = milestones.findIndex(m => m.active)

  if (active === -1) {
    step.first()
  } else {
    step.select(milestones[active].id)
  }

  const currentIndex = computed(() => step.selectedIndex.value)
</script>

<template>
  <div class="w-full max-w-2xl mx-auto py-8">
    <div class="relative flex items-center justify-between">
      <!-- Track -->
      <div class="absolute top-5 left-0 right-0 h-0.5 bg-divider" />

      <!-- Progress -->
      <div
        class="absolute top-5 left-0 h-0.5 bg-primary transition-all duration-500 ease-out"
        :style="{ width: `${(currentIndex / (milestones.length - 1)) * 100}%` }"
      />

      <!-- Milestones -->
      <div
        v-for="(milestone, index) in milestones"
        :key="milestone.id"
        class="relative z-10 flex flex-col items-center cursor-pointer group"
        @click="step.select(milestone.id)"
      >
        <!-- Circle -->
        <div
          class="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300"
          :class="[
            index < currentIndex ? 'bg-primary text-on-primary scale-90' : '',
            index === currentIndex ? 'bg-primary text-on-primary ring-4 ring-primary/30 scale-110' : '',
            index > currentIndex ? 'bg-surface border-2 border-divider text-on-surface-variant group-hover:border-primary' : '',
          ]"
        >
          <svg
            v-if="index < currentIndex"
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M5 13l4 4L19 7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" />
          </svg>
          <span v-else>{{ index + 1 }}</span>
        </div>

        <!-- Label -->
        <span
          class="mt-3 text-sm font-semibold transition-colors duration-200"
          :class="index === currentIndex ? 'text-primary' : 'text-on-surface-variant'"
        >
          {{ milestone.label }}
        </span>

        <!-- Date -->
        <span
          v-if="milestone.date"
          class="mt-1 text-xs transition-colors duration-200"
          :class="index === currentIndex ? 'text-primary/70' : 'text-on-surface-variant/60'"
        >
          {{ milestone.date }}
        </span>
      </div>
    </div>

    <!-- Description -->
    <p
      v-if="milestones[currentIndex]?.description"
      class="mt-8 text-center text-sm text-on-surface-variant"
    >
      {{ milestones[currentIndex].description }}
    </p>
  </div>
</template>
