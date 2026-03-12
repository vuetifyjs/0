<script setup lang="ts">
  import { Slider } from '@vuetify/v0'
  import { shallowRef } from 'vue'

  const value = defineModel<number>({ default: 40 })
  const internal = shallowRef([value.value])

  const gap = 6
  const thumbWidth = 4
</script>

<template>
  <div class="pill-slider">
    <Slider.Root
      v-model="internal"
      class="pill-root"
      :max="100"
      :min="0"
      :step="1"
      @update:model-value="value = $event[0] ?? 0"
    >
      <Slider.Track class="pill-track">
        <template #default="{ attrs }">
          <div v-bind="attrs" class="pill-track-container">
            <!-- Inactive segment BEFORE thumb -->
            <Slider.Range :renderless="true">
              <template #default="{ end }">
                <div
                  class="pill-segment pill-segment--before"
                  :style="{
                    left: '0%',
                    width: `calc(${end}% - ${thumbWidth / 2}px - ${gap}px)`,
                  }"
                >
                  <span class="pill-stop-indicator pill-stop-indicator--end" />
                </div>
              </template>
            </Slider.Range>

            <!-- Fill (active segment between gap edges) -->
            <Slider.Range class="pill-fill" />

            <!-- Inactive segment AFTER thumb -->
            <Slider.Range :renderless="true">
              <template #default="{ end }">
                <div
                  class="pill-segment pill-segment--after"
                  :style="{
                    left: `calc(${end}% + ${thumbWidth / 2}px + ${gap}px)`,
                    width: `calc(${100 - end}% - ${thumbWidth / 2}px - ${gap}px)`,
                  }"
                >
                  <span class="pill-stop-indicator pill-stop-indicator--start" />
                </div>
              </template>
            </Slider.Range>
          </div>
        </template>
      </Slider.Track>

      <Slider.Thumb class="pill-thumb" />
    </Slider.Root>
  </div>
</template>

<style scoped>
.pill-slider {
  padding: 16px 0;
}

.pill-root {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  height: 40px;
  cursor: pointer;
}

.pill-track-container {
  position: relative;
  width: 100%;
  height: 16px;
  border-radius: 16px;
  touch-action: none;
}

/* Inactive segments (before & after thumb) */
.pill-segment {
  position: absolute;
  top: 0;
  height: 100%;
  background: var(--v0-primary, #6750a4);
  opacity: 0.24;
}

.pill-segment--before {
  border-radius: 16px 2px 2px 16px;
}

.pill-segment--after {
  border-radius: 2px 16px 16px 2px;
}

/* Stop indicators (dots at gap edges) */
.pill-stop-indicator {
  position: absolute;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: currentColor;
  top: 50%;
  transform: translateY(-50%);
  opacity: 0.38;
}

.pill-stop-indicator--end {
  right: -2px;
}

.pill-stop-indicator--start {
  left: -2px;
}

/* Fill */
.pill-fill {
  position: absolute;
  top: 0;
  height: 100%;
  background: var(--v0-primary, #6750a4);
  border-radius: 16px;
}

/* Thumb — narrow pill shape */
.pill-thumb {
  position: absolute;
  top: 50%;
  width: 4px;
  min-height: 44px;
  background: var(--v0-primary, #6750a4);
  border-radius: 4px;
  transform: translate(-50%, -50%);
  z-index: 2;
  outline: none;
  touch-action: none;
  transition: width 0.1s ease;
}

.pill-thumb:focus-visible {
  width: 2px;
  outline: 3px solid currentColor;
  outline-offset: 2px;
}
</style>
