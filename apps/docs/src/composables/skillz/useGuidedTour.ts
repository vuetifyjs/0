// Framework
import { useStorage } from '@vuetify/v0'

// Composables
import { useSkillProgress } from './useSkillProgress'

// Utilities
import { computed, readonly, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

// Types
import type { GuidedSkill, GuidedStep, GuidedTourState, GuidedValidation } from '@/types/skill'

// Data
import { getSkill } from '@/data/skillz'

const STORAGE_KEY = 'skillz-guided-tour'

// Singleton state for active tour
const activeTour = ref<GuidedTourState | null>(null)
const isInitialized = ref(false)

export function useGuidedTour () {
  const router = useRouter()
  const storage = useStorage()
  const { markStepComplete, markSkillComplete, isStepComplete } = useSkillProgress()

  // Initialize from storage on first use
  if (!isInitialized.value) {
    const stored = storage.get<GuidedTourState | null>(STORAGE_KEY, null)
    activeTour.value = stored.value
    isInitialized.value = true

    // Sync to storage when tour changes
    watch(activeTour, newTour => {
      stored.value = newTour
    }, { deep: true })
  }

  // Get current skill data
  const currentSkill = computed(() => {
    if (!activeTour.value) return null
    const skill = getSkill(activeTour.value.skillId)
    if (!skill || skill.mode !== 'guided') return null
    return skill as GuidedSkill
  })

  // Get current step
  const currentStep = computed((): GuidedStep | null => {
    if (!currentSkill.value || !activeTour.value) return null
    return currentSkill.value.steps[activeTour.value.currentStepIndex] ?? null
  })

  // Current step index
  const currentStepIndex = computed(() => activeTour.value?.currentStepIndex ?? 0)

  // Total steps
  const totalSteps = computed(() => currentSkill.value?.steps.length ?? 0)

  // Is last step
  const isLastStep = computed(() => currentStepIndex.value === totalSteps.value - 1)

  // Is first step
  const isFirstStep = computed(() => currentStepIndex.value === 0)

  // Is tour active
  const isActive = computed(() => activeTour.value !== null)

  // Check if on correct route for current step
  // For navigation validation, also accept being at the navigation target
  const isOnCorrectRoute = computed(() => {
    if (!currentStep.value) return false
    const currentPath = router.currentRoute.value.path

    // On the step's designated route
    if (currentPath === currentStep.value.route) return true

    // For navigation validation, also accept being at the target
    // (user successfully navigated but step hasn't auto-completed yet)
    const validation = currentStep.value.validation
    if (validation.type === 'navigation' && currentPath === validation.path) {
      return true
    }

    return false
  })

  // Start a guided tour
  function startTour (skillId: string) {
    const skill = getSkill(skillId)
    if (!skill || skill.mode !== 'guided') {
      console.warn(`Cannot start tour: skill "${skillId}" not found or not a guided skill`)
      return false
    }

    activeTour.value = {
      skillId,
      currentStepIndex: 0,
      startedAt: new Date().toISOString(),
    }

    // Navigate to start route
    router.push(skill.startRoute)
    return true
  }

  // Stop the tour
  function stopTour () {
    activeTour.value = null
  }

  // Go to next step
  function nextStep () {
    if (!activeTour.value || !currentSkill.value) return

    const nextIndex = activeTour.value.currentStepIndex + 1
    if (nextIndex >= currentSkill.value.steps.length) {
      // Tour complete
      markSkillComplete(activeTour.value.skillId)
      stopTour()
      router.push('/skillz')
      return
    }

    activeTour.value.currentStepIndex = nextIndex

    // Navigate to step route if different
    const nextStepData = currentSkill.value.steps[nextIndex]
    if (nextStepData.route !== router.currentRoute.value.path) {
      router.push(nextStepData.route)
    }
  }

  // Go to previous step
  function prevStep () {
    if (!activeTour.value || activeTour.value.currentStepIndex === 0) return

    activeTour.value.currentStepIndex--

    // Navigate to step route if different
    const prevStepData = currentSkill.value?.steps[activeTour.value.currentStepIndex]
    if (prevStepData && prevStepData.route !== router.currentRoute.value.path) {
      router.push(prevStepData.route)
    }
  }

  // Complete current step and advance
  function completeStep () {
    if (!activeTour.value) return
    markStepComplete(activeTour.value.skillId, activeTour.value.currentStepIndex)
    nextStep()
  }

  // Check if current step is complete
  const isCurrentStepComplete = computed(() => {
    if (!activeTour.value) return false
    return isStepComplete(activeTour.value.skillId, activeTour.value.currentStepIndex)
  })

  // Validate current step based on validation type
  function validateStep (validation: GuidedValidation): boolean {
    switch (validation.type) {
      case 'click': {
        const el = document.querySelector(validation.selector)
        return el !== null // Will be checked via event listener
      }
      case 'hover': {
        const el = document.querySelector(validation.selector)
        return el !== null
      }
      case 'input': {
        const el = document.querySelector(validation.selector) as HTMLInputElement | null
        if (!el) return false
        if (validation.match) {
          return el.value.toLowerCase().includes(validation.match.toLowerCase())
        }
        return el.value.length > 0
      }
      case 'navigation': {
        return router.currentRoute.value.path === validation.path
      }
      case 'element-visible': {
        const el = document.querySelector(validation.selector)
        return el !== null && getComputedStyle(el).display !== 'none'
      }
      case 'element-hidden': {
        const el = document.querySelector(validation.selector)
        return el === null || getComputedStyle(el).display === 'none'
      }
      case 'manual': {
        return true // Always valid, requires user to click "Done"
      }
      default: {
        return false
      }
    }
  }

  // Check validation for current step
  function checkCurrentStepValidation (): boolean {
    if (!currentStep.value) return false
    return validateStep(currentStep.value.validation)
  }

  // Navigate to current step's route
  function goToStepRoute () {
    if (!currentStep.value) return
    if (router.currentRoute.value.path !== currentStep.value.route) {
      router.push(currentStep.value.route)
    }
  }

  return {
    // State
    activeTour: readonly(activeTour),
    currentSkill,
    currentStep,
    currentStepIndex,
    totalSteps,
    isActive,
    isLastStep,
    isFirstStep,
    isOnCorrectRoute,
    isCurrentStepComplete,

    // Actions
    startTour,
    stopTour,
    nextStep,
    prevStep,
    completeStep,
    validateStep,
    checkCurrentStepValidation,
    goToStepRoute,
  }
}
