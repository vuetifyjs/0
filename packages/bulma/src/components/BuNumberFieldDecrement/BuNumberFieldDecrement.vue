/**
 * @module BuNumberFieldDecrement
 *
 * @remarks
 * Bulma `.control > button.button` — the first `.control` of the addon group,
 * which is what gives it the left corner radii (`bulma.css:6259-6263`). The
 * wrapper is structural, so the part renders it rather than leaving userland
 * free to compose a group with broken radii.
 *
 * The button is v0's `NumberField.Decrement`: `type="button"`, `tabindex="-1"`
 * (APG spinbutton — keyboard access is via the input), a localized
 * `aria-label`, spin-on-hold, and the native `disabled` attribute at the lower
 * bound or when the field is disabled/readonly. The default slot content is
 * the `−` glyph; override it for an icon.
 */

<script lang="ts">
  // Framework
  import { NumberFieldDecrement } from '@vuetify/v0'

  // Utilities
  import { orphan } from '../../utilities/context'
  import { toRef } from 'vue'

  // Context
  import { useBuNumberField } from '../BuNumberField/BuNumberField.vue'

  export interface BuNumberFieldDecrementProps {
    /** Namespace of the NumberField.Root context (the parent's wins when nested) */
    namespace?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'BuNumberFieldDecrement' })

  defineSlots<{
    /** Button content — defaults to the `−` glyph. */
    default?: () => any
  }>()

  const { namespace = 'v0:number-field:root' } = defineProps<BuNumberFieldDecrementProps>()

  const field = useBuNumberField()

  orphan('BuNumberFieldDecrement', 'BuNumberField', field)

  const ns = field?.namespace ?? namespace

  const classes = toRef(() => [
    field?.color() && `is-${field.color()}`,
    field?.size() && `is-${field.size()}`,
    field?.rounded() && 'is-rounded',
  ])
</script>

<template>
  <div class="control">
    <NumberFieldDecrement class="button" :class="classes" :namespace="ns">
      <slot>&minus;</slot>
    </NumberFieldDecrement>
  </div>
</template>
