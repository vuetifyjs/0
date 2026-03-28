<script setup lang="ts">
  import {
    HxBreadcrumbs,
    HxCallout,
    HxCalloutHeader,
    HxCodeBlock,
    HxHeaderAnchor,
    HxPackageManagerTabs,
  } from '@paper/helix'

  const breadcrumbs = [
    { label: 'Home', to: '/' },
    { label: 'Getting Started' },
  ]
</script>

<template>
  <div class="p-8 max-w-3xl">
    <HxBreadcrumbs class="mb-6" :items="breadcrumbs" />

    <h1 class="text-3xl font-bold mb-2">Getting Started</h1>
    <p class="text-on-surface-variant mb-8">Learn how Paper design systems work and how to use them.</p>

    <HxHeaderAnchor id="what-is-paper" tag="h2">
      What is Paper?
    </HxHeaderAnchor>
    <p class="mb-4">
      Paper is a layered design system architecture. At the bottom is
      <strong>v0</strong> — headless, unstyled UI primitives. On top of v0,
      <strong>Paper</strong> adds styling tokens and layout primitives. Design
      systems like <strong>Emerald</strong> and <strong>Helix</strong> build on
      Paper to provide fully styled, ready-to-use component libraries.
    </p>

    <HxHeaderAnchor id="how-design-systems-work" tag="h2">
      How Design Systems Work
    </HxHeaderAnchor>
    <p class="mb-4">
      Each design system is a complete framework: tokens for colors, spacing,
      and typography; a full set of components; and optional plugins for
      features like theming and locale. Design systems share the same
      headless core, so switching between them means changing the visual
      layer without rewriting logic.
    </p>

    <HxCallout class="mb-6" type="tip">
      <HxCalloutHeader type="tip" />
      <p class="mt-2">
        You can register multiple design systems in the showcase to compare
        them side by side.
      </p>
    </HxCallout>

    <HxHeaderAnchor id="installation" tag="h2">
      Installing a Design System
    </HxHeaderAnchor>

    <p class="mb-4">Install the package:</p>
    <HxPackageManagerTabs class="mb-6" package="@paper/emerald" />

    <p class="mb-4">Create the plugin and register it with your app:</p>
    <HxCodeBlock
      class="mb-4"
      :code="`import { createApp } from 'vue'
import { createEmeraldPlugin } from '@paper/emerald'

const app = createApp(App)
app.use(createEmeraldPlugin())
app.mount('#app')`"
      language="ts"
    />

    <p class="mb-4">Import and use components:</p>
    <HxCodeBlock
      class="mb-6"
      :code="`<script setup lang=&quot;ts&quot;>
  import { EmButton } from '@paper/emerald'
</script>

<template>
  <EmButton>Click me</EmButton>
</template>`"
      language="vue"
    />

    <HxCallout class="mb-6" type="info">
      <HxCalloutHeader type="info" />
      <p class="mt-2">
        Each design system ships its own plugin factory. Check the
        overview page for the exact import path and package name.
      </p>
    </HxCallout>
  </div>
</template>
