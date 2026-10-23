<script lang="ts">
  // Framework
  import { isUndefined, Menu, useId } from '@vuetify/v0'

  // Context
  import { orphan, useQuFab } from './QuFab.vue'

  // Utilities
  import { onBeforeUnmount, useAttrs, useTemplateRef } from 'vue'

  // Types
  import type { QuIconName } from '../../icons'
  import type { ComponentPublicInstance } from 'vue'

  // Components
  import QuIcon from '../QuIcon/QuIcon.vue'
  import QuRipple from '../QuRipple/QuRipple.vue'

  export interface QuFabActionProps {
    /** The 24 dp glyph in the 40 dp circle, a QuIcon role. */
    icon: QuIconName
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
  defineOptions({ name: 'QuFabAction', inheritAttrs: false })

  const { icon, label, value } = defineProps<QuFabActionProps>()

  const attrs = useAttrs()
  const context = useQuFab()
  const item = useTemplateRef<ComponentPublicInstance>('item')

  orphan('QuFabAction', context)

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
      class="quantum-fab__action"
      :label
      :namespace="context.namespace.value"
      type="button"
      @click="onClick"
      @keydown="onKeydown"
    >
      <QuRipple />

      <QuIcon :name="icon" />
    </Menu.Item>

    <span
      aria-hidden="true"
      class="quantum-fab__label"
      @click="onLabel"
    >{{ label }}</span>
  </template>
</template>
