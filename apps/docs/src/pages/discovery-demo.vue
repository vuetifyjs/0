<script setup lang="ts">
  import { useHead } from '@unhead/vue'

  // Components
  import { Discovery } from '@/components/Discovery'

  // Composables
  import { useDiscovery } from '@/composables/useDiscovery'

  // Utilities
  import { ref } from 'vue'

  useHead({
    title: 'Discovery Demo',
  })

  const discovery = useDiscovery()

  // For disabled step demo
  const notificationsEnabled = ref(false)

  // For validation demo - rule checks the searchQuery ref directly
  const searchQuery = ref('')
  const searchRules = [
    () => !!searchQuery.value.trim() || 'Please enter a search term to continue',
  ]

  function startTour () {
    discovery.start()
  }

  function resetTour () {
    discovery.stop()
  }

  function goToStep (step: string) {
    discovery.start()
    discovery.select(step)
  }
</script>

<template>
  <div class="min-h-screen bg-background p-8">
    <!-- Highlight overlay - renders when tour is active -->
    <Discovery.Highlight :opacity="0.7" />

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

        <!-- Programmatic navigation -->
        <div class="flex flex-wrap justify-center gap-2 pt-2">
          <button
            v-for="step in ['search', 'settings', 'help', 'notifications', 'profile', 'sidebar']"
            :key="step"
            class="px-2 py-1 text-xs bg-surface border border-divider rounded hover:bg-surface-variant"
            @click="goToStep(step)"
          >
            Go to {{ step }}
          </button>
        </div>
      </header>

      <!-- Demo content with discovery steps -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Step 1: Search - placement bottom (default), with validation -->
        <Discovery.Root :rules="searchRules" step="search">
          <div class="p-6 bg-surface rounded-xl border border-divider">
            <Discovery.Activator>
              <div class="space-y-3">
                <div class="flex items-center gap-2 text-lg font-medium text-on-surface">
                  <span class="i-mdi-magnify text-xl text-primary" />
                  Search
                </div>
                <input
                  v-model="searchQuery"
                  class="w-full px-3 py-2 bg-background border border-divider rounded-lg text-on-background placeholder:text-on-surface-variant"
                  placeholder="Search documentation..."
                  type="text"
                >
              </div>
            </Discovery.Activator>
          </div>

          <Discovery.Content placement="bottom">
            <div class="p-4 bg-surface border border-divider rounded-xl shadow-xl max-w-xs">
              <Discovery.Title class="text-lg font-semibold text-on-surface mb-1">
                Search Feature
              </Discovery.Title>
              <Discovery.Progress class="text-xs text-on-surface-variant mb-2" />
              <Discovery.Description class="text-sm text-on-surface-variant mb-2">
                Use the search bar to find content across the documentation. You can search for components, composables, or guides.
              </Discovery.Description>
              <div v-if="discovery.form.get('search')?.errors.value.length" class="text-sm text-error mb-4">
                {{ discovery.form.get('search')?.errors.value[0] }}
              </div>
              <div v-else class="mb-4" />
              <div class="flex justify-between items-center">
                <Discovery.Prev class="px-3 py-1.5 text-sm text-on-surface-variant hover:text-on-surface disabled:opacity-40">
                  Previous
                </Discovery.Prev>
                <div class="flex gap-2">
                  <Discovery.Skip class="px-3 py-1.5 text-sm text-on-surface-variant hover:text-on-surface">
                    Skip
                  </Discovery.Skip>
                  <Discovery.Next class="px-3 py-1.5 text-sm bg-primary text-on-primary rounded hover:opacity-90">
                    Next
                  </Discovery.Next>
                </div>
              </div>
            </div>
          </Discovery.Content>
        </Discovery.Root>

        <!-- Step 2: Settings - placement TOP to demonstrate per-step control -->
        <Discovery.Root step="settings">
          <div class="p-6 bg-surface rounded-xl border border-divider">
            <Discovery.Activator>
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

          <Discovery.Content placement="top">
            <div class="p-4 bg-surface border border-divider rounded-xl shadow-xl max-w-xs">
              <Discovery.Title class="text-lg font-semibold text-on-surface mb-1">
                Settings Panel
              </Discovery.Title>
              <Discovery.Progress class="text-xs text-on-surface-variant mb-2" />
              <Discovery.Description class="text-sm text-on-surface-variant mb-4">
                Access your preferences and customize the documentation experience. Change themes, toggle features, and more.
              </Discovery.Description>
              <div class="flex justify-between items-center">
                <Discovery.Prev class="px-3 py-1.5 text-sm text-on-surface-variant hover:text-on-surface disabled:opacity-40">
                  Previous
                </Discovery.Prev>
                <div class="flex gap-2">
                  <Discovery.Skip class="px-3 py-1.5 text-sm text-on-surface-variant hover:text-on-surface">
                    Skip
                  </Discovery.Skip>
                  <Discovery.Next class="px-3 py-1.5 text-sm bg-primary text-on-primary rounded hover:opacity-90">
                    Next
                  </Discovery.Next>
                </div>
              </div>
            </div>
          </Discovery.Content>
        </Discovery.Root>

        <!-- Step 3: Help - placement bottom -->
        <Discovery.Root step="help">
          <div class="p-6 bg-surface rounded-xl border border-divider">
            <Discovery.Activator>
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

          <Discovery.Content placement="bottom">
            <div class="p-4 bg-surface border border-divider rounded-xl shadow-xl max-w-xs">
              <Discovery.Title class="text-lg font-semibold text-on-surface mb-1">
                Help Center
              </Discovery.Title>
              <Discovery.Progress class="text-xs text-on-surface-variant mb-2" />
              <Discovery.Description class="text-sm text-on-surface-variant mb-4">
                Need help? Access our FAQ, community resources, or contact support for assistance with any issues.
              </Discovery.Description>
              <div class="flex justify-between items-center">
                <Discovery.Prev class="px-3 py-1.5 text-sm text-on-surface-variant hover:text-on-surface disabled:opacity-40">
                  Previous
                </Discovery.Prev>
                <div class="flex gap-2">
                  <Discovery.Skip class="px-3 py-1.5 text-sm text-on-surface-variant hover:text-on-surface">
                    Skip
                  </Discovery.Skip>
                  <Discovery.Next class="px-3 py-1.5 text-sm bg-primary text-on-primary rounded hover:opacity-90">
                    Finish
                  </Discovery.Next>
                </div>
              </div>
            </div>
          </Discovery.Content>
        </Discovery.Root>
      </div>

      <!-- Left/Right placement examples -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Step 4: Notifications - conditionally disabled -->
        <Discovery.Root v-slot="{ isActive }" :disabled="!notificationsEnabled" step="notifications">
          <Discovery.Activator
            class="p-6 bg-surface rounded-xl border border-divider transition-all block"
            :class="{ 'ring-2 ring-primary': isActive }"
          >
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2 text-lg font-medium text-on-surface">
                  <span class="i-mdi-bell text-xl text-primary" />
                  Notifications
                </div>
                <span
                  v-if="!notificationsEnabled"
                  class="text-xs px-2 py-0.5 bg-warning/20 text-warning rounded"
                >
                  Step Disabled
                </span>
              </div>
              <label class="flex items-center gap-2 cursor-pointer">
                <input
                  v-model="notificationsEnabled"
                  class="w-4 h-4"
                  type="checkbox"
                >
                <span class="text-sm text-on-surface-variant">
                  Enable notifications (enables this step)
                </span>
              </label>
            </div>
          </Discovery.Activator>

          <Discovery.Content placement="right">
            <div class="p-4 bg-surface border border-divider rounded-xl shadow-xl max-w-xs">
              <Discovery.Title class="text-lg font-semibold text-on-surface mb-1">
                Notification Settings
              </Discovery.Title>
              <Discovery.Progress class="text-xs text-on-surface-variant mb-2" />
              <Discovery.Description class="text-sm text-on-surface-variant mb-4">
                This step uses <code class="text-primary">placement="right"</code> and was conditionally enabled.
              </Discovery.Description>
              <div class="flex justify-between items-center">
                <Discovery.Prev class="px-3 py-1.5 text-sm text-on-surface-variant hover:text-on-surface disabled:opacity-40">
                  Previous
                </Discovery.Prev>
                <Discovery.Next class="px-3 py-1.5 text-sm bg-primary text-on-primary rounded hover:opacity-90">
                  Next
                </Discovery.Next>
              </div>
            </div>
          </Discovery.Content>
        </Discovery.Root>

        <!-- Step 5: Profile - left placement -->
        <Discovery.Root v-slot="{ isActive }" step="profile">
          <Discovery.Activator
            class="p-6 bg-surface rounded-xl border border-divider transition-all block"
            :class="{ 'ring-2 ring-primary': isActive }"
          >
            <div class="space-y-3">
              <div class="flex items-center gap-2 text-lg font-medium text-on-surface">
                <span class="i-mdi-account text-xl text-primary" />
                Profile
              </div>
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <span class="i-mdi-account text-primary" />
                </div>
                <div>
                  <div class="font-medium text-on-surface">John Doe</div>
                  <div class="text-xs text-on-surface-variant">john@example.com</div>
                </div>
              </div>
            </div>
          </Discovery.Activator>

          <Discovery.Content placement="left">
            <div class="p-4 bg-surface border border-divider rounded-xl shadow-xl max-w-xs">
              <Discovery.Title class="text-lg font-semibold text-on-surface mb-1">
                Your Profile
              </Discovery.Title>
              <Discovery.Progress class="text-xs text-on-surface-variant mb-2" />
              <Discovery.Description class="text-sm text-on-surface-variant mb-4">
                This step uses <code class="text-primary">placement="left"</code> to position the popover.
              </Discovery.Description>
              <div class="flex justify-between items-center">
                <Discovery.Prev class="px-3 py-1.5 text-sm text-on-surface-variant hover:text-on-surface disabled:opacity-40">
                  Previous
                </Discovery.Prev>
                <Discovery.Next class="px-3 py-1.5 text-sm bg-primary text-on-primary rounded hover:opacity-90">
                  Next
                </Discovery.Next>
              </div>
            </div>
          </Discovery.Content>
        </Discovery.Root>
      </div>

      <!-- Sidebar example - demonstrates activator separate from content location -->
      <Discovery.Root v-slot="{ isActive }" step="sidebar">
        <div class="flex gap-6">
          <Discovery.Activator
            as="aside"
            class="w-48 p-4 bg-surface rounded-xl border border-divider shrink-0 transition-all"
            :class="{ 'ring-2 ring-primary': isActive }"
          >
            <nav class="space-y-2">
              <div class="text-sm font-medium text-on-surface mb-3">Navigation</div>
              <a class="block px-3 py-2 text-sm text-on-surface-variant hover:bg-surface-variant rounded" href="#">Home</a>
              <a class="block px-3 py-2 text-sm text-on-surface-variant hover:bg-surface-variant rounded" href="#">Components</a>
              <a class="block px-3 py-2 text-sm text-on-surface-variant hover:bg-surface-variant rounded" href="#">Composables</a>
              <a class="block px-3 py-2 text-sm text-on-surface-variant hover:bg-surface-variant rounded" href="#">Guides</a>
            </nav>
          </Discovery.Activator>

          <div class="flex-1 p-6 bg-surface rounded-xl border border-divider">
            <h3 class="text-lg font-medium text-on-surface mb-2">Main Content Area</h3>
            <p class="text-on-surface-variant mb-4">
              This demonstrates a typical layout where the sidebar is highlighted. The content popover appears to the right of the sidebar.
            </p>
            <div class="text-sm text-on-surface-variant space-y-2">
              <p><strong>Features demonstrated:</strong></p>
              <ul class="list-disc list-inside space-y-1">
                <li><code class="text-primary">placement="bottom"</code> - Search (default)</li>
                <li><code class="text-primary">placement="top"</code> - Settings</li>
                <li><code class="text-primary">placement="right"</code> - Notifications, Sidebar</li>
                <li><code class="text-primary">placement="left"</code> - Profile</li>
                <li><code class="text-primary">:disabled</code> - Conditional step (Notifications)</li>
                <li>Slot props for custom styling</li>
                <li>Programmatic navigation via <code class="text-primary">discovery.select()</code></li>
              </ul>
            </div>
          </div>
        </div>

        <Discovery.Content placement="right">
          <div class="p-4 bg-surface border border-divider rounded-xl shadow-xl max-w-xs">
            <Discovery.Title class="text-lg font-semibold text-on-surface mb-1">
              Sidebar Navigation
            </Discovery.Title>
            <Discovery.Progress class="text-xs text-on-surface-variant mb-2" />
            <Discovery.Description class="text-sm text-on-surface-variant mb-4">
              The sidebar provides quick access to all documentation sections. This is the final step of the tour!
            </Discovery.Description>
            <div class="flex justify-between items-center">
              <Discovery.Prev class="px-3 py-1.5 text-sm text-on-surface-variant hover:text-on-surface disabled:opacity-40">
                Previous
              </Discovery.Prev>
              <Discovery.Next class="px-3 py-1.5 text-sm bg-primary text-on-primary rounded hover:opacity-90">
                Finish
              </Discovery.Next>
            </div>
          </div>
        </Discovery.Content>
      </Discovery.Root>

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
