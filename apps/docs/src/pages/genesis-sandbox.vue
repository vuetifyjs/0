<script setup lang="ts">
  import {
    GnDocsExample,
    GnDocsExampleCode,
    GnDocsExampleDescription,
    GnDocsExamplePreview,
  } from '@paper/genesis'

  // Components
  import DocsGenesisExample from '@/components/docs/DocsGenesisExample.vue'

  // Composables
  import { useHighlightCode } from '@/composables/useHighlightCode'

  // Types
  import type { GnDocsExampleFile } from '@paper/genesis'

  definePage({
    meta: {
      layout: 'default',
      level: 1,
    },
  })

  const shortCode = `<script setup lang="ts">
  import { shallowRef } from 'vue'
  const count = shallowRef(0)
<\/script>

<template>
  <button class="px-4 py-2 rounded bg-primary text-on-primary" @click="count++">
    Clicked {{ count }} times
  </button>
</template>`

  const multiFiles: GnDocsExampleFile[] = [
    {
      name: 'context.ts',
      code: `export const APP_CONTEXT = Symbol('app-context')`,
      language: 'ts',
    },
    {
      name: 'Provider.vue',
      code: `<script setup lang="ts">
  import { provide } from 'vue'
  import { APP_CONTEXT } from './context'
  provide(APP_CONTEXT, { user: 'jane' })
<\/script>

<template>
  <slot />
</template>`,
      language: 'vue',
    },
    {
      name: 'app.vue',
      code: `<script setup lang="ts">
  import Provider from './Provider.vue'
<\/script>

<template>
  <Provider>
    <div>Hello</div>
  </Provider>
</template>`,
      language: 'vue',
    },
  ]

  // Shiki integration via the docs site's existing highlight composable.
  // Wires Shiki HTML into a GnDocsExampleCode slot below.
  const { highlightedCode: shiki } = useHighlightCode(() => shortCode, { lang: 'vue' })
</script>

<template>
  <div class="mx-auto max-w-4xl px-6 py-10 space-y-12">
    <header class="space-y-2 pb-6 border-b border-divider">
      <h1 class="text-3xl font-bold">@paper/genesis — sandbox</h1>

      <p class="text-on-surface-variant">
        Live render of Genesis components inside the apps/docs chrome.
        v0 themes <code class="text-xs">html</code>; Genesis themes <code class="text-xs">body</code>.
      </p>
    </header>

    <section class="space-y-2">
      <h2 class="text-xl font-semibold">Single-file example</h2>

      <GnDocsExample
        :code="shortCode"
        file-name="counter.vue"
        language="vue"
        title="Counter"
      >
        <div class="grid place-items-center min-h-24">
          <button class="px-4 py-2 rounded bg-accent text-on-accent">Live preview</button>
        </div>

        <template #description>
          <p>Click "Show code" to expand the source. Default <pre> fallback rendering.</pre></p>
        </template>
      </GnDocsExample>
    </section>

    <section class="space-y-2">
      <h2 class="text-xl font-semibold">Multi-file example</h2>

      <GnDocsExample :files="multiFiles" title="createContext">
        <div class="grid place-items-center min-h-24">
          Multi-file demo — toggle code, switch tabs, try Combine.
        </div>
      </GnDocsExample>
    </section>

    <section class="space-y-2">
      <h2 class="text-xl font-semibold">DocsGenesisExample (apps/docs wrapper)</h2>

      <p class="text-xs text-on-surface-variant">
        The opt-in apps/docs wrapper around GnDocsExample. Auto-resolves examples via <code>useExamples()</code>,
        renders Shiki via the code slot, wires the Playground and Bin actions on multi-file mode. Drop-in
        candidate for the existing <code>DocsExample.vue</code>.
      </p>

      <DocsGenesisExample
        file-path="/components/snackbar/basic"
        title="Snackbar basic example"
      >
        <template #description>
          <p>Resolved component renders from <code>examples/components/snackbar/basic.vue</code>.</p>
        </template>
      </DocsGenesisExample>
    </section>

    <section class="space-y-2">
      <h2 class="text-xl font-semibold">Per-example theme override</h2>

      <p class="text-xs text-on-surface-variant">
        The <code class="text-xs">theme</code> prop scopes a v0 theme to the preview panel. Each example below
        renders the same content but in a different v0 theme, regardless of the page's active theme.
      </p>

      <div class="grid gap-4">
        <GnDocsExample
          :code="shortCode"
          file-name="counter.vue"
          language="vue"
          theme="light"
          title="theme=&quot;light&quot;"
        >
          <div class="grid place-items-center min-h-24 bg-surface text-on-surface">
            <button class="px-4 py-2 rounded bg-primary text-on-primary">Light theme</button>
          </div>
        </GnDocsExample>

        <GnDocsExample
          :code="shortCode"
          file-name="counter.vue"
          language="vue"
          theme="dark"
          title="theme=&quot;dark&quot;"
        >
          <div class="grid place-items-center min-h-24 bg-surface text-on-surface">
            <button class="px-4 py-2 rounded bg-primary text-on-primary">Dark theme</button>
          </div>
        </GnDocsExample>

        <GnDocsExample
          :code="shortCode"
          file-name="counter.vue"
          language="vue"
          theme="tailwind"
          title="theme=&quot;tailwind&quot;"
        >
          <div class="grid place-items-center min-h-24 bg-surface text-on-surface">
            <button class="px-4 py-2 rounded bg-primary text-on-primary">Tailwind theme</button>
          </div>
        </GnDocsExample>
      </div>
    </section>

    <section class="space-y-2">
      <h2 class="text-xl font-semibold">Hand-composed with Shiki highlighter</h2>

      <p class="text-xs text-on-surface-variant">
        Standalone GnDocsExampleCode using the docs site's useHighlightCode composable via the code slot.
      </p>

      <GnDocsExampleDescription title="With syntax highlighting">
        <p>The docs site's useHighlightCode resolves Shiki against the active theme.</p>
      </GnDocsExampleDescription>

      <GnDocsExamplePreview>
        <div class="grid place-items-center min-h-24">A code block follows</div>
      </GnDocsExamplePreview>

      <GnDocsExampleCode :code="shortCode" file-name="counter.vue" language="vue">
        <div v-if="shiki" class="p-4 text-sm font-mono" v-html="shiki" />
        <pre v-else class="p-4 text-sm font-mono"><code>{{ shortCode }}</code></pre>
      </GnDocsExampleCode>
    </section>
  </div>
</template>
