<script setup lang="ts">
  import { createTour, Tour } from '@vuetify/v0'
  import { provide } from 'vue'

  const tour = createTour()
  provide('v0:tour', tour)

  tour.steps.onboard([
    { id: 'welcome', type: 'dialog' },
    { id: 'search' },
    { id: 'profile' },
  ])
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex items-center gap-4">
      <Tour.Activator step="search">
        <input
          class="px-3 py-2 border border-divider rounded-lg bg-surface text-on-surface text-sm w-48"
          placeholder="Search..."
          type="text"
        >
      </Tour.Activator>

      <Tour.Activator step="profile">
        <div class="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center text-sm font-medium">
          JL
        </div>
      </Tour.Activator>
    </div>

    <button
      class="px-4 py-2 bg-primary text-on-primary rounded-lg text-sm font-medium w-fit"
      @click="tour.start()"
    >
      Start Tour
    </button>

    <Tour.Highlight :padding="8" />

    <!-- Step 1: Welcome -->
    <Tour.Root step="welcome">
      <Tour.Content>
        <div class="bg-surface border border-divider rounded-xl p-6 max-w-sm shadow-lg pointer-events-auto">
          <Tour.Title class="text-lg font-semibold text-on-surface">
            Welcome!
          </Tour.Title>

          <Tour.Description class="text-sm text-on-surface-variant mt-1">
            Let us show you around the interface.
          </Tour.Description>

          <div class="flex justify-end gap-2 mt-4">
            <Tour.Skip
              class="px-3 py-1.5 text-sm text-on-surface-variant"
              @skip="tour.stop()"
            >
              Skip
            </Tour.Skip>

            <Tour.Next class="px-3 py-1.5 text-sm bg-primary text-on-primary rounded-md">
              Next
            </Tour.Next>
          </div>
        </div>
      </Tour.Content>
    </Tour.Root>

    <!-- Step 2: Search -->
    <Tour.Root step="search">
      <Tour.Content>
        <div class="bg-surface border border-divider rounded-xl p-4 max-w-xs shadow-lg">
          <Tour.Title class="text-base font-semibold text-on-surface">
            Search
          </Tour.Title>

          <Tour.Description class="text-sm text-on-surface-variant mt-1">
            Find anything with the search bar.
          </Tour.Description>

          <div class="flex items-center justify-between mt-3">
            <Tour.Progress class="text-xs text-on-surface-variant" />

            <div class="flex gap-2">
              <Tour.Prev class="px-3 py-1.5 text-sm border border-divider rounded-md disabled:opacity-40">
                Back
              </Tour.Prev>

              <Tour.Next class="px-3 py-1.5 text-sm bg-primary text-on-primary rounded-md">
                Next
              </Tour.Next>
            </div>
          </div>
        </div>
      </Tour.Content>
    </Tour.Root>

    <!-- Step 3: Profile -->
    <Tour.Root step="profile">
      <Tour.Content>
        <div class="bg-surface border border-divider rounded-xl p-4 max-w-xs shadow-lg">
          <Tour.Title class="text-base font-semibold text-on-surface">
            Your Profile
          </Tour.Title>

          <Tour.Description class="text-sm text-on-surface-variant mt-1">
            Access settings and preferences here.
          </Tour.Description>

          <div class="flex items-center justify-between mt-3">
            <Tour.Progress class="text-xs text-on-surface-variant" />

            <div class="flex gap-2">
              <Tour.Prev class="px-3 py-1.5 text-sm border border-divider rounded-md disabled:opacity-40">
                Back
              </Tour.Prev>

              <button
                class="px-3 py-1.5 text-sm bg-primary text-on-primary rounded-md"
                @click="tour.complete()"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      </Tour.Content>
    </Tour.Root>

    <Tour.Keyboard />
  </div>
</template>
