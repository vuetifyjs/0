<script setup lang="ts">
  import { Presence } from '@vuetify/v0'
  import { shallowRef } from 'vue'

  const show = shallowRef(true)
</script>

<template>
  <div class="flex flex-col items-center gap-6">
    <button
      class="rounded bg-primary px-4 py-2 text-on-primary"
      @click="show = !show"
    >
      {{ show ? 'Hide Both' : 'Show Both' }}
    </button>

    <table class="w-full border-separate border-spacing-2">
      <thead>
        <tr>
          <th class="text-left text-xs font-medium uppercase tracking-wide text-on-surface-variant">v-if</th>
          <th class="text-left text-xs font-medium uppercase tracking-wide text-on-surface-variant">Presence</th>
        </tr>
      </thead>

      <tbody>
        <tr>
          <td class="w-1/2 align-top">
            <div
              v-if="show"
              class="rounded-lg bg-surface-variant p-4 text-sm"
            >
              Vanishes instantly
            </div>
          </td>

          <td class="w-1/2 align-top">
            <Presence v-slot="{ attrs, done }" v-model="show" :immediate="false">
              <div
                v-bind="attrs"
                class="presence-box rounded-lg bg-surface-variant p-4 text-sm"
                @animationend="done"
              >
                Animates out, then unmounts
              </div>
            </Presence>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
  .presence-box[data-state="mounted"] {
    animation: fade-in 250ms ease-out;
  }

  .presence-box[data-state="leaving"] {
    animation: fade-out 200ms ease-in;
  }

  @keyframes fade-in {
    from { opacity: 0; transform: translateY(-8px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes fade-out {
    from { opacity: 1; transform: translateY(0); }
    to { opacity: 0; transform: translateY(-8px); }
  }
</style>
