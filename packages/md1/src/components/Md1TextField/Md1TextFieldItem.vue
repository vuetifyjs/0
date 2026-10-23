<script lang="ts">
  // Framework
  import { isNull, Select, useLogger } from '@vuetify/v0'

  // Context
  import { useMd1TextField } from './Md1TextField.vue'

  // Utilities
  import { toRef } from 'vue'

  // Components
  import Md1Ripple from '../Md1Ripple/Md1Ripple.vue'

  export interface Md1TextFieldItemProps {
    /** The value the field's `v-model` takes when this option is chosen. */
    value: string
    /** The option shows at the disabled opacity and cannot be chosen. */
    disabled?: boolean
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'Md1TextFieldItem' })

  defineSlots<{
    /** The option text. Defaults to `value`. */
    default?: () => any
  }>()

  const { value, disabled = false } = defineProps<Md1TextFieldItemProps>()

  const context = useMd1TextField()

  // An option only has a list to join inside a dropdown field.
  const active = toRef(() => !isNull(context) && context.dropdown.value)

  if (__DEV__ && !active.value) {
    useLogger().warn('[Md1TextFieldItem] rendered outside <Md1TextField dropdown>; it renders nothing')
  }
</script>

<template>
  <Select.Item
    v-if="active"
    class="md1-text-field__item"
    :disabled
    :value
  >
    <Md1Ripple />

    <slot>{{ value }}</slot>
  </Select.Item>
</template>

<!--
  The dropdown's 48 dp rows: Subheading text 16 dp from the sheet's edges
  (menus page); hover and the keyboard highlight take the 6% overlay, the
  chosen option the 12% one.
-->
<style>
  .md1-text-field__item {
    position: relative;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    height: var(--md1-touch-target, 48px);
    padding: 0 var(--md1-spacing-2, 16px);
    overflow: hidden;
    font-size: var(--md1-type-subheading-size, 16px);
    line-height: 20px;
    color: var(--md1-text-primary, rgba(0, 0, 0, 0.87));
    text-overflow: ellipsis;
    white-space: nowrap;
    cursor: pointer;
    user-select: none;
  }

  .md1-text-field__item:hover,
  .md1-text-field__item[data-highlighted] {
    background: var(--md1-hover, rgba(0, 0, 0, 0.06));
  }

  .md1-text-field__item[data-selected] {
    background: var(--md1-focus, rgba(0, 0, 0, 0.12));
  }

  .md1-text-field__item[data-disabled] {
    color: var(--md1-text-disabled, rgba(0, 0, 0, 0.38));
    background: transparent;
    cursor: default;
  }
</style>
