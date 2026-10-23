<script setup lang="ts">
  import { Md1Button, Md1Checkbox, Md1Toolbar } from '@paper/md1'
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
  <div class="md1-docs-screen md1-docs-toolbar-screen">
    <Md1Toolbar app-bar :contextual="count > 0">
      <Md1Toolbar.Nav />

      <Md1Toolbar.Title>Photos</Md1Toolbar.Title>

      <Md1Toolbar.Contextual :count @clear="onClear">
        <Md1Toolbar.Actions>
          <Md1Button aria-label="Share" icon="share" />

          <Md1Button aria-label="Delete" icon="delete" @click="onClear" />
        </Md1Toolbar.Actions>
      </Md1Toolbar.Contextual>
    </Md1Toolbar>

    <div class="md1-docs-toolbar-select-content">
      <Md1Checkbox
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
  .md1-docs-toolbar-screen {
    background: var(--md1-background, #FAFAFA);
  }

  .md1-docs-toolbar-select-content {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    height: 100%;
    padding: calc(var(--md1-increment, 56px) + var(--md1-spacing-2, 16px)) var(--md1-spacing-2, 16px) var(--md1-spacing-2, 16px);
    overflow-y: auto;
  }
</style>
