/**
 * @module DiscoveryContent
 *
 * @remarks
 * Content container for discovery step. Uses the native Popover API with
 * CSS anchor positioning to position relative to the step's activator element.
 * Includes keyboard navigation and focus management.
 */

<script lang="ts">
  // Types
  import type { AtomProps, ID } from '@vuetify/v0'

  export interface DiscoveryContentProps extends AtomProps {
    /** CSS position-area value for anchor positioning */
    placement?: string
    /** CSS position-try-fallbacks value */
    positionTry?: string
    /** Offset/gap from the activator element in pixels */
    offset?: number
    /** Teleport target. true = body, string = selector, false = disabled */
    teleport?: boolean | string
    /** Namespace for context injection */
    namespace?: string
  }

  export interface DiscoveryContentSlotProps {
    /** Whether this step is currently active */
    isActive: boolean
    /** This step's ID */
    step: ID
    /** Current placement position */
    placement: string
    /** Attributes to bind to the content element */
    attrs: {
      'role': 'dialog'
      'aria-modal': 'false'
      'aria-labelledby': string
      'aria-describedby': string
      'data-discovery-content': ''
      'popover': 'manual'
    }
  }
</script>

<script setup lang="ts">
  // Framework
  import { IN_BROWSER, useHotkey, useToggleScope } from '@vuetify/v0'

  // Components
  // Context
  import { useDiscoveryRootContext } from './DiscoveryRoot.vue'

  // Utilities
  import { computed, nextTick, shallowRef, toRef, useTemplateRef, watch } from 'vue'

  defineOptions({ name: 'DiscoveryContent' })

  defineSlots<{
    default: (props: DiscoveryContentSlotProps) => any
  }>()

  const {
    placement = 'bottom',
    positionTry = 'flip-block',
    offset = 16,
    teleport = true,
    namespace = 'v0:discovery',
  } = defineProps<DiscoveryContentProps>()

  const teleportTarget = computed(() => {
    if (teleport === false) return null
    if (teleport === true) return 'body'
    return teleport
  })

  const rootContext = useDiscoveryRootContext(namespace)

  const contentRef = useTemplateRef<HTMLElement>('content')
  const triggerRef = shallowRef<HTMLElement | null>(null)

  const announcement = toRef(() => {
    if (!rootContext.isActive.value || rootContext.index.value < 0) return ''
    return `Step ${rootContext.index.value + 1} of ${rootContext.total.value}`
  })

  // CSS anchor positioning style (matches PopoverContent pattern)
  // Use directional margin based on placement to create gap from anchor
  const marginMap: Record<string, string> = {
    top: `0 0 ${offset}px 0`,
    bottom: `${offset}px 0 0 0`,
    left: `0 ${offset}px 0 0`,
    right: `0 0 0 ${offset}px`,
  }

  const style = toRef(() => ({
    'position': 'fixed' as const,
    'margin': marginMap[placement] ?? `${offset}px`,
    'inset-area': placement,
    'position-area': placement,
    'position-anchor': `--discovery-${rootContext.step}`,
    'position-try-fallbacks': positionTry,
  }))

  // Control popover visibility based on step active state
  watch(() => rootContext.isActive.value, async isActive => {
    await nextTick() // Ensure DOM is ready
    const element = contentRef.value
    // Guard against operations on disconnected elements
    if (!element?.isConnected) return

    const isOpen = element.matches?.(':popover-open')
    if (isActive === isOpen) return

    if (isActive) {
      element.showPopover?.()
    } else {
      element.hidePopover?.()
    }
  }, { immediate: true })

  // Focus management: focus content when step becomes active
  watch(() => rootContext.isActive.value, async isActive => {
    if (!IN_BROWSER) return

    if (isActive) {
      // Store element that triggered the tour for focus restoration
      if (!triggerRef.value) {
        triggerRef.value = document.activeElement as HTMLElement | null
      }
      await nextTick()
      // Focus first focusable element within content
      const firstFocusable = contentRef.value?.querySelector<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      )
      firstFocusable?.focus()
    } else {
      // Restore focus when step becomes inactive
      await nextTick()
      triggerRef.value?.focus()
      triggerRef.value = null
    }
  })

  // Keyboard navigation: only active when this step is active
  useToggleScope(
    () => rootContext.isActive.value,
    () => {
      useHotkey('escape', () => rootContext.stop(), { inputs: true })
      useHotkey('arrowright', () => rootContext.next(), { inputs: true })
      useHotkey('arrowleft', () => rootContext.prev(), { inputs: true })
    },
  )

  const slotProps = toRef((): DiscoveryContentSlotProps => ({
    isActive: rootContext.isActive.value,
    step: rootContext.step,
    placement,
    attrs: {
      'role': 'dialog',
      'aria-modal': 'false',
      'aria-labelledby': rootContext.titleId,
      'aria-describedby': rootContext.descriptionId,
      'data-discovery-content': '',
      'popover': 'manual',
    },
  }))
</script>

<template>
  <Teleport v-if="rootContext.isActive.value" :disabled="!teleportTarget" :to="teleportTarget ?? 'body'">
    <!-- Live region for screen reader announcements -->
    <div
      aria-atomic="true"
      aria-live="polite"
      class="sr-only"
    >
      {{ announcement }}
    </div>

    <div
      ref="content"
      :aria-describedby="rootContext.descriptionId"
      :aria-labelledby="rootContext.titleId"
      aria-modal="false"
      data-discovery-content
      popover="manual"
      role="dialog"
      :style
    >
      <slot v-bind="slotProps" />
    </div>
  </Teleport>
</template>
