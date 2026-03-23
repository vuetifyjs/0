<script setup lang="ts">
  import { Form, Input } from '@vuetify/v0'
  import { shallowRef } from 'vue'

  const valid = shallowRef<boolean | null>(null)
  const email = shallowRef('')
  const password = shallowRef('')
  const submitted = shallowRef(false)

  function onSubmit ({ valid }: { valid: boolean }) {
    if (!valid) return

    submitted.value = true
  }

  function onReset () {
    email.value = ''
    password.value = ''
    submitted.value = false
  }
</script>

<template>
  <Form v-model="valid" class="flex flex-col gap-4 max-w-sm mx-auto" @reset="onReset" @submit="onSubmit">
    <Input.Root
      id="email"
      v-model="email"
      label="Email"
      :rules="[
        (v: string) => !!v || 'Email is required',
        (v: string) => /.+@.+\..+/.test(v) || 'Must be a valid email',
      ]"
      type="email"
    >
      <label class="text-sm font-medium text-on-surface" for="email">Email</label>

      <Input.Control
        class="w-full px-3 py-2 rounded-lg border border-divider bg-surface text-on-surface placeholder:text-on-surface-variant/50 outline-none data-[focused]:border-primary data-[state=invalid]:border-error transition-colors"
        placeholder="you@example.com"
      />

      <Input.Error v-slot="{ errors }" class="text-xs text-error">
        <span v-for="error in errors" :key="error">{{ error }}</span>
      </Input.Error>
    </Input.Root>

    <Input.Root
      id="password"
      v-model="password"
      label="Password"
      :rules="[
        (v: string) => !!v || 'Password is required',
        (v: string) => v.length >= 8 || 'Must be at least 8 characters',
      ]"
      type="password"
    >
      <label class="text-sm font-medium text-on-surface" for="password">Password</label>

      <Input.Control
        class="w-full px-3 py-2 rounded-lg border border-divider bg-surface text-on-surface placeholder:text-on-surface-variant/50 outline-none data-[focused]:border-primary data-[state=invalid]:border-error transition-colors"
        placeholder="••••••••"
      />

      <Input.Error v-slot="{ errors }" class="text-xs text-error">
        <span v-for="error in errors" :key="error">{{ error }}</span>
      </Input.Error>
    </Input.Root>

    <div class="flex gap-2">
      <button
        class="px-4 py-2 rounded-lg bg-primary text-on-primary font-medium text-sm"
        type="submit"
      >
        Sign in
      </button>

      <button
        class="px-4 py-2 rounded-lg border border-divider text-on-surface text-sm"
        type="reset"
      >
        Reset
      </button>
    </div>

    <p v-if="submitted" class="text-sm text-success">
      Form submitted successfully!
    </p>
  </Form>
</template>
