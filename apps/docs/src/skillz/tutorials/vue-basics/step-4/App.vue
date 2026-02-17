<script setup lang="ts">
  // Utilities
  import { shallowRef, computed } from 'vue'

  const name = shallowRef('Alex Chen')
  const role = shallowRef('Frontend Developer')
  const email = shallowRef('alex.chen@email.com')
  const following = shallowRef(false)
  const skills = shallowRef(['Vue', 'TypeScript', 'CSS', 'Node.js'])

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
</script>

<template>
  <div class="p-8 font-sans min-h-screen bg-background text-on-background">
    <div class="max-w-sm rounded-lg border border-solid border-divider bg-surface p-6">
      <div class="flex items-center gap-4 mb-4">
        <div class="w-12 h-12 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-lg">
          {{ initials }}
        </div>

        <div>
          <h2 class="text-lg font-bold text-on-surface">{{ name }}</h2>
          <p class="text-sm text-on-surface-variant">{{ role }}</p>
        </div>
      </div>

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
  </div>
</template>
