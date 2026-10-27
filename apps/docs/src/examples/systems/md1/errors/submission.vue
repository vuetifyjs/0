<script setup lang="ts">
  import { Md1Button, Md1TextField } from '@paper/md1'
  import { Form } from '@vuetify/v0'
  import { shallowRef, toRef, useTemplateRef } from 'vue'

  const name = shallowRef('')
  const email = shallowRef('')
  const confirm = shallowRef('')
  const attempted = shallowRef(false)
  const sent = shallowRef(false)

  const sheet = useTemplateRef<HTMLElement>('sheet')

  function filled (value: unknown) {
    return String(value).trim().length > 0 || 'Enter your name'
  }

  function address (value: unknown) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value)) || 'Enter an address like name@example.com'
  }

  function match (value: unknown) {
    return String(value) === email.value || 'The two addresses do not match'
  }

  // The summary is derived from the same rules, so it shrinks as each field is fixed.
  const problems = toRef(() => [
    filled(name.value) === true ? '' : 'Name is empty',
    address(email.value) === true ? '' : 'Email is not a valid address',
    match(confirm.value) === true ? '' : 'Confirm email does not match Email',
  ].filter(Boolean))

  async function onSave (submit: () => Promise<boolean>) {
    attempted.value = true

    const valid = await submit()

    sent.value = valid

    if (!valid) sheet.value?.scrollTo({ top: 0 })
  }
</script>

<template>
  <div ref="sheet" class="md1-docs-errors-sheet">
    <Form v-slot="{ submit }" class="md1-docs-errors-form">
      <div
        v-if="attempted && problems.length > 0"
        class="md1-docs-errors-summary"
        role="alert"
      >
        <p class="md1-docs-errors-summary-title">Fix {{ problems.length }} {{ problems.length === 1 ? 'field' : 'fields' }} to create the account</p>

        <ul class="md1-docs-errors-summary-list">
          <li v-for="problem in problems" :key="problem">{{ problem }}</li>
        </ul>
      </div>

      <Md1TextField v-model="name" autocomplete="name" label="Name" :rules="[filled]" />

      <Md1TextField
        v-model="email"
        autocomplete="email"
        inputmode="email"
        label="Email"
        :rules="[address]"
        type="email"
      />

      <Md1TextField
        v-model="confirm"
        autocomplete="off"
        inputmode="email"
        label="Confirm email"
        :rules="[match]"
        type="email"
      />

      <div class="md1-docs-errors-actions">
        <Md1Button variant="raised" @click="onSave(submit)">Create account</Md1Button>
      </div>

      <p v-if="sent" class="md1-docs-errors-note" role="status">Account created</p>
    </Form>
  </div>
</template>

<style>
  .md1-docs-errors-sheet {
    box-sizing: border-box;
    max-width: 400px;
    max-height: 360px;
    overflow-y: auto;
    padding: var(--md1-spacing-2, 16px) var(--md1-spacing-3, 24px);
    background: var(--md1-surface, #FFFFFF);
    border-radius: var(--md1-radius, 2px);
    box-shadow: var(--md1-elevation-2);
  }

  .md1-docs-errors-form {
    display: flex;
    flex-direction: column;
    gap: var(--md1-spacing-2, 16px);
  }

  .md1-docs-errors-summary {
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }

  .md1-docs-errors-summary-title {
    margin: 0 0 var(--md1-spacing-1, 8px);
    color: var(--md1-error, #FF1744);
    font-size: var(--md1-type-body-2-size, 14px);
    font-weight: var(--md1-type-body-2-weight, 500);
    line-height: var(--md1-type-body-2-leading, 24px);
  }

  .md1-docs-errors-summary-list {
    margin: 0;
    padding-inline-start: 20px;
    font-size: var(--md1-type-body-1-size, 14px);
    line-height: var(--md1-type-body-1-leading, 20px);
  }

  /* Forms place the affirmative button at the start, under the fields it submits. */
  .md1-docs-errors-actions {
    display: flex;
    justify-content: flex-start;
  }

  .md1-docs-errors-note {
    margin: 0;
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-caption-size, 12px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
