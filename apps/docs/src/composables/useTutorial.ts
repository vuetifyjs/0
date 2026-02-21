// Framework
import { createStep, useTheme } from '@vuetify/v0'

// Composables
import { useMarkdown } from '@/composables/useMarkdown'
import { usePlaygroundRepl } from '@/composables/usePlaygroundStore'

// Utilities
import { File as ReplFile, compileFile } from '@vue/repl'
import { computed, onMounted, shallowRef, watch } from 'vue'

// Types
import type { StepOptions, TutorialMeta } from '@/skillz/tutorials'
import type { ReplStore } from '@vue/repl'
import type { ComputedRef, Ref, ShallowRef } from 'vue'

import { createMainTs, UNO_CONFIG_TS } from '@/data/playground-defaults'
// Tutorials
import { getTutorial, parseStepOptions } from '@/skillz/tutorials'
// Stores
import { useSkillzStore } from '@/stores/skillz'

export interface UseTutorialReturn {
  store: ReplStore
  isDark: Readonly<Ref<boolean>>
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
  complete: () => void
}

export function useTutorial (tutorialId: ComputedRef<string>, initialStep?: ComputedRef<number>): UseTutorialReturn {
  const theme = useTheme()
  const isDark = theme.isDark
  const skillz = useSkillzStore()

  const { store, replTheme, previewOptions } = usePlaygroundRepl(isDark)

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

  function complete () {
    skillz.record(tutorialId.value, `step-${currentStep.value}`)
    skillz.finish(tutorialId.value)
  }

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

  // Files the REPL manages internally — never touch between steps or the
  // sandbox watch will fire and recreate the iframe.
  const REPL_PROTECTED = new Set(['import-map.json', 'tsconfig.json'])

  async function loadStep (stepIndex: number) {
    const data = await resolveStep(stepIndex)
    if (!data) return

    // Update markdown and options immediately (sync, before async compile)
    markdown.value = data.md
    stepOptions.value = data.options

    const currentTheme = isDark.value ? 'dark' : 'light'

    // Ensure the sandbox entry point is main.ts, not the default src/App.vue.
    // updatePreview() reads store.mainFile inside its watchEffect, so setting
    // this before files are compiled means the sandbox will always bootstrap
    // from main.ts rather than auto-wrapping App.vue with createApp.
    store.mainFile = 'src/main.ts'

    // Build normalized next file set (ensure src/ prefix)
    const nextFiles: Record<string, string> = {}
    for (const [name, code] of Object.entries({
      'src/main.ts': createMainTs(currentTheme),
      'src/uno.config.ts': UNO_CONFIG_TS,
      ...data.files,
    })) {
      nextFiles[name.startsWith('src/') ? name : `src/${name}`] = code
    }

    // Remove files that belong to the previous step but not this one.
    // Skipping protected REPL files avoids touching the import map, which
    // would trigger the Sandbox watch and recreate the iframe.
    for (const filename of Object.keys(store.files)) {
      if (REPL_PROTECTED.has(filename)) continue
      if (!(filename in nextFiles)) delete store.files[filename]
    }

    // Update existing files in-place or add new ones, compile only what changed.
    // Mutating .code directly avoids replacing the files reactive object, so
    // the Sandbox's getImportMap() watch never fires → no iframe recreation →
    // no volar worker restart.
    //
    // IMPORTANT: always pass store.files[filename] (the reactive Proxy) to
    // compileFile, never the raw ReplFile instance. compileFile destructures
    // { compiled } from the file parameter — when it writes compiled.js through
    // a Proxy, Vue tracks the change and re-triggers updatePreview. A raw write
    // bypasses the Proxy and the preview never updates.
    const compilePromises: Promise<(string | Error)[]>[] = []
    for (const [filename, code] of Object.entries(nextFiles)) {
      const existing = store.files[filename]
      if (existing) {
        if (existing.code !== code) {
          existing.code = code
          compilePromises.push(compileFile(store, existing))
        }
      } else {
        store.files[filename] = new ReplFile(filename, code)
        compilePromises.push(compileFile(store, store.files[filename]!))
      }
    }

    store.files['src/main.ts']!.hidden = true
    store.files['src/uno.config.ts']!.hidden = true

    store.errors = (await Promise.all(compilePromises)).flat()

    const firstFile = Object.keys(data.files)[0] ?? 'src/App.vue'
    store.setActive(firstFile.startsWith('src/') ? firstFile : `src/${firstFile}`)
    fileTreeKey.value++
  }

  // React to step changes
  watch(() => stepper.selectedIndex.value, async (newIndex, oldIndex) => {
    if (newIndex != null) {
      // Record the previous step as completed when advancing forward
      if (oldIndex != null && newIndex > oldIndex) {
        skillz.record(tutorialId.value, `step-${oldIndex + 1}`)
      }
      // Track current position so resume can return here
      skillz.setLastStep(tutorialId.value, `step-${newIndex + 1}`)
      await loadStep(newIndex)
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

    // Begin progress tracking
    skillz.begin(tutorialId.value)

    // Register steps
    stepper.onboard(
      tutorial.steps.map((_, i) => ({ id: `step-${i + 1}`, value: i })),
    )

    // Clamp the requested step to valid range (1-indexed from caller)
    const startIndex = initialStep
      ? Math.min(Math.max(0, initialStep.value - 1), tutorial.steps.length - 1)
      : 0
    stepper.select(`step-${startIndex + 1}`)

    // Load the starting step
    await loadStep(startIndex)
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
    complete,
  }
}
