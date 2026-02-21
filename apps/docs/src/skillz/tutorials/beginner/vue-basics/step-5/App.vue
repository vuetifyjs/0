<script setup lang="ts">
  // Utilities
  import { shallowRef, computed } from 'vue'

  const name = shallowRef('Alex Chen')
  const role = shallowRef('Frontend Developer')
  const email = shallowRef('alex.chen@email.com')
  const following = shallowRef(false)
  const skills = shallowRef(['Vue', 'TypeScript', 'CSS', 'Node.js'])
  const open = shallowRef(false)

  const initials = computed(() => {
    return name.value
      .split(' ')
      .map(p => p[0])
      .join('')
      .toUpperCase()
  })

  const best = computed(() => skills.value[0])

  function toggle () {
    following.value = !following.value
  }

  function flip () {
    open.value = !open.value
  }
</script>

<template>
  <div class="p-8">
    <div class="max-w-sm rounded-lg border border-solid border-divider bg-surface p-6">
      <div class="flex items-center gap-4 mb-4 cursor-pointer" @click="flip">
        <div class="w-12 h-12 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-lg">
          {{ initials }}
        </div>

        <div class="flex-1">
          <h2 class="text-lg font-bold text-on-surface">{{ name }}</h2>
          <p class="text-sm text-on-surface-variant">{{ role }}</p>
        </div>

        <svg
          class="w-4 h-4 text-on-surface-variant transition-transform duration-200"
          :class="{ 'rotate-180': open }"
          fill="none"
          height="16"
          stroke="currentColor"
          stroke-width="2"
          viewBox="0 0 24 24"
          width="16"
        >
          <path d="M6 9l6 6 6-6" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </div>

      <div v-if="open">
        <p class="text-sm text-on-surface-variant mb-2">
          {{ email }}
        </p>

        <p class="text-sm text-on-surface-variant mb-4">
          Top skill: <span class="font-medium text-on-surface">{{ best }}</span>
        </p>

        <button
          class="w-full py-2 rounded font-medium transition-colors"
          :class="following ? 'bg-surface-tint text-on-surface' : 'bg-primary text-on-primary'"
          @click="toggle"
        >
          {{ following ? 'Following' : 'Follow' }}
        </button>
      </div>

      <p v-else class="text-sm text-on-surface-variant">
        Click to expand
      </p>
    </div>
  </div>
</template>
