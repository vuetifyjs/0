<script setup lang="ts">
  import { Input } from '@vuetify/v0'
  import { ref } from 'vue'

  const email = ref('')
</script>

<template>
  <div class="flex flex-col gap-1 max-w-sm">
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
      <label class="text-sm font-medium text-on-surface" for="email">
        Email
      </label>
      <Input.Control
        class="w-full px-3 py-2 rounded-lg border border-divider bg-surface text-on-surface placeholder:text-on-surface-variant/50 outline-none data-[focused]:border-primary data-[state=invalid]:border-error transition-colors"
        placeholder="you@example.com"
      />

      <Input.Description class="text-xs text-on-surface-variant">
        We'll never share your email.
      </Input.Description>

      <Input.Error v-slot="{ errors }" class="text-xs text-error">
        <span v-for="error in errors" :key="error">{{ error }}</span>
      </Input.Error>
    </Input.Root>
  </div>
</template>
