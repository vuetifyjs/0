<script setup lang="ts">
  // Framework
  import { useDocumentEventListener, useHotkey, useToggleScope } from '@vuetify/v0'

  // Components
  import DocsDiscoveryStep from '@/components/docs/DocsDiscoveryStep.vue'

  // Composables
  import { useDiscovery } from '@/composables/useDiscovery'

  // Utilities
  import { watch } from 'vue'

  const discovery = useDiscovery()

  // Allowed keys during guided tours
  const GUIDED_ALLOWED_KEYS = new Set(['Escape', 'Tab', 'ArrowLeft', 'ArrowRight', 'Enter'])

  // Whether the focused element is a control that owns its own Enter/Space
  // activation (the tour popover's Back/Next/Complete/Exit buttons). Focus is
  // trapped inside the popover during a guided tour, so any focused button is
  // one of ours - defer to native activation instead of the tour shortcuts.
  function isControlFocused () {
    return !!(document.activeElement as HTMLElement | null)?.closest('button, a[href], [role="button"]')
  }

  // Block keyboard input during guided tours
  useToggleScope(
    () => discovery.isActive.value && discovery.tours.selectedItem.value?.mode === 'guided',
    () => {
      useDocumentEventListener('keydown', (e: KeyboardEvent) => {
        // Space activates a focused button/link on keyup; let it through so
        // the popover's own controls work when tabbed to directly.
        if (e.key === ' ' && isControlFocused()) return
        if (!GUIDED_ALLOWED_KEYS.has(e.key)) {
          e.preventDefault()
          e.stopImmediatePropagation()
        }
      }, { capture: true })
    },
  )

  const hotkeys = [
    // preventDefault is off so a focused button keeps its native Enter click;
    // the shortcut only advances the tour when focus is on the popover body.
    useHotkey('enter', e => {
      if (isControlFocused()) return
      e.preventDefault()
      discovery.next()
    }, { preventDefault: false }),
    useHotkey('right', () => discovery.next()),
    useHotkey('left', () => discovery.prev()),
    useHotkey('escape', () => discovery.stop()),
  ]

  watch(
    () => discovery.isActive.value && discovery.tours.selectedItem.value?.mode === 'guided',
    active => {
      for (const h of hotkeys) active ? h.resume() : h.pause()
    },
    { immediate: true },
  )
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
