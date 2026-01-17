/**
 * @module GuidedTourOverlay
 *
 * @remarks
 * Skillz-specific guided tour overlay. Demonstrates how to build on top of
 * the headless Tour components with custom validation, progress tracking,
 * and route-aware navigation.
 *
 * This serves as a POC for what users can build using Tour primitives.
 */

<script setup lang="ts">
  // Framework
  import { useEventListener, useHotkey, useToggleScope } from '@vuetify/v0'

  // Tour components (headless primitives)
  import { Tour } from '@/components/tour'

  // Composables
  import { useGuidedTour } from '@/composables/skillz/useGuidedTour'

  // Utilities
  import { computed, shallowRef, watch } from 'vue'
  import { useRouter } from 'vue-router'

  const router = useRouter()

  const {
    isActive,
    currentSkill,
    currentStep,
    currentStepIndex,
    totalSteps,
    completeStep,
    nextStep,
    prevStep,
    stopTour,
    checkCurrentStepValidation,
    isOnCorrectRoute,
    isFirstStep,
    isLastStep,
  } = useGuidedTour()

  // Convert GuidedSteps to TourSteps for the Tour component
  // The highlight.selector is the primary target for both highlighting and tooltip positioning
  const tourSteps = computed(() => {
    if (!currentSkill.value) return []

    return currentSkill.value.steps.map((step, index) => ({
      id: `step-${index}`,
      selector: step.highlight?.selector ?? '',
      title: step.title,
      content: step.task,
      position: step.position,
    }))
  })

  // Suppress auto-advance briefly after going backwards
  const suppressAutoAdvance = shallowRef(false)

  // Handle validation-based auto-advance
  function checkAndAdvance () {
    if (!currentStep.value) return
    if (suppressAutoAdvance.value) return

    const validation = currentStep.value.validation

    // Skip auto-advance for manual steps
    if (validation.type === 'manual') return

    if (checkCurrentStepValidation()) {
      completeStep()
    }
  }

  // Current validation type for conditional scopes
  const validationType = computed(() => currentStep.value?.validation.type)

  // Only listen for click events when tour is active and step requires click validation
  useToggleScope(
    () => isActive.value && validationType.value === 'click',
    () => {
      useEventListener(document, 'click', (e: Event) => {
        const validation = currentStep.value?.validation
        if (validation?.type !== 'click') return

        const target = e.target as Element
        const matchEl = document.querySelector(validation.selector)

        if (matchEl && (matchEl === target || matchEl.contains(target))) {
          // Delay to let the click action complete (e.g., dialog open)
          setTimeout(() => checkAndAdvance(), 100)
        }
      }, { capture: true })
    },
  )

  // Only listen for input events when tour is active and step requires input validation
  useToggleScope(
    () => isActive.value && validationType.value === 'input',
    () => {
      useEventListener(document, 'input', (e: Event) => {
        const validation = currentStep.value?.validation
        if (validation?.type !== 'input') return

        const target = e.target as Element
        const matchEl = document.querySelector(validation.selector)

        if (matchEl && (matchEl === target || matchEl.contains(target))) {
          checkAndAdvance()
        }
      })
    },
  )

  // Only listen for hover events when tour is active and step requires hover validation
  useToggleScope(
    () => isActive.value && validationType.value === 'hover',
    () => {
      useEventListener(document, 'mouseenter', (e: Event) => {
        const validation = currentStep.value?.validation
        if (validation?.type !== 'hover') return

        const target = e.target as Element
        const matchEl = document.querySelector(validation.selector)

        if (matchEl && (matchEl === target || matchEl.contains(target))) {
          checkAndAdvance()
        }
      }, { capture: true })
    },
  )

  // Only listen for navigation when tour is active and step requires navigation validation
  useToggleScope(
    () => isActive.value && validationType.value === 'navigation',
    () => {
      watch(() => router.currentRoute.value.path, newPath => {
        const validation = currentStep.value?.validation
        if (validation?.type === 'navigation' && validation.path === newPath) {
          completeStep()
        }
      }, { immediate: true }) // Check immediately in case navigation already happened
    },
  )

  // Poll for element visibility changes only when needed
  useToggleScope(
    () => isActive.value && (validationType.value === 'element-visible' || validationType.value === 'element-hidden'),
    () => {
      const checkInterval = setInterval(() => {
        if (suppressAutoAdvance.value) return
        if (checkCurrentStepValidation()) {
          completeStep()
        }
      }, 200)

      // Return cleanup via onScopeDispose (handled by useToggleScope)
      return () => clearInterval(checkInterval)
    },
  )

  // Keyboard shortcuts - only active during tour
  useToggleScope(
    () => isActive.value,
    () => {
      useHotkey('Escape', () => stopTour())
    },
  )

  // Handle tooltip actions
  function handleComplete () {
    completeStep()
  }

  function handleSkip () {
    nextStep()
  }

  function handlePrev () {
    // Suppress auto-advance to prevent immediately jumping forward
    // when going back to a step whose condition is already met.
    // Use a longer timeout to give user time to review the step.
    suppressAutoAdvance.value = true
    prevStep()
    setTimeout(() => {
      suppressAutoAdvance.value = false
    }, 5000)
  }

  function handleExit () {
    stopTour()
    router.push('/skillz')
  }

  // Track when step is ready (setup complete, target available)
  const stepReady = shallowRef(true)

  // Execute setup action for a step (e.g., click to open dialog)
  async function executeSetup (): Promise<boolean> {
    const setup = currentStep.value?.setup
    if (!setup) return true // No setup needed

    const el = document.querySelector(setup.selector) as HTMLElement | null
    if (!el) return false

    switch (setup.type) {
      case 'click':
        el.click()
        break
      case 'focus':
        el.focus()
        break
      case 'scroll':
        el.scrollIntoView({ behavior: 'smooth', block: 'center' })
        break
    }

    // Wait for DOM to update after setup action
    await new Promise(resolve => setTimeout(resolve, 350))
    return true
  }

  // Check if the target element exists
  function checkTargetExists (): boolean {
    const selector = currentStep.value?.highlight?.selector
    if (!selector) return true
    return document.querySelector(selector) !== null
  }

  // Prepare step when it changes - run setup proactively
  watch([currentStepIndex, isOnCorrectRoute], async ([, onRoute]) => {
    if (!isActive.value || !onRoute) return

    stepReady.value = false

    // Small delay for route transition to complete
    await new Promise(resolve => setTimeout(resolve, 50))

    // Run setup if step has one
    if (currentStep.value?.setup) {
      await executeSetup()
    }

    // Verify target exists (with retries for animation)
    let attempts = 0
    while (!checkTargetExists() && attempts < 5) {
      await new Promise(resolve => setTimeout(resolve, 100))
      attempts++
    }

    stepReady.value = true
  }, { immediate: true })

  // Show tooltip only when step is ready
  const showTooltip = computed(() => isActive.value && isOnCorrectRoute.value && stepReady.value)

  // Show "target not found" when step setup failed (ready but target still missing)
  const showTargetMissing = computed(() => {
    if (!isActive.value || !isOnCorrectRoute.value || !stepReady.value) return false
    return !checkTargetExists()
  })
