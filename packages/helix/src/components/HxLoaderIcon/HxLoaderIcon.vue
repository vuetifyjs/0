<script lang="ts">
  export interface HxLoaderIconProps {
    /** Loader variant */
    variant?: 'spinner' | 'dots' | 'wave' | 'orbit'
    /** Size in pixels */
    size?: string | number
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'HxLoaderIcon' })

  const {
    variant = 'dots',
    size = 14,
  } = defineProps<HxLoaderIconProps>()
</script>

<template>
  <!-- Spinning ring -->
  <span
    v-if="variant === 'spinner'"
    class="helix-loader-icon helix-loader-icon--spinner"
    :style="{ width: `${size}px`, height: `${size}px` }"
  />

  <!-- Three dots pulse -->
  <span
    v-else-if="variant === 'dots'"
    class="helix-loader-icon helix-loader-icon--dots"
  >
    <span
      v-for="i in 3"
      :key="i"
      class="helix-loader-icon__dot"
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
    class="helix-loader-icon helix-loader-icon--wave"
    :style="{ height: `${size}px` }"
  >
    <span
      v-for="i in 4"
      :key="i"
      class="helix-loader-icon__bar"
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
    class="helix-loader-icon helix-loader-icon--orbit"
    :style="{ width: `${size}px`, height: `${size}px` }"
  >
    <span
      v-for="i in 8"
      :key="i"
      class="helix-loader-icon__orbit-dot"
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
  .helix-loader-icon {
    display: inline-flex;
  }

  /* Spinner */
  .helix-loader-icon--spinner {
    border: 2px solid currentColor;
    border-top-color: transparent;
    border-radius: 9999px;
    opacity: 0.6;
    animation: helix-spin 0.75s linear infinite;
  }

  @keyframes helix-spin {
    to {
      transform: rotate(360deg);
    }
  }

  /* Dots */
  .helix-loader-icon--dots {
    align-items: center;
    gap: 0.125rem;
  }

  .helix-loader-icon__dot {
    border-radius: 9999px;
    background: currentColor;
    opacity: 0.6;
    animation: helix-pulse-dot 1.2s ease-in-out infinite;
  }

  @keyframes helix-pulse-dot {
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
  .helix-loader-icon--wave {
    align-items: center;
    gap: 1px;
  }

  .helix-loader-icon__bar {
    background: currentColor;
    opacity: 0.6;
    animation: helix-wave 1s ease-in-out infinite;
  }

  @keyframes helix-wave {
    0%, 40%, 100% {
      transform: scaleY(0.4);
    }
    20% {
      transform: scaleY(1);
    }
  }

  /* Orbit */
  .helix-loader-icon--orbit {
    align-items: center;
    justify-content: center;
    position: relative;
  }

  .helix-loader-icon__orbit-dot {
    position: absolute;
    border-radius: 9999px;
    background: currentColor;
    animation: helix-orbit-fade 0.8s ease-in-out infinite;
  }

  @keyframes helix-orbit-fade {
    0%, 100% {
      opacity: 0.2;
    }
    50% {
      opacity: 1;
    }
  }
</style>
