<script lang="ts">
  // Framework
  import { isNullOrUndefined, isUndefined, useId, useLocale, useLogger } from '@vuetify/v0'

  // Context
  import { orphan, useMd1List, useMd1ListItem } from './context'

  // Utilities
  import { nextTick, onBeforeUnmount, onMounted, onUpdated, shallowRef, toRef, useTemplateRef } from 'vue'

  // Components
  import Md1Icon from '../Md1Icon/Md1Icon.vue'
  import Md1Ripple from '../Md1Ripple/Md1Ripple.vue'

  export interface Md1ListReorderProps {
    /**
     * The row's name in the handle's label and the move announcements. Defaults
     * to the text of the row's `Primary`, else the whole tile's text.
     */
    label?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'Md1ListReorder' })

  const { label } = defineProps<Md1ListReorderProps>()

  const item = useMd1ListItem()
  const list = useMd1List()
  const locale = useLocale()

  orphan('Md1ListReorder', 'Md1List.Item', item)

  if (__DEV__ && !isNullOrUndefined(list) && list.select.value !== 'none') {
    useLogger().warn('[Md1ListReorder] a selectable list is a listbox and its options cannot host a reorder handle; use select="none"')
  }

  const engine = list?.reorder()

  if (__DEV__ && !isNullOrUndefined(list) && isUndefined(engine)) {
    useLogger().warn('[Md1ListReorder] the list has no v-model:order to move rows in; the handle is inert')
  }

  if (__DEV__ && !isNullOrUndefined(item) && isUndefined(item.value.value)) {
    useLogger().warn('[Md1ListReorder] its Md1List.Item has no value; give each item the value it has in v-model:order')
  }

  const handle = useTemplateRef<HTMLButtonElement>('handle')
  const hint = useId()

  // The tile's text, read after render: the row's name when no label is passed.
  const text = shallowRef('')

  function read () {
    const tile = item?.tile.value
    const primary = tile?.querySelector('.md1-list__primary') ?? tile

    text.value = primary?.textContent?.trim() ?? ''
  }

  onMounted(read)
  onUpdated(read)

  const name = toRef(() => label ?? text.value)
  const value = toRef(() => item?.value.value)
  const inert = toRef(() => isUndefined(engine) || isUndefined(value.value) || (item?.disabled.value ?? false))

  const unname = list?.name(value.value, () => name.value)

  const ticket = engine && !isUndefined(value.value)
    ? engine.dnd.draggables.register({
      el: handle,
      type: 'md1-list-item',
      value: value.value,
      disabled: inert,
    })
    : undefined

  onBeforeUnmount(() => {
    ticket?.unregister()
    unname?.()
  })

  const ariaLabel = toRef(() => {
    const row = name.value

    return locale.ti('Md1.reorder', { item: row }) ?? (row ? `Reorder ${row}` : 'Reorder')
  })

  const instructions = toRef(() => locale.ti('Md1.reorderHint') ?? 'Use the up and down arrow keys to move')

  function onKeydown (event: KeyboardEvent) {
    if (inert.value || isUndefined(engine) || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return

    const from = engine.index(value.value)
    const last = engine.size.value - 1
    const targets: Record<string, number> = {
      ArrowUp: from - 1,
      ArrowDown: from + 1,
      Home: 0,
      End: last,
    }
    const to = targets[event.key]

    if (isUndefined(to) || from === -1) return

    event.preventDefault()

    if (!engine.move(value.value, to, name.value)) return

    // Re-rendering the order moves the row's DOM node, which drops focus; the handle takes it back.
    nextTick(() => handle.value?.focus())
  }
</script>

<template>
  <div class="md1-list__action md1-list__reorder">
    <button
      ref="handle"
      :aria-describedby="hint"
      aria-keyshortcuts="ArrowUp ArrowDown Home End"
      :aria-label
      class="md1-list__handle"
      :data-dragging="(ticket?.isDragging.value) || undefined"
      :disabled="inert || undefined"
      type="button"
      @keydown="onKeydown"
    >
      <Md1Ripple />

      <Md1Icon name="reorder" />
    </button>

    <span :id="hint" class="md1-list__hint">{{ instructions }}</span>
  </div>
</template>
