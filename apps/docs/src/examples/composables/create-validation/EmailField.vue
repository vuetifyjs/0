<script setup lang="ts">
  import type { FieldStatus } from './useEmailField'

  const { errors = [], isValidating = false, status = 'idle' } = defineProps<{
    errors?: string[]
    isValidating?: boolean
    status?: FieldStatus
  }>()

  const email = defineModel<string>({ default: '' })

  const emit = defineEmits<{ blur: [] }>()
</script>

<template>
  <div class="space-y-2">
    <label class="block text-xs font-medium text-on-surface-variant">Email address</label>

    <div class="relative">
      <input
        v-model="email"
        autocomplete="email"
        class="w-full px-3 py-2 pr-24 text-sm border border-divider rounded-lg bg-surface text-on-surface outline-none transition-colors focus:border-primary data-[status=checking]:border-warning data-[status=valid]:border-success data-[status=invalid]:border-error"
        :data-status="status"
        placeholder="you@example.com"
        type="email"
        @blur="emit('blur')"
      >

      <div
        v-if="isValidating"
        class="absolute right-3 top-1/2 -translate-y-1/2 size-4 border-2 border-warning border-t-transparent rounded-full animate-spin"
      />

      <span
        v-else-if="status === 'valid'"
        class="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-success"
      >
        Available
      </span>
    </div>

    <ul v-if="errors.length > 0" class="space-y-1">
      <li
        v-for="(error, index) in errors"
        :key="index"
        class="flex items-center gap-1.5 text-xs text-error"
      >
        <span class="size-1 rounded-full bg-error shrink-0" />
        {{ error }}
      </li>
    </ul>
  </div>
</template>
