/**
 * @module BuNumberFieldInput
 *
 * @remarks
 * Bulma `.control > input.input` — the middle `.control` of the addon group,
 * whose corners Bulma squares off (`bulma.css:6254-6257`). The wrapper is
 * structural, so the part renders it; `expanded` puts `is-expanded` on it
 * (`bulma.css:6300`) so the input eats the leftover width.
 *
 * The input is v0's `NumberField.Control`: `role="spinbutton"`,
 * `inputmode="decimal"`, the full `aria-value*` set, keyboard stepping, the
 * typing guard, and focus-dependent display. `is-danger` is component-owned
 * and comes from v0's `isValid === false`, never from a prop.
 */

<script lang="ts">
  // Framework
  import { NumberFieldControl, useNumberFieldRoot } from '@vuetify/v0'

  // Utilities
  import { orphan } from '../../utilities/context'
  import { toRef } from 'vue'

  // Context
  import { useBuNumberField } from '../BuNumberField/BuNumberField.vue'

  export interface BuNumberFieldInputProps {
    /** Fill the leftover width of the addon group: `is-expanded` on the control */
    expanded?: boolean
    /** Namespace of the NumberField.Root context (the parent's wins when nested) */
    namespace?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'BuNumberFieldInput' })

  const {
    expanded = false,
    namespace = 'v0:number-field:root',
  } = defineProps<BuNumberFieldInputProps>()

  const field = useBuNumberField()

  orphan('BuNumberFieldInput', 'BuNumberField', field)

  const ns = field?.namespace ?? namespace

  // Throws V0_CONTEXT_MISSING outside a NumberField.Root — the same contract
  // every part backed by a v0 context inherits (BuPanelBlock, BuModalTitle).
  const root = useNumberFieldRoot(ns)

  const classes = toRef(() => [
    field?.size() && `is-${field.size()}`,
    field?.rounded() && 'is-rounded',
    { 'is-danger': root.isValid.value === false },
  ])
</script>

<template>
  <div class="control" :class="{ 'is-expanded': expanded }">
    <NumberFieldControl class="input" :class="classes" :namespace="ns" />
  </div>
</template>
