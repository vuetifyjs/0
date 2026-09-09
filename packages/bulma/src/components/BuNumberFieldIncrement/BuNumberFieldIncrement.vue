/**
 * @module BuNumberFieldIncrement
 *
 * @remarks
 * Bulma `.control > button.button` — the last `.control` of the addon group,
 * which is what gives it the right corner radii (`bulma.css:6265-6269`). The
 * wrapper is structural, so the part renders it rather than leaving userland
 * free to compose a group with broken radii.
 *
 * The button is v0's `NumberField.Increment`: `type="button"`, `tabindex="-1"`
 * (APG spinbutton — keyboard access is via the input), a localized
 * `aria-label`, spin-on-hold, and the native `disabled` attribute at the upper
 * bound or when the field is disabled/readonly. The default slot content is
 * the `+` glyph; override it for an icon.
 */

<script lang="ts">
  // Framework
  import { NumberFieldIncrement } from '@vuetify/v0'

  // Utilities
  import { orphan } from '../../utilities/context'
  import { toRef } from 'vue'

  // Context
  import { useBuNumberField } from '../BuNumberField/BuNumberField.vue'

  export interface BuNumberFieldIncrementProps {
    /** Namespace of the NumberField.Root context (the parent's wins when nested) */
    namespace?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'BuNumberFieldIncrement' })

  defineSlots<{
    /** Button content — defaults to the `+` glyph. */
    default?: () => any
  }>()

  const { namespace = 'v0:number-field:root' } = defineProps<BuNumberFieldIncrementProps>()

  const field = useBuNumberField()

  orphan('BuNumberFieldIncrement', 'BuNumberField', field)

  const ns = field?.namespace ?? namespace

  const classes = toRef(() => [
    field?.color() && `is-${field.color()}`,
    field?.size() && `is-${field.size()}`,
    field?.rounded() && 'is-rounded',
  ])
</script>

<template>
  <div class="control">
    <NumberFieldIncrement class="button" :class="classes" :namespace="ns">
      <slot>+</slot>
    </NumberFieldIncrement>
  </div>
</template>
