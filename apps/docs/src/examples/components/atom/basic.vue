<script setup lang="ts">
  import { Atom } from '@vuetify/v0'
  import { ref } from 'vue'

  const element = ref<'button' | 'a' | 'div' | null>('button')
  const options = ['button', 'a', 'div', null] as const
</script>

<template>
  <div class="space-y-4">
    <div class="flex gap-2">
      <button
        v-for="opt in options"
        :key="String(opt)"
        class="px-3 py-1 border rounded text-sm"
        :class="element === opt ? 'bg-primary text-on-primary' : 'bg-surface'"
        @click="element = opt"
      >
        {{ opt ?? 'null' }}
      </button>
    </div>

    <div class="p-4 border border-dashed rounded min-h-16 flex items-center">
      <Atom
        :as="element"
        class="px-4 py-2 border border-primary rounded bg-surface-tint"
        :href="element === 'a' ? '#' : undefined"
      >
        <template v-if="element">
          I'm a &lt;{{ element }}&gt;
        </template>
        <template v-else>
          <span class="text-secondary">No wrapper—just this span</span>
        </template>
      </Atom>
    </div>

    <p class="text-sm text-secondary">
      <template v-if="element === null">
        Renderless mode: slot content renders without a wrapper element.
      </template>
      <template v-else-if="element === 'a'">
        Links get href. Inspect the DOM to verify the element type.
      </template>
      <template v-else>
        Inspect the DOM to verify the element type.
      </template>
    </p>
  </div>
</template>
