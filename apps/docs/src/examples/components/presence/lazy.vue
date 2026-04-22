<script setup lang="ts">
  import { Presence } from '@vuetify/v0'
  import { shallowRef } from 'vue'

  const show = shallowRef(false)
  const mounts = shallowRef(0)
</script>

<template>
  <div class="flex flex-col items-center gap-4">
    <span class="text-sm text-on-surface-variant">
      Content mounts once on first toggle, then stays in DOM. Toggle multiple times — mount count stays at 1.
    </span>

    <div class="flex items-center gap-4">
      <button
        class="rounded bg-primary px-4 py-2 text-on-primary"
        @click="show = !show"
      >
        {{ show ? 'Hide' : 'Show' }}
      </button>

      <span class="font-mono text-sm text-on-surface-variant">
        Mounts: {{ mounts }}
      </span>
    </div>

    <Presence
      v-slot="{ attrs }"
      v-model="show"
      lazy
      @enter="mounts++"
    >
      <div
        v-bind="attrs"
        class="w-full rounded-lg bg-surface-variant p-4 text-sm"
      >
        Lazy content — mounted once, hidden via state instead of unmounting
      </div>
    </Presence>
  </div>
</template>
