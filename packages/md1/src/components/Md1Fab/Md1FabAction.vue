<script lang="ts">
  // Framework
  import { isUndefined, Menu, useId } from '@vuetify/v0'

  // Context
  import { orphan, useMd1Fab } from './Md1Fab.vue'

  // Utilities
  import { onBeforeUnmount, useAttrs, useTemplateRef } from 'vue'

  // Types
  import type { Md1IconName } from '../../icons'
  import type { ComponentPublicInstance } from 'vue'

  // Components
  import Md1Icon from '../Md1Icon/Md1Icon.vue'
  import Md1Ripple from '../Md1Ripple/Md1Ripple.vue'

  export interface Md1FabActionProps {
    /** The 24 dp glyph in the 40 dp circle, an Md1Icon role. */
    icon: Md1IconName
    /**
     * The action's name: the label sheet beside the circle and the accessible
     * name of the menu item. Required, since the circle carries only a glyph.
     */
    label: string
    /** What the FAB's `select` event reports for this action; the label when unset. */
    value?: unknown
  }

  /** The keys that activate a native button. */
  const KEYS = new Set(['Enter', ' '])
</script>

<script setup lang="ts">
  defineOptions({ name: 'Md1FabAction', inheritAttrs: false })

  const { icon, label, value } = defineProps<Md1FabActionProps>()

  const attrs = useAttrs()
  const context = useMd1Fab()
  const item = useTemplateRef<ComponentPublicInstance>('item')

  orphan('Md1FabAction', context)

  const id = useId()

  context?.register(id)

  onBeforeUnmount(() => {
    context?.unregister(id)
  })

  function onClick () {
    context?.select(isUndefined(value) ? label : value)
  }

  /*
   * Menu.Content activates a highlighted item on Enter and Space and cancels
   * the key's default, so a keyboard activation fires no click and a
   * consumer's @click would only hear the pointer. Stopping the two keys at
   * the item lets the native button click instead: one activation path for
   * pointer and keyboard, still through Menu.Item's own click handler.
   */
  function onKeydown (event: KeyboardEvent) {
    if (event.isComposing || !KEYS.has(event.key)) return

    event.stopPropagation()
  }

  /** The label is part of the target: a press on it is a press on the action. */
  function onLabel () {
    const el = item.value?.$el

    if (el instanceof HTMLElement) el.click()
  }
</script>

<template>
  <template v-if="context">
    <Menu.Item
      ref="item"
      v-bind="attrs"
      :aria-label="label"
      as="button"
      class="md1-fab__action"
      :label
      :namespace="context.namespace.value"
      type="button"
      @click="onClick"
      @keydown="onKeydown"
    >
      <Md1Ripple />

      <Md1Icon :name="icon" />
    </Menu.Item>

    <span
      aria-hidden="true"
      class="md1-fab__label"
      @click="onLabel"
    >{{ label }}</span>
  </template>
</template>
