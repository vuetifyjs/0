<script setup lang="ts">
  import { createForm, createValidation } from '@vuetify/v0'
  import { shallowRef, toRef } from 'vue'

  const form = createForm()

  const name = shallowRef('')
  const nameValidation = createValidation({
    value: name,
    rules: [
      (v: unknown) => !!v || 'Name is required',
      (v: unknown) => String(v).length >= 2 || 'At least 2 characters',
    ],
  })
  form.register({ value: nameValidation })

  const email = shallowRef('')
  const emailValidation = createValidation({
    value: email,
    rules: [
      (v: unknown) => !!v || 'Email is required',
      (v: unknown) => /^.+@\S+\.\S+$/.test(String(v)) || 'Invalid email address',
    ],
  })
  form.register({ value: emailValidation })

  const message = shallowRef('')
  const messageValidation = createValidation({
    value: message,
    rules: [
      (v: unknown) => !!v || 'Message is required',
      (v: unknown) => String(v).length >= 10 || 'At least 10 characters',
    ],
  })
  form.register({ value: messageValidation })

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
    name.value = ''
    email.value = ''
    message.value = ''
    form.reset()
    submitted.value = false
  }
</script>

<template>
  <div class="space-y-4">
    <!-- Name -->
    <div>
      <label class="block text-xs font-medium text-on-surface-variant mb-1">Name</label>

      <input
        v-model="name"
        class="w-full px-3 py-2 text-sm border rounded-lg bg-surface text-on-surface outline-none transition-colors"
        :class="nameValidation.errors.value.length > 0 ? 'border-error' : 'border-divider focus:border-primary'"
        placeholder="Jane Doe"
      >

      <p v-if="nameValidation.errors.value.length > 0" class="mt-1 text-xs text-error">
        {{ nameValidation.errors.value[0] }}
      </p>
    </div>

    <!-- Email -->
    <div>
      <label class="block text-xs font-medium text-on-surface-variant mb-1">Email</label>

      <input
        v-model="email"
        class="w-full px-3 py-2 text-sm border rounded-lg bg-surface text-on-surface outline-none transition-colors"
        :class="emailValidation.errors.value.length > 0 ? 'border-error' : 'border-divider focus:border-primary'"
        placeholder="jane@example.com"
        type="email"
      >

      <p v-if="emailValidation.errors.value.length > 0" class="mt-1 text-xs text-error">
        {{ emailValidation.errors.value[0] }}
      </p>
    </div>

    <!-- Message -->
    <div>
      <label class="block text-xs font-medium text-on-surface-variant mb-1">Message</label>

      <textarea
        v-model="message"
        class="w-full px-3 py-2 text-sm border rounded-lg bg-surface text-on-surface outline-none resize-none transition-colors"
        :class="messageValidation.errors.value.length > 0 ? 'border-error' : 'border-divider focus:border-primary'"
        placeholder="Tell us what you think..."
        rows="3"
      />

      <p v-if="messageValidation.errors.value.length > 0" class="mt-1 text-xs text-error">
        {{ messageValidation.errors.value[0] }}
      </p>
    </div>

    <!-- Actions -->
    <div class="flex items-center gap-2">
      <button
        class="px-4 py-2 text-sm font-medium rounded-lg bg-primary text-on-primary hover:opacity-90 transition-opacity"
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

    <!-- Status -->
    <div
      class="px-3 py-2 rounded-lg text-xs"
      :class="{
        'bg-surface-variant/30 text-on-surface-variant': status === 'pending',
        'bg-success/10 text-success': status === 'valid',
        'bg-error/10 text-error': status === 'invalid',
      }"
    >
      <template v-if="submitted">Form submitted successfully.</template>
      <template v-else-if="status === 'invalid'">Please fix the errors above.</template>

      <template v-else>
        {{ form.size }} fields registered &middot; validation: {{ form.isValid.value ?? 'not run' }}
      </template>
    </div>
  </div>
</template>
