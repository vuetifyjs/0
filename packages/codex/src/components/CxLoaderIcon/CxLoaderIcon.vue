<script lang="ts">
  export interface CxLoaderIconProps {
    /** Loader variant */
    variant?: 'spinner' | 'dots' | 'wave' | 'orbit'
    /** Size in pixels */
    size?: string | number
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'CxLoaderIcon' })

  const {
    variant = 'dots',
    size = 14,
  } = defineProps<CxLoaderIconProps>()
</script>

<template>
  <!-- Spinning ring -->
  <span
    v-if="variant === 'spinner'"
    class="codex-loader-icon codex-loader-icon--spinner"
    :style="{ width: `${size}px`, height: `${size}px` }"
  />

  <!-- Three dots pulse -->
  <span
    v-else-if="variant === 'dots'"
    class="codex-loader-icon codex-loader-icon--dots"
  >
    <span
      v-for="i in 3"
      :key="i"
      class="codex-loader-icon__dot"
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
    class="codex-loader-icon codex-loader-icon--wave"
    :style="{ height: `${size}px` }"
  >
    <span
      v-for="i in 4"
      :key="i"
      class="codex-loader-icon__bar"
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
    class="codex-loader-icon codex-loader-icon--orbit"
    :style="{ width: `${size}px`, height: `${size}px` }"
  >
    <span
      v-for="i in 8"
      :key="i"
      class="codex-loader-icon__orbit-dot"
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
  .codex-loader-icon {
    display: inline-flex;
  }

  /* Spinner */
  .codex-loader-icon--spinner {
    border: 2px solid currentColor;
    border-top-color: transparent;
    border-radius: 9999px;
    opacity: 0.6;
    animation: codex-spin 0.75s linear infinite;
  }

  @keyframes codex-spin {
    to {
      transform: rotate(360deg);
    }
  }

  /* Dots */
  .codex-loader-icon--dots {
    align-items: center;
    gap: 0.125rem;
  }

  .codex-loader-icon__dot {
    border-radius: 9999px;
    background: currentColor;
    opacity: 0.6;
    animation: codex-pulse-dot 1.2s ease-in-out infinite;
  }

  @keyframes codex-pulse-dot {
    0%, 80%, 100% {
      transform: scale(0.6);
      opacity: 0.4;
    }
    40% {
      transform: scale(1);
      opacity: 0.8;
    }
  }

  /* Wave */
  .codex-loader-icon--wave {
    align-items: center;
    gap: 1px;
  }

  .codex-loader-icon__bar {
    background: currentColor;
    opacity: 0.6;
    animation: codex-wave 1s ease-in-out infinite;
  }

  @keyframes codex-wave {
    0%, 40%, 100% {
      transform: scaleY(0.4);
    }
    20% {
      transform: scaleY(1);
    }
  }

  /* Orbit */
  .codex-loader-icon--orbit {
    align-items: center;
    justify-content: center;
    position: relative;
  }

  .codex-loader-icon__orbit-dot {
    position: absolute;
    border-radius: 9999px;
    background: currentColor;
    animation: codex-orbit-fade 0.8s ease-in-out infinite;
  }

  @keyframes codex-orbit-fade {
    0%, 100% {
      opacity: 0.2;
    }
    50% {
      opacity: 1;
    }
  }
</style>
