<script setup lang="ts">
  // Framework
  import { useBreakpoints, useStorage } from '@vuetify/v0'

  // Components
  import { usePlayground } from '../app/PlaygroundApp.vue'
  import { Discovery } from '@/components/discovery'

  // Utilities
  import { onMounted, onUnmounted, shallowRef, toRef } from 'vue'

  const DEFAULT_WIDTH = 400
  const DEFAULT_MIN_WIDTH = 200
  const DEFAULT_MAX_WIDTH = 700

  const playground = usePlayground()
  const breakpoints = useBreakpoints()
  const storage = useStorage()
  const side = storage.get('playground-preview-right', false)
  const left = storage.get('playground-left-open', true)

  const ticket = playground.register({ id: 'preview-side' })

  onMounted(() => {
    if (!breakpoints.isMobile.value && side.value && !left.value) ticket.select()
  })

  onUnmounted(() => {
    playground.unregister(ticket.id)
  })

  const modelValue = shallowRef(DEFAULT_WIDTH)

  const styles = toRef(() => ({
    width: `${modelValue.value}px`,
  }))

  function onDblClick () {
    modelValue.value = modelValue.value === DEFAULT_WIDTH ? DEFAULT_MAX_WIDTH : DEFAULT_WIDTH
  }
</script>

<template>
  <template v-if="ticket.isSelected.value">
    <PlaygroundAppResizeBar
      v-model="modelValue"
      direction="horizontal"
      :max="DEFAULT_MAX_WIDTH"
      :min="DEFAULT_MIN_WIDTH"
      reverse
      storage-key="preview-side"
      @dblclick="onDblClick"
    />

    <Discovery.Activator
      active-class="rounded-lg"
      as="div"
      class="flex flex-col h-full"
      step="preview"
      :style="styles"
    >
      <slot />
    </Discovery.Activator>
  </template>
</template>
