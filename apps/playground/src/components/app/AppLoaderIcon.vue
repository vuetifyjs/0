<script setup lang="ts">
  const {
    variant = 'dots',
    size = 14,
  } = defineProps<{
    variant?: 'spinner' | 'dots' | 'wave' | 'orbit'
    size?: string | number
  }>()
</script>

<template>
  <!-- Spinning ring -->
  <span
    v-if="variant === 'spinner'"
    class="inline-block border-2 border-current border-t-transparent rounded-full animate-spin opacity-60"
    :style="{ width: `${size}px`, height: `${size}px` }"
  />

  <!-- Three dots pulse -->
  <span
    v-else-if="variant === 'dots'"
    class="inline-flex items-center gap-0.5"
  >
    <span
      v-for="i in 3"
      :key="i"
      class="rounded-full bg-current opacity-60 animate-pulse-dot"
      :style="{
        width: `${Number(size) / 3.5}px`,
        height: `${Number(size) / 3.5}px`,
        animationDelay: `${(i - 1) * 150}ms`,
      }"
    />
  </span>

  <!-- Wave bars -->
  <span
    v-else-if="variant === 'wave'"
    class="inline-flex items-center gap-px"
    :style="{ height: `${size}px` }"
  >
    <span
      v-for="i in 4"
      :key="i"
      class="bg-current opacity-60 animate-wave"
      :style="{
        width: `${Number(size) / 5}px`,
        height: '60%',
        animationDelay: `${(i - 1) * 100}ms`,
      }"
    />
  </span>

  <!-- Orbit dots -->
  <span
    v-else-if="variant === 'orbit'"
    class="inline-flex items-center justify-center"
    :style="{ width: `${size}px`, height: `${size}px` }"
  >
    <span
      v-for="i in 8"
      :key="i"
      class="absolute rounded-full bg-current animate-orbit-fade"
      :style="{
        width: `${Number(size) / 7}px`,
        height: `${Number(size) / 7}px`,
        transform: `rotate(${(i - 1) * 45}deg) translateY(-${Number(size) * 0.35}px)`,
        animationDelay: `${(i - 1) * 100}ms`,
      }"
    />
  </span>
</template>

<style scoped>
  @keyframes pulse-dot {
    0%, 80%, 100% {
      transform: scale(0.6);
      opacity: 0.4;
    }
    40% {
      transform: scale(1);
      opacity: 0.8;
    }
  }

  .animate-pulse-dot {
    animation: pulse-dot 1.2s ease-in-out infinite;
  }

  @keyframes wave {
    0%, 40%, 100% {
      transform: scaleY(0.4);
    }
    20% {
      transform: scaleY(1);
    }
  }

  .animate-wave {
    animation: wave 1s ease-in-out infinite;
  }

  @keyframes orbit-fade {
    0%, 100% {
      opacity: 0.2;
    }
    50% {
      opacity: 1;
    }
  }

  .animate-orbit-fade {
    animation: orbit-fade 0.8s ease-in-out infinite;
  }
</style>
