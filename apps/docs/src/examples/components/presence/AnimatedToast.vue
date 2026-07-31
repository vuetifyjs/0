<script setup lang="ts">
  import { Presence } from '@vuetify/v0'

  const { lazy = false, message = '' } = defineProps<{
    lazy?: boolean
    message?: string
  }>()

  const open = defineModel<boolean>({ default: false })

  defineEmits<{ enter: [] }>()
</script>

<template>
  <Presence
    :key="lazy ? 'lazy' : 'eager'"
    v-slot="{ attrs, done }"
    v-model="open"
    :immediate="false"
    :lazy
    @enter="$emit('enter')"
  >
    <div
      v-bind="attrs"
      class="toast flex items-center gap-3 rounded-lg bg-surface-variant px-4 py-3 text-sm text-on-surface shadow-md"
      @animationend="done"
    >
      <span class="h-2 w-2 shrink-0 rounded-full bg-success" />

      <span class="flex-1">{{ message }}</span>

      <button
        class="rounded px-2 py-1 text-xs font-medium text-on-surface-variant hover:bg-surface hover:text-on-surface"
        type="button"
        @click="open = false"
      >
        Dismiss
      </button>
    </div>
  </Presence>
</template>

<style scoped>
  /* `mounted` is a transient tick before paint — hide so there's no flash */
  .toast[data-state="mounted"] {
    opacity: 0;
  }

  /* enter animation runs on the persistent `present` state */
  .toast[data-state="present"] {
    animation: toast-in 240ms cubic-bezier(0.21, 1.02, 0.73, 1);
  }

  .toast[data-state="leaving"] {
    animation: toast-out 200ms ease-in forwards;
  }

  @keyframes toast-in {
    from { opacity: 0; transform: translateY(12px) scale(0.98); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }

  @keyframes toast-out {
    from { opacity: 1; transform: translateY(0) scale(1); }
    to { opacity: 0; transform: translateY(12px) scale(0.98); }
  }
</style>
