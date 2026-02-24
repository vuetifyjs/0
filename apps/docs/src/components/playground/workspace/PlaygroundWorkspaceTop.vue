<script setup lang="ts">
  // Components
  import { usePlayground } from '../app/PlaygroundApp.vue'

  // Utilities
  import { onMounted, onUnmounted, shallowRef, toRef } from 'vue'

  const DEFAULT_HEIGHT = 60

  const playground = usePlayground()
  const ticket = playground.register({ id: 'workspace-top' })

  onMounted(() => ticket.select())

  const modelValue = shallowRef(DEFAULT_HEIGHT)

  const hasBottom = toRef(() => playground.selectedIds.has('workspace-bottom'))
  const hasContent = toRef(() =>
    playground.selectedIds.has('workspace-right') ||
    playground.selectedIds.has('preview-side'),
  )

  const styles = toRef(() => ({
    height: hasContent.value ? (hasBottom.value ? `${modelValue.value}%` : '100%') : '0',
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
      v-if="hasBottom && hasContent"
      v-model="modelValue"
      direction="vertical"
      :max="80"
      :min="20"
      storage-key="workspace-top"
      @dblclick="onDblClick"
    />
  </template>
</template>
