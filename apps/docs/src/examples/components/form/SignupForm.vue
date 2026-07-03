<script setup lang="ts">
  import { Form, Input } from '@vuetify/v0'

  const {
    serverError,
    submit,
    reset,
  } = defineProps<{
    serverError?: string
    submit: (valid: boolean) => void
    reset: () => void
  }>()

  const name = defineModel<string>('name', { default: '' })
  const email = defineModel<string>('email', { default: '' })
  const password = defineModel<string>('password', { default: '' })
  const confirm = defineModel<string>('confirm', { default: '' })

  const input = 'w-full px-3 py-2 rounded-lg border border-divider bg-surface text-on-surface placeholder:text-on-surface-variant/50 outline-none data-[focused]:border-primary data-[state=invalid]:border-error transition-colors'

  const passwordRules = [
    (v: string) => !!v || 'Password is required',
    (v: string) => v.length >= 8 || 'At least 8 characters',
  ]

  // Cross-field rule — the confirm field validates against the password model
  const confirmRules = [
    (v: string) => v === password.value || 'Passwords must match',
  ]

  function onSubmit (payload: { valid: boolean }) {
    submit(payload.valid)
  }
</script>

<template>
  <Form
    class="flex flex-col gap-4"
    @reset="reset"
    @submit="onSubmit"
  >
    <Input.Root
      v-model="name"
      label="Name"
      :rules="[(v: string) => !!v || 'Name is required']"
      validate-on="blur lazy"
    >
      <Input.Control
        autocomplete="name"
        :class="input"
        placeholder="Jane Smith"
      />

      <Input.Error v-slot="{ errors }" class="text-xs text-error">
        <span v-for="error in errors" :key="error">{{ error }}</span>
      </Input.Error>
    </Input.Root>

    <Input.Root
      v-model="email"
      :error="!!serverError"
      :error-messages="serverError"
      label="Email"
      :rules="[
        (v: string) => !!v || 'Email is required',
        (v: string) => /.+@.+\..+/.test(v) || 'Must be a valid email',
      ]"
      type="email"
      validate-on="blur lazy"
    >
      <Input.Control
        autocomplete="email"
        :class="input"
        placeholder="jane@example.com"
      />

      <Input.Error v-slot="{ errors }" class="text-xs text-error">
        <span v-for="error in errors" :key="error">{{ error }}</span>
      </Input.Error>
    </Input.Root>

    <Input.Root
      v-model="password"
      label="Password"
      :rules="passwordRules"
      type="password"
      validate-on="blur lazy"
    >
      <Input.Control
        autocomplete="new-password"
        :class="input"
        placeholder="At least 8 characters"
      />

      <Input.Error v-slot="{ errors }" class="text-xs text-error">
        <span v-for="error in errors" :key="error">{{ error }}</span>
      </Input.Error>
    </Input.Root>

    <Input.Root
      v-model="confirm"
      label="Confirm password"
      :rules="confirmRules"
      type="password"
      validate-on="blur lazy"
    >
      <Input.Control
        autocomplete="new-password"
        :class="input"
        placeholder="Re-enter your password"
      />

      <Input.Error v-slot="{ errors }" class="text-xs text-error">
        <span v-for="error in errors" :key="error">{{ error }}</span>
      </Input.Error>
    </Input.Root>

    <div class="flex gap-2">
      <button
        class="px-4 py-2 rounded-lg bg-primary text-on-primary text-sm font-medium"
        type="submit"
      >
        Create account
      </button>

      <button
        class="px-4 py-2 rounded-lg border border-divider text-on-surface text-sm"
        type="reset"
      >
        Reset
      </button>
    </div>
  </Form>
</template>
