<script lang="ts">
  // Framework
  import { isArray, isNullOrUndefined, isString, isUndefined, useId } from '@vuetify/v0'

  // Context
  import Md1ListAction from './Md1ListAction.vue'

  import { orphan, provideMd1ListItem, useMd1List } from './context'

  // Utilities
  import { Fragment, mergeProps, onBeforeUnmount, onMounted, shallowRef, toRef, useAttrs, useTemplateRef } from 'vue'

  // Types
  import type { Md1ListLines } from './context'
  import type { SetupContext, VNode } from 'vue'

  import Md1Ripple from '../Md1Ripple/Md1Ripple.vue'

  export interface Md1ListItemProps {
    /**
     * What the item stands for in the model: the option's value under
     * `select="single" | "multiple"`, the destination under `select="none"`
     * (the item whose value equals the model is the current one).
     */
    value?: unknown
    /** Makes the tile a link: the navigation list's primary action. */
    href?: string
    /** Inert: the disabled ink, no activation, no ripple. */
    disabled?: boolean
    /** One, two or three lines of text: 48 (56 with an avatar), 72 or 88 dp. Defaults to the list's `lines`. */
    lines?: Md1ListLines
    /** Puts the text on the content keyline (72 dp, 80 dp from 600 px) with no avatar or icon beside it. */
    inset?: boolean
  }

  interface SliceProps {
    part: 'body' | 'action'
  }

  function flatten (nodes: VNode[]): VNode[] {
    return nodes.flatMap(node => node.type === Fragment && isArray(node.children)
      ? flatten(node.children as VNode[])
      : [node])
  }

  /**
   * The item's one slot holds the tile's content and its secondary action
   * together. The action is a separate target (lists: controls page), so it
   * renders beside the tile rather than inside it, where a switch or a
   * checkbox would nest one control inside another.
   */
  function Slice (props: SliceProps, { slots }: SetupContext): VNode[] {
    const action = props.part === 'action'

    return flatten(slots.default?.() ?? []).filter(node => (node.type === Md1ListAction) === action)
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'Md1ListItem', inheritAttrs: false })

  defineSlots<{
    /** `Avatar` or `Icon`, `Content`, then `Action`; plain text works for a one-line item. */
    default?: () => any
  }>()

  const {
    value,
    href,
    disabled = false,
    lines,
    inset = false,
  } = defineProps<Md1ListItemProps>()

  const attrs = useAttrs()
  const list = useMd1List()

  orphan('Md1ListItem', 'Md1List', list)

  const id = useId()
  const tile = useTemplateRef<HTMLElement>('tile')

  const ticket = list?.selection.register({
    id,
    value: isUndefined(value) ? id : value,
    disabled: () => disabled,
    el: tile,
  })

  onBeforeUnmount(() => {
    ticket?.unregister()
  })

  const listbox = toRef(() => !isNullOrUndefined(list) && list.select.value !== 'none')
  const selected = toRef(() => ticket?.isSelected.value ?? false)
  const count = toRef(() => lines ?? list?.lines.value ?? 1)

  const tag = toRef(() => {
    if (listbox.value) return 'div'
    if (isString(href)) return 'a'
    if (!isUndefined(value) || !isNullOrUndefined(attrs.onClick)) return 'button'

    // No primary action: a static row with no ripple and no hover.
    return 'div'
  })

  const interactive = toRef(() => listbox.value || tag.value !== 'div')

  // Only the tiles present when the list mounts play the staggered entrance.
  const enter = shallowRef(!isNullOrUndefined(list) && !isNullOrUndefined(ticket) && !list.entered.value)
  const delay = enter.value ? `calc(${ticket?.index ?? 0} * var(--md1-stagger, 20ms))` : undefined

  onMounted(() => {
    // A row inside a closed group is not on screen at mount: it must not replay the entrance when the group opens.
    if (enter.value && tile.value?.checkVisibility?.() === false) enter.value = false
  })

  // Once played, the entrance is spent; a later display change (a group closing and opening) would otherwise restart it.
  function onAnimationend (event: AnimationEvent) {
    if (event.target === event.currentTarget) enter.value = false
  }

  function activate () {
    if (disabled || isNullOrUndefined(ticket) || isNullOrUndefined(list)) return

    if (list.select.value === 'multiple') ticket.toggle()
    else if (listbox.value || !isUndefined(value)) ticket.select()
  }

  function onClick (event: MouseEvent) {
    if (disabled) {
      event.preventDefault()
      return
    }

    activate()
  }

  function onKeydown (event: KeyboardEvent) {
    if (event.key !== 'Enter' && event.key !== ' ') return

    event.preventDefault()
    activate()
  }

  function onFocus () {
    list?.focus(id)
  }

  const bindings = toRef(() => {
    if (listbox.value) {
      return mergeProps({
        'role': 'option',
        'aria-selected': selected.value,
        'aria-disabled': disabled || undefined,
        'tabindex': !disabled && list?.tabbable(id) ? 0 : -1,
        onClick,
        onKeydown,
        onFocus,
      }, attrs)
    }

    if (tag.value === 'a') {
      return mergeProps({
        'href': disabled ? undefined : href,
        'aria-disabled': disabled || undefined,
        'aria-current': selected.value ? 'page' : undefined,
        onClick,
      }, attrs)
    }

    if (tag.value === 'button') {
      return mergeProps({
        'type': 'button',
        'disabled': disabled || undefined,
        'aria-current': selected.value ? 'true' : undefined,
        onClick,
      }, attrs)
    }

    return mergeProps({ 'aria-disabled': disabled || undefined }, attrs)
  })

  provideMd1ListItem({
    selected,
    disabled: toRef(() => disabled),
  })
</script>

<template>
  <li
    class="md1-list__item"
    :data-disabled="disabled || undefined"
    :data-enter="enter || undefined"
    :data-inset="inset || undefined"
    :data-lines="String(count)"
    :data-selected="selected || undefined"
    :role="listbox ? 'none' : undefined"
    :style="enter && delay ? { animationDelay: delay } : undefined"
    @animationcancel="onAnimationend"
    @animationend="onAnimationend"
  >
    <component :is="tag" ref="tile" class="md1-list__tile" v-bind="bindings">
      <Md1Ripple v-if="interactive" />

      <span class="md1-list__body">
        <Slice part="body">
          <slot />
        </Slice>
      </span>
    </component>

    <Slice part="action">
      <slot />
    </Slice>
  </li>
</template>
