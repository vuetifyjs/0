<script setup lang="ts">
  import { useHead } from '@unhead/vue'

  // Components
  import { Discovery } from '@/components/Discovery'

  // Composables
  import { useDiscovery } from '@/composables/useDiscovery'

  // Utilities
  import { computed } from 'vue'

  useHead({
    title: 'Discovery Demo',
  })

  const discovery = useDiscovery()

  // Step content definitions
  const steps = {
    search: {
      title: 'Search Feature',
      description: 'Use the search bar to find content across the documentation. You can search for components, composables, or guides.',
    },
    settings: {
      title: 'Settings Panel',
      description: 'Access your preferences and customize the documentation experience. Change themes, toggle features, and more.',
    },
    help: {
      title: 'Help Center',
      description: 'Need help? Access our FAQ, community resources, or contact support for assistance with any issues.',
    },
  }

  const currentStep = computed(() => {
    const id = discovery.selectedId.value as keyof typeof steps
    return steps[id] ?? null
  })

  const currentIndex = computed(() => {
    const id = discovery.selectedId.value
    if (!id) return -1
    let idx = 0
    for (const ticket of discovery.values()) {
      if (ticket.id === id) return idx
      idx++
    }
    return -1
  })

  function startTour () {
    discovery.start()
  }

  function resetTour () {
    discovery.stop()
    const currentId = discovery.selectedId.value
    if (currentId) {
      discovery.unselect(currentId)
    }
  }
</script>

