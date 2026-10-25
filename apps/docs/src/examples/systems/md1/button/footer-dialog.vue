<script setup lang="ts">
  import { Md1Button, Md1Dialog } from '@paper/md1'
  import { shallowRef } from 'vue'

  const notice = shallowRef(false)
  const terms = shallowRef(false)

  const sections = [
    { title: 'Your account', text: 'You are responsible for the activity that happens on your account. Keep your password secret and tell us at once if you think someone else has used it.' },
    { title: 'Your content', text: 'You keep ownership of the photos, notes and files you store. You give us permission to host and back them up so the service can show them to you on every device.' },
    { title: 'Storage', text: 'Free accounts include 15 GB. When an account runs out of space, new photos stop backing up until space is freed or more storage is bought.' },
    { title: 'Payments', text: 'Paid storage renews each month until you cancel it. A cancelled plan stays active until the end of the period you have paid for.' },
    { title: 'Privacy', text: 'Our privacy policy explains how we treat your personal data and protect your privacy when you use the service.' },
    { title: 'Changes to these terms', text: 'We may change these terms to reflect changes to the service or the law. We will tell you before a change takes effect.' },
    { title: 'Ending the service', text: 'You can stop using the service at any time. We will give you reasonable notice before we end it, and time to download your content.' },
  ]
</script>

<template>
  <div class="md1-docs-row md1-docs-row-loose">
    <Md1Dialog v-model="notice">
      <Md1Dialog.Activator v-slot="{ attrs }">
        <Md1Button v-bind="attrs" variant="raised">Show notice</Md1Button>
      </Md1Dialog.Activator>

      <Md1Dialog.Content>
        <Md1Dialog.Title>Storage almost full</Md1Dialog.Title>

        <Md1Dialog.Text class="md1-docs-dialog-measure">Photos and videos are no longer backing up. Free up space or buy more storage to continue.</Md1Dialog.Text>

        <div class="md1-docs-dialog-footer">
          <Md1Button footer @click="notice = false">Got it</Md1Button>
        </div>
      </Md1Dialog.Content>
    </Md1Dialog>

    <Md1Dialog v-model="terms">
      <Md1Dialog.Activator v-slot="{ attrs }">
        <Md1Button v-bind="attrs" variant="raised">Show terms</Md1Button>
      </Md1Dialog.Activator>

      <Md1Dialog.Content>
        <Md1Dialog.Title>Terms of service</Md1Dialog.Title>

        <Md1Dialog.Text class="md1-docs-dialog-measure">
          <template v-for="section in sections" :key="section.title">
            <span class="md1-docs-dialog-heading md1-type-subheading">{{ section.title }}</span>

            <span class="md1-docs-dialog-paragraph">{{ section.text }}</span>
          </template>
        </Md1Dialog.Text>

        <div class="md1-docs-dialog-footer md1-docs-dialog-footer-divided">
          <Md1Button footer @click="terms = false">Accept</Md1Button>
        </div>
      </Md1Dialog.Content>
    </Md1Dialog>
  </div>
</template>

<style>
  /* The footer button pinned to the bottom of the sheet while the content scrolls under it. */
  .md1-docs-dialog-footer {
    position: sticky;
    bottom: 0;
    z-index: 1;
    display: flex;
    background: var(--md1-surface, #FFFFFF);
  }

  /* The guidelines add a divider above a footer button when the content scrolls. */
  .md1-docs-dialog-footer-divided {
    border-top: 1px solid var(--md1-divider, rgba(0, 0, 0, 0.12));
  }

  /* A reading measure for the text, so the sheet, which sizes to its content, stops at a dialog width on desktop. */
  .md1-docs-dialog-measure {
    box-sizing: border-box;
    max-width: 400px;
  }

  .md1-docs-dialog-heading {
    display: block;
    color: var(--md1-text-primary, rgba(0, 0, 0, 0.87));
  }

  .md1-docs-dialog-paragraph {
    display: block;
    margin-block-end: var(--md1-spacing-2, 16px);
  }
</style>
