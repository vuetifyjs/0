<script setup lang="ts">
  // Framework
  import { useBreakpoints, useStack, useStorage } from '@vuetify/v0'

  // Components
  import { usePlayground } from './PlaygroundApp.vue'

  // Utilities
  import { onMounted, onUnmounted, shallowRef, toRef, watch } from 'vue'

  const DEFAULT_WIDTH = 400
  const DEFAULT_MIN_WIDTH = DEFAULT_WIDTH
  const DEFAULT_MAX_WIDTH = 720

  const playground = usePlayground()
  const breakpoints = useBreakpoints()
  const storage = useStorage()
  const left = storage.get('playground-left-open', true)

  const ticket = playground.register({ id: 'playground-left' })

  const isMobile = breakpoints.isMobile

  onMounted(() => {
    if (left.value && !isMobile.value) ticket.select()
  })

  const modelValue = shallowRef(DEFAULT_WIDTH)

  const styles = toRef(() => ({
    width: `${modelValue.value}px`,
  }))

  onUnmounted(() => {
    playground.unregister(ticket.id)
  })

  function onDblClick () {
    modelValue.value = modelValue.value === DEFAULT_WIDTH ? DEFAULT_MAX_WIDTH : DEFAULT_WIDTH
  }

  const stack = useStack()
  const stackTicket = stack.register({ onDismiss: () => playground.toggle('playground-left') })

  watch(() => ticket.isSelected.value && isMobile.value, open => {
    if (open) stackTicket.select()
    else stackTicket.unselect()
  }, { immediate: true })

</script>

<template>
  <!-- Desktop: inline flex item -->
  <template v-if="!isMobile">
    <template v-if="ticket.isSelected.value">
      <div
        class="bg-glass-surface h-full flex flex-col"
        :style="styles"
      >
        <slot />
      </div>

      <PlaygroundAppResizeBar
        v-model="modelValue"
        class="z-1"
        direction="horizontal"
        :max="DEFAULT_MAX_WIDTH"
        :min="DEFAULT_MIN_WIDTH"
        storage-key="playground-left"
        @dblclick="onDblClick"
      />
    </template>
  </template>

  <!-- Mobile: always mounted fixed drawer -->
  <template v-else>
    <div
      class="fixed inset-0 bg-surface border-r border-divider flex flex-col transition-transform duration-200"
      :class="ticket.isSelected.value ? 'translate-x-0' : '-translate-x-full'"
      :inert="ticket.isSelected.value ? undefined : true"
      :style="{ zIndex: stackTicket.zIndex.value }"
    >
      <slot />
    </div>
  </template>
</template>
