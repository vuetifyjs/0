<script setup lang="ts">
  // Framework
  import { Select } from '@vuetify/v0'

  // Components
  import AppIcon from '@/components/app/AppIcon.vue'
  import { usePlayground } from '@/components/playground/app/PlaygroundApp.vue'

  // Utilities
  import { computed, onMounted } from 'vue'

  // Types
  import type { ID } from '@vuetify/v0'

  const playground = usePlayground()

  onMounted(() => playground.fetchVersions())

  // Vue: null means "latest" in the ref, but the select uses 'latest' as the item id
  const vueModel = computed({
    get: (): ID => playground.vueVersion.value ?? 'latest',
    set: (id: ID | ID[]) => {
      const value = Array.isArray(id) ? id[0] : id
      playground.vueVersion.value = value === 'latest' ? null : String(value)
    },
  })

  // v0: 'latest' string is used directly as the item id
  const v0Model = computed({
    get: (): ID => playground.v0Version.value,
    set: (id: ID | ID[]) => {
      playground.v0Version.value = String(Array.isArray(id) ? id[0] : id)
    },
  })
</script>

<template>
  <div class="flex flex-col gap-5">
    <!-- Vue version -->
    <div class="flex flex-col gap-1.5">
      <label class="field-label">Vue</label>
      <div v-if="playground.fetching.value" class="select-skeleton" />
      <Select.Root v-else v-model="vueModel" mandatory>
        <Select.Activator class="select-trigger">
          {{ playground.vueVersion.value ?? 'Latest' }}
          <Select.Cue class="select-cue">
            <AppIcon icon="chevron-down" :size="14" />
          </Select.Cue>
        </Select.Activator>
        <Select.Content class="select-content">
          <Select.Item
            id="latest"
            v-slot="{ isSelected, isHighlighted, attrs }"
            value="Latest"
          >
            <div class="select-item" v-bind="attrs" :data-highlighted="isHighlighted || undefined">
              <span>Latest</span>
              <svg
                v-if="isSelected"
                aria-hidden="true"
                class="check"
                fill="none"
                height="12"
                stroke="currentColor"
                stroke-width="2.5"
                viewBox="0 0 24 24"
                width="12"
              >
                <path d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </Select.Item>
          <Select.Item
            v-for="v in playground.vueVersions.value"
            :id="v"
            :key="v"
            v-slot="{ isSelected, isHighlighted, attrs }"
            :value="v"
          >
            <div class="select-item" v-bind="attrs" :data-highlighted="isHighlighted || undefined">
              <span>{{ v }}</span>
              <svg
                v-if="isSelected"
                aria-hidden="true"
                class="check"
                fill="none"
                height="12"
                stroke="currentColor"
                stroke-width="2.5"
                viewBox="0 0 24 24"
                width="12"
              >
                <path d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </Select.Item>
        </Select.Content>
      </Select.Root>
    </div>

    <!-- v0 version -->
    <div class="flex flex-col gap-1.5">
      <label class="field-label">@vuetify/v0</label>
      <div v-if="playground.fetching.value" class="select-skeleton" />
      <Select.Root v-else v-model="v0Model" mandatory>
        <Select.Activator class="select-trigger">
          {{ playground.v0Version.value === 'latest' ? 'Latest' : playground.v0Version.value }}
          <Select.Cue class="select-cue">
            <AppIcon icon="chevron-down" :size="14" />
          </Select.Cue>
        </Select.Activator>
        <Select.Content class="select-content">
          <Select.Item
            id="latest"
            v-slot="{ isSelected, isHighlighted, attrs }"
            value="Latest"
          >
            <div class="select-item" v-bind="attrs" :data-highlighted="isHighlighted || undefined">
              <span>Latest</span>
              <svg
                v-if="isSelected"
                aria-hidden="true"
                class="check"
                fill="none"
                height="12"
                stroke="currentColor"
                stroke-width="2.5"
                viewBox="0 0 24 24"
                width="12"
              >
                <path d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </Select.Item>
          <Select.Item
            v-for="v in playground.v0Versions.value"
            :id="v"
            :key="v"
            v-slot="{ isSelected, isHighlighted, attrs }"
            :value="v"
          >
            <div class="select-item" v-bind="attrs" :data-highlighted="isHighlighted || undefined">
              <span>{{ v }}</span>
              <svg
                v-if="isSelected"
                aria-hidden="true"
                class="check"
                fill="none"
                height="12"
                stroke="currentColor"
                stroke-width="2.5"
                viewBox="0 0 24 24"
                width="12"
              >
                <path d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </Select.Item>
        </Select.Content>
      </Select.Root>
    </div>
  </div>
</template>

<style scoped>
.field-label {
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--v0-on-surface-variant);
  opacity: 0.7;
}

.select-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
  width: 100%;
  background: var(--v0-surface-variant);
  border: 1px solid var(--v0-outline-variant, var(--v0-outline));
  border-radius: 6px;
  color: var(--v0-on-surface);
  cursor: pointer;
  font-size: 13px;
  padding: 6px 10px;
  text-align: left;
  transition: border-color 0.15s, background 0.15s;
}

.select-trigger:hover {
  border-color: var(--v0-outline);
}

.select-trigger:focus-visible {
  outline: 2px solid var(--v0-primary);
  outline-offset: -1px;
}

.select-cue {
  display: flex;
  align-items: center;
  color: var(--v0-on-surface-variant);
  transition: transform 0.15s;
  flex-shrink: 0;
}

.select-cue[data-state="open"] {
  transform: rotate(180deg);
}

.select-content {
  background: var(--v0-surface);
  border: 1px solid var(--v0-outline-variant, var(--v0-outline));
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  font-size: 13px;
  max-height: 260px;
  min-width: 200px;
  overflow-y: auto;
  padding: 4px;
}

.select-item {
  align-items: center;
  border-radius: 4px;
  color: var(--v0-on-surface);
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  padding: 6px 8px;
  transition: background 0.1s;
  user-select: none;
}

.select-item:hover,
.select-item[data-highlighted] {
  background: var(--v0-surface-tint);
}

.select-item[data-selected] {
  color: var(--v0-primary);
}

.select-skeleton {
  background: var(--v0-surface-variant);
  border: 1px solid var(--v0-outline-variant, var(--v0-outline));
  border-radius: 6px;
  height: 32px;
  opacity: 0.5;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 0.25; }
}

.check {
  color: var(--v0-primary);
  flex-shrink: 0;
}
</style>
