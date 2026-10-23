<script lang="ts">
  // Framework
  import { AlertDialog, createContext, Dialog, isNull, useLogger } from '@vuetify/v0'

  // Utilities
  import { shallowRef, toRef, watch } from 'vue'

  // Types
  import type { DialogRootProps } from '@vuetify/v0'
  import type { Ref, ShallowRef } from 'vue'

  /** The dialogs page's four types: alerts, simple dialogs, confirmation dialogs and full-screen dialogs. */
  export type Md1DialogVariant = 'alert' | 'simple' | 'confirmation' | 'full-screen'

  export interface Md1DialogContext {
    /** The namespace the v0 root was given, so every part resolves the same v0 context. */
    namespace: Readonly<Ref<string | undefined>>
    variant: Readonly<Ref<Md1DialogVariant>>
    dismissible: Readonly<Ref<boolean>>
    dirty: Readonly<Ref<boolean>>
    isOpen: Readonly<Ref<boolean>>
    /** The choice the dialog holds while open; `v-model:value` receives it on commit. */
    value: Readonly<Ref<unknown>>
    /** A dirty full-screen dialog is asking whether to discard its changes. */
    confirming: ShallowRef<boolean>
    open: () => void
    /** Dismiss. A dirty full-screen dialog prompts for the discard first. */
    close: () => void
    /** Hold a choice. A simple dialog commits it and closes at once. */
    commit: (value: unknown) => void
    /** Write the held choice to `v-model:value`, close, and return it. */
    confirm: () => unknown
    /** Close a dirty full-screen dialog and drop its changes. */
    discard: () => void
  }

  /**
   * MD1 withholds `as` and `renderless` from v0's dialog root: the root is
   * always the renderless state owner and `Md1Dialog.Content` is the `<dialog>`.
   */
  export interface Md1DialogProps extends Pick<DialogRootProps, 'id' | 'namespace'> {
    /**
     * `alert` interrupts with a decision on `AlertDialog`; `simple` offers a
     * list whose choice commits and closes; `confirmation` holds a choice until
     * OK; `full-screen` fills a handset viewport under 600 px.
     */
    variant?: Md1DialogVariant
    /** `false` disables the outside click and Escape so an action must be chosen (dialogs page). */
    dismissible?: boolean
    /** A full-screen dialog with unsaved changes: closing it prompts for the discard first (dialogs page). */
    dirty?: boolean
  }

  export interface Md1DialogSlotProps {
    /** Whether the dialog is open. */
    isOpen: boolean
    /** Open the dialog. */
    open: () => void
    /** Dismiss the dialog; a dirty full-screen dialog prompts first. */
    close: () => void
    /** The choice held while open. */
    value: unknown
    /** Hold a choice; a simple dialog commits it and closes. */
    commit: (value: unknown) => void
  }

  const [useMd1Dialog, provideMd1Dialog] = createContext<Md1DialogContext | null>('md1:dialog', null)

  export { useMd1Dialog }

  /**
   * Parts read the root through the optional context, so a part placed outside
   * `Md1Dialog` renders inert instead of throwing on its own account; the warning
   * says why nothing happens. Parts that also need a v0 context still throw, as v0 does.
   */
  export function orphan (part: string, context: Md1DialogContext | null) {
    if (__DEV__ && isNull(context)) {
      useLogger().warn(`[${part}] rendered outside <Md1Dialog>; its state is inert`)
    }
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'Md1Dialog' })

  defineSlots<{
    /** The activator, the content, and the parts inside it. */
    default?: (props: Md1DialogSlotProps) => any
  }>()

  defineEmits<{
    'update:model-value': [value: boolean]
    'update:value': [value: unknown]
  }>()

  const {
    id,
    namespace,
    variant = 'alert',
    dismissible = true,
    dirty = false,
  } = defineProps<Md1DialogProps>()

  const open = defineModel<boolean>({ default: false })
  const value = defineModel<unknown>('value')

  const logger = useLogger()

  // What the dialog holds while open. A confirmation dialog confirms one value
  // only, so the consumer's model is written on OK, not while the radios move.
  const pending = shallowRef<unknown>(value.value)
  const confirming = shallowRef(false)

  watch(value, current => {
    pending.value = current
  })

  // Opening starts from the committed value; closing by any path but a commit
  // discards what was held: "Cancel, Back or leaving the dialog discards changes".
  watch(open, () => {
    pending.value = value.value
    confirming.value = false
  })

  if (__DEV__) {
    watch(() => dirty && variant !== 'full-screen', wrong => {
      if (wrong) logger.warn('[Md1Dialog] `dirty` prompts a full-screen dialog before discarding; the other variants discard on Cancel')
    }, { immediate: true })
  }

  function show () {
    open.value = true
  }

  function close () {
    if (variant === 'full-screen' && dirty) {
      confirming.value = true

      return
    }

    open.value = false
  }

  function commit (next: unknown) {
    pending.value = next

    // Choosing an option in a simple dialog commits it immediately and closes.
    if (variant === 'simple') {
      value.value = next
      open.value = false
    }
  }

  function confirm (): unknown {
    const next = pending.value

    value.value = next
    open.value = false

    return next
  }

  function discard () {
    confirming.value = false
    open.value = false
  }

  provideMd1Dialog({
    namespace: toRef(() => namespace),
    variant: toRef(() => variant),
    dismissible: toRef(() => dismissible),
    dirty: toRef(() => dirty),
    isOpen: toRef(() => open.value),
    value: toRef(() => pending.value),
    confirming,
    open: show,
    close,
    commit,
    confirm,
    discard,
  })

  const slotProps = toRef((): Md1DialogSlotProps => ({
    isOpen: open.value,
    open: show,
    close,
    value: pending.value,
    commit,
  }))
</script>

<template>
  <AlertDialog.Root v-if="variant === 'alert'" :id v-model="open" :namespace>
    <slot v-bind="slotProps" />
  </AlertDialog.Root>

  <Dialog.Root v-else :id v-model="open" :namespace>
    <slot v-bind="slotProps" />
  </Dialog.Root>
</template>
