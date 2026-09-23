<script lang="ts">
  /**
   * @module Portal
   *
   * @see https://0.vuetifyjs.com/components/primitives/portal
   *
   * @remarks
   * Renderless component wrapping Vue's Teleport with automatic
   * useStack integration for z-index coordination.
   *
   * Standardizes the teleport + stack registration pattern used by
   * overlay components (Snackbar, Toast, Dialog, etc.).
   */

  // Composables
  import { useStack } from '#v0/composables/useStack'

  // Utilities
  import { isNumber } from '#v0/utilities'
  import { onScopeDispose, toRef, watch } from 'vue'

  const ranks = new Map<string, number>()
  let raising = false

  // Types
  import type { Extensible } from '#v0/types'

  export interface PortalProps {
    /** Teleport target. `'top-layer'` mounts into the topmost open modal. @default 'body' */
    to?: Extensible<'top-layer'> | HTMLElement
    /** Render inline instead of teleporting. @default false */
    disabled?: boolean
    /** Block scrim close. @default false */
    blocking?: boolean
    /** Whether a scrim/backdrop should back this portal. @default true */
    scrim?: boolean
    /**
     * Keep this portal above overlays that open later.
     * A number is the raise order when several promoted portals are open
     * (higher paints on top). `true` is order 0.
     */
    promote?: boolean | number
  }

  export interface PortalSlotProps {
    /**
     * Calculated z-index from useStack.
     *
     * @remarks
     * Must be applied to a **positioned** element (`position: relative`, `absolute`,
     * `fixed`, or `sticky`) to create a stacking context. Applying it to a
     * `position: static` element has no effect.
     */
    zIndex: number
    /** Close this portal (unselects from stack) */
    close: () => void
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'Portal' })

  defineSlots<{
    default: (props: PortalSlotProps) => any
  }>()

  const emit = defineEmits<{
    close: []
  }>()

  const {
    to,
    disabled = false,
    blocking = false,
    scrim = true,
    promote = false,
  } = defineProps<PortalProps>()

  const stack = useStack()
  // `disabled` is the Teleport toggle (render inline) — bound on <Teleport>
  // below. It must NOT reach the stack ticket, whose `disabled` means
  // selection-disabled: forwarding it makes ticket.select() a no-op, so an
  // inline portal is excluded from the stack (z-index pins to base, inline
  // portals collide, no dismiss/scrim coordination).
  const ticket = stack.register({
    blocking: () => blocking,
    scrim: () => scrim,
    onDismiss: () => emit('close'),
  })
  ticket.select()

  // Later overlays select() onto the end of the stack and would cover a tour
  // card. Promoted portals unselect and reselect, in rank order, so the
  // highest rank stays on top without two of them looping.
  if (promote !== false) {
    const rank = isNumber(promote) ? promote : 0
    const id = String(ticket.id)
    ranks.set(id, rank)
    onScopeDispose(() => {
      ranks.delete(id)
    })

    // scrim:false overlays are omitted from stack.top, and tour portals are
    // scrim:false. Order still drives z-index, so watch the full selection.
    watch(() => [...stack.selectedIds], ids => {
      if (raising) return

      const ordered = [...ranks.entries()].toSorted((a, b) => a[1] - b[1])
      const selected = ordered.filter(([id]) => ids.includes(id))
      if (selected.length === 0) return

      const tail = ids.slice(-selected.length)
      const want = selected.map(([id]) => id)
      if (tail.every((entry, index) => entry === want[index])) return

      raising = true
      for (const [id] of selected) {
        stack.unselect(id)
        stack.select(id)
      }
      raising = false
    }, { immediate: true })
  }

  const target = toRef(() => {
    const resolvedTo = to ?? stack.default.value ?? 'body'
    return resolvedTo === 'top-layer' ? stack.topElement.value ?? 'body' : resolvedTo
  })

  const slotProps = toRef((): PortalSlotProps => ({
    zIndex: ticket.zIndex.value,
    close: ticket.dismiss,
  }))
</script>

<template>
  <Teleport :disabled :to="target">
    <slot v-bind="slotProps" />
  </Teleport>
</template>
