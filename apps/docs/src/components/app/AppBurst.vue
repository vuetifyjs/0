<script setup lang="ts">
  // Utilities
  import { ref, shallowRef, nextTick } from 'vue'

  const {
    disabled = false,
  } = defineProps<{
    emoji?: string
    size?: number
    disabled?: boolean
  }>()

  const active = shallowRef(false)
  const particlesEl = ref<HTMLElement>()

  let timeout: ReturnType<typeof setTimeout>

  const colors = [
    '#ff6b6b', // red
    '#feca57', // yellow
    '#48dbfb', // cyan
    '#ff9ff3', // pink
    '#54a0ff', // blue
    '#1dd1a1', // green
    'var(--v0-primary)', // white sparkle
  ]

  function randomBetween (min: number, max: number) {
    return Math.random() * (max - min) + min
  }

  function createParticles () {
    if (!particlesEl.value) return

    // Scale particles relative to font-size (base 16px = 1em)
    const fontSize = Number.parseFloat(getComputedStyle(particlesEl.value).fontSize) || 16

    const count = 16

    for (let i = 0; i < count; i++) {
      const el = document.createElement('span')

      // Random properties (scaled to font-size)
      const baseAngle = (i / count) * Math.PI * 2
      const angle = baseAngle + randomBetween(-0.5, 0.5)
      const distance = randomBetween(1.5, 3) * fontSize // 1.5-3em
      const size = randomBetween(0.2, 0.4) * fontSize // 0.2-0.4em
      const duration = randomBetween(600, 900)
      const delay = randomBetween(0, 100)

      const x = Math.cos(angle) * distance
      const y = Math.sin(angle) * distance

      // Style the particle
      el.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        width: ${size}px;
        height: ${size}px;
        margin: ${-size / 2}px 0 0 ${-size / 2}px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        border-radius: 50%;
        pointer-events: none;
      `

      particlesEl.value.append(el)

      // Animate with Web Animations API
      const animation = el.animate([
        { transform: 'translate(0, 0) scale(1)', opacity: 1 },
        { transform: `translate(${x * 0.6}px, ${y * 0.6}px) scale(1)`, opacity: 1, offset: 0.4 },
        { transform: `translate(${x}px, ${y}px) scale(0.3)`, opacity: 0 },
      ], {
        duration,
        delay,
        easing: 'cubic-bezier(0.15, 0.6, 0.4, 1)',
        fill: 'forwards',
      })

      animation.onfinish = () => el.remove()
    }
  }

  async function trigger () {
    clearTimeout(timeout)
    active.value = true
    await nextTick()
    createParticles()
    timeout = setTimeout(() => {
      active.value = false
    }, 800)
  }

  defineExpose({ trigger })
</script>

<template>
  <span
    class="burst-wrap relative inline-flex select-none overflow-visible"
    :class="{ 'cursor-pointer': !disabled }"
    :style="{ fontSize: size ? `${size}px` : undefined }"
    @click="!disabled && trigger()"
  >
    <span class="burst-icon" :class="{ active }">
      {{ emoji ?? '🎉' }}
    </span>
    <span ref="particlesEl" class="burst-particles absolute pointer-events-none overflow-visible" />
  </span>
</template>

<style scoped>
.burst-icon {
  transition: transform 0.1s ease-out;
}

.burst-icon.active {
  animation: pop 0.4s cubic-bezier(0.17, 0.89, 0.32, 1.49);
}

.burst-particles {
  inset: 0;
}

@keyframes pop {
  0% {
    transform: scale(1);
  }
  15% {
    transform: scale(0.8);
  }
  40% {
    transform: scale(1.5) rotate(-8deg);
  }
  60% {
    transform: scale(1.1) rotate(4deg);
  }
  80% {
    transform: scale(0.95) rotate(-2deg);
  }
  100% {
    transform: scale(1) rotate(0deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .burst-icon.active {
    animation: none;
  }
}
</style>
