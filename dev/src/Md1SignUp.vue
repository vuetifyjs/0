<script lang="ts">
  import { Md1Button, Md1Snackbar, Md1TextField } from '@paper/md1'

  // Framework
  import { Form, useTimer } from '@vuetify/v0'

  // Utilities
  import { shallowRef } from 'vue'
  import { useRouter } from 'vue-router'

  function filled (value: unknown) {
    return String(value).trim().length > 0 || 'Error: enter your name'
  }

  function address (value: unknown) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value)) || 'Error: enter an address like name@example.com'
  }

  function strong (value: unknown) {
    return String(value).length >= 8 || 'Error: use eight characters or more'
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'Md1SignUp' })

  const router = useRouter()

  const name = shallowRef('')
  const email = shallowRef('')
  const password = shallowRef('')
  const confirm = shallowRef('')
  const created = shallowRef(false)

  function match (value: unknown) {
    return value === password.value || 'Error: the passwords do not match'
  }

  // The acknowledgement shows before the app takes over.
  const timer = useTimer(() => {
    router.push('/md1/setup')
  }, { duration: 1400 })

  async function onCreate (submit: () => Promise<boolean>) {
    if (await submit()) onCreated()
  }

  function onCreated () {
    created.value = true
    timer.start()
  }
</script>

<template>
  <div class="md1-demo-auth" data-theme="md1-light">
    <main class="md1-demo-auth__card md1-elevation-2">
      <h1 class="md1-demo-auth__name">Quanta</h1>

      <p class="md1-demo-auth__hint">Create your workspace account</p>

      <Form v-slot="{ submit }" class="md1-demo-auth__form">
        <!-- No native submit button exists and Enter's default is prevented:
             the keydown path below is the one way in from the keyboard. -->
        <div class="md1-demo-auth__fields" @keydown.enter.prevent="onCreate(submit)">
          <Md1TextField
            v-model="name"
            autocomplete="name"
            label="Name"
            required
            :rules="[filled]"
          />

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
            autocomplete="new-password"
            helper="Eight characters or more"
            label="Password"
            required
            :rules="[strong]"
            type="password"
          />

          <Md1TextField
            v-model="confirm"
            autocomplete="new-password"
            label="Confirm password"
            required
            :rules="[match]"
            type="password"
          />
        </div>

        <div class="md1-demo-auth__actions">
          <Md1Button :disabled="created" variant="raised" @click="onCreate(submit)">Create account</Md1Button>

          <Md1Button @click="router.push('/md1/sign-in')">Sign in instead</Md1Button>
        </div>
      </Form>
    </main>

    <Md1Snackbar.Portal :teleport="false">
      <Md1Snackbar v-model="created">Account created</Md1Snackbar>
    </Md1Snackbar.Portal>
  </div>
</template>
