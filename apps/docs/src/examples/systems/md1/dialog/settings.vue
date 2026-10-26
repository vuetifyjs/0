<script setup lang="ts">
  import { Md1Button, Md1Dialog, Md1List, Md1Switch } from '@paper/md1'
  import { ref, toRef } from 'vue'

  // Changes apply as they are made: there is nothing to save or discard.
  const settings = ref({ messages: true, mentions: true, reminders: false, sounds: true })

  const items = [
    { key: 'messages', title: 'New messages', subtitle: 'Notify me when a message arrives' },
    { key: 'mentions', title: 'Mentions', subtitle: 'Notify me when someone mentions me' },
    { key: 'reminders', title: 'Event reminders', subtitle: 'Ten minutes before each event' },
    { key: 'sounds', title: 'Sounds', subtitle: 'Play a sound with each notification' },
  ] as const

  const count = toRef(() => Object.values(settings.value).filter(Boolean).length)
</script>

<template>
  <div class="md1-docs-dialog-stack">
    <Md1Dialog v-slot="{ close }" variant="full-screen">
      <Md1Dialog.Activator v-slot="{ attrs }">
        <Md1Button v-bind="attrs" variant="raised">Notification settings</Md1Button>
      </Md1Dialog.Activator>

      <Md1Dialog.Content>
        <div class="md1-docs-settings-bar">
          <Md1Button aria-label="Back" icon="arrow-back" @click="close" />

          <Md1Dialog.Title>Notifications</Md1Dialog.Title>
        </div>

        <Md1List aria-label="Notifications" :lines="2">
          <Md1List.Item v-for="item in items" :key="item.key">
            <Md1List.Content>
              <Md1List.Primary>{{ item.title }}</Md1List.Primary>

              <Md1List.Secondary>{{ item.subtitle }}</Md1List.Secondary>
            </Md1List.Content>

            <Md1List.Action>
              <Md1Switch v-model="settings[item.key]" :aria-label="item.title" />
            </Md1List.Action>
          </Md1List.Item>
        </Md1List>
      </Md1Dialog.Content>
    </Md1Dialog>

    <p class="md1-docs-readout md1-docs-note" role="status">{{ count }} of {{ items.length }} on</p>
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

  /* The 56 dp primary app bar with the up arrow where the X would be, and no action: each change is already saved. */
  .md1-docs-settings-bar {
    position: sticky;
    top: 0;
    z-index: 2;
    display: flex;
    align-items: center;
    height: 56px;
    padding: 0 var(--md1-spacing-1, 8px) 0 4px;
    background: var(--md1-primary, #3F51B5);
    color: var(--md1-on-primary, #FFFFFF);
    box-shadow: var(--md1-elevation-4, 0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12));
  }

  .md1-docs-settings-bar .md1-button[data-variant] {
    color: var(--md1-on-primary, #FFFFFF);
  }

  .md1-docs-settings-bar .md1-dialog__title {
    flex: 1 1 auto;
    padding: 0 0 0 20px;
    color: var(--md1-on-primary, #FFFFFF);
  }
</style>
