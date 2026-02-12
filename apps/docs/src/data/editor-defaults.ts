export const DEFAULT_CODE = `<script setup lang="ts">
  import { createStep } from '@vuetify/v0'
  import { computed } from 'vue'

  const steps = [
    { id: 'cart', label: 'Cart', icon: '1' },
    { id: 'shipping', label: 'Shipping', icon: '2' },
    { id: 'payment', label: 'Payment', icon: '3', disabled: true },
    { id: 'review', label: 'Review', icon: '4' },
    { id: 'confirm', label: 'Confirm', icon: '5' },
  ]

  const stepper = createStep()
  stepper.onboard(steps.map((s, i) => ({ id: s.id, value: i, disabled: s.disabled })))
  stepper.first()

  const currentIndex = computed(() => stepper.selectedIndex.value)
  const isFirst = computed(() => currentIndex.value === 0)
  const isLast = computed(() => currentIndex.value === stepper.size - 1)
</script>

<template>
  <div style="max-width: 480px; margin: 0 auto; padding: 32px 16px; font-family: sans-serif;">
    <!-- Stepper Track -->
    <div style="position: relative; display: flex; align-items: center; justify-content: space-between; margin-bottom: 48px;">
      <!-- Background Line -->
      <div style="position: absolute; top: 20px; left: 0; right: 0; height: 2px; background: #e0e0e0;" />

      <!-- Progress Line -->
      <div
        :style="{
          position: 'absolute',
          top: '20px',
          left: 0,
          height: '2px',
          background: '#1867c0',
          transition: 'width 0.4s ease',
          width: (currentIndex / (steps.length - 1)) * 100 + '%',
        }"
      />

      <!-- Steps -->
      <div
        v-for="(step, i) in steps"
        :key="step.id"
        style="position: relative; z-index: 1; display: flex; flex-direction: column; align-items: center; cursor: pointer;"
        @click="!step.disabled && stepper.select(step.id)"
      >
        <div
          :style="{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            fontWeight: 600,
            transition: 'all 0.3s',
            background: i <= currentIndex ? '#1867c0' : '#fff',
            color: i <= currentIndex ? '#fff' : '#888',
            border: i <= currentIndex ? 'none' : step.disabled ? '2px dashed #ccc' : '2px solid #e0e0e0',
            transform: i === currentIndex ? 'scale(1.15)' : 'scale(0.9)',
            boxShadow: i === currentIndex ? '0 0 0 4px rgba(24, 103, 192, 0.2)' : 'none',
            opacity: step.disabled ? 0.5 : 1,
          }"
        >
          <span v-if="i < currentIndex">&#10003;</span>
          <span v-else>{{ step.icon }}</span>
        </div>

        <span
          :style="{
            marginTop: '8px',
            fontSize: '12px',
            fontWeight: 500,
            color: i === currentIndex ? '#1867c0' : '#888',
            textDecoration: step.disabled ? 'line-through' : 'none',
            opacity: step.disabled ? 0.5 : 1,
          }"
        >
          {{ step.label }}
        </span>
      </div>
    </div>

    <!-- Controls -->
    <div style="display: flex; align-items: center; justify-content: center; gap: 8px;">
      <button
        :disabled="isFirst"
        :style="{ padding: '6px 12px', fontSize: '13px', borderRadius: '4px', border: '1px solid #e0e0e0', background: '#fff', cursor: isFirst ? 'not-allowed' : 'pointer', opacity: isFirst ? 0.4 : 1 }"
        @click="stepper.first()"
      >
        First
      </button>
      <button
        :disabled="isFirst"
        :style="{ padding: '6px 16px', fontSize: '13px', borderRadius: '4px', border: 'none', background: isFirst ? '#e3f2fd' : '#bbdefb', color: '#1867c0', cursor: isFirst ? 'not-allowed' : 'pointer', opacity: isFirst ? 0.4 : 1 }"
        @click="stepper.prev()"
      >
        Prev
      </button>
      <button
        :disabled="isLast"
        :style="{ padding: '6px 16px', fontSize: '13px', borderRadius: '4px', border: 'none', background: '#1867c0', color: '#fff', cursor: isLast ? 'not-allowed' : 'pointer', opacity: isLast ? 0.4 : 1 }"
        @click="stepper.next()"
      >
        Next
      </button>
      <button
        :disabled="isLast"
        :style="{ padding: '6px 12px', fontSize: '13px', borderRadius: '4px', border: '1px solid #e0e0e0', background: '#fff', cursor: isLast ? 'not-allowed' : 'pointer', opacity: isLast ? 0.4 : 1 }"
        @click="stepper.last()"
      >
        Last
      </button>
    </div>

    <p style="margin-top: 24px; text-align: center; font-size: 12px; color: #888;">
      Step {{ currentIndex + 1 }} of {{ stepper.size }} · Payment step is disabled (auto-skipped)
    </p>
  </div>
</template>
`
