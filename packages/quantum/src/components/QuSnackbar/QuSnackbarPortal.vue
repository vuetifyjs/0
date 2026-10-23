<script lang="ts">
  // Framework
  import { createContext, isNull, Snackbar, useLogger } from '@vuetify/v0'

  // Utilities
  import { toRef } from 'vue'

  // Types
  import type { SnackbarPortalProps } from '@vuetify/v0'
  import type { Ref } from 'vue'

  export interface QuSnackbarPortalContext {
    /** The notifications key the queue and the snackbars inside resolve when they are given none of their own. */
    namespace: Readonly<Ref<string>>
  }

  /**
   * Quantum withholds `as`, `renderless` and `announcer` from v0's portal:
   * the portal is always the fixed bottom container, and the live-region pair
   * is what makes a freshly mounted snackbar heard, so it always renders.
   */
  export interface QuSnackbarPortalProps extends Pick<SnackbarPortalProps, 'teleport' | 'namespace'> {}

  const [useQuSnackbarPortal, provideQuSnackbarPortal] = createContext<QuSnackbarPortalContext | null>('quantum:snackbar-portal', null)

  export { useQuSnackbarPortal }

  /** Dev warning for a part rendered outside QuSnackbarPortal: it renders, but nothing positions or announces it. */
  export function orphan (part: string, context: QuSnackbarPortalContext | null): void {
    if (__DEV__ && isNull(context)) useLogger().warn(`[${part}] rendered outside <QuSnackbarPortal>; it is neither positioned at the bottom edge nor announced`)
  }

  /** v0's notifications key, the one `createNotificationsPlugin()` installs under. */
  export const QU_SNACKBAR_NAMESPACE = 'v0:notifications'
</script>

<script setup lang="ts">
  defineOptions({ name: 'QuSnackbarPortal' })

  defineSlots<{
    /** A `QuSnackbar.Queue`, or a single `QuSnackbar` driven by `v-model`. */
    default?: () => any
  }>()

  // The prop type includes `false`, so Vue casts an absent `teleport` to false (inline); the default restores v0's.
  const { teleport = 'top-layer', namespace = QU_SNACKBAR_NAMESPACE } = defineProps<QuSnackbarPortalProps>()

  provideQuSnackbarPortal({
    namespace: toRef(() => namespace),
  })
</script>

<template>
  <Snackbar.Portal class="quantum-snackbar-portal" :namespace :teleport>
    <slot />
  </Snackbar.Portal>
</template>

<!--
  Unscoped: Snackbar.Portal teleports and renders the announcer beside the
  container, so a scoped data-v never lands on it. The class positions itself:
  v0 applies the stack z-index inline and only nudges a static wrapper to
  relative, which would leave the snackbar in the page flow.
-->
<style>
  .quantum-snackbar-portal {
    position: fixed;
    inset-inline: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    pointer-events: none;
  }
</style>