</script>

<template>
  <!--
    POC: Using Tour headless components with custom Skillz overlay.
    The Tour.Root manages core tour state, while we layer on
    Skillz-specific validation, progress tracking, and styling.
  -->
  <Tour.Root
    v-if="isActive"
    :steps="tourSteps"
    auto-start
    :start-index="currentStepIndex"
  >
    <!-- Highlight with custom styling (only when step is ready) -->
    <Tour.Highlight v-if="isOnCorrectRoute && stepReady" :padding="0" :opacity="0.75" />

    <!-- Custom tooltip with Skillz branding and validation-aware actions -->
    <Tour.Tooltip v-if="showTooltip" #default="{ step, progress }">
      <div class="bg-surface border border-divider rounded-xl p-4 min-w-70 max-w-90 shadow-2xl">
        <div class="flex justify-between items-center mb-3">
          <span class="text-2xs font-bold uppercase tracking-wide px-2 py-1 bg-primary text-on-primary rounded">
            Skillz
          </span>
          <span class="text-xs font-medium text-on-surface-variant">
            {{ progress.current }} / {{ progress.total }}
          </span>
        </div>

        <h4 class="m-0 mb-2 text-lg font-semibold text-on-surface">
          {{ currentStep?.title }}
        </h4>
        <p class="m-0 mb-3 text-sm leading-relaxed text-on-surface-variant">
          {{ currentStep?.task }}
        </p>

        <!-- Step-specific hint -->
        <p
          v-if="currentStep?.hint"
          class="m-0 mb-4 px-3 py-2 text-xs italic bg-surface-variant text-on-surface-variant rounded-md"
        >
          {{ currentStep.hint }}
        </p>

        <div class="flex flex-wrap gap-2">
          <button
            v-if="!isFirstStep"
            class="px-3.5 py-2 text-sm font-medium bg-surface-variant text-on-surface rounded-md hover:bg-divider transition-colors"
            type="button"
            @click="handlePrev"
          >
            Back
          </button>

          <button
            v-if="currentStep?.validation.type === 'manual'"
            class="px-3.5 py-2 text-sm font-medium bg-primary text-on-primary rounded-md hover:brightness-110 transition-all"
            type="button"
            @click="handleComplete"
          >
            {{ isLastStep ? 'Finish' : 'Done' }}
          </button>

          <button
            class="px-3.5 py-2 text-sm font-medium bg-transparent text-on-surface-variant rounded-md hover:bg-surface-variant transition-colors"
            type="button"
            @click="handleSkip"
          >
            {{ isLastStep ? 'Skip & Finish' : 'Skip' }}
          </button>

          <button
            class="ml-auto px-3.5 py-2 text-sm font-medium bg-transparent text-error rounded-md hover:bg-error/10 transition-colors"
            type="button"
            @click="handleExit"
          >
            Exit
          </button>
        </div>
      </div>
    </Tour.Tooltip>
  </Tour.Root>

  <!-- Wrong route indicator (Skillz-specific) -->
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="isActive && !isOnCorrectRoute" class="fixed bottom-6 right-6 z-9999">
        <div class="flex flex-col gap-3 px-4 py-3 bg-surface border border-divider rounded-lg shadow-lg max-w-80">
          <p class="m-0 text-sm text-on-surface">
            You've navigated away from the current step.
          </p>
          <div class="flex gap-2">
            <button
              class="px-3 py-1.5 text-sm font-medium bg-primary text-on-primary rounded-md whitespace-nowrap"
              @click="router.push(currentStep?.route ?? '/skillz')"
            >
              Return to step
            </button>
            <button
              class="px-3 py-1.5 text-sm font-medium bg-transparent text-error rounded-md whitespace-nowrap hover:bg-error/10 transition-colors"
              @click="handleExit"
            >
              Exit tour
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>

  <!-- Target element not found indicator (e.g., dialog closed after refresh) -->
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="showTargetMissing" class="fixed bottom-6 right-6 z-9999">
        <div class="flex flex-col gap-3 px-4 py-3 bg-surface border border-divider rounded-lg shadow-lg max-w-80">
          <p class="m-0 text-sm text-on-surface">
            This step requires a previous action. Try going back or completing the prior step.
          </p>
          <div class="flex gap-2">
            <button
              v-if="!isFirstStep"
              class="px-3 py-1.5 text-sm font-medium bg-primary text-on-primary rounded-md whitespace-nowrap"
              @click="handlePrev"
            >
              Go back
            </button>
            <button
              class="px-3 py-1.5 text-sm font-medium bg-transparent text-error rounded-md whitespace-nowrap hover:bg-error/10 transition-colors"
              @click="handleExit"
            >
              Exit tour
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* Transition only - can't be done with utility classes */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
