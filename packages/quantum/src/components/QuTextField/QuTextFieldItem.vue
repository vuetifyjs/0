<script lang="ts">
  // Framework
  import { isNull, Select, useLogger } from '@vuetify/v0'

  // Context
  import { useQuTextField } from './QuTextField.vue'

  // Utilities
  import { toRef } from 'vue'

  // Components
  import QuRipple from '../QuRipple/QuRipple.vue'

  export interface QuTextFieldItemProps {
    /** The value the field's `v-model` takes when this option is chosen. */
    value: string
    /** The option shows at the disabled opacity and cannot be chosen. */
    disabled?: boolean
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'QuTextFieldItem' })

  defineSlots<{
    /** The option text. Defaults to `value`. */
    default?: () => any
  }>()

  const { value, disabled = false } = defineProps<QuTextFieldItemProps>()

  const context = useQuTextField()

  // An option only has a list to join inside a dropdown field.
  const active = toRef(() => !isNull(context) && context.dropdown.value)

  if (__DEV__ && !active.value) {
    useLogger().warn('[QuTextFieldItem] rendered outside <QuTextField dropdown>; it renders nothing')
  }
</script>

<template>
  <Select.Item
    v-if="active"
    class="quantum-text-field__item"
    :disabled
    :value
  >
    <QuRipple />

    <slot>{{ value }}</slot>
  </Select.Item>
</template>

<!--
  The dropdown's 48 dp rows: Subheading text 16 dp from the sheet's edges
  (menus page); hover and the keyboard highlight take the 6% overlay, the
  chosen option the 12% one.
-->
<style>
  .quantum-text-field__item {
    position: relative;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    height: var(--quantum-touch-target, 48px);
    padding: 0 var(--quantum-spacing-2, 16px);
    overflow: hidden;
    font-size: var(--quantum-type-subheading-size, 16px);
    line-height: 20px;
    color: var(--quantum-text-primary, rgba(0, 0, 0, 0.87));
    text-overflow: ellipsis;
    white-space: nowrap;
    cursor: pointer;
    user-select: none;
  }

  .quantum-text-field__item:hover,
  .quantum-text-field__item[data-highlighted] {
    background: var(--quantum-hover, rgba(0, 0, 0, 0.06));
  }

  .quantum-text-field__item[data-selected] {
    background: var(--quantum-focus, rgba(0, 0, 0, 0.12));
  }

  .quantum-text-field__item[data-disabled] {
    color: var(--quantum-text-disabled, rgba(0, 0, 0, 0.38));
    background: transparent;
    cursor: default;
  }
</style>
