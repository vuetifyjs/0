<script setup lang="ts">
  import { createValidation } from '@vuetify/v0'
  import { shallowRef } from 'vue'

  const password = shallowRef('')
  const validation = createValidation({ value: password })

  const rules = validation.onboard([
    { id: 'length', value: (v: unknown) => String(v).length >= 8 || 'At least 8 characters' },
    { id: 'upper', value: (v: unknown) => /[A-Z]/.test(String(v)) || 'Needs an uppercase letter' },
    { id: 'number', value: (v: unknown) => /\d/.test(String(v)) || 'Needs a number' },
    { id: 'special', value: (v: unknown) => /[!@#$%^&*]/.test(String(v)) || 'Needs a special character' },
  ])

  async function onValidate () {
    await validation.validate()
  }
</script>

<template>
  <div class="space-y-4">
    <!-- Input -->
    <div>
      <label class="block text-xs font-medium text-on-surface-variant mb-1">Password</label>

      <input
        v-model="password"
        class="w-full px-3 py-2 text-sm border rounded-lg bg-surface text-on-surface outline-none transition-colors"
        :class="validation.isValid.value === false ? 'border-error' : 'border-divider focus:border-primary'"
        placeholder="Enter a password"
        type="password"
      >
    </div>

    <!-- Rule toggles -->
    <div class="space-y-1.5">
      <p class="text-xs font-medium text-on-surface-variant">Active Rules</p>

      <label
        v-for="rule in rules"
        :key="rule.id"
        class="flex items-center gap-2 cursor-pointer"
      >
        <input
          :checked="rule.isSelected.value"
          class="accent-primary"
          type="checkbox"
          @change="rule.toggle()"
        >

        <span class="text-sm text-on-surface">{{ rule.id }}</span>
      </label>
    </div>

    <!-- Errors -->
    <div v-if="validation.errors.value.length > 0" class="space-y-1">
      <p
        v-for="(error, index) in validation.errors.value"
        :key="index"
        class="text-xs text-error"
      >
        {{ error }}
      </p>
    </div>

    <!-- Controls -->
    <div class="flex gap-2">
      <button
        class="px-3 py-1.5 text-xs font-medium rounded-lg bg-primary text-on-primary hover:opacity-90 transition-opacity"
        @click="onValidate"
      >
        Validate
      </button>

      <button
        class="px-3 py-1.5 text-xs font-medium rounded-lg border border-divider text-on-surface-variant hover:bg-surface-tint transition-colors"
        @click="validation.reset()"
      >
        Reset
      </button>
    </div>

    <!-- State -->
    <p class="text-xs text-on-surface-variant">
      {{ validation.selectedIds.size }}/{{ validation.size }} rules active
      &middot;
      Only selected rules run during validation.
    </p>
  </div>
</template>
