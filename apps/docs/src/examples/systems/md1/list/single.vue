<script setup lang="ts">
  import { Md1List } from '@paper/md1'
  import { shallowRef } from 'vue'

  const language = shallowRef('en')
</script>

<template>
  <div class="md1-docs-list md1-elevation-2">
    <Md1List v-model="language" aria-label="Language" select="single">
      <Md1List.Item value="en">English</Md1List.Item>

      <Md1List.Item value="fr">Français</Md1List.Item>

      <Md1List.Item value="de">Deutsch</Md1List.Item>

      <Md1List.Item disabled value="ja">日本語</Md1List.Item>
    </Md1List>
  </div>
</template>

<style>
  /* A list sheet: the surface colour, the 2 dp radius and room for a handset column; its depth is the shipped md1-elevation-2 utility. */
  .md1-docs-list {
    box-sizing: border-box;
    width: 100%;
    max-width: 360px;
    background: var(--md1-surface, #FFFFFF);
    border-radius: var(--md1-radius, 2px);
  }
</style>
