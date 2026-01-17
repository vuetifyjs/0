<script setup lang="ts">
  // Framework
  import { createStep, useHotkey } from '@vuetify/v0'

  // Components
  import SkillHint from './SkillHint.vue'
  import SkillNav from './SkillNav.vue'
  import SkillPlayground from './SkillPlayground.vue'
  import SkillProgress from './SkillProgress.vue'

  // Composables
  import { useSkillProgress } from '@/composables/skillz/useSkillProgress'
  import { useSkillValidation } from '@/composables/skillz/useSkillValidation'

  // Utilities
  import { computed, ref, watch } from 'vue'

  // Types
  import type { SkillMeta } from '@/types/skill'

  import { SKILL_LEVEL_META } from '@/types/skill'

  const props = defineProps<{
    skill: SkillMeta
  }>()

  const emit = defineEmits<{
    complete: []
  }>()

  const { getSkillProgress, markStepComplete, markSkillComplete, isStepComplete } = useSkillProgress()

  // Create step navigation using v0's createStep
  const stepper = createStep({
    mandatory: 'force', // Always have a step selected
  })

  // Register all steps from the skill
  for (const [index, step] of props.skill.steps.entries()) {
    stepper.register({
      id: `step-${index}`,
      value: step,
    })
  }

  // Select first step
  stepper.first()

  // Current step data from stepper
  const currentStepIndex = computed(() => stepper.selectedIndex.value ?? 0)
  const currentStepData = computed(() => props.skill.steps[currentStepIndex.value])
  const isLastStep = computed(() => currentStepIndex.value === props.skill.steps.length - 1)

  // Code state
  const code = ref(currentStepData.value.startCode)
  const playgroundRef = ref<InstanceType<typeof SkillPlayground> | null>(null)

  // Validation
  const { validateStep } = useSkillValidation(code)
  const canProceed = ref(false)
  const isValidating = ref(false)
  const validationMessage = ref<{ type: 'success' | 'error', text: string } | null>(null)

  // Get progress for this skill
  const skillProgress = computed(() => getSkillProgress(props.skill.id))
  const completedSteps = computed(() => skillProgress.value.completedSteps)

  // Level metadata
  const levelMeta = computed(() => SKILL_LEVEL_META[props.skill.level])

  // Update code when step changes
  watch(currentStepIndex, newStep => {
    code.value = props.skill.steps[newStep].startCode
    canProceed.value = isStepComplete(props.skill.id, newStep)
    validationMessage.value = null
  })

  // Handle code updates from playground
  function onCodeUpdate (newCode: string) {
    code.value = newCode
    // Reset validation state when code changes
    if (validationMessage.value?.type === 'error') {
      validationMessage.value = null
    }
  }

  // Navigation handlers using stepper
  function handlePrev () {
    stepper.prev()
  }

  function handleNext () {
    stepper.next()
  }

  function handleCheck () {
    isValidating.value = true

    setTimeout(() => {
      const result = validateStep(currentStepData.value.validate)

      if (result.isValid) {
        markStepComplete(props.skill.id, currentStepIndex.value)
        canProceed.value = true
        validationMessage.value = { type: 'success', text: 'Correct! You can proceed to the next step.' }
      } else {
        validationMessage.value = { type: 'error', text: 'Not quite right. Check the task requirements and try again.' }
      }

      isValidating.value = false
    }, 300)
  }

  function handleComplete () {
    markSkillComplete(props.skill.id)
    emit('complete')
  }

  // Keyboard shortcuts using v0's useHotkey
  useHotkey('left', handlePrev, { inputs: false })
  useHotkey('right', () => {
    if (canProceed.value && !isLastStep.value) {
      handleNext()
    }
  }, { inputs: false })
  useHotkey('enter', () => {
    if (isLastStep.value && canProceed.value) {
      handleComplete()
    } else if (canProceed.value) {
      handleNext()
    } else {
      handleCheck()
    }
  }, { inputs: false })
</script>

