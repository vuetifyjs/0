<script lang="ts">
  // Framework
  import { createContext, isNull, Snackbar, useLogger } from '@vuetify/v0'

  // Utilities
  import { toRef, useAttrs } from 'vue'

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
  defineOptions({ name: 'Md1SnackbarPortal', inheritAttrs: false })

  defineSlots<{
    /** An `Md1Snackbar.Queue`, or a single `Md1Snackbar` driven by `v-model`. */
    default?: () => any
  }>()

  // The prop type includes `false`, so Vue casts an absent `teleport` to false (inline); the default restores v0's.
  const { teleport = 'top-layer', namespace = MD1_SNACKBAR_NAMESPACE } = defineProps<Md1SnackbarPortalProps>()

  const attrs = useAttrs()

  provideMd1SnackbarPortal({
    namespace: toRef(() => namespace),
  })
</script>

<!--
  Renderless, so the container leaves out the stack's inline z-index: v0's
  stack numbers every portal from 2000 up, which would lift the snackbar over
  the bottom navigation. The stylesheet places it on the elevation ladder
  instead. Overlays opened over it still stack above, and a modal dialog
  still takes it into the top layer through `teleport`.
-->
<template>
  <Snackbar.Portal :namespace renderless :teleport>
    <div v-bind="attrs" class="md1-snackbar-portal">
      <slot />
    </div>
  </Snackbar.Portal>
</template>

<!--
  Unscoped: Snackbar.Portal teleports and renders the announcer beside the
  container, so a scoped data-v never lands on it. The class positions itself:
  v0 applies the stack z-index inline and only nudges a static wrapper to
  relative, which would leave the snackbar in the page flow.
-->
<style>
  /*
   * z-index 3: a 6 dp snackbar sits above content and the 4 dp app bar
   * (z-index 2) and behind the 8 dp bottom navigation (z-index 4), so it rises
   * from behind the bar (bottom navigation page, "snackbar-behind-bar");
   * sheets, drawers and dialogs stack above it through v0's stack.
   */
  .md1-snackbar-portal {
    z-index: 3;
    position: fixed;
    inset-inline: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    pointer-events: none;
  }
</style>
