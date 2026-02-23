<script lang="ts" setup>
  // Components
  import { usePlayground } from '../app/PlaygroundApp.vue'

  // Utilities
  import { onUnmounted, shallowRef, toRef } from 'vue'

  const DEFAULT_HEIGHT = 60

  const playground = usePlayground()
  const ticket = playground.register({ id: 'workspace-top' })

  const modelValue = shallowRef(60)

  const hasBottom = toRef(() => playground.selectedIds.has('workspace-bottom'))

  const styles = toRef(() => ({
    height: hasBottom.value ? `${modelValue.value}%` : '100%',
  }))

  onUnmounted(() => {
    playground.unregister(ticket.id)
  })

  function onDblClick () {
    modelValue.value = modelValue.value === DEFAULT_HEIGHT ? 30 : DEFAULT_HEIGHT
  }
</script>

<template>
  <template v-if="ticket.isSelected.value">
    <div
      class="flex"
      :style="styles"
    >
      <slot />
    </div>

    <PlaygroundAppResizeBar
      v-if="hasBottom"
      v-model="modelValue"
      direction="vertical"
      :max="80"
      :min="20"
      storage-key="workspace-top"
      @dblclick="onDblClick"
    />
  </template>
</template>
