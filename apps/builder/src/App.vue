<script setup lang="ts">
  // Components
  import AppShell from '@/components/app/AppShell.vue'
  import PreviewPane from '@/components/preview/PreviewPane.vue'

  // Utilities
  import { toRef } from 'vue'
  import { RouterView, useRoute } from 'vue-router'

  const route = useRoute()

  const split = toRef(() => route.path.startsWith('/builder'))
</script>

<template>
  <AppShell :split>
    <RouterView />

    <template #preview>
      <PreviewPane />
    </template>
  </AppShell>
</template>

<style>
/* Shiki (defaultColor: false, dual themes) writes each token's color as a pair of
   --shiki-light/--shiki-dark custom properties on its own span rather than as a
   `color` declaration — nothing consumes them without this rule. apps/docs' toggle
   assumes a `.dark` ancestor class; this app only ever sets [data-theme] on <html>
   (createThemePlugin, target: 'html'), so the toggle keys off that instead.
   Background is forced transparent (not shiki's own light/dark bg) so the manifest's
   own surface — GnDocsExampleCode's --v0-pre override — shows through underneath,
   letting GnDotGrid read behind the code text instead of being covered by it. */
.shiki,
.shiki span {
  color: var(--shiki-light);
  background-color: transparent;
}

:root[data-theme='dark'] .shiki,
:root[data-theme='dark'] .shiki span {
  color: var(--shiki-dark);
}
</style>
