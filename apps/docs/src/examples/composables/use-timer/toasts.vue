<script setup lang="ts">
  import Toast from './Toast.vue'
  import { useToast } from './useToast'

  const { toasts, add, dismiss } = useToast()
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex gap-2 flex-wrap">
      <button
        class="px-3 py-1.5 rounded text-sm bg-primary text-on-primary hover:opacity-90"
        @click="add('File uploaded successfully', 'success')"
      >
        Success
      </button>
      <button
        class="px-3 py-1.5 rounded text-sm border border-divider hover:bg-surface-tint"
        @click="add('Your session will expire soon', 'warning', 8000)"
      >
        Warning (8s)
      </button>
      <button
        class="px-3 py-1.5 rounded text-sm border border-divider hover:bg-surface-tint"
        @click="add('New message from team', 'info', 4000)"
      >
        Info (4s)
      </button>
      <button
        class="px-3 py-1.5 rounded text-sm border border-divider hover:bg-surface-tint"
        @click="add('Failed to save changes', 'error', 6000)"
      >
        Error (6s)
      </button>
    </div>

    <p class="text-xs text-on-surface-variant">
      Hover a toast to pause its countdown
    </p>

    <TransitionGroup
      class="flex flex-col gap-2"
      name="toast"
      tag="div"
    >
      <Toast
        v-for="toast in toasts"
        :key="toast.id"
        :on-dismiss="dismiss"
        :toast
      />
    </TransitionGroup>
  </div>
</template>

<style scoped>
  .toast-enter-active,
  .toast-leave-active {
    transition: all 200ms ease;
  }
  .toast-enter-from {
    opacity: 0;
    transform: translateY(-8px);
  }
  .toast-leave-to {
    opacity: 0;
    transform: translateX(16px);
  }
</style>
