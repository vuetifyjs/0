<script setup lang="ts">
  import { QuDivider } from '@paper/quantum'

  const contacts = [
    { initial: 'A', name: 'Ali Connors' },
    { initial: 'A', name: 'Alex Nelson' },
    { initial: 'T', name: 'Trevor Hansen' },
    { initial: 'S', name: 'Sandra Adams' },
  ]
</script>

<template>
  <div class="quantum-docs-divider-list quantum-elevation-2">
    <template v-for="(contact, index) in contacts" :key="contact.name">
      <QuDivider v-if="index > 0" inset />

      <div class="quantum-docs-divider-contact quantum-type-subheading">
        <span aria-hidden="true" class="quantum-docs-divider-avatar">{{ contact.initial }}</span>

        {{ contact.name }}
      </div>
    </template>
  </div>
</template>

<style>
  .quantum-docs-divider-list {
    box-sizing: border-box;
    width: 100%;
    max-width: 360px;
    padding-block: var(--quantum-spacing-1, 8px);
    background: var(--quantum-surface, #FFFFFF);
    border-radius: var(--quantum-radius, 2px);
  }

  /* The avatar tile of the lists page: 56 dp, the avatar at the margin keyline and the text at the content keyline. */
  .quantum-docs-divider-contact {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    height: 56px;
    padding-inline: var(--quantum-keyline-margin, 16px);
  }

  /* A 40 dp avatar with 16 dp to the text, which lands the name on the 72 dp keyline (80 dp from 600 px). */
  .quantum-docs-divider-avatar {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: var(--quantum-avatar-size, 40px);
    height: var(--quantum-avatar-size, 40px);
    margin-inline-end: var(--quantum-spacing-2, 16px);
    border-radius: 50%;
    background: var(--quantum-primary, #3F51B5);
    font-size: var(--quantum-type-body-2-size, 14px);
    font-weight: var(--quantum-type-body-2-weight, 500);
    color: var(--quantum-on-primary, #FFFFFF);
  }
</style>
