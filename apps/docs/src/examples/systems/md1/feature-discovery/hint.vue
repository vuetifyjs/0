<script setup lang="ts">
  import { Md1Button, Md1Card, Md1Icon, Md1Toolbar } from '@paper/md1'
  import { shallowRef } from 'vue'

  const open = shallowRef(true)
  const answer = shallowRef('')

  function onAnswer (value: string) {
    answer.value = value
    open.value = false
  }

  function onReset () {
    answer.value = ''
    open.value = true
  }
</script>

<template>
  <div class="md1-docs-screen md1-docs-hint">
    <Md1Toolbar variant="primary">
      <Md1Toolbar.Nav />

      <Md1Toolbar.Title>Library</Md1Toolbar.Title>
    </Md1Toolbar>

    <div class="md1-docs-hint-body">
      <template v-if="open">
        <Md1Card>
          <Md1Card.Title>Welcome back!</Md1Card.Title>

          <Md1Card.Supporting>It's been a while. Have you read any new books lately?</Md1Card.Supporting>

          <Md1Card.Actions>
            <Md1Button @click="onAnswer('No')">No</Md1Button>

            <Md1Button @click="onAnswer('Yes')">Yes</Md1Button>
          </Md1Card.Actions>
        </Md1Card>

        <p class="md1-docs-hint-text">
          <span aria-hidden="true" class="md1-docs-hint-mark">
            <Md1Icon name="help" />
          </span>

          Answer No to put this card away
        </p>
      </template>

      <div v-else class="md1-docs-hint-done">
        <span role="status">You answered {{ answer }}.</span>

        <Md1Button @click="onReset">Show the card again</Md1Button>
      </div>
    </div>
  </div>
</template>

<style>
  .md1-docs-screen.md1-docs-hint {
    display: flex;
    flex-direction: column;
    max-width: 360px;
    background: var(--md1-background, #FAFAFA);
  }

  .md1-docs-hint-body {
    padding: var(--md1-spacing-1, 8px);
  }

  /*
   * Hint text: a short line under the element it explains, joined to it by a
   * 2 dp connector, with a 40 dp mark in the disabled ink. Quieter than a tap
   * target, for a small prompt that asks for input.
   */
  .md1-docs-hint-text {
    position: relative;
    display: flex;
    align-items: center;
    gap: var(--md1-spacing-2, 16px);
    margin: var(--md1-spacing-2, 16px) 0 0;
    padding-inline-start: var(--md1-spacing-1, 8px);
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-body-1-size, 14px);
    color: var(--md1-text-primary, rgba(0, 0, 0, 0.87));
  }

  .md1-docs-hint-text::before {
    content: '';
    position: absolute;
    inset-block-start: calc(-1 * var(--md1-spacing-2, 16px));
    inset-inline-start: calc(var(--md1-spacing-1, 8px) + 19px);
    width: 2px;
    height: var(--md1-spacing-2, 16px);
    background: var(--md1-divider, rgba(0, 0, 0, 0.12));
  }

  .md1-docs-hint-mark {
    display: grid;
    flex-shrink: 0;
    place-items: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    color: var(--md1-white, #FFFFFF);
    background: var(--md1-text-disabled, rgba(0, 0, 0, 0.38));
  }

  .md1-docs-hint-done {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--md1-spacing-2, 16px);
    padding: var(--md1-spacing-2, 16px);
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-body-1-size, 14px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
