<script setup lang="ts">
  // Framework
  import { useEventListener, useHotkey, useToggleScope } from '@vuetify/v0'

  // Components
  import GuidedHighlight from './GuidedHighlight.vue'
  import GuidedTooltip from './GuidedTooltip.vue'

  // Composables
  import { useGuidedTour } from '@/composables/skillz/useGuidedTour'

  // Utilities
  import { computed, shallowRef, watch } from 'vue'
  import { useRouter } from 'vue-router'

  const router = useRouter()

  const {
    isActive,
    currentStep,
    currentStepIndex,
    totalSteps,
    completeStep,
    nextStep,
    prevStep,
    stopTour,
    checkCurrentStepValidation,
    isOnCorrectRoute,
  } = useGuidedTour()

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
      useHotkey('escape', () => stopTour())
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
    // when going back to a step whose condition is already met
    suppressAutoAdvance.value = true
    prevStep()
    setTimeout(() => {
      suppressAutoAdvance.value = false
    }, 500)
  }

  function handleExit () {
    stopTour()
    router.push('/skillz')
  }
</script>

<template>
  <GuidedHighlight
    :active="isActive && isOnCorrectRoute"
    :highlight="currentStep?.highlight"
  />

  <GuidedTooltip
    :active="isActive && isOnCorrectRoute"
    :step="currentStep"
    :step-index="currentStepIndex"
    :total-steps="totalSteps"
    @complete="handleComplete"
    @exit="handleExit"
    @prev="handlePrev"
    @skip="handleSkip"
  />

  <!-- Wrong route indicator -->
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="isActive && !isOnCorrectRoute" class="guided-wrong-route">
        <div class="guided-wrong-route__content">
          <p>This step takes place on a different page.</p>
          <button @click="router.push(currentStep?.route ?? '/skillz')">
            Go to step page
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.guided-wrong-route {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 9999;
}

.guided-wrong-route__content {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: var(--v0-surface);
  border: 1px solid var(--v0-warning);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.guided-wrong-route__content p {
  margin: 0;
  font-size: 0.875rem;
  color: var(--v0-on-surface);
}

.guided-wrong-route__content button {
  padding: 6px 12px;
  font-size: 0.8125rem;
  font-weight: 500;
  background: var(--v0-primary);
  color: var(--v0-on-primary);
  border: none;
  border-radius: 6px;
  cursor: pointer;
  white-space: nowrap;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
