<script setup lang="ts">
  import { createContactForm, provideContactForm } from './context'

  const form = createContactForm()

  provideContactForm(form)
</script>

<template>
  <slot />
</template>
