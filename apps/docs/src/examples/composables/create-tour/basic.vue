<script setup lang="ts">
  import { useOnboarding } from './useOnboarding'

  const { tour, current, index, placement } = useOnboarding()
  const isActive = tour.isActive
  const isComplete = tour.isComplete
  const isLast = tour.isLast
  const canGoBack = tour.canGoBack
  const canGoNext = tour.canGoNext
  const selectedId = tour.selectedId

  function onStart () {
    tour.start()
  }

  function onStop () {
    tour.stop()
  }

  function onPrev () {
    void tour.prev()
  }

  function onNext () {
    if (tour.isLast.value) {
      tour.complete()
      return
    }

    void tour.next()
  }
</script>

<template>
  <div class="flex flex-col gap-4 w-full">
    <div class="flex items-center gap-3 px-3 py-2 rounded bg-neutral-100 dark:bg-neutral-900">
      <input
        class="flex-1 px-3 py-1 rounded text-sm bg-white dark:bg-neutral-800"
        :class="isActive && selectedId === 'search' ? 'ring-2 ring-blue-500' : ''"
        data-tour="search"
        placeholder="Search…"
        type="search"
      >

      <button
        class="size-8 rounded-full text-xs font-medium bg-neutral-300 dark:bg-neutral-700"
        :class="isActive && selectedId === 'avatar' ? 'ring-2 ring-blue-500' : ''"
        data-tour="avatar"
        type="button"
      >
        AJ
      </button>
    </div>

    <div
      v-if="isActive && current"
      class="flex flex-col gap-1 px-3 py-2 rounded text-sm bg-neutral-100 dark:bg-neutral-900"
    >
      <div class="flex items-baseline justify-between gap-2">
        <span class="font-medium">{{ current.title }}</span>
        <span class="text-xs text-neutral-500">{{ index }} / {{ tour.total }}</span>
      </div>

      <p class="text-neutral-600 dark:text-neutral-400">{{ current.body }}</p>

      <p v-if="placement" class="text-xs text-neutral-500">
        placement: {{ placement }}
      </p>
    </div>

    <p v-else-if="isComplete" class="text-sm text-neutral-500">
      Tour complete.
    </p>

    <p v-else class="text-sm text-neutral-500">
      Press Start to walk the chrome.
    </p>

    <div class="flex items-center gap-2">
      <button
        class="px-3 py-1 rounded text-sm bg-blue-500 text-white disabled:opacity-50"
        :disabled="isActive"
        type="button"
        @click="onStart"
      >
        Start
      </button>

      <button
        class="px-3 py-1 rounded text-sm bg-neutral-200 dark:bg-neutral-800 disabled:opacity-50"
        :disabled="!canGoBack"
        type="button"
        @click="onPrev"
      >
        Prev
      </button>

      <button
        class="px-3 py-1 rounded text-sm bg-neutral-200 dark:bg-neutral-800 disabled:opacity-50"
        :disabled="isLast ? !isActive : !canGoNext"
        type="button"
        @click="onNext"
      >
        {{ isLast ? 'Complete' : 'Next' }}
      </button>

      <button
        class="px-3 py-1 rounded text-sm bg-neutral-200 dark:bg-neutral-800 disabled:opacity-50"
        :disabled="!isActive"
        type="button"
        @click="onStop"
      >
        Stop
      </button>
    </div>
  </div>
</template>
