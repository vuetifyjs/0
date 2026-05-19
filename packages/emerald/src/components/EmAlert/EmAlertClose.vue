<script lang="ts">
  export interface EmAlertCloseProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmAlertClose' })

  const emit = defineEmits<{
    click: [event: MouseEvent]
  }>()

  function onClick (event: MouseEvent) {
    emit('click', event)
  }
</script>

<template>
  <button
    aria-label="Close alert"
    class="emerald-alert__close"
    type="button"
    @click="onClick"
  >
    <slot />
  </button>
</template>