<template>
  <div class="skill-tutorial">
    <header class="skill-tutorial__header">
      <div class="skill-tutorial__title">
        <RouterLink class="skill-tutorial__back" to="/skillz">
          ←
        </RouterLink>
        <span
          class="skill-tutorial__level"
          :style="{ '--level-color': levelMeta.color }"
        >
          <AppIcon :icon="levelMeta.icon" :size="14" />
          {{ levelMeta.label }}
        </span>
        <h1>{{ skill.name }}</h1>
      </div>
      <SkillProgress
        :completed-steps="completedSteps"
        :current-step="currentStepIndex"
        :total-steps="skill.steps.length"
      />
    </header>

    <div class="skill-tutorial__content">
      <aside class="skill-tutorial__instructions">
        <div class="skill-tutorial__step-header">
          <h2>{{ currentStepData.title }}</h2>
        </div>

        <div class="skill-tutorial__task">
          <h3>Task</h3>
          <p>{{ currentStepData.task }}</p>
        </div>

        <SkillHint :hint="currentStepData.hint" />

        <Transition name="fade">
          <div
            v-if="validationMessage"
            class="skill-tutorial__message"
            :class="`skill-tutorial__message--${validationMessage.type}`"
          >
            {{ validationMessage.text }}
          </div>
        </Transition>

        <div class="skill-tutorial__shortcuts">
          <span><kbd>←</kbd><kbd>→</kbd> Navigate</span>
          <span><kbd>Enter</kbd> Check / Next</span>
        </div>
      </aside>

      <main class="skill-tutorial__playground">
        <SkillPlayground
          ref="playgroundRef"
          :initial-code="currentStepData.startCode"
          @update:code="onCodeUpdate"
        />
      </main>
    </div>

    <SkillNav
      :can-proceed="canProceed"
      :current-step="currentStepIndex"
      :is-validating="isValidating"
      :total-steps="skill.steps.length"
      @check="handleCheck"
      @complete="handleComplete"
      @next="handleNext"
      @prev="handlePrev"
    />
  </div>
</template>

<style scoped>
.skill-tutorial {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 64px);
  background: var(--v0-background);
}

.skill-tutorial__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--v0-divider);
  background: var(--v0-surface);
}

.skill-tutorial__title {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.skill-tutorial__back {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  color: var(--v0-on-surface);
  text-decoration: none;
  transition: background-color 0.15s;
}

.skill-tutorial__back:hover {
  background: var(--v0-surface-variant);
}

.skill-tutorial__title h1 {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
}

.skill-tutorial__level {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 4px;
  background: color-mix(in srgb, var(--level-color) 15%, transparent);
  color: var(--level-color);
}

.skill-tutorial__content {
  display: grid;
  grid-template-columns: 350px 1fr;
  flex: 1;
  overflow: hidden;
}

.skill-tutorial__instructions {
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  overflow-y: auto;
  border-right: 1px solid var(--v0-divider);
  background: var(--v0-surface);
}

.skill-tutorial__step-header h2 {
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0 0 1rem;
}

.skill-tutorial__task {
  background: var(--v0-surface-variant);
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.skill-tutorial__task h3 {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  color: var(--v0-on-surface-variant);
  margin: 0 0 0.5rem;
}

.skill-tutorial__task p {
  margin: 0;
  line-height: 1.6;
}

.skill-tutorial__message {
  margin-top: 1rem;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
}

.skill-tutorial__message--success {
  background: color-mix(in srgb, var(--v0-success) 15%, transparent);
  color: var(--v0-success);
  border: 1px solid var(--v0-success);
}

.skill-tutorial__message--error {
  background: color-mix(in srgb, var(--v0-error) 15%, transparent);
  color: var(--v0-error);
  border: 1px solid var(--v0-error);
}

.skill-tutorial__shortcuts {
  margin-top: auto;
  padding-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: var(--v0-on-surface-variant);
}

.skill-tutorial__shortcuts kbd {
  display: inline-block;
  padding: 2px 6px;
  font-family: inherit;
  font-size: 0.7rem;
  background: var(--v0-surface-variant);
  border: 1px solid var(--v0-divider);
  border-radius: 4px;
  margin-right: 2px;
}

.skill-tutorial__playground {
  padding: 1rem;
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.skill-tutorial__playground > * {
  flex: 1;
  min-height: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 900px) {
  .skill-tutorial__content {
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr;
  }

  .skill-tutorial__instructions {
    border-right: none;
    border-bottom: 1px solid var(--v0-divider);
    max-height: 40vh;
  }
}
</style>
