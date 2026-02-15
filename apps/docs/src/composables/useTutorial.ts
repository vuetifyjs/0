// Framework
import { createStep, useTheme } from '@vuetify/v0'

// Composables
import { useEditorStore } from '@/composables/useEditorStore'
import { useMarkdown } from '@/composables/useMarkdown'

// Utilities
import { compileFile } from '@vue/repl'
import { computed, onMounted, shallowRef, watch } from 'vue'

// Types
import type { StepOptions, TutorialMeta } from '@/skillz/tutorials'
import type { ReplStore } from '@vue/repl'
import type { ComputedRef, ShallowRef } from 'vue'

import { createMainTs, UNO_CONFIG_TS } from '@/data/editor-defaults'
// Tutorials
import { getTutorial, parseStepOptions } from '@/skillz/tutorials'

export interface UseTutorialReturn {
  store: ReplStore
  isDark: ComputedRef<boolean>
  replTheme: ComputedRef<'dark' | 'light'>
  previewOptions: ComputedRef<{ headHTML: string }>
  meta: ComputedRef<TutorialMeta | undefined>
  markdown: ShallowRef<string>
  html: ShallowRef<string>
  stepLabel: ComputedRef<string>
  totalSteps: ComputedRef<number>
  currentStep: ComputedRef<number>
  isFirst: ComputedRef<boolean>
  isLast: ComputedRef<boolean>
  isReady: ShallowRef<boolean>
  fileTreeKey: ShallowRef<number>
  stepOptions: ShallowRef<StepOptions>
  nextStep: () => void
  prevStep: () => void
}

export function useTutorial (tutorialId: ComputedRef<string>): UseTutorialReturn {
  const theme = useTheme()
  const isDark = computed(() => theme.isDark.value)

  const { store, replTheme, previewOptions } = useEditorStore(isDark)

  const meta = computed(() => getTutorial(tutorialId.value)?.meta)
  const markdown = shallowRef('')
  const { html } = useMarkdown(markdown)
  const isReady = shallowRef(false)
  const fileTreeKey = shallowRef(0)
  const stepOptions = shallowRef<StepOptions>({})

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

  // ── Step preloading ──────────────────────────────────────────────────
  const stepCache = new Map<number, { md: string, files: Record<string, string>, options: StepOptions }>()

  async function preloadSteps () {
    const tutorial = getTutorial(tutorialId.value)
    if (!tutorial) return

    await Promise.all(tutorial.steps.map(async (step, i) => {
      if (stepCache.has(i)) return
      const fileEntries = Object.entries(step.files)
      const [rawMd, ...fileContents] = await Promise.all([
        step.markdown(),
        ...fileEntries.map(([, loader]) => loader()),
      ])
      const { body, options } = parseStepOptions(rawMd)
      const files: Record<string, string> = {}
      for (const [j, fileEntry] of fileEntries.entries()) {
        files[fileEntry[0]] = fileContents[j]
      }
      stepCache.set(i, { md: body, files, options })
    }))
  }

  async function resolveStep (stepIndex: number): Promise<{ md: string, files: Record<string, string>, options: StepOptions } | undefined> {
    const cached = stepCache.get(stepIndex)
    if (cached) return cached

    const tutorial = getTutorial(tutorialId.value)
    if (!tutorial || !tutorial.steps[stepIndex]) return

    const step = tutorial.steps[stepIndex]
    const fileEntries = Object.entries(step.files)
    const [rawMd, ...fileContents] = await Promise.all([
      step.markdown(),
      ...fileEntries.map(([, loader]) => loader()),
    ])
    const { body, options } = parseStepOptions(rawMd)
    const files: Record<string, string> = {}
    for (const [i, fileEntry] of fileEntries.entries()) {
      files[fileEntry[0]] = fileContents[i]
    }
    const result = { md: body, files, options }
    stepCache.set(stepIndex, result)
    return result
  }

  // ── Step loading ─────────────────────────────────────────────────────
  async function loadStep (stepIndex: number) {
    const data = await resolveStep(stepIndex)
    if (!data) return

    // Update markdown and options immediately
    markdown.value = data.md
    stepOptions.value = data.options

    const currentTheme = isDark.value ? 'dark' : 'light'
    await store.setFiles(
      {
        'src/main.ts': createMainTs(currentTheme),
        'src/uno.config.ts': UNO_CONFIG_TS,
        ...data.files,
      },
      'src/main.ts',
    )
    store.files['src/main.ts']!.hidden = true
    store.files['src/uno.config.ts']!.hidden = true

    const firstFile = Object.keys(data.files)[0] ?? 'src/App.vue'
    store.setActive(firstFile)
    fileTreeKey.value++
  }

  // React to step changes
  watch(() => stepper.selectedIndex.value, async index => {
    if (index != null) {
      await loadStep(index)
    }
  })

  // Sync theme into the preview's main.ts when toggled
  watch(isDark, async () => {
    if (!isReady.value) return
    const file = store.files['src/main.ts']
    if (!file) return
    file.code = createMainTs(isDark.value ? 'dark' : 'light')
    await compileFile(store, file)
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

    // Preload remaining steps in background
    preloadSteps()
  })

  return {
    store,
    isDark,
    replTheme,
    previewOptions,
    meta,
    markdown,
    html,
    stepLabel,
    totalSteps,
    currentStep,
    isFirst,
    isLast,
    isReady,
    fileTreeKey,
    stepOptions,
    nextStep,
    prevStep,
  }
}
