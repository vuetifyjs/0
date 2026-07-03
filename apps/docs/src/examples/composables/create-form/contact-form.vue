<script setup lang="ts">
  import ContactForm from './ContactForm.vue'
  import ContactProvider from './ContactProvider.vue'
</script>

<template>
  <ContactProvider>
    <ContactForm />
  </ContactProvider>
</template>
