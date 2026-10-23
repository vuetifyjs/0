<script setup lang="ts">
  import { QuButton, QuDialog, QuIcon, QuRipple } from '@paper/quantum'
  import { Button } from '@vuetify/v0'
  import { shallowRef } from 'vue'

  const accounts = ['username@gmail.com', 'user02@gmail.com']

  const account = shallowRef<unknown>()
</script>

<template>
  <div class="quantum-docs-row">
    <QuDialog v-slot="{ commit }" v-model:value="account" variant="simple">
      <QuDialog.Activator v-slot="{ attrs }">
        <QuButton v-bind="attrs" variant="raised">Backup account</QuButton>
      </QuDialog.Activator>

      <QuDialog.Content>
        <QuDialog.Title>Set backup account</QuDialog.Title>

        <div class="quantum-docs-options">
          <Button.Root
            v-for="address in accounts"
            :key="address"
            class="quantum-docs-option"
            @click="commit(address)"
          >
            <QuRipple />

            <span class="quantum-docs-avatar">
              <QuIcon name="person" />
            </span>

            <span class="quantum-docs-option-text">{{ address }}</span>
          </Button.Root>

          <Button.Root class="quantum-docs-option" @click="commit('new')">
            <QuRipple />

            <span class="quantum-docs-avatar">
              <QuIcon name="add" />
            </span>

            <span class="quantum-docs-option-text">Add account</span>
          </Button.Root>
        </div>
      </QuDialog.Content>
    </QuDialog>

    <span v-if="account" class="quantum-docs-note" role="status">Backup: {{ account }}</span>
  </div>
</template>

<style>
  .quantum-docs-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--quantum-spacing-2, 16px);
  }

  .quantum-docs-note {
    font-family: var(--quantum-font-family, Roboto, Noto, sans-serif);
    font-size: var(--quantum-type-caption-size, 12px);
    color: var(--quantum-text-secondary, rgba(0, 0, 0, 0.54));
  }

  .quantum-docs-options {
    display: flex;
    flex-direction: column;
  }

  /* A 56 dp single-line row with an avatar: avatar at the 24 dp keyline, text at 80 dp. */
  .quantum-docs-option {
    position: relative;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    width: 100%;
    height: 56px;
    padding: 0 var(--quantum-spacing-3, 24px);
    border: 0;
    background: transparent;
    color: var(--quantum-text-primary, rgba(0, 0, 0, 0.87));
    font-family: var(--quantum-font-family, Roboto, Noto, sans-serif);
    font-size: var(--quantum-type-subheading-size, 16px);
    text-align: start;
    cursor: pointer;
  }

  .quantum-docs-option:hover {
    background: var(--quantum-hover, rgba(0, 0, 0, 0.06));
  }

  .quantum-docs-option:focus-visible {
    outline: 2px solid transparent;
    background: var(--quantum-focus, rgba(0, 0, 0, 0.12));
  }

  .quantum-docs-avatar {
    position: relative;
    display: inline-flex;
    flex: none;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    margin-inline-end: 16px;
    border-radius: 50%;
    background: var(--quantum-grey-400, #BDBDBD);
    color: var(--quantum-white, #FFFFFF);
  }

  .quantum-docs-option-text {
    position: relative;
  }
</style>
