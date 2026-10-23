<script setup lang="ts">
  import { QuButton, QuTextField } from '@paper/quantum'
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
  <div ref="sheet" class="quantum-docs-errors-sheet">
    <Form v-slot="{ submit }" class="quantum-docs-errors-form">
      <div
        v-if="attempted && problems.length > 0"
        class="quantum-docs-errors-summary"
        role="alert"
      >
        <p class="quantum-docs-errors-summary-title">Fix {{ problems.length }} {{ problems.length === 1 ? 'field' : 'fields' }} to create the account</p>

        <ul class="quantum-docs-errors-summary-list">
          <li v-for="problem in problems" :key="problem">{{ problem }}</li>
        </ul>
      </div>

      <QuTextField v-model="name" autocomplete="name" label="Name" :rules="[filled]" />

      <QuTextField
        v-model="email"
        autocomplete="email"
        inputmode="email"
        label="Email"
        :rules="[address]"
        type="email"
      />

      <QuTextField
        v-model="confirm"
        autocomplete="off"
        inputmode="email"
        label="Confirm email"
        :rules="[match]"
        type="email"
      />

      <div class="quantum-docs-errors-actions">
        <QuButton variant="raised" @click="onSave(submit)">Create account</QuButton>
      </div>

      <p v-if="sent" class="quantum-docs-errors-note" role="status">Account created</p>
    </Form>
  </div>
</template>

<style>
  .quantum-docs-errors-sheet {
    box-sizing: border-box;
    max-width: 400px;
    max-height: 360px;
    overflow-y: auto;
    padding: var(--quantum-spacing-2, 16px) var(--quantum-spacing-3, 24px);
    background: var(--quantum-surface, #FFFFFF);
    border-radius: var(--quantum-radius, 2px);
    box-shadow: var(--quantum-elevation-2);
  }

  .quantum-docs-errors-form {
    display: flex;
    flex-direction: column;
    gap: var(--quantum-spacing-2, 16px);
  }

  .quantum-docs-errors-summary {
    font-family: var(--quantum-font-family, Roboto, Noto, sans-serif);
    color: var(--quantum-text-secondary, rgba(0, 0, 0, 0.54));
  }

  .quantum-docs-errors-summary-title {
    margin: 0 0 var(--quantum-spacing-1, 8px);
    color: var(--quantum-error, #FF1744);
    font-size: var(--quantum-type-body-2-size, 14px);
    font-weight: var(--quantum-type-body-2-weight, 500);
    line-height: var(--quantum-type-body-2-leading, 24px);
  }

  .quantum-docs-errors-summary-list {
    margin: 0;
    padding-inline-start: 20px;
    font-size: var(--quantum-type-body-1-size, 14px);
    line-height: var(--quantum-type-body-1-leading, 20px);
  }

  .quantum-docs-errors-actions {
    display: flex;
    justify-content: flex-end;
  }

  .quantum-docs-errors-note {
    margin: 0;
    font-family: var(--quantum-font-family, Roboto, Noto, sans-serif);
    font-size: var(--quantum-type-caption-size, 12px);
    color: var(--quantum-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
