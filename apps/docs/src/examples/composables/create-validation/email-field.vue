<script setup lang="ts">
  import EmailField from './EmailField.vue'
  import { useEmailField } from './useEmailField'

  const { email, touched, status, errors, isValid, isValidating, onBlur, reset } = useEmailField()
</script>

<template>
  <div class="max-w-sm mx-auto space-y-4">
    <EmailField
      v-model="email"
      :errors
      :is-validating
      :status
      @blur="onBlur"
    />

    <button
      class="px-3 py-1.5 text-xs font-medium rounded-lg border border-divider text-on-surface-variant hover:bg-surface-tint transition-colors"
      @click="reset"
    >
      Reset
    </button>

    <div class="border border-divider rounded-lg p-3 bg-surface-variant/30 text-xs space-y-1">
      <p class="font-medium text-on-surface-variant mb-1">Validation State</p>

      <p>
        <span class="text-on-surface-variant">status: </span>
        <span class="text-on-surface">{{ status }}</span>
      </p>

      <p>
        <span class="text-on-surface-variant">isValid: </span>

        <span
          :class="{
            'text-success': isValid === true,
            'text-error': isValid === false,
            'text-on-surface-variant': isValid === null,
          }"
        >
          {{ isValid ?? 'null' }}
        </span>
      </p>

      <p>
        <span class="text-on-surface-variant">isValidating: </span>
        <span :class="isValidating ? 'text-warning' : 'text-on-surface-variant'">{{ isValidating }}</span>
      </p>

      <p>
        <span class="text-on-surface-variant">touched: </span>
        <span class="text-on-surface">{{ touched }}</span>
      </p>

      <p>
        <span class="text-on-surface-variant">errors: </span>
        <span class="text-on-surface">{{ errors.length }}</span>
      </p>

      <p class="text-on-surface-variant/70 pt-1">
        Validation runs on blur. Try "jane@example.com" (registered) or "you@example.com" (available).
      </p>
    </div>
  </div>
</template>
