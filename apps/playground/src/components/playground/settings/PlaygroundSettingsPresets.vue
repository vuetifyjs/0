<script setup lang="ts">
  // Framework
  import { Switch } from '@vuetify/v0'

  // Components
  import AppIcon from '@/components/app/AppIcon.vue'
  import { usePlayground } from '@/components/playground/app/PlaygroundApp.vue'

  // Data
  import { ADDONS, PRESETS } from '@/data/presets'

  // Utilities
  import { shallowRef } from 'vue'

  const playground = usePlayground()

  // ID of the preset currently showing the inline confirmation, or null
  const confirming = shallowRef<string | null>(null)

  function onPresetClick (id: string) {
    if (id === playground.activePreset.value) return
    confirming.value = confirming.value === id ? null : id
  }

  async function onApply (id: string) {
    confirming.value = null
    await playground.applyPreset(id)
  }
</script>

<template>
  <div class="flex flex-col gap-5">
    <!-- Presets -->
    <div class="flex flex-col gap-2">
      <div
        v-for="preset in PRESETS"
        :key="preset.id"
        class="rounded-lg border transition-colors"
        :class="playground.activePreset.value === preset.id
          ? 'border-primary bg-surface-tint'
          : 'border-divider'"
      >
        <!-- Preset card header -->
        <button
          class="w-full flex items-center gap-3 px-3 py-3 text-left"
          :class="playground.activePreset.value === preset.id ? 'cursor-default' : 'cursor-pointer'"
          type="button"
          @click="onPresetClick(preset.id)"
        >
          <AppIcon
            class="shrink-0"
            :class="playground.activePreset.value === preset.id ? 'text-primary' : 'text-on-surface-variant'"
            :icon="preset.icon"
            :size="18"
          />

          <div class="flex-1 min-w-0">
            <div
              class="text-sm font-medium"
              :class="playground.activePreset.value === preset.id ? 'text-primary' : 'text-on-surface'"
            >{{ preset.label }}</div>

            <div class="text-xs text-on-surface-variant mt-0.5">{{ preset.description }}</div>
          </div>
          <!-- Active checkmark -->
          <svg
            v-if="playground.activePreset.value === preset.id"
            aria-hidden="true"
            class="shrink-0 text-primary"
            fill="none"
            height="16"
            stroke="currentColor"
            stroke-width="2.5"
            viewBox="0 0 24 24"
            width="16"
          >
            <path d="M5 13l4 4L19 7" />
          </svg>
        </button>

        <!-- Inline confirmation -->
        <div
          v-if="confirming === preset.id"
          class="px-3 pb-3 flex flex-col gap-2 border-t border-divider pt-3"
        >
          <p class="text-xs text-on-surface-variant">
            Applying <strong class="text-on-surface">{{ preset.label }}</strong> will reset your playground. Any unsaved work will be lost.
          </p>

          <div class="flex gap-2">
            <button
              class="px-3 py-1.5 rounded text-xs font-medium bg-primary text-on-primary"
              type="button"
              @click="onApply(preset.id)"
            >Apply</button>

            <button
              class="px-3 py-1.5 rounded text-xs font-medium border border-divider text-on-surface"
              type="button"
              @click="confirming = null"
            >Cancel</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Add-ons -->
    <div class="flex flex-col gap-1.5">
      <div class="text-xs font-semibold text-on-surface-variant uppercase tracking-wide opacity-70 px-0.5">Add-ons</div>

      <div class="flex flex-col gap-1">
        <div
          v-for="addon in ADDONS"
          :key="addon.id"
          class="flex items-center gap-3 px-3 py-2.5 rounded-lg border border-divider"
        >
          <AppIcon class="shrink-0 text-on-surface-variant" :icon="addon.icon" :size="16" />

          <div class="flex-1 min-w-0">
            <div class="text-sm font-medium text-on-surface">{{ addon.label }}</div>
            <div class="text-xs text-on-surface-variant mt-0.5">{{ addon.description }}</div>
          </div>

          <Switch.Root
            :aria-label="addon.label"
            class="shrink-0 inline-flex items-center border-none bg-transparent p-0 outline-none"
            :model-value="playground.activeAddons.value.includes(addon.id)"
            @update:model-value="playground.toggleAddon(addon.id)"
          >
            <Switch.Track class="relative inline-flex items-center rounded-full transition-colors w-9 h-5 bg-on-surface/20 data-[state=checked]:bg-primary">
              <Switch.Thumb class="![visibility:visible] block size-3.5 rounded-full bg-white shadow-sm transition-transform translate-x-0.75 data-[state=checked]:translate-x-4.75" />
            </Switch.Track>
          </Switch.Root>
        </div>
      </div>
    </div>
  </div>
</template>
