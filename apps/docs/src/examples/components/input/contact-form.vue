<script setup lang="ts">
  import ContactForm from './ContactForm.vue'
  import { useContact } from './useContact'

  const { name, email, message, submitted, serverError, submit, reset } = useContact()
</script>

<template>
  <div class="max-w-sm mx-auto">
    <div v-if="submitted" class="flex flex-col gap-2 p-4 rounded-lg bg-surface-variant text-on-surface">
      <p class="text-sm font-medium">Submitted!</p>
      <p class="text-sm">{{ submitted.name }} &lt;{{ submitted.email }}&gt;</p>
      <p class="text-sm text-on-surface-variant">{{ submitted.message }}</p>

      <button
        class="self-start mt-2 px-3 py-1 rounded-lg border border-divider text-sm"
        @click="reset"
      >
        Start over
      </button>
    </div>

    <ContactForm
      v-else
      v-model:email="email"
      v-model:message="message"
      v-model:name="name"
      :reset
      :server-error
      :submit
    />

    <p class="mt-3 text-xs text-on-surface-variant">
      Try submitting with <code class="text-primary">taken@example.com</code> to see server-side error injection.
    </p>
  </div>
</template>
