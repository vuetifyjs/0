<script setup lang="ts">
  import { createValidation } from '@vuetify/v0'
  import { ref, shallowRef, toRef } from 'vue'

  import { useContactForm, type FieldConfig } from './context'

  const form = useContactForm()

  const configs: FieldConfig[] = [
    {
      key: 'name',
      label: 'Name',
      type: 'text',
      autocomplete: 'name',
      placeholder: 'Jane Doe',
      rules: [
        (v: unknown) => !!v || 'Name is required',
        (v: unknown) => String(v).length >= 2 || 'At least 2 characters',
      ],
    },
    {
      key: 'email',
      label: 'Email',
      type: 'email',
      autocomplete: 'email',
      placeholder: 'jane@example.com',
      rules: [
        (v: unknown) => !!v || 'Email is required',
        (v: unknown) => /^.+@\S+\.\S+$/.test(String(v)) || 'Enter a valid email address',
      ],
    },
    {
      key: 'message',
      label: 'Message',
      type: 'text',
      autocomplete: 'off',
      placeholder: 'Tell us what you think...',
      multiline: true,
      rules: [
        (v: unknown) => !!v || 'Message is required',
        (v: unknown) => String(v).length >= 10 || 'At least 10 characters',
      ],
    },
  ]

  const values = ref<Record<string, string>>(
    Object.fromEntries(configs.map(config => [config.key, ''])),
  )

  const fields = configs.map(config => {
    const validation = createValidation({
      value: () => values.value[config.key],
      rules: config.rules,
    })
    form.register({ value: validation })
    return { config, validation }
  })

  const submitted = shallowRef(false)

  const status = toRef(() => {
    if (form.isValid.value === true) return 'valid'
    if (form.isValid.value === false) return 'invalid'
    return 'pending'
  })

  async function onSubmit () {
    submitted.value = false
    const valid = await form.submit()
    if (valid) submitted.value = true
  }

  function onReset () {
    for (const config of configs) values.value[config.key] = ''
    form.reset()
    submitted.value = false
  }
</script>

<template>
  <div class="space-y-4">
    <div v-for="field in fields" :key="field.config.key">
      <label class="block text-xs font-medium text-on-surface-variant mb-1">
        {{ field.config.label }}
      </label>

      <textarea
        v-if="field.config.multiline"
        v-model="values[field.config.key]"
        :autocomplete="field.config.autocomplete"
        class="w-full px-3 py-2 text-sm border rounded-lg bg-surface text-on-surface outline-none resize-none transition-colors"
        :class="field.validation.errors.value.length > 0 ? 'border-error' : 'border-divider focus:border-primary'"
        :placeholder="field.config.placeholder"
        rows="3"
      />

      <input
        v-else
        v-model="values[field.config.key]"
        :autocomplete="field.config.autocomplete"
        class="w-full px-3 py-2 text-sm border rounded-lg bg-surface text-on-surface outline-none transition-colors"
        :class="field.validation.errors.value.length > 0 ? 'border-error' : 'border-divider focus:border-primary'"
        :placeholder="field.config.placeholder"
        :type="field.config.type"
      >

      <p v-if="field.validation.errors.value.length > 0" class="mt-1 text-xs text-error">
        {{ field.validation.errors.value[0] }}
      </p>
    </div>

    <div class="flex items-center gap-2">
      <button
        class="px-4 py-2 text-sm font-medium rounded-lg bg-primary text-on-primary hover:opacity-90 transition-opacity disabled:opacity-50"
        :disabled="form.isValidating.value"
        @click="onSubmit"
      >
        Submit
      </button>

      <button
        class="px-4 py-2 text-sm font-medium rounded-lg border border-divider text-on-surface-variant hover:bg-surface-tint transition-colors"
        @click="onReset"
      >
        Reset
      </button>
    </div>

    <div
      class="px-3 py-2 rounded-lg text-xs"
      :class="{
        'bg-surface-variant/30 text-on-surface-variant': status === 'pending',
        'bg-success/10 text-success': status === 'valid',
        'bg-error/10 text-error': status === 'invalid',
      }"
    >
      <template v-if="submitted">Message sent. Thanks for reaching out.</template>
      <template v-else-if="status === 'invalid'">Please fix the errors above.</template>

      <template v-else>
        {{ form.size }} fields registered &middot; validity: {{ form.isValid.value ?? 'not run' }}
      </template>
    </div>
  </div>
</template>
