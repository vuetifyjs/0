<script setup lang="ts">
  // Components
  import { usePlayground } from '../app/PlaygroundApp.vue'

  // Utilities
  import { onMounted, onUnmounted, shallowRef, toRef } from 'vue'

  const DEFAULT_WIDTH = 300
  const DEFAULT_MIN_WIDTH = 200
  const DEFAULT_MAX_WIDTH = 450

  const playground = usePlayground()

  const ticket = playground.register({ id: 'workspace-left' })

  onMounted(() => ticket.select())

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
      :style="styles"
    >
      <slot />
    </div>

    <PlaygroundAppResizeBar
      v-if="playground.selectedIds.has('workspace-right')"
      v-model="modelValue"
      class="z-1"
      direction="horizontal"
      :max="DEFAULT_MAX_WIDTH"
      :min="DEFAULT_MIN_WIDTH"
      storage-key="workspace-left"
      @dblclick="onDblClick"
    />
  </template>
</template>
