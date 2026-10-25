<script setup lang="ts">
  import { Md1Button, Md1Icon, Md1Menu } from '@paper/md1'
  import { shallowRef } from 'vue'

  const accounts = [
    { id: 'janelle', name: 'Janelle Murrells', email: 'janelle@example.com' },
    { id: 'work', name: 'Janelle Murrells', email: 'janelle@work.example.com' },
  ]

  const account = shallowRef(accounts[0]!)
  const signed = shallowRef(false)
</script>

<template>
  <div class="md1-docs-onboarding-stack">
    <div class="md1-docs-sign-in">
      <div class="md1-docs-sign-in-art">
        <Md1Icon class="md1-docs-sign-in-glyph" name="language" />
      </div>

      <div class="md1-docs-sign-in-sheet">
        <div class="md1-docs-sign-in-account">
          <span aria-hidden="true" class="md1-docs-sign-in-avatar">{{ account.name.charAt(0) }}</span>

          <span class="md1-docs-sign-in-names">
            <span class="md1-docs-sign-in-name">{{ account.name }}</span>

            <span class="md1-docs-sign-in-email">{{ account.email }}</span>
          </span>

          <Md1Menu>
            <Md1Menu.Activator v-slot="{ attrs }">
              <Md1Button v-bind="attrs" aria-label="Choose an account" icon="arrow-drop-down" />
            </Md1Menu.Activator>

            <Md1Menu.Content>
              <Md1Menu.Item v-for="item in accounts" :key="item.id" @select="account = item">{{ item.email }}</Md1Menu.Item>
            </Md1Menu.Content>
          </Md1Menu>
        </div>

        <Md1Button class="md1-docs-sign-in-continue" variant="raised" @click="signed = true">
          Continue as {{ account.name.split(' ')[0] }}
        </Md1Button>
      </div>
    </div>

    <span v-if="signed" class="md1-docs-onboarding-note" role="status">Signed in as {{ account.email }}</span>
  </div>
</template>

<style>
  /*
   * The self-select sign-in screen: an illustration over the background, then
   * a sheet at the bottom with the account the device already knows and one
   * full-width action to continue with it.
   */
  .md1-docs-sign-in {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 360px;
    background: var(--md1-background, #FAFAFA);
    border: 1px solid var(--md1-divider, rgba(0, 0, 0, 0.12));
  }

  .md1-docs-sign-in-art {
    display: grid;
    place-items: center;
    height: 240px;
  }

  .md1-docs-sign-in-glyph {
    --md1-icon-size: 120px;

    color: var(--md1-teal-300, #4DB6AC);
  }

  .md1-docs-sign-in-account {
    display: flex;
    align-items: center;
    gap: var(--md1-spacing-2, 16px);
    min-height: 72px;
    padding-inline: var(--md1-spacing-2, 16px) 4px;
  }

  /* The account sheet at the bottom: the surface colour over the background, a divider above it. */
  .md1-docs-sign-in-sheet {
    display: flex;
    flex-direction: column;
    background: var(--md1-surface, #FFFFFF);
    border-top: 1px solid var(--md1-divider, rgba(0, 0, 0, 0.12));
  }

  /* The 40 dp avatar of a list row; an initial stands in for the photo. */
  .md1-docs-sign-in-avatar {
    display: grid;
    flex-shrink: 0;
    place-items: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: 20px;
    color: var(--md1-white, #FFFFFF);
    background: var(--md1-teal-500, #009688);
  }

  .md1-docs-sign-in-names {
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    min-width: 0;
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
  }

  .md1-docs-sign-in-name {
    font-size: var(--md1-type-subheading-size, 16px);
    color: var(--md1-text-primary, rgba(0, 0, 0, 0.87));
  }

  .md1-docs-sign-in-email {
    overflow: hidden;
    font-size: var(--md1-type-body-1-size, 14px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  /* One full-width raised action, 16 dp from the sheet's edges. */
  .md1-docs-sign-in-continue {
    align-self: stretch;
    margin: 0 var(--md1-spacing-2, 16px) var(--md1-spacing-2, 16px);
  }
</style>
