<script lang="ts">
  import { Md1Checkbox, Md1Dialog, Md1Divider, Md1List, Md1Radio, Md1Snackbar, Md1Subheader, Md1Switch } from '@paper/md1'

  // Framework
  import { useStorage } from '@vuetify/v0'

  // Utilities
  import { shallowRef } from 'vue'

  const frequencies = ['Every 15 minutes', 'Every hour', 'Every day', 'Manual only']
</script>

<script setup lang="ts">
  defineOptions({ name: 'Md1Settings' })

  // Every toggle persists through the storage plugin, so a reload keeps it.
  const storage = useStorage()

  // General
  const updates = storage.get('md1-demo:updates', true)
  const reports = storage.get('md1-demo:reports', false)

  // Notifications
  const notifications = storage.get('md1-demo:notifications', true)
  const sound = storage.get('md1-demo:sound', true)
  const previews = storage.get('md1-demo:previews', true)

  // Data & storage
  const wifi = storage.get('md1-demo:wifi', true)
  const sync = storage.get<unknown>('md1-demo:sync', 'Every hour')
  const choosing = shallowRef(false)
  const clearing = shallowRef(false)
  const cleared = shallowRef(false)

  /** Clearing local data really clears it: every persisted setting returns to its default. */
  function onClear () {
    updates.value = true
    reports.value = false
    notifications.value = true
    sound.value = true
    previews.value = true
    wifi.value = true
    sync.value = 'Every hour'
    cleared.value = true
  }
</script>

<template>
  <section class="md1-demo-settings">
    <div class="md1-demo-settings-sheet md1-elevation-2">
      <Md1Subheader inset :sticky="false">General</Md1Subheader>

      <Md1List :lines="2">
        <Md1List.Item inset>
          <Md1List.Content>
            <Md1List.Primary>Automatic updates</Md1List.Primary>

            <Md1List.Secondary>{{ updates ? 'On' : 'Off' }}</Md1List.Secondary>
          </Md1List.Content>

          <Md1List.Action>
            <Md1Switch v-model="updates" aria-label="Automatic updates" />
          </Md1List.Action>
        </Md1List.Item>

        <Md1List.Item inset>
          <Md1List.Content>
            <Md1List.Primary>Usage reports</Md1List.Primary>

            <Md1List.Secondary>Shares anonymous statistics</Md1List.Secondary>
          </Md1List.Content>

          <Md1List.Action>
            <Md1Checkbox v-model="reports" aria-label="Usage reports" />
          </Md1List.Action>
        </Md1List.Item>
      </Md1List>

      <Md1Divider />

      <Md1Subheader inset :sticky="false">Notifications</Md1Subheader>

      <Md1List :lines="2">
        <Md1List.Item inset>
          <Md1List.Content>
            <Md1List.Primary>Notifications</Md1List.Primary>

            <Md1List.Secondary>{{ notifications ? 'On' : 'Off' }}</Md1List.Secondary>
          </Md1List.Content>

          <Md1List.Action>
            <Md1Switch v-model="notifications" aria-label="Notifications" />
          </Md1List.Action>
        </Md1List.Item>

        <Md1List.Item inset>
          <Md1List.Content>
            <Md1List.Primary>Sound</Md1List.Primary>

            <Md1List.Secondary>{{ sound ? 'On' : 'Off' }}</Md1List.Secondary>
          </Md1List.Content>

          <Md1List.Action>
            <Md1Switch v-model="sound" aria-label="Sound" />
          </Md1List.Action>
        </Md1List.Item>

        <Md1List.Item inset>
          <Md1List.Content>
            <Md1List.Primary>Previews</Md1List.Primary>

            <Md1List.Secondary>Shows message text in notifications</Md1List.Secondary>
          </Md1List.Content>

          <Md1List.Action>
            <Md1Checkbox v-model="previews" aria-label="Previews" />
          </Md1List.Action>
        </Md1List.Item>
      </Md1List>

      <Md1Divider />

      <Md1Subheader inset :sticky="false">Data &amp; storage</Md1Subheader>

      <Md1List :lines="2">
        <Md1List.Item inset>
          <Md1List.Content>
            <Md1List.Primary>Download over Wi-Fi only</Md1List.Primary>

            <Md1List.Secondary>Queues large downloads until Wi-Fi returns</Md1List.Secondary>
          </Md1List.Content>

          <Md1List.Action>
            <Md1Checkbox v-model="wifi" aria-label="Download over Wi-Fi only" />
          </Md1List.Action>
        </Md1List.Item>

        <Md1List.Item aria-haspopup="dialog" inset @click="choosing = true">
          <Md1List.Content>
            <Md1List.Primary>Sync frequency</Md1List.Primary>

            <Md1List.Secondary>{{ sync }}</Md1List.Secondary>
          </Md1List.Content>
        </Md1List.Item>

        <Md1List.Item aria-haspopup="dialog" inset @click="clearing = true">
          <Md1List.Content>
            <Md1List.Primary>Clear local data</Md1List.Primary>

            <Md1List.Secondary>Removes drafts and cached files from this device</Md1List.Secondary>
          </Md1List.Content>
        </Md1List.Item>
      </Md1List>
    </div>

    <Md1Dialog v-slot="{ value, commit }" v-model="choosing" v-model:value="sync" variant="confirmation">
      <Md1Dialog.Content>
        <Md1Dialog.Title>Sync frequency</Md1Dialog.Title>

        <Md1Radio.Group aria-label="Sync frequency" :model-value="value" @update:model-value="commit">
          <Md1Radio
            v-for="frequency in frequencies"
            :key="frequency"
            class="md1-demo-settings-choice"
            :label="frequency"
            :value="frequency"
          />
        </Md1Radio.Group>

        <Md1Dialog.Actions>
          <Md1Dialog.Cancel />

          <Md1Dialog.Confirm />
        </Md1Dialog.Actions>
      </Md1Dialog.Content>
    </Md1Dialog>

    <Md1Dialog v-model="clearing">
      <Md1Dialog.Content>
        <Md1Dialog.Title>Clear local data?</Md1Dialog.Title>

        <Md1Dialog.Text>Drafts and cached files are removed from this device. Anything synced stays in your account.</Md1Dialog.Text>

        <Md1Dialog.Actions>
          <Md1Dialog.Cancel />

          <Md1Dialog.Confirm @confirm="onClear">Clear</Md1Dialog.Confirm>
        </Md1Dialog.Actions>
      </Md1Dialog.Content>
    </Md1Dialog>

    <Md1Snackbar.Portal :teleport="false">
      <Md1Snackbar v-model="cleared">Local data cleared</Md1Snackbar>
    </Md1Snackbar.Portal>
  </section>
</template>

<style>
  .md1-demo-settings {
    max-width: 840px;
    margin-inline: auto;
  }

  .md1-demo-settings-sheet {
    background: var(--md1-surface, #FFFFFF);
    border-radius: var(--md1-radius, 2px);
  }

  /* The dialog's radios sit on its 24 dp content keyline. */
  .md1-demo-settings-choice {
    padding-inline: var(--md1-spacing-3, 24px);
  }
</style>
