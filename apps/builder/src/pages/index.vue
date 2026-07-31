<script setup lang="ts">
  import { mdiArrowRight } from '@mdi/js'

  // Framework
  import { Button } from '@vuetify/v0'

  import { COMPONENTS } from '@/data/components'
  import { PLUGINS } from '@/data/plugins'

  // Utilities
  import { toRef } from 'vue'
  import { useRouter } from 'vue-router'

  const router = useRouter()

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
            <Button.Content>Start configuring</Button.Content>

            <Button.Icon>
              <svg class="w-4 h-4" viewBox="0 0 24 24">
                <path :d="mdiArrowRight" fill="currentColor" />
              </svg>
            </Button.Icon>
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
