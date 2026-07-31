<script setup lang="ts">
  import { mdiArrowRight, mdiTrashCanOutline } from '@mdi/js'

  // Framework
  import { AlertDialog, Button } from '@vuetify/v0'

  import { COMPONENTS } from '@/data/components'
  import { PLUGINS } from '@/data/plugins'

  // Stores
  import { useBuilderStore } from '@/stores/builder'

  // Utilities
  import { shallowRef, toRef } from 'vue'
  import { useRouter } from 'vue-router'

  // Types
  import type { BuildSummary } from '@/stores/persistence'

  const router = useRouter()
  const store = useBuilderStore()

  const relative = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' })

  const UNITS: Array<[Intl.RelativeTimeFormatUnit, number]> = [
    ['day', 86_400_000],
    ['hour', 3_600_000],
    ['minute', 60_000],
  ]

  function updated (at: number): string {
    const delta = at - Date.now()

    for (const [unit, ms] of UNITS) {
      const value = Math.round(delta / ms)
      if (value !== 0) return relative.format(value, unit)
    }

    return 'just now'
  }

  function plural (count: number, noun: string): string {
    return `${count} ${count === 1 ? noun : `${noun}s`}`
  }

  async function onResume (entry: BuildSummary) {
    await store.switchTo(entry.id)
    router.push('/builder')
  }

  // Deleting a build throws away its whole configuration with no undo, so it asks first.
  const doomed = shallowRef<BuildSummary | null>(null)
  const confirming = shallowRef(false)

  // The title reads off this rather than off `doomed`, which is dropped the moment the
  // choice is made. The dialog element stays mounted while it closes, so a title bound to
  // the vanished entry renders "Delete ?" — and a build that no longer exists cannot
  // supply its own name.
  const name = shallowRef('')

  function onDelete (entry: BuildSummary) {
    doomed.value = entry
    name.value = entry.name
    confirming.value = true
  }

  // Closed before the delete is awaited, not after. The dialog has served its purpose the
  // instant the choice is made, and holding it open across the write leaves the user in a
  // modal describing a build that is already gone — or, if the write hangs, in one with no
  // way forward. A genuine failure surfaces through saveError in the shell instead.
  async function onConfirmDelete () {
    const target = doomed.value
    if (!target) return

    confirming.value = false
    doomed.value = null

    await store.removeBuild(target.id)
  }

  async function onNew () {
    await store.createBuild()
    router.push('/builder')
  }

  // Read off the catalogue rather than hardcoded, so the pitch can't drift from the app.
  const plugins = toRef(() => PLUGINS.length)
  const components = toRef(() => COMPONENTS.filter(c => c.selectable).length)

  const steps = [
    {
      index: '01',
      title: 'Pick your parts',
      body: 'Start from the plugins that install at app startup, then add the headless components you want. Nothing you skip ends up in the output.',
    },
    {
      index: '02',
      title: 'Configure against a preview',
      body: 'Every plugin gets its own screen with a working preview beside it. Change a token or a breakpoint and watch the result before you commit to it.',
    },
    {
      index: '03',
      title: 'Take the code',
      body: 'Download a starter wired to exactly your selection, or open it in the playground. It is yours — no build step to eject from later.',
    },
  ]

  function onStart () {
    router.push('/builder')
  }
</script>

<template>
  <div class="max-w-6xl mx-auto px-6 sm:px-8">
    <section class="grid lg:grid-cols-[1.05fr_1fr] gap-10 lg:gap-16 items-center pt-14 pb-16 sm:pt-20 sm:pb-20">
      <div>
        <p class="t-eyebrow text-primary mb-6">Vuetify0 · Framework Builder</p>

        <h1 class="t-display mb-6 max-w-[13ch]">
          Assemble the framework your app needs.
        </h1>

        <p class="t-body text-on-surface-variant max-w-xl mb-9">
          Choose the plugins and headless components you want, configure each one against a
          live preview, and download a starter that contains exactly those — and nothing else.
        </p>

        <div class="flex flex-wrap items-center gap-4">
          <Button.Root class="btn-primary h-12 px-6" @click="onStart">
            <Button.Content>{{ store.builds.length > 0 ? 'Resume building' : 'Start configuring' }}</Button.Content>

            <Button.Icon>
              <svg class="w-4 h-4" viewBox="0 0 24 24">
                <path :d="mdiArrowRight" fill="currentColor" />
              </svg>
            </Button.Icon>
          </Button.Root>

          <Button.Root v-if="store.builds.length > 0" class="btn-outline h-12 px-5" @click="onNew">
            <Button.Content>Start a new build</Button.Content>
          </Button.Root>

          <p class="t-index text-on-surface-variant">
            {{ plugins }} plugins · {{ components }} components · 0 dependencies
          </p>
        </div>
      </div>

      <!-- The artifact, not an illustration of one: this is the shape of the src/main.ts
           the builder writes for you. -->
      <div class="panel overflow-hidden">
        <div class="flex items-center justify-between gap-3 h-11 px-4 border-b border-divider bg-surface-variant/60">
          <span class="font-mono text-[0.75rem] text-on-surface-variant">src/main.ts</span>
          <span class="chip-on">generated</span>
        </div>

        <pre class="p-5 overflow-x-auto font-mono text-[0.78rem] leading-[1.85] text-on-surface"><span class="text-on-surface-variant">import</span> { createApp } <span class="text-on-surface-variant">from</span> <span class="text-primary">'vue'</span>
