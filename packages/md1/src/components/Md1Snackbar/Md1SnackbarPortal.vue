<script lang="ts">
  // Framework
  import { createContext, isNull, Snackbar, useLogger } from '@vuetify/v0'

  // Utilities
  import { toRef } from 'vue'

  // Types
  import type { SnackbarPortalProps } from '@vuetify/v0'
  import type { Ref } from 'vue'

  export interface Md1SnackbarPortalContext {
    /** The notifications key the queue and the snackbars inside resolve when they are given none of their own. */
    namespace: Readonly<Ref<string>>
  }

  /**
   * Material Design 1 withholds `as`, `renderless` and `announcer` from v0's portal:
   * the portal is always the fixed bottom container, and the live-region pair
   * is what makes a freshly mounted snackbar heard, so it always renders.
   */
  export interface Md1SnackbarPortalProps extends Pick<SnackbarPortalProps, 'teleport' | 'namespace'> {}

  const [useMd1SnackbarPortal, provideMd1SnackbarPortal] = createContext<Md1SnackbarPortalContext | null>('md1:snackbar-portal', null)

  export { useMd1SnackbarPortal }

  /** Dev warning for a part rendered outside Md1SnackbarPortal: it renders, but nothing positions or announces it. */
  export function orphan (part: string, context: Md1SnackbarPortalContext | null): void {
    if (__DEV__ && isNull(context)) useLogger().warn(`[${part}] rendered outside <Md1SnackbarPortal>; it is neither positioned at the bottom edge nor announced`)
  }

  /** v0's notifications key, the one `createNotificationsPlugin()` installs under. */
  export const MD1_SNACKBAR_NAMESPACE = 'v0:notifications'
</script>

<script setup lang="ts">
  defineOptions({ name: 'Md1SnackbarPortal' })

  defineSlots<{
    /** An `Md1Snackbar.Queue`, or a single `Md1Snackbar` driven by `v-model`. */
    default?: () => any
  }>()

  // The prop type includes `false`, so Vue casts an absent `teleport` to false (inline); the default restores v0's.
  const { teleport = 'top-layer', namespace = MD1_SNACKBAR_NAMESPACE } = defineProps<Md1SnackbarPortalProps>()

  provideMd1SnackbarPortal({
    namespace: toRef(() => namespace),
  })
</script>

<template>
  <Snackbar.Portal class="md1-snackbar-portal" :namespace :teleport>
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
  .md1-snackbar-portal {
    position: fixed;
    inset-inline: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    pointer-events: none;
  }
</style>
