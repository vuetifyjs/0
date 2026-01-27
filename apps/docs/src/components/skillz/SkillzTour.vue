<script setup lang="ts">
  // Framework
  import { useDocumentEventListener, useHotkey } from '@vuetify/v0'

  // Components
  import DocsDiscoveryStep from '@/components/docs/DocsDiscoveryStep.vue'

  // Composables
  import { useDiscovery } from '@/composables/useDiscovery'

  const discovery = useDiscovery()

  // Allowed keys during guided tours
  const GUIDED_ALLOWED_KEYS = new Set(['Escape', 'Tab', 'ArrowLeft', 'ArrowRight', 'Enter'])

  // Block keyboard input during guided tours
  useDocumentEventListener('keydown', (e: KeyboardEvent) => {
    if (!discovery.isActive.value) return

    const tour = discovery.tours.selectedItem.value
    if (tour?.mode !== 'guided') return

    if (GUIDED_ALLOWED_KEYS.has(e.key)) return

    e.preventDefault()
    e.stopPropagation()
  }, { capture: true })

  // Hotkey navigation for guided tours
  function isGuidedTourActive () {
    return discovery.isActive.value && discovery.tours.selectedItem.value?.mode === 'guided'
  }

  useHotkey('enter', () => {
    if (!isGuidedTourActive()) return
    discovery.next()
  })

  useHotkey('right', () => {
    if (!isGuidedTourActive()) return
    discovery.next()
  })

  useHotkey('left', () => {
    if (!isGuidedTourActive()) return
    discovery.prev()
  })

  useHotkey('escape', () => {
    if (!isGuidedTourActive()) return
    discovery.stop()
  })
</script>

<template>
  <template v-if="discovery.isActive.value">
    <DocsDiscoveryStep
      v-for="step in discovery.steps.values()"
      :key="step.id"
      :hint="step.hint"
      :placement="step.placement"
      :placement-mobile="step.placementMobile"
      :step="step.id"
      :text="step.task"
      :title="step.title"
    />
  </template>
</template>
