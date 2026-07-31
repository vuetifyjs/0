<script setup lang="ts">
  import { shallowRef } from 'vue'
  import AccessProvider from './AccessProvider.vue'
  import Sidebar from './Sidebar.vue'
  import Workspace from './Workspace.vue'
  import { roles } from './context'
  import type { Role } from './context'

  const role = shallowRef<Role>('editor')
</script>

<template>
  <AccessProvider>
    <div class="space-y-4">
      <div>
        <label class="mb-1.5 block text-xs text-on-surface-variant">Signed in as</label>

        <div class="flex gap-1.5">
          <button
            v-for="r in roles"
            :key="r"
            class="rounded-lg border px-3 py-1.5 text-sm capitalize transition-all"
            :class="role === r
              ? 'border-primary bg-primary/10 text-primary font-medium'
              : 'border-divider text-on-surface-variant hover:border-primary/50'"
            type="button"
            @click="role = r"
          >
            {{ r }}
          </button>
        </div>
      </div>

      <div class="grid items-start gap-4 md:grid-cols-[180px_1fr]">
        <Sidebar :role />

        <Workspace :role />
      </div>
    </div>
  </AccessProvider>
</template>
