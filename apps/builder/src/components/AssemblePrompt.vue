<script setup lang="ts">
  import { mdiAutoFix, mdiLockOutline } from '@mdi/js'

  // Framework
  import { AlertDialog, Button, Dialog } from '@vuetify/v0'

  // Components
  import Icon from '@/components/app/Icon.vue'

  // Composables
  import { isSubscriber, useAssemble } from '@/composables/useAssemble'

  // Stores
  import { useBuilderStore } from '@/stores/builder'
  import { useAuthStore } from '@vuetify/auth'

  // Utilities
  import { shallowRef, toRef } from 'vue'
  import { useRouter } from 'vue-router'

  // Types
  import type { AuthProvider } from '@vuetify/auth'

  const auth = useAuthStore()
  const store = useBuilderStore()
  const router = useRouter()
  const { assemble, isLoading, error } = useAssemble()

  const dialog = shallowRef(false)
  const requirements = shallowRef('')
  const confirmOverwrite = shallowRef(false)
  const pendingResult = shallowRef<{ plugins: string[], components: string[] } | null>(null)

  const hasSubscription = toRef(() => isSubscriber(auth.user?.role))
  const isAuthenticated = toRef(() => auth.isAuthenticated)
  const hasExistingBuild = toRef(() => store.selectedPlugins.size > 0 || store.selectedComponents.size > 0)

  const providers: { name: string, provider: AuthProvider, bg: string }[] = [
    { name: 'GitHub', provider: 'github', bg: '#24292f' },
    { name: 'Discord', provider: 'discord', bg: '#5865F2' },
    { name: 'Google', provider: 'google', bg: '#4285F4' },
  ]

  function open () {
    dialog.value = true
    requirements.value = ''
  }

  function close () {
    dialog.value = false
    requirements.value = ''
    pendingResult.value = null
  }

  async function onSubmit () {
    if (!requirements.value.trim()) return

    const result = await assemble(requirements.value)
    if (!result) return

    if (hasExistingBuild.value) {
      pendingResult.value = result
      confirmOverwrite.value = true
    } else {
      await applyResult(result)
    }
  }

  async function applyResult (result: { plugins: string[], components: string[] }) {
    for (const plugin of result.plugins) {
      store.selectPlugin(plugin)
    }

    for (const component of result.components) {
      store.selectComponent(component)
    }

    close()
    router.push('/builder')
  }

  async function onConfirmOverwrite () {
    if (!pendingResult.value) return

    confirmOverwrite.value = false
    await applyResult(pendingResult.value)
  }

  function onCancelOverwrite () {
    confirmOverwrite.value = false
    pendingResult.value = null
  }
</script>

