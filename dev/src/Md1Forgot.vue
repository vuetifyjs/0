<script lang="ts">
  import { Md1Button, Md1Snackbar, Md1TextField } from '@paper/md1'

  // Framework
  import { Form, useTimer } from '@vuetify/v0'

  // Utilities
  import { shallowRef } from 'vue'
  import { useRouter } from 'vue-router'

  function address (value: unknown) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value)) || 'Error: enter an address like name@example.com'
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'Md1Forgot' })

  const router = useRouter()

  const email = shallowRef('')
  const sent = shallowRef(false)

  // The acknowledgement shows before sign-in returns.
  const timer = useTimer(() => {
    router.push('/md1/sign-in')
  }, { duration: 1400 })

  async function onSend (submit: () => Promise<boolean>) {
    if (await submit()) onSent()
  }

  function onSent () {
    sent.value = true
    timer.start()
  }
</script>

<template>
  <div class="md1-demo-auth" data-theme="md1-light">
    <main class="md1-demo-auth__card md1-elevation-2">
      <h1 class="md1-demo-auth__name">Quanta</h1>

      <p class="md1-demo-auth__hint">We'll email you a link to reset your password</p>

      <Form v-slot="{ submit }" class="md1-demo-auth__form">
        <!-- No native submit button exists and Enter's default is prevented:
             the keydown path below is the one way in from the keyboard. -->
        <div class="md1-demo-auth__fields" @keydown.enter.prevent="onSend(submit)">
          <Md1TextField
            v-model="email"
            autocomplete="email"
            helper="The address you signed up with"
            inputmode="email"
            label="Email"
            required
            :rules="[address]"
            type="email"
          />
        </div>

        <div class="md1-demo-auth__actions">
          <Md1Button :disabled="sent" variant="raised" @click="onSend(submit)">Send reset link</Md1Button>

          <Md1Button @click="router.push('/md1/sign-in')">Back to sign in</Md1Button>
        </div>
      </Form>
    </main>

    <Md1Snackbar.Portal :teleport="false">
      <Md1Snackbar v-model="sent">Reset link sent</Md1Snackbar>
    </Md1Snackbar.Portal>
  </div>
</template>
