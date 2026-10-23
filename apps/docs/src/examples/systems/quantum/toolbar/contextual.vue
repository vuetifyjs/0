<script setup lang="ts">
  import { QuButton, QuCheckbox, QuToolbar } from '@paper/quantum'
  import { ref, toRef } from 'vue'

  const photos = ['Lake', 'Coast', 'Forest', 'Desert']

  const selected = ref<string[]>([])

  const count = toRef(() => selected.value.length)

  function toggle (photo: string, value: boolean) {
    selected.value = value
      ? [...selected.value, photo]
      : selected.value.filter(item => item !== photo)
  }

  function onClear () {
    selected.value = []
  }
</script>

<template>
  <div class="quantum-docs-screen quantum-docs-toolbar-screen">
    <QuToolbar app-bar :contextual="count > 0">
      <QuToolbar.Nav />

      <QuToolbar.Title>Photos</QuToolbar.Title>

      <QuToolbar.Contextual :count @clear="onClear">
        <QuToolbar.Actions>
          <QuButton aria-label="Share" icon="share" />

          <QuButton aria-label="Delete" icon="delete" @click="onClear" />
        </QuToolbar.Actions>
      </QuToolbar.Contextual>
    </QuToolbar>

    <div class="quantum-docs-toolbar-select-content">
      <QuCheckbox
        v-for="photo in photos"
        :key="photo"
        :label="photo"
        :model-value="selected.includes(photo)"
        @update:model-value="toggle(photo, !!$event)"
      />
    </div>
  </div>
</template>

<style>
  .quantum-docs-toolbar-screen {
    background: var(--quantum-background, #FAFAFA);
  }

  .quantum-docs-toolbar-select-content {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    height: 100%;
    padding: calc(var(--quantum-increment, 56px) + var(--quantum-spacing-2, 16px)) var(--quantum-spacing-2, 16px) var(--quantum-spacing-2, 16px);
    overflow-y: auto;
  }
</style>