<span class="text-on-surface-variant">import</span> {
  createThemePlugin,
  createBreakpointsPlugin,
  createStoragePlugin,
} <span class="text-on-surface-variant">from</span> <span class="text-primary">'@vuetify/v0'</span>

<span class="text-on-surface-variant">const</span> app = createApp(App)

app.use(<span class="text-primary">createThemePlugin</span>({ <span class="text-on-surface-variant">default</span>: <span class="text-primary">'dark'</span> }))
app.use(<span class="text-primary">createBreakpointsPlugin</span>())
app.use(<span class="text-primary">createStoragePlugin</span>())

app.mount(<span class="text-primary">'#app'</span>)</pre>
      </div>
    </section>

    <section v-if="store.builds.length > 0" class="border-t border-divider py-12 sm:py-14">
      <div class="flex items-baseline gap-3 mb-5">
        <h2 class="t-eyebrow text-on-surface">Your builds</h2>
        <p class="t-meta text-on-surface-variant">Saved as you go — pick one up where you left it</p>
      </div>

      <ul class="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <li v-for="entry in store.builds" :key="entry.id" class="relative">
          <Button.Root
            :aria-label="`Resume ${entry.name}, ${plural(entry.plugins, 'plugin')}, ${plural(entry.components, 'component')}, updated ${updated(entry.updated)}`"
            class="pick pick-off w-full h-full p-4 pr-11 block"
            @click="onResume(entry)"
          >
            <Button.Content>
              <span class="flex items-center gap-2 mb-2.5">
                <span class="font-mono text-[0.8125rem] font-semibold truncate">{{ entry.name }}</span>
                <span v-if="entry.id === store.activeId" class="chip-on flex-shrink-0">active</span>
              </span>

              <span class="block t-index text-on-surface-variant">
                {{ plural(entry.plugins, 'plugin') }} · {{ plural(entry.components, 'component') }}
              </span>

              <span class="block t-meta text-on-surface-variant/80 mt-1">
                Updated {{ updated(entry.updated) }}
              </span>
            </Button.Content>
          </Button.Root>

          <!-- Outside the card button: a button inside a button is invalid, and nesting
               would make the whole card announce as the delete action. -->
          <Button.Root
            :aria-label="`Delete ${entry.name}`"
            class="absolute top-2.5 right-2.5 h-8 w-8 p-0 rounded-md inline-flex items-center justify-center text-on-surface-variant hover:bg-surface-variant hover:text-error transition-colors duration-150"
            @click="onDelete(entry)"
          >
            <Button.Icon>
              <svg class="w-4 h-4" viewBox="0 0 24 24"><path :d="mdiTrashCanOutline" fill="currentColor" /></svg>
            </Button.Icon>
          </Button.Root>
        </li>
      </ul>

      <AlertDialog.Root v-model="confirming">
        <!-- AlertDialogContent defaults closeOnEscape to false so an alert demands an
             explicit choice. Opted in here because the safe outcome (keep the build) is
             what dismissing gives you — a confirm this small shouldn't trap focus. -->
        <AlertDialog.Content
          class="m-auto p-6 w-[min(26rem,calc(100vw-2rem))] rounded-xl border border-divider bg-surface shadow-2xl backdrop:bg-black/50"
          close-on-escape
        >
          <AlertDialog.Title class="t-section mb-2">
            Delete {{ name || 'this build' }}?
          </AlertDialog.Title>

          <AlertDialog.Description class="t-meta text-on-surface-variant mb-6">
            This build's plugins, configuration and component selection are removed. This
            cannot be undone.
          </AlertDialog.Description>

          <div class="flex items-center justify-end gap-2">
            <AlertDialog.Cancel class="btn-ghost h-9 px-4">
              Keep it
            </AlertDialog.Cancel>

            <AlertDialog.Action
              class="btn h-9 px-4 bg-error text-on-primary hover:opacity-90"
              @action="onConfirmDelete"
            >
              Delete build
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Root>
    </section>

    <!-- A real sequence, so it is numbered like one. -->
    <section class="border-t border-divider pb-20 sm:pb-24">
      <ol class="grid md:grid-cols-3 gap-px bg-divider">
        <li
          v-for="step in steps"
          :key="step.index"
          class="bg-background pt-8 pb-2 md:pt-10 md:px-7 first:md:pl-0 last:md:pr-0"
        >
          <p class="font-mono text-[0.8125rem] tabular-nums font-semibold text-primary mb-5">
            {{ step.index }}
          </p>

          <h2 class="t-section mb-2">{{ step.title }}</h2>

          <p class="t-meta text-on-surface-variant max-w-sm">{{ step.body }}</p>
        </li>
      </ol>
    </section>
  </div>
</template>
