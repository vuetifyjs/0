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
 * Owns the announcement state for a persistent live-region pair rendered by
 * Snackbar.Announcer — auto-rendered here unless the `announcer` prop is
 * false. The regions mount empty from Portal mount; live regions only
 * announce changes, so the region must exist in the DOM before content is
 * inserted. Each SnackbarRoot mirrors its rendered text into the appropriate
 * region via context, and text is cleared before filling so identical
 * consecutive messages re-announce.
 *
 * @see https://tetralogical.com/blog/2024/05/01/why-are-my-live-regions-not-working/
 * @see https://adrianroselli.com/2026/01/live-region-support.html
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'
  import { Portal } from '#v0/components/Portal'

  // Context
  import SnackbarAnnouncer from './SnackbarAnnouncer.vue'

  // Composables
  import { createContext } from '#v0/composables/createContext'
  import { useRaf } from '#v0/composables/useRaf'

  // Transformers
  import { toElement } from '#v0/composables/toElement'

  import { IN_BROWSER } from '#v0/constants/globals'

  // Utilities
  import { isNull } from '#v0/utilities'
  import { mergeProps, shallowReadonly, shallowRef, toRef, useTemplateRef, watch } from 'vue'

  // Types
  import type { AtomExpose, AtomProps } from '#v0/components/Atom'
  import type { ShallowRef } from 'vue'

  export interface SnackbarPortalContext {
    /** Mirror a message into the persistent announcers. Urgent routes to the assertive/alert region. */
    announce: (message: string, urgent?: boolean) => void
    /** Current polite (role="status") announcement text */
    polite: Readonly<ShallowRef<string>>
    /** Current assertive (role="alert") announcement text */
    assertive: Readonly<ShallowRef<string>>
  }

  const [usePortal, providePortal] =
    createContext<SnackbarPortalContext | null>({ suffix: 'portal' })

  export { usePortal as useSnackbarPortalContext }

  export interface SnackbarPortalProps extends AtomProps {
    /** Auto-render the Snackbar.Announcer live-region pair. Set false to omit it or place `<Snackbar.Announcer>` yourself. @default true */
    announcer?: boolean
    /** Namespace for dependency injection. @default 'v0:notifications' */
    namespace?: string
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
    announcer = true,
    as = 'div',
    namespace = 'v0:notifications',
    renderless,
    teleport = 'top-layer',
  } = defineProps<SnackbarPortalProps>()

  const polite = shallowRef('')
  const assertive = shallowRef('')

  let politeNext = ''
  let assertiveNext = ''

  const politeFrame = useRaf(() => {
    polite.value = politeNext
  })
  const assertiveFrame = useRaf(() => {
    assertive.value = assertiveNext
  })

  // Clear, then fill on the next frame — the mutation is what gets announced,
  // and clearing first lets identical consecutive messages re-announce. useRaf
  // dedupes rapid calls, so back-to-back announces coalesce to the latest
  // message per region instead of speaking stale intermediates.
  function announce (message: string, urgent = false) {
    const region = urgent ? assertive : polite
    region.value = ''

    if (urgent) {
      assertiveNext = message
      assertiveFrame()
    } else {
      politeNext = message
      politeFrame()
    }
  }

  providePortal(namespace, {
    announce,
    polite: shallowReadonly(polite),
    assertive: shallowReadonly(assertive),
  })

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

      <SnackbarAnnouncer v-if="announcer" :namespace />
    </template>
  </Portal>
</template>
