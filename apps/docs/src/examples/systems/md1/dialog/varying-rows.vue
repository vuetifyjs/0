<script setup lang="ts">
  import { Md1Button, Md1Dialog, Md1List } from '@paper/md1'
  import { shallowRef } from 'vue'

  const options = [
    { value: 'high', title: 'High quality', detail: 'Full resolution. Uses about 5 MB per photo and backs up only on Wi-Fi.' },
    { value: 'standard', title: 'Standard' },
    { value: 'saver', title: 'Data saver', detail: 'Compressed to 2 MP. Backs up on any connection.' },
    { value: 'off', title: 'Don\'t back up' },
  ] as const

  const quality = shallowRef<unknown>('standard')
</script>

<template>
  <div class="md1-docs-dialog-stack">
    <Md1Dialog v-slot="{ commit }" v-model:value="quality" variant="simple">
      <Md1Dialog.Activator v-slot="{ attrs }">
        <Md1Button v-bind="attrs" variant="raised">Upload quality</Md1Button>
      </Md1Dialog.Activator>

      <Md1Dialog.Content>
        <Md1Dialog.Title>Upload quality</Md1Dialog.Title>

        <Md1List aria-label="Upload quality" class="md1-docs-dialog-rows">
          <Md1List.Item
            v-for="option in options"
            :key="option.value"
            :lines="'detail' in option ? 3 : 1"
            @click="commit(option.value)"
          >
            <Md1List.Content>
              <Md1List.Primary>{{ option.title }}</Md1List.Primary>

              <Md1List.Secondary v-if="'detail' in option">{{ option.detail }}</Md1List.Secondary>
            </Md1List.Content>
          </Md1List.Item>
        </Md1List>
      </Md1Dialog.Content>
    </Md1Dialog>

    <p class="md1-docs-readout md1-docs-note" role="status">Quality: {{ quality }}</p>
  </div>
</template>

<style>
  /*
   * The activator on top and its readout below, each centred on its own, so the
   * readout changing never moves the button.
   */
  .md1-docs-dialog-stack {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--md1-spacing-2, 16px);
  }

  .md1-docs-note {
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-caption-size, 12px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }

  /* The rows hold a dialog's reading width so the longer options wrap to their second line instead of widening the sheet. */
  .md1-docs-dialog-rows {
    max-width: 320px;
  }
</style>
