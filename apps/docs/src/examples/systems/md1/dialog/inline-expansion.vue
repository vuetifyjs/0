<script setup lang="ts">
  import { Md1Button, Md1Dialog, Md1Icon, Md1Ripple } from '@paper/md1'
  import { Collapsible } from '@vuetify/v0'
  import { shallowRef, watch } from 'vue'

  const open = shallowRef(false)
  const expanded = shallowRef(false)
  const answer = shallowRef('Not asked yet')

  // Each opening starts collapsed, as a freshly shown dialog would.
  watch(open, value => {
    if (value) expanded.value = false
  })

  function onAgree () {
    answer.value = 'Location service on'
  }
</script>

<template>
  <div class="md1-docs-dialog-stack">
    <Md1Dialog v-model="open">
      <Md1Dialog.Activator v-slot="{ attrs }">
        <Md1Button v-bind="attrs" variant="raised">Turn on location</Md1Button>
      </Md1Dialog.Activator>

      <Md1Dialog.Content>
        <Md1Dialog.Title>Use location service?</Md1Dialog.Title>

        <Md1Dialog.Text class="md1-docs-dialog-measure">
          Let apps find your location using GPS, Wi-Fi and mobile networks, even when no apps are running.

          <Collapsible.Root v-model="expanded">
            <Collapsible.Activator class="md1-docs-dialog-more">
              <Md1Ripple />

              <span class="md1-docs-dialog-more-label">What gets sent</span>

              <Md1Icon class="md1-docs-dialog-more-cue" name="expand-more" />
            </Collapsible.Activator>

            <Collapsible.Content class="md1-docs-dialog-more-body">
              Anonymous location data is sent to the location service at regular intervals: nearby Wi-Fi access points and mobile network towers, and your GPS position when it is available. It is not linked to your account, and you can turn the service off in Settings at any time.
            </Collapsible.Content>
          </Collapsible.Root>
        </Md1Dialog.Text>

        <Md1Dialog.Actions>
          <Md1Dialog.Cancel>Disagree</Md1Dialog.Cancel>

          <Md1Dialog.Confirm @confirm="onAgree">Agree</Md1Dialog.Confirm>
        </Md1Dialog.Actions>
      </Md1Dialog.Content>
    </Md1Dialog>

    <p class="md1-docs-readout md1-docs-note" role="status">{{ answer }}</p>
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

  /* The copy holds a dialog's reading width, so the expanded text wraps instead of widening the sheet. */
  .md1-docs-dialog-measure {
    max-width: 320px;
  }

  /*
   * The disclosure row sits inside the body copy, so it takes the copy's ink and
   * size; only the arrow tells it apart, pointing down closed and up open.
   */
  .md1-docs-dialog-more {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--md1-spacing-2, 16px);
    box-sizing: border-box;
    width: 100%;
    min-height: 48px;
    margin-top: var(--md1-spacing-1, 8px);
    padding: 0;
    border: 0;
    background: transparent;
    color: var(--md1-text-primary, rgba(0, 0, 0, 0.87));
    font: inherit;
    text-align: start;
    cursor: pointer;
  }

  .md1-docs-dialog-more:focus-visible {
    outline: 2px solid transparent;
    background: var(--md1-focus, rgba(0, 0, 0, 0.12));
  }

  .md1-docs-dialog-more-label {
    position: relative;
  }

  .md1-docs-dialog-more-cue {
    flex: none;
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
    transition: transform var(--md1-duration-standard, 300ms) var(--md1-easing-standard, cubic-bezier(0.4, 0, 0.2, 1));
  }

  .md1-docs-dialog-more[data-state="open"] .md1-docs-dialog-more-cue {
    transform: rotate(180deg);
  }

  .md1-docs-dialog-more-body {
    padding-bottom: var(--md1-spacing-1, 8px);
  }
</style>
