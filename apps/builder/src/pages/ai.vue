<script setup lang="ts">
  import { mdiArrowLeft, mdiLock, mdiSend } from '@mdi/js'

  // Utilities
  import { shallowRef } from 'vue'
  import { useRouter } from 'vue-router'

  import { useBuilderStore } from '@/stores/builder'

  const store = useBuilderStore()
  const router = useRouter()

  const authenticated = shallowRef(false)
  const input = shallowRef('')

  const messages = shallowRef<Array<{ role: 'user' | 'assistant', content: string }>>([
    { role: 'assistant', content: 'Tell me about your project and I\'ll help you pick the right v0 features.' },
  ])

  function onSend () {
    if (!input.value.trim()) return
    messages.value = [
      ...messages.value,
      { role: 'user', content: input.value },
      { role: 'assistant', content: 'AI integration coming soon. For now, try the Guided or Free Pick modes!' },
    ]
    input.value = ''
  }

  function onReview () {
    router.push('/review')
  }
</script>

<template>
  <div>
    <!-- Auth gate -->
    <div v-if="!authenticated" class="flex flex-col items-center justify-center min-h-screen px-6">
      <svg class="w-12 h-12 text-on-surface-variant mb-4" viewBox="0 0 24 24">
        <path :d="mdiLock" fill="currentColor" />
      </svg>
      <h2 class="text-xl font-bold mb-2">Vuetify One Required</h2>
      <p class="text-on-surface-variant text-center max-w-md mb-6">
        The AI Builder is available to Vuetify One subscribers. Get personalized framework recommendations powered by AI.
      </p>
      <div class="flex gap-3">
        <button
          class="px-4 py-2 text-sm border border-divider rounded-lg text-on-surface-variant hover:text-on-surface transition-colors"
          @click="router.push('/')"
        >
          Back to Builder
        </button>
        <a
          class="px-4 py-2 text-sm bg-primary text-on-primary rounded-lg font-semibold hover:opacity-90 transition-opacity"
          href="https://one.vuetifyjs.com"
          target="_blank"
        >
          Learn about Vuetify One
        </a>
      </div>

      <!-- Dev bypass -->
      <button
        v-if="__DEV__"
        class="mt-8 text-xs text-on-surface-variant/50 hover:text-on-surface-variant"
        @click="authenticated = true"
      >
        [Dev] Skip auth
      </button>
    </div>

    <!-- AI Builder -->
    <div v-else class="flex min-h-screen">
      <div class="flex-1 flex flex-col">
        <div class="flex items-center justify-between py-4">
          <button class="text-sm text-on-surface-variant hover:text-on-surface transition-colors" @click="router.push('/')">
            <svg class="w-4 h-4 inline mr-1" viewBox="0 0 24 24"><path :d="mdiArrowLeft" fill="currentColor" /></svg>
            Back
          </button>
          <button
            class="text-sm bg-primary text-on-primary px-3 py-1.5 rounded-lg font-semibold hover:opacity-90 transition-opacity"
            :class="{ 'opacity-50 cursor-not-allowed': store.selected.size === 0 }"
            :disabled="store.selected.size === 0"
            @click="onReview"
          >
            Review ({{ store.selected.size }})
          </button>
        </div>

        <div class="flex-1 overflow-y-auto py-4 space-y-4">
          <div
            v-for="(msg, index) in messages"
            :key="index"
            class="flex"
            :class="msg.role === 'user' ? 'justify-end' : 'justify-start'"
          >
            <div
              class="max-w-[80%] px-4 py-2.5 rounded-lg text-sm"
              :class="msg.role === 'user'
                ? 'bg-primary text-on-primary'
                : 'bg-surface-tint text-on-surface'"
            >
              {{ msg.content }}
            </div>
          </div>
        </div>

        <div class="py-4 border-t border-divider">
          <div class="flex gap-2">
            <input
              v-model="input"
              class="flex-1 px-4 py-2.5 rounded-lg border border-divider bg-surface text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary focus:outline-none transition-colors"
              placeholder="Describe your project..."
              type="text"
              @keydown.enter="onSend"
            >
            <button
              class="px-4 py-2.5 bg-primary text-on-primary rounded-lg hover:opacity-90 transition-opacity"
              :class="{ 'opacity-50 cursor-not-allowed': !input.trim() }"
              :disabled="!input.trim()"
              @click="onSend"
            >
              <svg class="w-5 h-5" viewBox="0 0 24 24"><path :d="mdiSend" fill="currentColor" /></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
