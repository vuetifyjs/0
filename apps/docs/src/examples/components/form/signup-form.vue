<script setup lang="ts">
  import { Button } from '@vuetify/v0'
  import SignupForm from './SignupForm.vue'
  import { useSignup } from './useSignup'

  const { name, email, password, confirm, submitted, serverError, onSubmit, reset } = useSignup()
</script>

<template>
  <div class="max-w-sm mx-auto">
    <div v-if="submitted" class="flex flex-col gap-2 p-4 rounded-lg bg-surface-variant text-on-surface">
      <p class="text-sm font-medium">Account created</p>
      <p class="text-sm">Welcome, {{ submitted.name }}!</p>
      <p class="text-sm text-on-surface-variant">{{ submitted.email }}</p>

      <Button.Root
        class="self-start mt-2 px-3 py-1 rounded-lg border border-divider text-sm"
        @click="reset"
      >
        Start over
      </Button.Root>
    </div>

    <SignupForm
      v-else
      v-model:confirm="confirm"
      v-model:email="email"
      v-model:name="name"
      v-model:password="password"
      :reset
      :server-error
      :submit="onSubmit"
    />

    <p class="mt-3 text-xs text-on-surface-variant">
      Try submitting with <code class="text-primary">taken@example.com</code> to see server-side error injection.
    </p>
  </div>
</template>