<template>
  <div class="min-h-screen bg-background p-8">
    <!-- Highlight overlay - renders when tour is active -->
    <Discovery.Highlight :opacity="0.7" :padding="12" />

    <!-- Single positioned tooltip that follows the activator -->
    <Discovery.Tooltip :offset="16">
      <div
        v-if="currentStep"
        class="p-4 bg-surface border border-divider rounded-xl shadow-xl max-w-xs"
      >
        <h3 class="text-lg font-semibold text-on-surface mb-1">
          {{ currentStep.title }}
        </h3>
        <p class="text-xs text-on-surface-variant mb-2">
          Step {{ currentIndex + 1 }} of {{ discovery.size }}
        </p>
        <p class="text-sm text-on-surface-variant mb-4">
          {{ currentStep.description }}
        </p>
        <div class="flex justify-between items-center">
          <button
            class="px-3 py-1.5 text-sm text-on-surface-variant hover:text-on-surface disabled:opacity-40"
            :disabled="currentIndex === 0"
            @click="discovery.prev()"
          >
            Previous
          </button>
          <div class="flex gap-2">
            <button
              class="px-3 py-1.5 text-sm text-on-surface-variant hover:text-on-surface"
              @click="discovery.stop()"
            >
              Skip
            </button>
            <button
              class="px-3 py-1.5 text-sm bg-primary text-on-primary rounded hover:opacity-90"
              @click="currentIndex === discovery.size - 1 ? discovery.finish() : discovery.next()"
            >
              {{ currentIndex === discovery.size - 1 ? 'Finish' : 'Next' }}
            </button>
          </div>
        </div>
      </div>
    </Discovery.Tooltip>

    <div class="max-w-4xl mx-auto space-y-8">
      <!-- Header -->
      <header class="text-center space-y-4">
        <h1 class="text-3xl font-bold text-on-background">
          Discovery Components Demo
        </h1>
        <p class="text-on-surface-variant">
          Click "Start Tour" to see the feature discovery in action
        </p>

        <div class="flex justify-center gap-4">
          <button
            class="px-4 py-2 bg-primary text-on-primary rounded-lg hover:opacity-90"
            @click="startTour"
          >
            Start Tour
          </button>
          <button
            class="px-4 py-2 bg-surface text-on-surface border border-divider rounded-lg hover:bg-surface-variant"
            @click="resetTour"
          >
            Reset
          </button>
        </div>

        <div class="text-sm text-on-surface-variant">
          Tour active: {{ discovery.isActive.value }} |
          Current step: {{ discovery.selectedId.value ?? 'none' }} |
          Total steps: {{ discovery.size }}
        </div>
      </header>

      <!-- Demo content with discovery steps -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Step 1: Search - explicitly pass step to Activator -->
        <Discovery.Root step="search">
          <div class="p-6 bg-surface rounded-xl border border-divider">
            <Discovery.Activator step="search">
              <div class="space-y-3">
                <div class="flex items-center gap-2 text-lg font-medium text-on-surface">
                  <span class="i-mdi-magnify text-xl text-primary" />
                  Search
                </div>
                <input
                  class="w-full px-3 py-2 bg-background border border-divider rounded-lg text-on-background placeholder:text-on-surface-variant"
                  placeholder="Search documentation..."
                  type="text"
                >
              </div>
            </Discovery.Activator>
          </div>
        </Discovery.Root>

        <!-- Step 2: Settings - explicitly pass step to Activator -->
        <Discovery.Root step="settings">
          <div class="p-6 bg-surface rounded-xl border border-divider">
            <Discovery.Activator step="settings">
              <div class="space-y-3">
                <div class="flex items-center gap-2 text-lg font-medium text-on-surface">
                  <span class="i-mdi-cog text-xl text-primary" />
                  Settings
                </div>
                <button class="w-full px-3 py-2 bg-background border border-divider rounded-lg text-on-background text-left hover:bg-surface-variant transition-colors">
                  Configure preferences
                </button>
              </div>
            </Discovery.Activator>
          </div>
        </Discovery.Root>

        <!-- Step 3: Help - explicitly pass step to Activator -->
        <Discovery.Root step="help">
          <div class="p-6 bg-surface rounded-xl border border-divider">
            <Discovery.Activator step="help">
              <div class="space-y-3">
                <div class="flex items-center gap-2 text-lg font-medium text-on-surface">
                  <span class="i-mdi-help-circle text-xl text-primary" />
                  Help
                </div>
                <button class="w-full px-3 py-2 bg-background border border-divider rounded-lg text-on-background text-left hover:bg-surface-variant transition-colors">
                  Get assistance
                </button>
              </div>
            </Discovery.Activator>
          </div>
        </Discovery.Root>
      </div>

      <!-- Additional content to show scrolling behavior -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="p-6 bg-surface rounded-xl border border-divider">
          <h3 class="text-lg font-medium text-on-surface mb-2">Feature One</h3>
          <p class="text-on-surface-variant">
            This is some additional content to demonstrate that the tour overlay covers the entire page while highlighting the target element.
          </p>
        </div>
        <div class="p-6 bg-surface rounded-xl border border-divider">
          <h3 class="text-lg font-medium text-on-surface mb-2">Feature Two</h3>
          <p class="text-on-surface-variant">
            The tooltip follows the activator element and positions itself automatically based on available screen space.
          </p>
        </div>
      </div>

      <!-- Debug info -->
      <details class="p-4 bg-surface rounded-xl border border-divider" open>
        <summary class="text-lg font-medium text-on-surface cursor-pointer">Debug Info</summary>
        <div class="mt-2 space-y-2">
          <div class="text-sm">
            <strong>isActive:</strong> {{ discovery.isActive.value }}
          </div>
          <div class="text-sm">
            <strong>isCompleted:</strong> {{ discovery.isCompleted.value }}
          </div>
          <div class="text-sm">
            <strong>selectedId:</strong> {{ discovery.selectedId.value ?? 'none' }}
          </div>
          <div class="text-sm">
            <strong>size (steps):</strong> {{ discovery.size }}
          </div>
          <div class="text-sm">
            <strong>activatorCount:</strong> {{ discovery.activatorCount }}
          </div>
          <div class="text-sm">
            <strong>steps:</strong> {{ [...discovery.values()].map(t => t.id).join(', ') }}
          </div>
          <div class="text-sm">
            <strong>activatorElement:</strong> {{ discovery.selectedId.value ? (discovery.getActivatorElement(discovery.selectedId.value)?.tagName ?? 'NULL') : 'N/A' }}
          </div>
          <div v-if="discovery.selectedId.value" class="text-sm">
            <strong>activatorRect:</strong>
            <span v-if="discovery.getActivatorRect(discovery.selectedId.value)">
              x={{ discovery.getActivatorRect(discovery.selectedId.value)?.x?.toFixed(0) }},
              y={{ discovery.getActivatorRect(discovery.selectedId.value)?.y?.toFixed(0) }},
              w={{ discovery.getActivatorRect(discovery.selectedId.value)?.width?.toFixed(0) }},
              h={{ discovery.getActivatorRect(discovery.selectedId.value)?.height?.toFixed(0) }}
            </span>
            <span v-else class="text-error">NULL</span>
          </div>
        </div>
      </details>
    </div>
  </div>
</template>

<route lang="yaml">
meta:
  layout: false
</route>
