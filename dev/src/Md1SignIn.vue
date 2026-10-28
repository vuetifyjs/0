<script lang="ts">
  import { Md1Button, Md1TextField } from '@paper/md1'

  // Framework
  import { Form } from '@vuetify/v0'

  // Utilities
  import { shallowRef } from 'vue'
  import { useRouter } from 'vue-router'

  function address (value: unknown) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value)) || 'Error: enter an address like name@example.com'
  }

  function strong (value: unknown) {
    return String(value).length >= 8 || 'Error: use eight characters or more'
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'Md1SignIn' })

  const router = useRouter()

  const email = shallowRef('')
  const password = shallowRef('')

  /** Enter in a field drives the native form submission; v0's Form has already validated. */
  function onSubmit ({ valid }: { valid: boolean }) {
    if (valid) router.push('/md1')
  }

  async function onSignIn (submit: () => Promise<boolean>) {
    if (await submit()) router.push('/md1')
  }
</script>

<template>
  <div class="md1-demo-auth" data-theme="md1-light">
    <main class="md1-demo-auth__card md1-elevation-2">
      <h1 class="md1-demo-auth__name">Quanta</h1>

      <p class="md1-demo-auth__hint">Sign in to your workspace</p>

      <Form v-slot="{ submit }" class="md1-demo-auth__form" @submit="onSubmit">
        <!-- No native submit button exists, so Enter needs its own path to sign in. -->
        <div class="md1-demo-auth__fields" @keydown.enter.prevent="onSignIn(submit)">
          <Md1TextField
            v-model="email"
            autocomplete="email"
            helper="Your work address"
            inputmode="email"
            label="Email"
            required
            :rules="[address]"
            type="email"
          />

          <Md1TextField
            v-model="password"
            autocomplete="current-password"
            helper="Eight characters or more"
            label="Password"
            required
            :rules="[strong]"
            type="password"
          />
        </div>

        <div class="md1-demo-auth__actions">
          <Md1Button variant="raised" @click="onSignIn(submit)">Sign in</Md1Button>

          <Md1Button @click="router.push('/md1/setup')">Create account</Md1Button>
        </div>
      </Form>
    </main>
  </div>
</template>

<style>
  .md1-demo-auth {
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    min-height: 100dvh;
    padding: var(--md1-keyline-margin, 16px);
    background: var(--md1-background, #FAFAFA);
    color: var(--md1-text-primary, rgba(0, 0, 0, 0.87));
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
  }

  .md1-demo-auth__card {
    width: 100%;
    max-width: 400px;
    padding: var(--md1-spacing-4, 32px) var(--md1-spacing-3, 24px);
    background: var(--md1-surface, #FFFFFF);
    border-radius: var(--md1-radius, 2px);
  }

  .md1-demo-auth__name {
    margin: 0;
    font-size: var(--md1-type-headline-size, 24px);
    font-weight: var(--md1-type-headline-weight, 400);
    line-height: var(--md1-type-headline-leading, 32px);
    text-align: center;
  }

  .md1-demo-auth__hint {
    margin: var(--md1-spacing-1, 8px) 0 var(--md1-spacing-3, 24px);
    font-size: var(--md1-type-body-1-size, 14px);
    line-height: var(--md1-type-body-1-leading, 20px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
    text-align: center;
  }

  .md1-demo-auth__form,
  .md1-demo-auth__fields {
    display: flex;
    flex-direction: column;
    gap: var(--md1-spacing-2, 16px);
  }

  /* The affirmative action sits at the end edge (dialogs page), the flat alternative at the start. */
  .md1-demo-auth__actions {
    display: flex;
    flex-direction: row-reverse;
    align-items: center;
    justify-content: space-between;
    margin-top: var(--md1-spacing-1, 8px);
  }
</style>
