<script setup lang="ts">
  import AnimatedToast from './AnimatedToast.vue'
  import { useToastDemo } from './useToastDemo'

  const { open, lazy, mounts, show, onEnter } = useToastDemo()
</script>

<template>
  <div class="flex flex-col items-center gap-5">
    <div class="flex flex-wrap items-center justify-center gap-3">
      <button
        class="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-on-primary"
        type="button"
        @click="show"
      >
        Show toast
      </button>

      <button
        class="rounded-lg border border-divider px-3 py-2 text-sm text-on-surface data-[active]:border-primary data-[active]:text-primary"
        :data-active="lazy || undefined"
        type="button"
        @click="lazy = !lazy"
      >
        Lazy mount: {{ lazy ? 'on' : 'off' }}
      </button>

      <span class="font-mono text-sm text-on-surface-variant">
        Mounts: {{ mounts }}
      </span>
    </div>

    <div class="flex h-20 items-center justify-center">
      <AnimatedToast
        v-model="open"
        :lazy
        message="Changes saved"
        @enter="onEnter"
      />
    </div>

    <p class="max-w-sm text-center text-xs text-on-surface-variant">
      Dismiss the toast, then press Show again before the exit animation finishes — Presence cancels the leave and the toast stays mounted. In lazy mode the content mounts once and hides via state, so the counter stays at 1.
    </p>
  </div>
</template>
