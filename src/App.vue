<template>
  <main class="p-8 space-y-6">
    <div class="space-y-4">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Component Demo</h1>

      <div class="space-y-4">
        <h2 class="text-lg font-semibold text-gray-700 dark:text-gray-300">VButton Examples</h2>
        <div class="flex flex-wrap gap-3">
          <VButton>Default Button</VButton>
          <VButton as="button" type="button">HTML Button</VButton>
          <VButton as="a" href="#">Link Button</VButton>
          <VButton disabled>Disabled Button</VButton>
        </div>

        <p class="text-sm text-gray-600 dark:text-gray-400">
          Try pressing Tab to see the keyboard focus effects with ring and offset.
        </p>
      </div>

      <div class="space-y-4">
        <h2 class="text-lg font-semibold text-gray-700 dark:text-gray-300">Dialog Example</h2>
        <VDialog />
      </div>

      <form class="space-y-4">
        <h2 class="text-lg font-semibold text-gray-700 dark:text-gray-300">Form Example</h2>
        <label class="block" for="content">
          <span class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Input Field</span>
          <input
            id="content"
            v-model="content"
            class="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            placeholder="Type something..."
            type="text"
          >
        </label>
        <VButton type="submit">Submit Form</VButton>
      </form>
    </div>
  </main>
</template>

<script setup>
  import { ref } from 'vue'
  import VDialog from './components/VDialog/VDialog.vue'
  import { VButton } from './components/VButton'

  const content = ref('')
</script>
