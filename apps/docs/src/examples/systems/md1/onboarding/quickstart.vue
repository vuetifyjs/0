<script setup lang="ts">
  import { Md1Button, Md1Card, Md1Icon, Md1List, Md1Subheader } from '@paper/md1'

  import { shallowRef } from 'vue'

  const done = shallowRef('')
  const offer = shallowRef(true)

  function onAction (label: string) {
    done.value = label
  }

  function onReset () {
    done.value = ''
    offer.value = true
  }
</script>

<template>
  <div class="md1-docs-onboarding-stack">
    <div class="md1-docs-quickstart-screen">
      <p class="md1-docs-quickstart-bar md1-type-title">Photos</p>

      <div class="md1-docs-quickstart-key">
        <Md1Icon class="md1-docs-quickstart-key-art" name="cloud-upload" />

        <p class="md1-docs-quickstart-key-text md1-type-subheading">Keep every photo safe, even if you lose your phone</p>

        <Md1Button variant="raised" @click="onAction('Backup started')">Back up now</Md1Button>
      </div>

      <Md1Subheader>More ways to start</Md1Subheader>

      <Md1List>
        <Md1List.Item @click="onAction('Album created')">
          <Md1List.Icon name="photo" />

          <Md1List.Content>
            <Md1List.Primary>Create an album</Md1List.Primary>
          </Md1List.Content>
        </Md1List.Item>

        <Md1List.Item @click="onAction('Invite sent')">
          <Md1List.Icon name="share" />

          <Md1List.Content>
            <Md1List.Primary>Share with a partner</Md1List.Primary>
          </Md1List.Content>
        </Md1List.Item>
      </Md1List>

      <div v-if="done && offer" class="md1-docs-quickstart-offer">
        <Md1Card>
          <Md1Card.Title>New to Photos?</Md1Card.Title>

          <Md1Card.Supporting>Take a two-minute tour of albums, search and sharing.</Md1Card.Supporting>

          <Md1Card.Actions>
            <Md1Button @click="offer = false">No thanks</Md1Button>

            <Md1Button @click="offer = false">Learn more</Md1Button>
          </Md1Card.Actions>
        </Md1Card>
      </div>
    </div>

    <div class="md1-docs-onboarding-row">
      <Md1Button :disabled="!done" @click="onReset">Start over</Md1Button>

      <span v-if="done" class="md1-docs-onboarding-note" role="status">{{ done }}</span>
    </div>
  </div>
</template>

<style>
  .md1-docs-onboarding-stack {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--md1-spacing-2, 16px);
  }

  .md1-docs-onboarding-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--md1-spacing-1, 8px);
  }

  /* A handset screen on the surface colour, the first-run view the app lands on. */
  .md1-docs-quickstart-screen {
    box-sizing: border-box;
    width: 100%;
    max-width: 360px;
    padding-block-end: var(--md1-spacing-1, 8px);
    background: var(--md1-surface, #FFFFFF);
    border: 1px solid var(--md1-divider, rgba(0, 0, 0, 0.12));
  }

  /* The app bar row: Title at the 16 dp keyline in a 56 dp increment. */
  .md1-docs-quickstart-bar {
    box-sizing: border-box;
    display: flex;
    align-items: center;
    height: var(--md1-increment, 56px);
    margin: 0;
    padding-inline: var(--md1-keyline-margin, 16px);
  }

  /* The first key action, promoted above everything else on the screen. */
  .md1-docs-quickstart-key {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--md1-spacing-2, 16px);
    padding: var(--md1-spacing-3, 24px) var(--md1-keyline-margin, 16px);
    text-align: center;
  }

  .md1-docs-quickstart-key-art {
    --md1-icon-size: 48px;

    color: var(--md1-primary, #3F51B5);
  }

  .md1-docs-quickstart-key-text {
    max-width: 280px;
    margin: 0;
  }

  .md1-docs-quickstart-offer {
    padding: var(--md1-spacing-1, 8px);
  }

  .md1-docs-onboarding-note {
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-caption-size, 12px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
