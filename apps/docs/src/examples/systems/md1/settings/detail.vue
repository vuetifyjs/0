<script setup lang="ts">
  import { Md1List, Md1Switch, Md1Toolbar } from '@paper/md1'
  import { shallowRef } from 'vue'

  const screen = shallowRef<'settings' | 'history'>('settings')
  const history = shallowRef(false)
</script>

<template>
  <div class="md1-docs-screen md1-docs-settings-screen">
    <template v-if="screen === 'settings'">
      <Md1Toolbar variant="primary">
        <Md1Toolbar.Nav aria-label="Home" icon="up" />

        <Md1Toolbar.Title>Location</Md1Toolbar.Title>
      </Md1Toolbar>

      <div class="md1-docs-settings-body">
        <Md1List :lines="2">
          <Md1List.Item inset>
            <Md1List.Content>
              <Md1List.Primary>Mode</Md1List.Primary>

              <Md1List.Secondary>High accuracy</Md1List.Secondary>
            </Md1List.Content>
          </Md1List.Item>

          <Md1List.Item inset @click="screen = 'history'">
            <Md1List.Content>
              <Md1List.Primary>Location history</Md1List.Primary>

              <Md1List.Secondary>{{ history ? 'On' : 'Off' }}</Md1List.Secondary>
            </Md1List.Content>
          </Md1List.Item>

          <Md1List.Item inset>
            <Md1List.Content>
              <Md1List.Primary>Location sharing</Md1List.Primary>

              <Md1List.Secondary>Shared with 2 people</Md1List.Secondary>
            </Md1List.Content>
          </Md1List.Item>
        </Md1List>
      </div>
    </template>

    <template v-else>
      <Md1Toolbar variant="primary">
        <Md1Toolbar.Nav aria-label="Location" icon="up" @click="screen = 'settings'" />

        <Md1Toolbar.Title>Location history</Md1Toolbar.Title>
      </Md1Toolbar>

      <div class="md1-docs-settings-body">
        <Md1List>
          <Md1List.Item inset>
            <Md1List.Content>
              <Md1List.Primary>{{ history ? 'On' : 'Off' }}</Md1List.Primary>
            </Md1List.Content>

            <Md1List.Action>
              <Md1Switch v-model="history" aria-label="Location history" />
            </Md1List.Action>
          </Md1List.Item>
        </Md1List>

        <div class="md1-docs-settings-description">
          <p>Location history saves where you go with this device, even when no app is open, so maps can suggest routes for your commute and photos can show where they were taken.</p>

          <p>Only you can see it. Turning it off stops new places being saved; the places already saved stay until you delete them.</p>
        </div>
      </div>
    </template>
  </div>
</template>

<style>
  /* A handset settings screen: the toolbar on top, the list scrolling on the surface under it. */
  .md1-docs-settings-screen {
    display: flex;
    flex-direction: column;
    max-width: 360px;
    background: var(--md1-surface, #FFFFFF);
  }

  .md1-docs-settings-body {
    flex: 1 1 auto;
    min-height: 0;
    overflow-y: auto;
  }

  /* The longer description starts on the content keyline (72 dp, 80 dp from 600 px) with the row labels above it. */
  .md1-docs-settings-description {
    padding-block: 0 var(--md1-spacing-2, 16px);
    padding-inline: var(--md1-keyline-content, 72px) var(--md1-spacing-2, 16px);
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-body-1-size, 14px);
    line-height: var(--md1-type-body-1-leading, 20px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }

  .md1-docs-settings-description p {
    margin: 0 0 var(--md1-spacing-2, 16px);
  }
</style>
