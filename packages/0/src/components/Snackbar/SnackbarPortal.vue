/**
 * @module SnackbarPortal
 *
 * @see https://0.vuetifyjs.com/components/semantic/snackbar
 *
 * @remarks
 * Container component for snackbar notifications. Teleports into the topmost
 * open modal (`top-layer`) by default, falling back to `body`; registers with
 * useStack for z-index coordination. Passes `scrim: false` to its Portal —
 * snackbars are non-modal, so `Scrim` never paints a backdrop for them even
 * when one is active for a Dialog.
 *
 * Does not set aria-live — each SnackbarRoot handles its own live region
 * semantics via role to avoid nesting conflicts.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'
  import { Portal } from '#v0/components/Portal'

  // Transformers
  import { toElement } from '#v0/composables/toElement'

  import { IN_BROWSER } from '#v0/constants/globals'

  // Utilities
  import { isNull } from '#v0/utilities'
  import { mergeProps, toRef, useTemplateRef, watch } from 'vue'

  // Types
  import type { AtomExpose, AtomProps } from '#v0/components/Atom'

  export interface SnackbarPortalProps extends AtomProps {
    /** Teleport target. `'top-layer'` mounts into the topmost open modal; `false` renders inline. @default 'top-layer' */
    teleport?: 'top-layer' | (string & {}) | false
  }

  export interface SnackbarPortalSlotProps {
    /** Calculated z-index from useStack */
    zIndex: number
    /**
     * Attributes to bind to the portal element.
     *
     * @remarks
     * The style carries only `zIndex` so consumer positioning (classes or
     * styles like `absolute` / `fixed`) wins. In renderless mode the wrapper
     * you render must be positioned (non-`static`) for the z-index to take
     * effect — the automatic `position: relative` fallback only covers the
     * element rendered by the non-renderless Atom.
     */
    attrs: {
      style: { zIndex: number }
    }
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'SnackbarPortal', inheritAttrs: false })

  defineSlots<{
    default: (props: SnackbarPortalSlotProps) => any
  }>()

  const {
    as = 'div',
    renderless,
    teleport = 'top-layer',
  } = defineProps<SnackbarPortalProps>()

  function getSlotProps (zIndex: number): SnackbarPortalSlotProps {
    return {
      zIndex,
      attrs: {
        style: { zIndex },
      },
    }
  }

  const atomRef = useTemplateRef<AtomExpose>('atom')
  const el = toRef(() => toElement(atomRef.value?.element) ?? null)

  // Preserve the stacking-context guarantee from #602 without an inline
  // `position` that would override consumer positioning classes: only a
  // computed `static` wrapper is nudged to `relative`.
  watch(el, value => {
    if (!IN_BROWSER || isNull(value)) return

    const element = value as HTMLElement

    if (getComputedStyle(element).position === 'static') {
      element.style.position = 'relative'
    }
  })
</script>

<template>
  <Portal :disabled="teleport === false" :scrim="false" :to="teleport || 'body'">
    <template #default="{ zIndex }">
      <Atom ref="atom" :as :renderless v-bind="mergeProps($attrs, getSlotProps(zIndex).attrs)">
        <slot v-bind="getSlotProps(zIndex)" />
      </Atom>
    </template>
  </Portal>
</template>
