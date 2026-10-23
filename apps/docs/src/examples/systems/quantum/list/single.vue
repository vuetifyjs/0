<script setup lang="ts">
  import { QuList } from '@paper/quantum'
  import { shallowRef } from 'vue'

  const language = shallowRef('en')
</script>

<template>
  <div class="quantum-docs-list quantum-elevation-2">
    <QuList v-model="language" aria-label="Language" select="single">
      <QuList.Item value="en">English</QuList.Item>

      <QuList.Item value="fr">Français</QuList.Item>

      <QuList.Item value="de">Deutsch</QuList.Item>

      <QuList.Item disabled value="ja">日本語</QuList.Item>
    </QuList>
  </div>
</template>

<style>
  /* A list sheet: the surface colour, the 2 dp radius and room for a handset column; its depth is the shipped quantum-elevation-2 utility. */
  .quantum-docs-list {
    box-sizing: border-box;
    width: 100%;
    max-width: 360px;
    background: var(--quantum-surface, #FFFFFF);
    border-radius: var(--quantum-radius, 2px);
  }
</style>
