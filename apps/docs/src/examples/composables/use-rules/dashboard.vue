<script setup lang="ts">
  import { createValidation } from '@vuetify/v0'
  import { provideRules } from './context'
  import FormField from './FormField.vue'

  provideRules()

  const validation = createValidation()

  const fields = [
    {
      label: 'Key Name',
      placeholder: 'e.g. production-api',
      ticket: validation.register({
        id: 'name',
        value: '',
        rules: ['required', 'slug'],
      }),
    },
    {
      label: 'Owner Email',
      placeholder: 'e.g. ops@company.com',
      ticket: validation.register({
        id: 'email',
        value: '',
        rules: ['required', 'email'],
      }),
    },
    {
      label: 'Rate Limit (req/s)',
      placeholder: '1–10000',
      ticket: validation.register({
        id: 'rate',
        value: '',
        rules: [
          'required',
          (v: unknown) => !v || !Number.isNaN(Number(v)) || 'Must be a number',
        ],
      }),
    },
    {
      label: 'Prefix',
      placeholder: 'e.g. PROD',
      ticket: validation.register({
        id: 'prefix',
        value: '',
        rules: ['required', 'prefix'],
      }),
    },
  ]

  async function onSubmit () {
    for (const field of validation.values()) {
      await field.validate()
    }
  }

  function onReset () {
    for (const field of validation.values()) {
      field.reset()
    }
  }

  function onPrefill () {
    fields[0]!.ticket.value = 'production-api'
    fields[1]!.ticket.value = 'ops@company.com'
    fields[2]!.ticket.value = '1000'
    fields[3]!.ticket.value = 'PROD'
  }

  function onBreak () {
    fields[0]!.ticket.value = 'BAD KEY!'
    fields[1]!.ticket.value = 'not-an-email'
    fields[2]!.ticket.value = 'abc'
    fields[3]!.ticket.value = 'lo'
  }
</script>

<template>
  <div class="space-y-4">
    <!-- Fields -->
    <div class="grid grid-cols-2 gap-4">
      <FormField
        v-for="field in fields"
        :key="field.ticket.id"
        :label="field.label"
        :placeholder="field.placeholder"
        :ticket="field.ticket"
        @input="field.ticket.value = $event"
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
        <div v-for="field in fields" :key="field.ticket.id" class="space-y-0.5">
          <p class="font-medium text-on-surface">{{ field.ticket.id }}</p>

          <p>
            <span class="text-on-surface-variant">valid: </span>
            <span :class="field.ticket.isValid.value === true ? 'text-success' : field.ticket.isValid.value === false ? 'text-error' : 'text-on-surface-variant'">
              {{ field.ticket.isValid.value ?? 'null' }}
            </span>
          </p>

          <p>
            <span class="text-on-surface-variant">pristine: </span>
            <span :class="field.ticket.isPristine.value ? 'text-on-surface-variant' : 'text-warning'">
              {{ field.ticket.isPristine.value }}
            </span>
          </p>

          <p>
            <span class="text-on-surface-variant">errors: </span>
            <span class="text-error">{{ field.ticket.errors.value.length }}</span>
          </p>
        </div>
      </div>

      <div class="mt-2 pt-2 border-t border-divider flex gap-4 text-xs">
        <p>
          <span class="text-on-surface-variant">aggregate isValid: </span>
          <span
            class="font-medium"
            :class="validation.isValid.value === true ? 'text-success' : validation.isValid.value === false ? 'text-error' : 'text-on-surface-variant'"
          >
            {{ validation.isValid.value ?? 'null' }}
          </span>
        </p>

        <p>
          <span class="text-on-surface-variant">fields: </span>
          <span class="text-on-surface">{{ validation.size }}</span>
        </p>
      </div>
    </div>
  </div>
</template>
