<script setup lang="ts">
  import { usePresence } from '@vuetify/v0'
  import { shallowRef } from 'vue'

  const isOpen = shallowRef(false)

  const { isMounted, isLeaving, state, done } = usePresence({
    present: isOpen,
    lazy: true,
    immediate: false,
  })

  function onTransitionEnd (e: TransitionEvent) {
    if (isLeaving.value && e.target === e.currentTarget) done()
  }
</script>

<template>
  <div class="flex flex-col items-center gap-4">
    <button
      class="px-4 py-2 bg-primary text-on-primary rounded"
      @click="isOpen = !isOpen"
    >
      {{ isOpen ? 'Close' : 'Open' }}
    </button>

    <div
      v-if="isMounted"
      class="w-full max-w-sm p-4 bg-surface border border-divider rounded shadow-md transition-all duration-300"
      :class="state === 'present' ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'"
      @transitionend="onTransitionEnd"
    >
      <p class="font-medium">Hello from usePresence</p>
      <p class="text-sm text-on-surface-variant mt-1">State: {{ state }}</p>
    </div>

    <p class="text-xs text-on-surface-variant">
      isMounted: {{ isMounted }} · isLeaving: {{ isLeaving }}
    </p>
  </div>
</template>
