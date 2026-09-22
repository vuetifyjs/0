<script setup lang="ts">
  import { EmButton } from '@paper/emerald'

  import { shallowRef } from 'vue'

  const saving = shallowRef(false)

  function onSave () {
    // `loading` is a visual and aria-busy state — it does not block the click,
    // so the guard is what stops a second submit.
    if (saving.value) return

    saving.value = true

    setTimeout(() => {
      saving.value = false
    }, 1600)
  }
</script>

<template>
  <div class="emerald-docs-row">
    <EmButton :loading="saving" @click="onSave">Save changes</EmButton>

    <!-- Belt and braces: disabled is what actually makes it unclickable. -->
    <EmButton :disabled="saving" :loading="saving" @click="onSave">Save once</EmButton>

    <EmButton disabled>Disabled</EmButton>
  </div>
</template>

<style>
  .emerald-docs-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--emerald-spacing-s, 12px);
  }
</style>
