// Framework
import { createStep, useTheme } from '@vuetify/v0'

// Composables
import { useEditorStore } from '@/composables/useEditorStore'
import { useMarkdown } from '@/composables/useMarkdown'

// Utilities
import { computed, onMounted, shallowRef, watch } from 'vue'

// Types
import type { ReplStore } from '@vue/repl'
import type { ComputedRef, ShallowRef } from 'vue'

import { createMainTs, UNO_CONFIG_TS } from '@/data/editor-defaults'
// Tutorials
import { getTutorial } from '@/tutorials'

export interface UseTutorialReturn {
  store: ReplStore
  isDark: ComputedRef<boolean>
  replTheme: ComputedRef<'dark' | 'light'>
  previewOptions: ComputedRef<{ headHTML: string }>
  markdown: ShallowRef<string>
  html: ShallowRef<string>
  stepLabel: ComputedRef<string>
  totalSteps: ComputedRef<number>
  currentStep: ComputedRef<number>
  isFirst: ComputedRef<boolean>
  isLast: ComputedRef<boolean>
  isReady: ShallowRef<boolean>
  fileTreeKey: ShallowRef<number>
  nextStep: () => void
  prevStep: () => void
}

export function useTutorial (tutorialId: ComputedRef<string>): UseTutorialReturn {
  const theme = useTheme()
  const isDark = computed(() => theme.isDark.value)

  const { store, replTheme, previewOptions } = useEditorStore(isDark)

  const markdown = shallowRef('')
  const { html } = useMarkdown(markdown)
  const isReady = shallowRef(false)
  const fileTreeKey = shallowRef(0)

  const stepper = createStep()
  const totalSteps = computed(() => stepper.size)
  const currentStep = computed(() => (stepper.selectedIndex.value ?? 0) + 1)
  const stepLabel = computed(() => `Step ${currentStep.value} of ${totalSteps.value}`)
  const isFirst = computed(() => stepper.selectedIndex.value === 0)
  const isLast = computed(() => stepper.selectedIndex.value === stepper.size - 1)

  function nextStep () {
    stepper.next()
  }

  function prevStep () {
    stepper.prev()
  }

  async function loadStep (stepIndex: number) {
    const tutorial = getTutorial(tutorialId.value)
    if (!tutorial || !tutorial.steps[stepIndex]) return

    const step = tutorial.steps[stepIndex]

    // Load markdown
    markdown.value = await step.markdown()

    // Load code files
    const files: Record<string, string> = {}
    for (const [path, loader] of Object.entries(step.files)) {
      files[path] = await loader()
    }

    const currentTheme = isDark.value ? 'dark' : 'light'
    await store.setFiles(
      {
        'src/main.ts': createMainTs(currentTheme),
        'src/uno.config.ts': UNO_CONFIG_TS,
        ...files,
      },
      'src/main.ts',
    )
    store.files['src/main.ts']!.hidden = true
    store.files['src/uno.config.ts']!.hidden = true

    const firstFile = Object.keys(files)[0] ?? 'src/App.vue'
    store.setActive(firstFile)
    fileTreeKey.value++
  }

  // React to step changes
  watch(() => stepper.selectedIndex.value, async index => {
    if (index != null) {
      await loadStep(index)
    }
  })

  onMounted(async () => {
    const tutorial = getTutorial(tutorialId.value)
    if (!tutorial || tutorial.steps.length === 0) return

    // Register steps
    stepper.onboard(
      tutorial.steps.map((_, i) => ({ id: `step-${i + 1}`, value: i })),
    )
    stepper.first()

    // Load first step
    await loadStep(0)
    isReady.value = true
  })

  return {
    store,
    isDark,
    replTheme,
    previewOptions,
    markdown,
    html,
    stepLabel,
    totalSteps,
    currentStep,
    isFirst,
    isLast,
    isReady,
    fileTreeKey,
    nextStep,
    prevStep,
  }
}
