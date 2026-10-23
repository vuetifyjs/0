<script setup lang="ts">
  import { QuButton, QuCard, QuIcon, QuList, QuSubheader } from '@paper/quantum'

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
  <div class="quantum-docs-onboarding-stack">
    <div class="quantum-docs-quickstart-screen">
      <p class="quantum-docs-quickstart-bar quantum-type-title">Photos</p>

      <div class="quantum-docs-quickstart-key">
        <QuIcon class="quantum-docs-quickstart-key-art" name="cloud-upload" />

        <p class="quantum-docs-quickstart-key-text quantum-type-subheading">Keep every photo safe, even if you lose your phone</p>

        <QuButton variant="raised" @click="onAction('Backup started')">Back up now</QuButton>
      </div>

      <QuSubheader>More ways to start</QuSubheader>

      <QuList>
        <QuList.Item @click="onAction('Album created')">
          <QuList.Icon name="photo" />

          <QuList.Content>
            <QuList.Primary>Create an album</QuList.Primary>
          </QuList.Content>
        </QuList.Item>

        <QuList.Item @click="onAction('Invite sent')">
          <QuList.Icon name="share" />

          <QuList.Content>
            <QuList.Primary>Share with a partner</QuList.Primary>
          </QuList.Content>
        </QuList.Item>
      </QuList>

      <div v-if="done && offer" class="quantum-docs-quickstart-offer">
        <QuCard>
          <QuCard.Title>New to Photos?</QuCard.Title>

          <QuCard.Supporting>Take a two-minute tour of albums, search and sharing.</QuCard.Supporting>

          <QuCard.Actions>
            <QuButton @click="offer = false">No thanks</QuButton>

            <QuButton @click="offer = false">Learn more</QuButton>
          </QuCard.Actions>
        </QuCard>
      </div>
    </div>

    <div class="quantum-docs-onboarding-row">
      <QuButton :disabled="!done" @click="onReset">Start over</QuButton>

      <span v-if="done" class="quantum-docs-onboarding-note" role="status">{{ done }}</span>
    </div>
  </div>
</template>

<style>
  .quantum-docs-onboarding-stack {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--quantum-spacing-2, 16px);
  }

  .quantum-docs-onboarding-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--quantum-spacing-1, 8px);
  }

  /* A handset screen on the surface colour, the first-run view the app lands on. */
  .quantum-docs-quickstart-screen {
    box-sizing: border-box;
    width: 100%;
    max-width: 360px;
    padding-block-end: var(--quantum-spacing-1, 8px);
    background: var(--quantum-surface, #FFFFFF);
    border: 1px solid var(--quantum-divider, rgba(0, 0, 0, 0.12));
  }

  /* The app bar row: Title at the 16 dp keyline in a 56 dp increment. */
  .quantum-docs-quickstart-bar {
    box-sizing: border-box;
    display: flex;
    align-items: center;
    height: var(--quantum-increment, 56px);
    margin: 0;
    padding-inline: var(--quantum-keyline-margin, 16px);
  }

  /* The first key action, promoted above everything else on the screen. */
  .quantum-docs-quickstart-key {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--quantum-spacing-2, 16px);
    padding: var(--quantum-spacing-3, 24px) var(--quantum-keyline-margin, 16px);
    text-align: center;
  }

  .quantum-docs-quickstart-key-art {
    --quantum-icon-size: 48px;

    color: var(--quantum-primary, #3F51B5);
  }

  /* Primary 500 on the dark surface falls under 2:1; the dark theme takes the primary's 100, as QuList does for its current item. */
  [data-theme='quantum-dark'] .quantum-docs-quickstart-key-art {
    color: var(--quantum-primary-light, #C5CAE9);
  }

  .quantum-docs-quickstart-key-text {
    max-width: 280px;
    margin: 0;
  }

  .quantum-docs-quickstart-offer {
    padding: var(--quantum-spacing-1, 8px);
  }

  .quantum-docs-onboarding-note {
    font-family: var(--quantum-font-family, Roboto, Noto, sans-serif);
    font-size: var(--quantum-type-caption-size, 12px);
    color: var(--quantum-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
