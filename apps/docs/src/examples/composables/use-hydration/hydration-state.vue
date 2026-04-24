<script setup lang="ts">
  import { useHydration } from '@vuetify/v0'
  import { toRef } from 'vue'

  const { isHydrated, isSettled } = useHydration()

  const status = toRef(() => {
    if (isSettled.value) return 'settled'
    if (isHydrated.value) return 'hydrated'
    return 'pending'
  })
</script>

<template>
  <div class="flex flex-col gap-6">
    <div class="grid grid-cols-2 gap-4">
      <div class="flex flex-col gap-2 p-4 rounded-lg border border-divider">
        <div class="flex items-center gap-2">
          <span
            class="w-3 h-3 rounded-full"
            :class="isHydrated ? 'bg-success' : 'bg-error'"
          />

          <span class="text-sm font-medium">isHydrated</span>
        </div>

        <span class="font-mono text-xs text-on-surface-variant">{{ isHydrated }}</span>

        <p class="text-xs text-on-surface-variant">
          True after root component mounts
        </p>
      </div>

      <div class="flex flex-col gap-2 p-4 rounded-lg border border-divider">
        <div class="flex items-center gap-2">
          <span
            class="w-3 h-3 rounded-full"
            :class="isSettled ? 'bg-success' : 'bg-error'"
          />

          <span class="text-sm font-medium">isSettled</span>
        </div>

        <span class="font-mono text-xs text-on-surface-variant">{{ isSettled }}</span>

        <p class="text-xs text-on-surface-variant">
          True one tick after hydration, safe for animations
        </p>
      </div>
    </div>

    <div
      class="flex items-center gap-3 p-4 rounded-lg"
      :class="{
        'bg-success/10 border border-success/30': status === 'settled',
        'bg-warning/10 border border-warning/30': status === 'hydrated',
        'bg-error/10 border border-error/30': status === 'pending',
      }"
    >
      <span
        class="text-lg"
        :class="{
          'i-lucide-check-circle text-success': status === 'settled',
          'i-lucide-loader text-warning': status === 'hydrated',
          'i-lucide-clock text-error': status === 'pending',
        }"
      />

      <div>
        <div class="font-medium capitalize">{{ status }}</div>

        <div class="text-xs text-on-surface-variant">
          <template v-if="status === 'settled'">
            App is fully hydrated and settled. Safe to run animations and transitions.
          </template>

          <template v-else-if="status === 'hydrated'">
            Root mounted but waiting for nextTick to settle.
          </template>

          <template v-else>
            Waiting for root component to mount.
          </template>
        </div>
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <div class="text-xs font-medium text-on-surface-variant uppercase tracking-wide">Lifecycle</div>

      <div class="flex items-center gap-2">
        <template v-for="(step, index) in ['SSR', 'hydrate()', 'nextTick', 'settle()']" :key="step">
          <div
            class="flex-1 py-2 text-center text-xs rounded transition-colors"
            :class="{
              'bg-primary text-on-primary': (status === 'pending' && index === 0)
                || (status === 'hydrated' && index <= 1)
                || (status === 'settled'),
              'bg-surface-variant text-on-surface-variant': !((status === 'pending' && index === 0)
                || (status === 'hydrated' && index <= 1)
                || (status === 'settled')),
            }"
          >
            {{ step }}
          </div>

          <span v-if="index < 3" class="i-lucide-chevron-right text-on-surface-variant text-xs" />
        </template>
      </div>
    </div>
  </div>
</template>
