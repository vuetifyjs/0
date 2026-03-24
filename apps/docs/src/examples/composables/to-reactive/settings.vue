<script setup lang="ts">
  import { toReactive } from '@vuetify/v0'
  import { ref, watch } from 'vue'

  const config = ref({
    theme: 'dark',
    language: 'en',
    fontSize: 14,
    notifications: true,
    sidebar: true,
  })

  const settings = toReactive(config)

  const history = ref<string[]>([])

  watch(config, val => {
    history.value = [
      JSON.stringify(val),
      ...history.value.slice(0, 4),
    ]
  }, { deep: true })

  function reset () {
    config.value = {
      theme: 'dark',
      language: 'en',
      fontSize: 14,
      notifications: true,
      sidebar: true,
    }
  }
</script>

<template>
  <div class="space-y-4">
    <p class="text-xs text-on-surface-variant">
      Mutate the reactive proxy directly &mdash; changes flow back to the source ref.
    </p>

    <!-- Settings controls -->
    <div class="space-y-3 rounded-lg border border-divider p-4">
      <!-- Theme -->
      <div class="flex items-center justify-between">
        <span class="text-sm text-on-surface">Theme</span>
        <div class="flex gap-1">
          <button
            v-for="t in ['light', 'dark', 'system']"
            :key="t"
            class="px-2 py-1 text-xs rounded border transition-all"
            :class="settings.theme === t
              ? 'border-primary bg-primary/10 text-primary font-medium'
              : 'border-divider text-on-surface-variant hover:border-primary/50'"
            @click="settings.theme = t"
          >
            {{ t }}
          </button>
        </div>
      </div>

      <!-- Language -->
      <div class="flex items-center justify-between">
        <span class="text-sm text-on-surface">Language</span>
        <select
          class="px-2 py-1 text-xs rounded-lg border border-divider bg-surface text-on-surface"
          :value="settings.language"
          @change="settings.language = ($event.target as HTMLSelectElement).value"
        >
          <option value="en">English</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
          <option value="ja">Japanese</option>
        </select>
      </div>

      <!-- Font size -->
      <div class="flex items-center justify-between">
        <span class="text-sm text-on-surface">Font size</span>
        <div class="flex items-center gap-2">
          <button
            class="size-6 rounded border border-divider text-xs text-on-surface-variant hover:bg-surface-tint transition-colors"
            @click="settings.fontSize--"
          >
            &minus;
          </button>
          <span class="text-sm font-mono text-on-surface w-6 text-center">{{ settings.fontSize }}</span>
          <button
            class="size-6 rounded border border-divider text-xs text-on-surface-variant hover:bg-surface-tint transition-colors"
            @click="settings.fontSize++"
          >
            +
          </button>
        </div>
      </div>

      <!-- Toggles -->
      <div class="flex items-center justify-between">
        <span class="text-sm text-on-surface">Notifications</span>
        <button
          class="w-10 h-5 rounded-full transition-colors relative"
          :class="settings.notifications ? 'bg-primary' : 'bg-divider'"
          @click="settings.notifications = !settings.notifications"
        >
          <span
            class="absolute top-0.5 size-4 rounded-full bg-white shadow transition-transform"
            :class="settings.notifications ? 'translate-x-5' : 'translate-x-0.5'"
          />
        </button>
      </div>

      <div class="flex items-center justify-between">
        <span class="text-sm text-on-surface">Sidebar</span>
        <button
          class="w-10 h-5 rounded-full transition-colors relative"
          :class="settings.sidebar ? 'bg-primary' : 'bg-divider'"
          @click="settings.sidebar = !settings.sidebar"
        >
          <span
            class="absolute top-0.5 size-4 rounded-full bg-white shadow transition-transform"
            :class="settings.sidebar ? 'translate-x-5' : 'translate-x-0.5'"
          />
        </button>
      </div>
    </div>

    <!-- Source ref state -->
    <div class="rounded-lg border border-divider bg-surface-variant/30 p-3 space-y-2">
      <div class="flex items-center justify-between">
        <div class="text-xs font-medium text-on-surface-variant/60 uppercase tracking-wider">
          Source ref
        </div>
        <button
          class="text-xs text-on-surface-variant hover:text-primary transition-colors"
          @click="reset"
        >
          Reset
        </button>
      </div>

      <pre class="text-xs font-mono text-on-surface overflow-auto">{{ JSON.stringify(config, null, 2) }}</pre>
    </div>

    <!-- Change history -->
    <div v-if="history.length > 0" class="rounded-lg border border-divider bg-surface-variant/30 p-3 space-y-2">
      <div class="text-xs font-medium text-on-surface-variant/60 uppercase tracking-wider">
        Change history
      </div>
      <div class="space-y-1">
        <p
          v-for="(entry, index) in history"
          :key="index"
          class="text-xs font-mono truncate"
          :class="index === 0 ? 'text-primary' : 'text-on-surface-variant/40'"
        >
          {{ entry }}
        </p>
      </div>
    </div>
  </div>
</template>
