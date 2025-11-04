<script lang="ts" setup>
import { Atom } from '@vuetify/v0'
import { ref } from 'vue'

const element = ref('button')
</script>

<template>
  <div class="space-y-4">
    <div>
      <label class="block text-sm mb-2">Render as:</label>
      <select v-model="element" class="px-3 py-2 border rounded">
        <option v-for="el in ['button', 'div', 'span']" :key="el">{{ el }}</option>
      </select>
    </div>

    <Atom :as="element" class="px-4 py-2 border rounded" style="background-color: var(--v0-surface-tint); border-color: var(--v0-primary);">
      I'm a &lt;{{ element }}&gt;
    </Atom>
  </div>
</template>
