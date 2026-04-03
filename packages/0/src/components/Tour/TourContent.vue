/**
 * @module TourContent
 *
 * @remarks
 * Tour content container. Teleported to body for overlay positioning.
 * Self-gates via root context isActive. Handles CSS anchor positioning
 * for tooltip steps and centering for dialog/floating steps.
 * Safari fallback centers content at the viewport edge.
 */

<script lang="ts">
  // Types
  export interface TourContentProps {
    /** Placement relative to the activator. @default 'bottom' */
    placement?: 'top' | 'bottom' | 'left' | 'right'
    /** Offset from viewport edges in px. @default 16 */
    offset?: number
    namespace?: string
  }

  export interface TourContentSlotProps {}
</script>

<script setup lang="ts">
  // Constants
  import { IN_BROWSER } from '#v0/constants/globals'

  // Context
  import { useTourRootContext } from './TourRoot.vue'

  // Composables
  import { useTour } from '#v0/composables/useTour'

  // Utilities
  import { nextTick, toRef, useAttrs, useTemplateRef, watch } from 'vue'

  defineOptions({ name: 'TourContent', inheritAttrs: false })

  defineSlots<{
    default: (props: TourContentSlotProps) => any
  }>()

  const {
    placement = 'bottom',
    offset = 16,
    namespace = 'v0:tour',
  } = defineProps<TourContentProps>()

  const attrs = useAttrs()
  const root = useTourRootContext(namespace)
  const tour = useTour(namespace)
  const contentRef = useTemplateRef<HTMLElement>('content')

  const supportsAnchor = IN_BROWSER
    && typeof CSS !== 'undefined'
    && typeof CSS.supports === 'function'
    && CSS.supports('position-area', 'top')

  const placementStyles: Record<string, Record<string, string>> = {
    bottom: { positionArea: 'bottom', justifySelf: 'anchor-center' },
    top: { positionArea: 'top', justifySelf: 'anchor-center' },
    left: { positionArea: 'left', alignSelf: 'anchor-center' },
    right: { positionArea: 'right', alignSelf: 'anchor-center' },
  }

  const fallbackStyles: Record<string, Record<string, string>> = {
    bottom: { bottom: '16px', left: '50%', transform: 'translateX(-50%)' },
    top: { top: '16px', left: '50%', transform: 'translateX(-50%)' },
    left: { top: '50%', left: '16px', transform: 'translateY(-50%)' },
    right: { top: '50%', right: '16px', transform: 'translateY(-50%)' },
    center: { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' },
  }

  const step = toRef(() => tour.steps.get(root.step))
  const isDialog = toRef(() => {
    const type = step.value?.type
    return type === 'dialog' || type === 'floating'
  })

  const activePlacement = toRef(() => {
    if (isDialog.value) return 'center'
    return step.value?.placement ?? placement
  })

  const style = toRef(() => {
    const p = activePlacement.value

    if (isDialog.value) {
      return {
        position: 'fixed' as const,
        inset: '0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none' as const,
        zIndex: 9999,
      }
    }

    if (supportsAnchor) {
      return {
        position: 'fixed' as const,
        inset: `${offset}px`,
        width: 'max-content',
        height: 'max-content',
        maxHeight: `calc(100vh - ${offset * 2}px)`,
        positionAnchor: `--tour-${root.step}`,
        zIndex: 9999,
        ...placementStyles[p] ?? placementStyles.bottom,
      }
    }

    return {
      position: 'fixed' as const,
      inset: 'auto',
      zIndex: 9999,
      ...fallbackStyles[p] ?? fallbackStyles.bottom,
    }
  })

  // Auto-focus on mount (skip if input is focused)
  watch(root.isActive, active => {
    if (!active || !IN_BROWSER) return
    nextTick(() => {
      const focused = document.activeElement
      const isInputFocused = focused?.tagName === 'INPUT'
        || focused?.tagName === 'TEXTAREA'
        || focused?.getAttribute('contenteditable') === 'true'
      if (!isInputFocused) {
        contentRef.value?.focus()
      }
    })
  })
</script>

<template>
  <Teleport v-if="root.isActive.value" to="body">
    <div
      ref="content"
      v-bind="attrs"
      :aria-describedby="root.descriptionId"
      :aria-labelledby="root.titleId"
      data-part="content"
      :data-placement="activePlacement"
      data-scope="tour"
      :data-step="String(root.step)"
      :data-type="isDialog ? 'dialog' : 'tooltip'"
      role="dialog"
      :style
      tabindex="-1"
    >
      <slot />
    </div>
  </Teleport>
</template>
