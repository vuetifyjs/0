<script setup lang="ts">
  import { Md1Divider } from '@paper/md1'

  const contacts = [
    { initial: 'A', name: 'Ali Connors' },
    { initial: 'A', name: 'Alex Nelson' },
    { initial: 'T', name: 'Trevor Hansen' },
    { initial: 'S', name: 'Sandra Adams' },
  ]
</script>

<template>
  <div class="md1-docs-divider-list md1-elevation-2">
    <template v-for="(contact, index) in contacts" :key="contact.name">
      <Md1Divider v-if="index > 0" inset />

      <div class="md1-docs-divider-contact md1-type-subheading">
        <span aria-hidden="true" class="md1-docs-divider-avatar">{{ contact.initial }}</span>

        {{ contact.name }}
      </div>
    </template>
  </div>
</template>

<style>
  .md1-docs-divider-list {
    box-sizing: border-box;
    width: 100%;
    max-width: 360px;
    padding-block: var(--md1-spacing-1, 8px);
    background: var(--md1-surface, #FFFFFF);
    border-radius: var(--md1-radius, 2px);
  }

  /* The avatar tile of the lists page: 56 dp, the avatar at the margin keyline and the text at the content keyline. */
  .md1-docs-divider-contact {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    height: 56px;
    padding-inline: var(--md1-keyline-margin, 16px);
  }

  /* A 40 dp avatar with 16 dp to the text, which lands the name on the 72 dp keyline (80 dp from 600 px). */
  .md1-docs-divider-avatar {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: var(--md1-avatar-size, 40px);
    height: var(--md1-avatar-size, 40px);
    margin-inline-end: var(--md1-spacing-2, 16px);
    border-radius: 50%;
    background: var(--md1-primary, #3F51B5);
    font-size: var(--md1-type-body-2-size, 14px);
    font-weight: var(--md1-type-body-2-weight, 500);
    color: var(--md1-on-primary, #FFFFFF);
  }
</style>
