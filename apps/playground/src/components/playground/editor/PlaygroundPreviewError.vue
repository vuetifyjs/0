<script setup lang="ts">
  // Framework
  import { Atom } from '@vuetify/v0'

  export interface FailedDep {
    url: string
    name: string
  }

  const { failed = [] } = defineProps<{
    failed?: FailedDep[]
  }>()

  defineEmits<{
    retry: []
    dismiss: []
  }>()

  function host (url: string) {
    try {
      return new URL(url).host
    } catch {
      return url
    }
  }
</script>

<template>
  <div class="absolute inset-0 z-10 flex items-center justify-center p-6 bg-background/80 backdrop-blur-4">
    <div
      class="w-full max-w-sm flex flex-col gap-3 rounded-lg border border-divider bg-surface p-5 shadow-lg"
      role="alert"
    >
      <div class="flex items-start gap-3">
        <AppIcon class="mt-0.5 text-warning" icon="alert" :size="20" />

        <div class="min-w-0 flex-1">
          <p class="text-sm font-medium text-on-surface">Preview didn't load</p>

          <p v-if="failed.length > 0" class="mt-1 text-sm text-on-surface-variant">
            Couldn't load<template v-for="(dep, i) in failed" :key="dep.url"> <code class="text-on-surface">{{ dep.name }}</code> from {{ host(dep.url) }}<span v-if="i < failed.length - 1">,</span></template>. A network or CDN issue is preventing the preview from running.
          </p>

          <p v-else class="mt-1 text-sm text-on-surface-variant">
            A network issue may be blocking the scripts the preview needs.
          </p>

          <p class="mt-2 text-xs text-on-surface-variant/70">Open your browser console for details.</p>
        </div>

        <AppCloseButton size="sm" @click="$emit('dismiss')" />
      </div>

      <div class="flex justify-end">
        <Atom
          as="button"
          class="inline-flex items-center gap-1.5 rounded bg-primary px-3 py-1.5 text-sm font-medium text-on-primary hover:opacity-90"
          @click="$emit('retry')"
        >
          <AppIcon icon="reset" :size="16" />
          Retry
        </Atom>
      </div>
    </div>
  </div>
</template>
