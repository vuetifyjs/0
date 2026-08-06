/**
 * @module BuHelp
 *
 * @remarks
 * Bulma `.help` — plain help text by default. With `validation` and an
 * ambient `Input.Root` context, wraps a renderless `Input.Error` so the error
 * id, `aria-live`, and `aria-errormessage` registration wire up automatically.
 * (`error` is reserved package-wide for the force-invalid override on form
 * controls, so the display switch is named `validation`.)
 */

<script lang="ts">
  // Framework
  import { InputError, isNull, useInputRoot } from '@vuetify/v0'

  // Utilities
  import { toRef, watchEffect } from 'vue'

  // Types
  import type { InputRootContext } from '@vuetify/v0'

  export type BuHelpColor = 'primary' | 'link' | 'info' | 'success' | 'warning' | 'danger'

  export interface BuHelpProps {
    /** Color modifier: `is-{color}` (defaults to `danger` in validation mode) */
    color?: BuHelpColor
    /** Namespace of the ambient Input.Root context */
    namespace?: string
    /** Render the ambient Input.Root validation errors via Input.Error */
    validation?: boolean
  }

  export interface BuHelpSlotProps {
    /** Validation errors from the ambient Input.Root (empty when unwired) */
    errors: string[]
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'BuHelp' })

  defineSlots<{
    default?: (props: BuHelpSlotProps) => any
  }>()

  const {
    color,
    namespace = 'v0:input:root',
    validation = false,
  } = defineProps<BuHelpProps>()

  // Optional injection: error wiring engages only inside an Input.Root scope
  // (a null default returns instead of throwing — only undefined throws)
  const root = useInputRoot(namespace, null as unknown as InputRootContext) as InputRootContext | null

  const wired = toRef(() => validation && !isNull(root))
  const tone = toRef(() => color ?? (validation ? 'danger' : undefined))

  if (__DEV__) {
    watchEffect(() => {
      if (validation && isNull(root)) {
        console.warn(
          '[BuHelp] `validation` is set but no ambient Input.Root context was found — errors will never render.',
          'BuInput creates its own renderless root scoped to its subtree; wrap the field in',
          '`<InputRoot renderless v-model :rules>` so sibling BuHelp/BuLabel wire up (see BuHelp.browser.test.ts).',
        )
      }
    })
  }
</script>

<template>
  <InputError
    v-if="wired"
    v-slot="{ errors, attrs }"
    :namespace
    renderless
  >
    <p v-bind="attrs" class="help" :class="tone && `is-${tone}`">
      <slot :errors>{{ errors.join(' ') }}</slot>
    </p>
  </InputError>

  <p v-else class="help" :class="tone && `is-${tone}`">
    <slot :errors="[]" />
  </p>
</template>
