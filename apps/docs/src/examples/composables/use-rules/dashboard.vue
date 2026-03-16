<script setup lang="ts">
  import { createValidation, isNull } from '@vuetify/v0'
  import { computed, shallowRef } from 'vue'
  import { provideRules } from './context'
  import FormField from './FormField.vue'

  provideRules()

  function input (label: string, placeholder: string, rules: Parameters<typeof createValidation>[0]['rules']) {
    const value = shallowRef('')
    const validation = createValidation({ value, rules })
    return { label, placeholder, value, validation }
  }

  const fields = [
    input('Key Name', 'e.g. production-api', ['required', 'slug']),
    input('Owner Email', 'e.g. ops@company.com', ['required', 'email']),
    input('Rate Limit (req/s)', '1–10000', [
      'required',
      (v: unknown) => !v || !Number.isNaN(Number(v)) || 'Must be a number',
    ]),
    input('Prefix', 'e.g. PROD', ['required', 'prefix']),
  ]

  const aggregate = computed(() => {
    let hasNull = false
    for (const { validation } of fields) {
      if (validation.isValid.value === false) return false
      if (isNull(validation.isValid.value)) hasNull = true
    }
    return hasNull ? null : true
  })

  async function onSubmit () {
    for (const field of fields) {
      await field.validation.validate()
    }
  }

  function onReset () {
    for (const field of fields) {
      field.value.value = ''
      field.validation.reset()
    }
  }

  function onPrefill () {
    fields[0]!.value.value = 'production-api'
    fields[1]!.value.value = 'ops@company.com'
    fields[2]!.value.value = '1000'
    fields[3]!.value.value = 'PROD'
  }

  function onBreak () {
    fields[0]!.value.value = 'BAD KEY!'
    fields[1]!.value.value = 'not-an-email'
    fields[2]!.value.value = 'abc'
    fields[3]!.value.value = 'lo'
  }
</script>

<template>
  <div class="space-y-4">
    <!-- Fields -->
    <div class="grid grid-cols-2 gap-4">
      <FormField
        v-for="field in fields"
        :key="field.label"
        :label="field.label"
        :placeholder="field.placeholder"
        :validation="field.validation"
        @input="field.value.value = $event"
      />
    </div>

    <!-- Controls -->
    <div class="flex flex-wrap gap-2">
      <button
        class="px-3 py-1.5 text-xs font-medium rounded bg-primary text-on-primary hover:opacity-90"
        @click="onSubmit"
      >
        Validate All
      </button>

      <button
        class="px-3 py-1.5 text-xs font-medium rounded bg-surface-variant text-on-surface-variant hover:opacity-90"
        @click="onReset"
      >
        Reset
      </button>

      <button
        class="px-3 py-1.5 text-xs font-medium rounded bg-success text-on-success hover:opacity-90"
        @click="onPrefill"
      >
        Fill Valid Data
      </button>

      <button
        class="px-3 py-1.5 text-xs font-medium rounded bg-error text-on-error hover:opacity-90"
        @click="onBreak"
      >
        Fill Invalid Data
      </button>
    </div>

    <!-- State Panel -->
    <div class="border border-divider rounded p-3 bg-surface-variant/30">
      <p class="text-xs font-medium text-on-surface-variant mb-1.5">Validation State</p>

      <div class="grid grid-cols-4 gap-3 text-xs">
        <div v-for="field in fields" :key="field.label" class="space-y-0.5">
          <p class="font-medium text-on-surface">{{ field.label }}</p>

          <p>
            <span class="text-on-surface-variant">valid: </span>
            <span :class="field.validation.isValid.value === true ? 'text-success' : field.validation.isValid.value === false ? 'text-error' : 'text-on-surface-variant'">
              {{ field.validation.isValid.value ?? 'null' }}
            </span>
          </p>

          <p>
            <span class="text-on-surface-variant">errors: </span>
            <span class="text-error">{{ field.validation.errors.value.length }}</span>
          </p>

          <p>
            <span class="text-on-surface-variant">rules: </span>
            <span class="text-on-surface">{{ field.validation.selectedIds.size }}/{{ field.validation.size }}</span>
          </p>
        </div>
      </div>

      <div class="mt-2 pt-2 border-t border-divider flex gap-4 text-xs">
        <p>
          <span class="text-on-surface-variant">aggregate isValid: </span>
          <span
            class="font-medium"
            :class="aggregate === true ? 'text-success' : aggregate === false ? 'text-error' : 'text-on-surface-variant'"
          >
            {{ aggregate ?? 'null' }}
          </span>
        </p>

        <p>
          <span class="text-on-surface-variant">fields: </span>
          <span class="text-on-surface">{{ fields.length }}</span>
        </p>
      </div>
    </div>
  </div>
</template>
