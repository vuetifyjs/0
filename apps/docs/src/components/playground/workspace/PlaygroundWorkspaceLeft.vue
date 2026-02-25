<script setup lang="ts">
  // Framework
  import { useBreakpoints, useClickOutside, useStack } from '@vuetify/v0'

  // Components
  import { usePlayground } from '../app/PlaygroundApp.vue'

  // Utilities
  import { onMounted, onUnmounted, shallowRef, toRef, useTemplateRef, watch } from 'vue'

  const DEFAULT_WIDTH = 300
  const DEFAULT_MIN_WIDTH = 200
  const DEFAULT_MAX_WIDTH = 450

  const playground = usePlayground()
  const breakpoints = useBreakpoints()

  const ticket = playground.register({ id: 'workspace-left' })

  const isMobile = breakpoints.isMobile

  onMounted(() => {
    if (!isMobile.value) ticket.select()
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
  const stackTicket = stack.register({ onDismiss: () => playground.toggle('workspace-left') })

  watch(() => ticket.isSelected.value && isMobile.value, open => {
    if (open) stackTicket.select()
    else stackTicket.unselect()
  }, { immediate: true })

  const panelRef = useTemplateRef<HTMLElement>('panel')

  useClickOutside(panelRef, () => {
    if (ticket.isSelected.value && isMobile.value) playground.toggle('workspace-left')
  }, { ignore: ['[data-playground-bar]'] })
</script>

<template>
  <!-- Desktop: inline flex item -->
  <template v-if="!isMobile">
    <template v-if="ticket.isSelected.value">
      <div
        ref="panel"
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

  <!-- Mobile: always mounted fixed drawer -->
  <template v-else>
    <div
      ref="panel"
      class="fixed top-[48px] bottom-0 left-0 w-[280px] bg-surface border-r border-divider flex flex-col transition-transform duration-200"
      :class="ticket.isSelected.value ? 'translate-x-0' : '-translate-x-full'"
      :inert="ticket.isSelected.value ? undefined : true"
      :style="{ zIndex: stackTicket.zIndex.value }"
    >
      <slot />
    </div>
  </template>
</template>
