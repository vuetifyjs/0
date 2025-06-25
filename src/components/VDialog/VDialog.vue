<script setup>
  import { Dialog } from '@/lib/Dialog'
  import { VButton } from '@/components/VButton'
  const isOpen = ref(false)
</script>

<template>
  <Dialog.Root v-model="isOpen">
    <Dialog.Trigger v-slot="props" renderless>
      <VButton v-bind="props">
        Open Dialog2
      </VButton>
    </Dialog.Trigger>
    <Dialog.Backdrop class="fixed inset-0 bg-gradient-to-br from-black/40 to-black/60 backdrop-blur-lg backdrop-saturate-180 z-50 transition-all duration-300 ease-out cursor-pointer data-[state=closed]:opacity-0 data-[state=closed]:backdrop-blur-none data-[state=closed]:backdrop-saturate-100 data-[state=closed]:pointer-events-none data-[state=closed]:scale-105 data-[state=open]:opacity-100 data-[state=open]:scale-100 before:content-[''] before:absolute before:inset-0 before:bg-gradient-radial before:from-white/10 before:to-transparent before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100 dark:from-black/70 dark:to-black/90 dark:before:from-white/5" />
    <Dialog.Portal>
      <Dialog.Content as="section" class="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-900 p-6 rounded-xl shadow-2xl max-w-md w-full mx-4 z-50 transition-all duration-300 ease-out data-[state=closed]:opacity-0 data-[state=closed]:scale-95 data-[state=closed]:translate-y-4 data-[state=open]:opacity-100 data-[state=open]:scale-100 data-[state=open]:translate-y--1/2 border border-gray-200 dark:border-gray-700">
        <slot>
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4 leading-tight">Dialog with VueUse Focus Trap</h2>

          <p class="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">This dialog uses VueUse's useFocusTrap integration. Try pressing Tab to navigate through the focusable elements.</p>

          <div class="space-y-3 mb-6">
            <label class="block" for="name-input">
              <span class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Name</span>
              <input
                id="name-input"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                placeholder="Enter your name"
                type="text"
              >
            </label>
            <label class="block" for="email-input">
              <span class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Email</span>
              <input
                id="email-input"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                placeholder="Enter your email"
                type="email"
              >
            </label>
            <VButton class="w-full">
              Submit
            </VButton>
          </div>
        </slot>

        <div class="flex gap-2 justify-end">
          <VButton class="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 focus:ring-gray-500">
            Cancel
          </VButton>
          <Dialog.Close
            :class="[
              'inline-flex items-center justify-center',
              'px-4 py-2',
            ]"
          >
            Close
          </Dialog.Close>
        </div>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
</template>
