<script setup lang="ts">
  import { Md1Button, Md1Dialog, Md1Icon, Md1Ripple } from '@paper/md1'
  import { Button } from '@vuetify/v0'
  import { shallowRef } from 'vue'

  const accounts = ['username@gmail.com', 'user02@gmail.com']

  const account = shallowRef<unknown>()
</script>

<template>
  <div class="md1-docs-row md1-docs-row-loose">
    <Md1Dialog v-slot="{ commit }" v-model:value="account" variant="simple">
      <Md1Dialog.Activator v-slot="{ attrs }">
        <Md1Button v-bind="attrs" variant="raised">Backup account</Md1Button>
      </Md1Dialog.Activator>

      <Md1Dialog.Content>
        <Md1Dialog.Title>Set backup account</Md1Dialog.Title>

        <div class="md1-docs-options">
          <Button.Root
            v-for="address in accounts"
            :key="address"
            class="md1-docs-option"
            @click="commit(address)"
          >
            <Md1Ripple />

            <span class="md1-docs-avatar">
              <Md1Icon name="person" />
            </span>

            <span class="md1-docs-option-text">{{ address }}</span>
          </Button.Root>

          <Button.Root class="md1-docs-option" @click="commit('new')">
            <Md1Ripple />

            <span class="md1-docs-avatar">
              <Md1Icon name="add" />
            </span>

            <span class="md1-docs-option-text">Add account</span>
          </Button.Root>
        </div>
      </Md1Dialog.Content>
    </Md1Dialog>

    <span v-if="account" class="md1-docs-note" role="status">Backup: {{ account }}</span>
  </div>
</template>

<style>
  .md1-docs-note {
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-caption-size, 12px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }

  .md1-docs-options {
    display: flex;
    flex-direction: column;
  }

  /* A 56 dp single-line row with an avatar: avatar at the 24 dp keyline, text at 80 dp. */
  .md1-docs-option {
    position: relative;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    width: 100%;
    height: 56px;
    padding: 0 var(--md1-spacing-3, 24px);
    border: 0;
    background: transparent;
    color: var(--md1-text-primary, rgba(0, 0, 0, 0.87));
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-subheading-size, 16px);
    text-align: start;
    cursor: pointer;
  }

  .md1-docs-option:hover {
    background: var(--md1-list-hover, rgba(0, 0, 0, 0.04));
  }

  .md1-docs-option:focus-visible {
    outline: 2px solid transparent;
    background: var(--md1-focus, rgba(0, 0, 0, 0.12));
  }

  .md1-docs-avatar {
    position: relative;
    display: inline-flex;
    flex: none;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    margin-inline-end: 16px;
    border-radius: 50%;
    background: var(--md1-grey-400, #BDBDBD);
    color: var(--md1-white, #FFFFFF);
  }

  .md1-docs-option-text {
    position: relative;
  }
</style>
