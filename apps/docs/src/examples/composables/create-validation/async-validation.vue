<script setup lang="ts">
  import { createValidation } from '@vuetify/v0'
  import { shallowRef, toRef } from 'vue'

  const taken = new Set(['admin', 'root', 'test', 'user', 'demo'])

  const username = shallowRef('')
  const validation = createValidation({
    value: username,
    rules: [
      (v: unknown) => !!v || 'Username is required',
      (v: unknown) => String(v).length >= 3 || 'At least 3 characters',
      (v: unknown) => /^[a-z0-9_]+$/.test(String(v)) || 'Lowercase letters, numbers, and underscores only',
      async (v: unknown) => {
        await new Promise(r => setTimeout(r, 800))
        return !taken.has(String(v)) || `"${v}" is already taken`
      },
    ],
  })

  const border = toRef(() => {
    if (validation.isValidating.value) return 'border-warning'
    if (validation.isValid.value === true) return 'border-success'
    if (validation.isValid.value === false) return 'border-error'
    return 'border-divider focus-within:border-primary'
  })

  async function onValidate () {
    await validation.validate()
  }
</script>

<template>
  <div class="space-y-4">
    <!-- Input -->
    <div>
      <label class="block text-xs font-medium text-on-surface-variant mb-1">Username</label>

      <div class="relative">
        <input
          v-model="username"
          class="w-full px-3 py-2 text-sm border rounded-lg bg-surface text-on-surface outline-none transition-colors"
          :class="border"
          placeholder="pick a username"
          @input="validation.reset()"
        >

        <!-- Spinner -->
        <div
          v-if="validation.isValidating.value"
          class="absolute right-3 top-1/2 -translate-y-1/2 size-4 border-2 border-warning border-t-transparent rounded-full animate-spin"
        />

        <!-- Check -->
        <span
          v-else-if="validation.isValid.value === true"
          class="absolute right-3 top-1/2 -translate-y-1/2 text-success text-sm"
        >
          Available
        </span>
      </div>
    </div>

    <!-- Errors -->
    <div v-if="validation.errors.value.length > 0" class="space-y-1">
      <p
        v-for="(error, index) in validation.errors.value"
        :key="index"
        class="text-xs text-error flex items-center gap-1"
      >
        <span class="size-1 rounded-full bg-error shrink-0" />
        {{ error }}
      </p>
    </div>

    <!-- Controls -->
    <div class="flex gap-2">
      <button
        class="px-3 py-1.5 text-xs font-medium rounded-lg bg-primary text-on-primary hover:opacity-90 transition-opacity disabled:opacity-40"
        :disabled="validation.isValidating.value"
        @click="onValidate"
      >
        Check Availability
      </button>

      <button
        class="px-3 py-1.5 text-xs font-medium rounded-lg border border-divider text-on-surface-variant hover:bg-surface-tint transition-colors"
        @click="validation.reset()"
      >
        Reset
      </button>
    </div>

    <!-- State -->
    <div class="border border-divider rounded-lg p-3 bg-surface-variant/30 text-xs space-y-1">
      <p class="font-medium text-on-surface-variant mb-1">Validation State</p>

      <p>
        <span class="text-on-surface-variant">isValid: </span>

        <span
          :class="{
            'text-success': validation.isValid.value === true,
            'text-error': validation.isValid.value === false,
            'text-on-surface-variant': validation.isValid.value === null,
          }"
        >
          {{ validation.isValid.value ?? 'null' }}
        </span>
      </p>

      <p>
        <span class="text-on-surface-variant">isValidating: </span>

        <span :class="validation.isValidating.value ? 'text-warning' : 'text-on-surface-variant'">
          {{ validation.isValidating.value }}
        </span>
      </p>

      <p>
        <span class="text-on-surface-variant">errors: </span>
        <span class="text-on-surface">{{ validation.errors.value.length }}</span>
      </p>

      <p>
        <span class="text-on-surface-variant">rules: </span>
        <span class="text-on-surface">{{ validation.size }} ({{ validation.selectedIds.size }} active)</span>
      </p>

      <p class="text-on-surface-variant/70 pt-1">
        Try: "admin", "root", "test" (taken) or "hello" (available)
      </p>
    </div>
  </div>
</template>
