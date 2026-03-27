<script lang="ts">
  export interface CxAlertDismissProps {
    label?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'CxAlertDismiss' })

  const { label = 'Dismiss alert' } = defineProps<CxAlertDismissProps>()

  const emit = defineEmits<{
    dismiss: []
  }>()
</script>

<template>
  <button
    :aria-label="label"
    class="codex-alert__dismiss"
    @click="emit('dismiss')"
  >
    <slot>
      <svg
        aria-hidden="true"
        fill="none"
        height="14"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        viewBox="0 0 24 24"
        width="14"
      >
        <path d="M18 6 6 18M6 6l12 12" />
      </svg>
    </slot>
  </button>
</template>

<style scoped>
.codex-alert__dismiss {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-inline-start: auto;
  padding: 0.25rem;
  border: none;
  background: none;
  cursor: pointer;
  opacity: 0.6;
}

.codex-alert__dismiss:hover {
  opacity: 1;
}
</style>
