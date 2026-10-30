<script lang="ts">
  import {
    Md1Button,
    Md1Radio,
    Md1Snackbar,
    Md1Stepper,
    Md1Switch,
    Md1TextField,
    md1Breakpoints,
  } from '@paper/md1'

  // Framework
  import { Form, useBreakpoints, useTimer } from '@vuetify/v0'

  // Utilities
  import { defineComponent, shallowRef, toRef, watch, watchEffect } from 'vue'
  import { useRouter } from 'vue-router'

  // Types
  import type { PropType } from 'vue'

  type Submit = () => Promise<boolean>

  function address (value: unknown) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value)) || 'Error: enter an address like name@example.com'
  }

  /**
   * Banks a Form slot's `submit` where the wizard can reach it: Continue,
   * Finish and the mobile bar's gate validate steps they do not render in,
   * and the slot alone sees the function.
   */
  const Enlist = defineComponent({
    name: 'Md1DemoEnlist',
    props: {
      at: { type: Number, required: true },
      bank: { type: Array as PropType<Submit[]>, required: true },
      submit: { type: Function as PropType<Submit>, required: true },
    },
    setup (props) {
      watchEffect(() => {
        props.bank[props.at] = props.submit
      })

      return () => null
    },
  })
</script>

<script setup lang="ts">
  defineOptions({ name: 'Md1Setup' })

  const router = useRouter()
  const { width } = useBreakpoints()

  /** Below 600 dp the header gives way to the mobile text form (stepper docs). */
  const mobile = toRef(() => width.value < md1Breakpoints[600])

  const step = shallowRef(0)

  // Account
  const name = shallowRef('')
  const email = shallowRef('')

  // Workspace
  const workspace = shallowRef('')
  const size = shallowRef('Just me')

  // Preferences
  const digest = shallowRef(true)
  const sounds = shallowRef(false)
  const tips = shallowRef(true)

  const done = shallowRef(false)
  const leave = useTimer(() => router.push('/md1'), { duration: 1400 })

  /** Each step's banked `submit`, filled by `Enlist` as the Forms mount. */
  const submits: Submit[] = []

  async function advance (index: number) {
    if (await submits[index]?.()) step.value = index + 1
  }

  function back () {
    step.value = Math.max(0, step.value - 1)
  }

  async function finish () {
    if (!(await submits[2]?.())) return

    done.value = true
    leave.start()
  }

  // The mobile bar moves first and emits after; walk back to the first invalid
  // step it skipped over, with its errors now showing.
  watch(step, async (next, prev) => {
    if (next <= prev) return

    for (let index = prev; index < next; index++) {
      if (!(await submits[index]?.())) {
        step.value = index
        return
      }
    }
  })
</script>

<template>
  <div class="md1-demo-auth" data-theme="md1-light">
    <!-- No card chrome: the stepper is its own 2 dp sheet, so a wrapper card would nest sheets. -->
    <main class="md1-demo-setup">
      <h1 class="md1-demo-auth__name">Set up your workspace</h1>

      <p class="md1-demo-auth__hint">Three short steps, and the dashboard is yours</p>

      <Md1Stepper v-model="step" :mobile="mobile ? 'text' : undefined">
        <Md1Stepper.Step label="Account" :value="0">
          <Md1Stepper.Content>
            <Form v-slot="{ submit }" class="md1-demo-setup__form">
              <Enlist :at="0" :bank="submits" :submit />

              <Md1TextField v-model="name" autocomplete="name" label="Name" required />

              <Md1TextField
                v-model="email"
                autocomplete="email"
                helper="We send the confirmation here"
                inputmode="email"
                label="Email"
                required
                :rules="[address]"
                type="email"
              />

              <Md1Stepper.Actions>
                <Md1Button variant="raised" @click="advance(0)">Continue</Md1Button>
              </Md1Stepper.Actions>
            </Form>
          </Md1Stepper.Content>
        </Md1Stepper.Step>

        <Md1Stepper.Step label="Workspace" :value="1">
          <Md1Stepper.Content>
            <Form v-slot="{ submit }" class="md1-demo-setup__form">
              <Enlist :at="1" :bank="submits" :submit />

              <Md1TextField
                v-model="workspace"
                helper="Shown in the toolbar and on invitations"
                label="Workspace name"
                required
              />

              <Md1Radio.Group v-model="size" aria-label="Team size" class="md1-demo-setup__choices">
                <Md1Radio label="Just me" value="Just me" />

                <Md1Radio label="2 to 10 people" value="2 to 10 people" />

                <Md1Radio label="11 to 50 people" value="11 to 50 people" />
              </Md1Radio.Group>

              <Md1Stepper.Actions>
                <Md1Button variant="raised" @click="advance(1)">Continue</Md1Button>

                <Md1Button @click="back">Back</Md1Button>
              </Md1Stepper.Actions>
            </Form>
          </Md1Stepper.Content>
        </Md1Stepper.Step>

        <Md1Stepper.Step label="Preferences" :value="2">
          <Md1Stepper.Content>
            <Form v-slot="{ submit }" class="md1-demo-setup__form">
              <Enlist :at="2" :bank="submits" :submit />

              <div class="md1-demo-setup__choices">
                <Md1Switch v-model="digest" label="Weekly digest" />

                <Md1Switch v-model="sounds" label="Notification sounds" />

                <Md1Switch v-model="tips" label="Product tips" />
              </div>

              <Md1Stepper.Actions>
                <Md1Button variant="raised" @click="finish">Finish</Md1Button>

                <Md1Button @click="back">Back</Md1Button>
              </Md1Stepper.Actions>
            </Form>
          </Md1Stepper.Content>
        </Md1Stepper.Step>

        <Md1Stepper.Bar v-if="mobile" />
      </Md1Stepper>

      <Md1Snackbar.Portal :teleport="false">
        <Md1Snackbar v-model="done">Workspace ready, taking you to the overview</Md1Snackbar>
      </Md1Snackbar.Portal>
    </main>
  </div>
</template>

<style>
  /* Page chrome shared with the sign-in screen (md1-demo-auth in Md1SignIn.vue). */
  .md1-demo-setup {
    width: 100%;
    max-width: 720px;
  }

  .md1-demo-setup__form {
    display: flex;
    flex-direction: column;
    gap: var(--md1-spacing-2, 16px);
    padding-top: var(--md1-spacing-1, 8px);
  }

  .md1-demo-setup__choices {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--md1-spacing-1, 8px);
  }
</style>
