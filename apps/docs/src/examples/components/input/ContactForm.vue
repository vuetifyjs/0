<script setup lang="ts">
  import { Input } from '@vuetify/v0'

  const {
    serverError,
    submit,
    reset,
  } = defineProps<{
    serverError?: string
    submit: () => Promise<void>
    reset: () => void
  }>()

  const name = defineModel<string>('name', { default: '' })
  const email = defineModel<string>('email', { default: '' })
  const message = defineModel<string>('message', { default: '' })

  const input = 'w-full px-3 py-2 rounded-lg border border-divider bg-surface text-on-surface placeholder:text-on-surface-variant/50 outline-none data-[focused]:border-primary data-[state=invalid]:border-error transition-colors'
</script>

<template>
  <form
    class="flex flex-col gap-4"
    @submit.prevent="submit"
  >
    <Input.Root
      v-model="name"
      label="Name"
      :rules="[(v: string) => !!v || 'Name is required']"
      validate-on="blur lazy"
    >
      <Input.Control
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
        :class="input"
        placeholder="jane@example.com"
      />

      <Input.Error v-slot="{ errors }" class="text-xs text-error">
        <span v-for="error in errors" :key="error">{{ error }}</span>
      </Input.Error>
    </Input.Root>

    <Input.Root
      v-model="message"
      label="Message"
      :rules="[
        (v: string) => !!v || 'Message is required',
        (v: string) => v.length >= 10 || 'At least 10 characters',
      ]"
      validate-on="blur lazy"
    >
      <Input.Control
        as="textarea"
        :class="[input, 'min-h-24 resize-y']"
        placeholder="Your message..."
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
        Submit
      </button>

      <button
        class="px-4 py-2 rounded-lg border border-divider text-on-surface text-sm"
        type="button"
        @click="reset"
      >
        Reset
      </button>
    </div>
  </form>
</template>
