<script lang="ts" setup>
  // Components
  import { usePlayground } from './PlaygroundApp.vue'

  // Utilities
  import { onUnmounted, shallowRef, toRef } from 'vue'

  const DEFAULT_WIDTH = 400
  const DEFAULT_MIN_WIDTH = DEFAULT_WIDTH
  const DEFAULT_MAX_WIDTH = 720

  const playground = usePlayground()

  const ticket = playground.register({ id: 'playground-left' })

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
</script>

<template>
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
