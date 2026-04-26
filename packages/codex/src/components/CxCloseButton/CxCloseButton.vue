<script lang="ts">
  export interface CxCloseButtonProps {
    size?: 'sm' | 'md'
    label?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'CxCloseButton' })

  const {
    size = 'md',
    label = 'Close',
  } = defineProps<CxCloseButtonProps>()

  const emit = defineEmits<{
    click: [event: MouseEvent]
  }>()

  const sizes = {
    sm: { button: 20, icon: 12 },
    md: { button: 24, icon: 14 },
  }

  function onClick (event: MouseEvent) {
    emit('click', event)
  }
</script>

<template>
  <button
    :aria-label="label"
    class="codex-close-button"
    :style="{
      width: `${sizes[size].button}px`,
      height: `${sizes[size].button}px`,
    }"
    :title="label"
    type="button"
    @click="onClick"
  >
    <svg
      aria-hidden="true"
      fill="none"
      :height="sizes[size].icon"
      stroke="currentColor"
      stroke-width="2"
      viewBox="0 0 24 24"
      :width="sizes[size].icon"
    >
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  </button>
</template>

<style scoped>
  .codex-close-button {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    background: none;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
</style>