<template>
  <div>
    <!-- Trigger button -->
    <Button.Root class="btn-outline h-12 px-5" @click="open">
      <Button.Icon>
        <svg class="w-4 h-4" viewBox="0 0 24 24">
          <path :d="mdiAutoFix" fill="currentColor" />
        </svg>
      </Button.Icon>

      <Button.Content>Describe what you need</Button.Content>
    </Button.Root>

    <!-- Main dialog -->
    <Dialog.Root v-model="dialog">
      <Dialog.Content
        class="m-auto rounded-xl bg-surface border border-divider max-w-lg w-full p-0 shadow-xl overflow-hidden"
      >
        <!-- Header -->
        <div class="flex items-center justify-between gap-3 px-5 py-4 border-b border-divider bg-surface-variant/40">
          <div class="flex items-center gap-3">
            <span class="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Icon class="text-primary" :path="mdiAutoFix" :size="18" />
            </span>

            <Dialog.Title class="t-section">
              Assemble from description
            </Dialog.Title>
          </div>

          <Dialog.Close class="pa-1 cursor-pointer bg-transparent border-0 inline-flex items-center justify-center rounded hover:bg-surface-variant transition-colors text-on-surface-variant">
            <svg class="w-4 h-4" viewBox="0 0 24 24">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="currentColor" />
            </svg>
          </Dialog.Close>
        </div>

        <div class="p-5">
          <!-- Not authenticated: show sign in -->
          <template v-if="!isAuthenticated">
            <Dialog.Description class="t-body text-on-surface-variant mb-6">
              Sign in with Vuetify One to describe your app and get a suggested configuration.
            </Dialog.Description>

            <div class="flex flex-col gap-2">
              <button
                v-for="p in providers"
                :key="p.provider"
                class="flex items-center justify-center gap-3 w-full px-4 py-2.5 rounded-lg text-white text-sm font-medium transition-opacity hover:opacity-90 disabled:opacity-50 cursor-pointer border-0"
                :disabled="auth.isLoading"
                :style="{ backgroundColor: p.bg }"
                type="button"
                @click="auth.login(p.provider)"
              >
                <span>Continue with {{ p.name }}</span>
              </button>
            </div>

            <p class="mt-5 text-xs text-on-surface-variant text-center">
              <a
                class="text-primary underline underline-offset-2 hover:opacity-80"
                href="https://vuetifyjs.com/one"
                rel="noopener noreferrer"
                target="_blank"
              >What is Vuetify One?</a>
            </p>
          </template>

          <!-- Authenticated but not a subscriber: show upgrade CTA -->
          <template v-else-if="!hasSubscription">
            <div class="text-center py-4">
              <span class="w-12 h-12 mx-auto mb-4 rounded-full bg-surface-variant flex items-center justify-center">
                <Icon class="text-on-surface-variant" :path="mdiLockOutline" :size="24" />
              </span>

              <Dialog.Description class="t-body text-on-surface-variant mb-6">
                This feature requires a Vuetify One subscription. Describe what you're building and get a tailored plugin and component selection in seconds.
              </Dialog.Description>

              <a
                class="btn-primary h-10 px-6 inline-flex items-center justify-center rounded-lg font-medium text-sm no-underline"
                href="https://vuetifyjs.com/one"
                rel="noopener noreferrer"
                target="_blank"
              >
                Get Vuetify One
              </a>

              <p class="mt-4 text-xs text-on-surface-variant">
                Starting at $2.99/month
              </p>
            </div>
          </template>

          <!-- Subscriber: show the prompt -->
          <template v-else>
            <Dialog.Description class="t-body text-on-surface-variant mb-4">
              Describe your app or what you're building. We'll suggest the plugins and components you need.
            </Dialog.Description>

            <form @submit.prevent="onSubmit">
              <textarea
                v-model="requirements"
                class="w-full h-32 p-3 border border-divider rounded-lg bg-surface text-on-surface text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                :disabled="isLoading"
                placeholder="e.g., I'm building a dashboard app with dark/light theme toggle, form validation, date pickers, and toast notifications. It needs to work well on mobile too."
              />

              <p v-if="error" class="mt-2 text-sm text-error">
                {{ error }}
              </p>

              <div class="flex items-center justify-end gap-2 mt-4">
                <Button.Root class="btn-ghost h-9 px-4" type="button" @click="close">
                  <Button.Content>Cancel</Button.Content>
                </Button.Root>

                <Button.Root
                  class="btn-primary h-9 px-4"
                  :disabled="!requirements.trim() || isLoading"
                  type="submit"
                >
                  <Button.Content>
                    {{ isLoading ? 'Assembling...' : 'Assemble' }}
                  </Button.Content>
                </Button.Root>
              </div>
            </form>
          </template>
        </div>
      </Dialog.Content>
    </Dialog.Root>

    <!-- Confirm overwrite dialog -->
    <AlertDialog.Root v-model="confirmOverwrite">
      <AlertDialog.Content
        class="floating m-auto p-6 w-[min(26rem,calc(100vw-2rem))] rounded-xl backdrop:bg-black/60"
        close-on-escape
      >
        <AlertDialog.Title class="t-section mb-2">
          Replace current selection?
        </AlertDialog.Title>

        <AlertDialog.Description class="t-meta text-on-surface-variant mb-6">
          You have existing plugin and component selections. The AI suggestions will be added to your current selections.
        </AlertDialog.Description>

        <div class="flex items-center justify-end gap-2">
          <AlertDialog.Cancel class="btn-ghost h-9 px-4" @click="onCancelOverwrite">
            Cancel
          </AlertDialog.Cancel>

          <AlertDialog.Action class="btn-primary h-9 px-4" @action="onConfirmOverwrite">
            Add selections
          </AlertDialog.Action>
        </div>
      </AlertDialog.Content>
    </AlertDialog.Root>
  </div>
</template>
