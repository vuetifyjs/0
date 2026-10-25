<script setup lang="ts">
  import { Md1Dialog, Md1Fab, Md1Toolbar, useMorph } from '@paper/md1'
  import { useMediaQuery } from '@vuetify/v0'
  import { nextTick, shallowRef, useTemplateRef } from 'vue'

  const fab = useTemplateRef('fab')
  const sheet = useTemplateRef('sheet')
  const open = shallowRef(false)
  const sent = shallowRef(0)
  const { morph } = useMorph()

  // Full-screen dialogs are a handset pattern: from 600 px the dialog is a sheet and enters with its own motion.
  const { matches: handset } = useMediaQuery('(max-width: 599.98px)')

  async function onOpen (value: boolean) {
    open.value = value

    if (!value || !handset.value) return

    await nextTick()

    // The motion page's 375 ms for a large, full-screen transition.
    const done = await morph({ from: fab, to: sheet, clip: '.md1-dialog__sheet', duration: 375 })

    done()
  }
</script>

<template>
  <div class="md1-docs-screen md1-docs-fab-screen">
    <p class="md1-docs-fab-note" role="status">
      {{ sent === 0 ? 'No messages sent.' : `${sent} message${sent === 1 ? '' : 's'} sent.` }}
    </p>

    <Md1Dialog v-slot="{ close }" :model-value="open" variant="full-screen" @update:model-value="onOpen">
      <Md1Dialog.Activator v-slot="{ attrs }">
        <Md1Fab ref="fab" v-bind="attrs" aria-label="Compose" icon="edit" />
      </Md1Dialog.Activator>

      <Md1Dialog.Content ref="sheet">
        <Md1Toolbar variant="primary">
          <Md1Toolbar.Nav aria-label="Discard" icon="close" @click="close" />

          <Md1Toolbar.Title>New message</Md1Toolbar.Title>

          <Md1Toolbar.Actions>
            <Md1Dialog.Confirm @confirm="sent++">Send</Md1Dialog.Confirm>
          </Md1Toolbar.Actions>
        </Md1Toolbar>

        <Md1Dialog.Text>On a phone the compose screen grows out of the button that made it. Discard, Send or Escape close it like any other dialog.</Md1Dialog.Text>
      </Md1Dialog.Content>
    </Md1Dialog>
  </div>
</template>

<style>
  .md1-docs-fab-screen {
    background: var(--md1-background, #FAFAFA);
  }

  .md1-docs-fab-note {
    margin: 0;
    padding: var(--md1-spacing-2, 16px);
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-body-1-size, 14px);
    line-height: var(--md1-type-body-1-leading, 20px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
