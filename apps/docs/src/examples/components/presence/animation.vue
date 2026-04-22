<script setup lang="ts">
  import { Presence } from '@vuetify/v0'
  import { shallowRef } from 'vue'

  const show = shallowRef(false)
</script>

<template>
  <div class="flex flex-col items-center gap-4">
    <p class="text-sm text-on-surface-variant">
      Click rapidly — if you toggle during the exit animation, Presence cancels the leave and returns to present. No unmount/remount cycle.
    </p>

    <button
      class="rounded bg-primary px-4 py-2 text-on-primary"
      @click="show = !show"
    >
      {{ show ? 'Hide' : 'Show' }}
    </button>

    <Presence v-slot="{ attrs, done, isLeaving }" v-model="show" :immediate="false">
      <div
        v-bind="attrs"
        class="presence-scale rounded-lg p-4"
        :class="isLeaving ? 'bg-error/10' : 'bg-surface-variant'"
        @animationend="done"
      >
        <span class="font-medium">
          {{ isLeaving ? 'Leaving...' : 'Present' }}
        </span>
      </div>
    </Presence>
  </div>
</template>

<style scoped>
  .presence-scale[data-state="mounted"] {
    animation: scale-in 300ms cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .presence-scale[data-state="leaving"] {
    animation: scale-out 200ms ease-in;
  }

  @keyframes scale-in {
    from { opacity: 0; transform: scale(0.9); }
    to { opacity: 1; transform: scale(1); }
  }

  @keyframes scale-out {
    from { opacity: 1; transform: scale(1); }
    to { opacity: 0; transform: scale(0.9); }
  }
</style>
