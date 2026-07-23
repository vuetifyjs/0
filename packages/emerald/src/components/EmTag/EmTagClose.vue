<script lang="ts">
  export interface EmTagCloseProps {
    label?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmTagClose' })

  const { label = 'Dismiss' } = defineProps<EmTagCloseProps>()

  const emit = defineEmits<{
    click: [event: MouseEvent]
  }>()

  function onClick (event: MouseEvent) {
    event.stopPropagation()

    emit('click', event)
  }
</script>

<template>
  <button
    :aria-label="label"
    class="emerald-tag__close"
    type="button"
    @click="onClick"
  >
    <slot>
      <svg
        fill="none"
        height="16"
        viewBox="0 0 16 16"
        width="16"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M4 4l8 8M12 4l-8 8"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-width="1.5"
        />
      </svg>
    </slot>
  </button>
</template>

<style scoped>
.emerald-tag__close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 16px;
  height: 16px;
  padding: 0;
  border: none;
  background: transparent;
  color: inherit;
  cursor: pointer;
}

.emerald-tag__close :deep(svg) {
  width: 100%;
  height: 100%;
}
</style>
