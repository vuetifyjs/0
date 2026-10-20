<script setup lang="ts">
  import { useOnboarding } from './useOnboarding'

  const {
    tour,
    current,
    index,
    name,
    errors,
    note,
    confirm,
    restart,
  } = useOnboarding()

  const isActive = tour.isActive
  const isComplete = tour.isComplete
  const isReady = tour.isReady
  const isLast = tour.isLast
  const canGoBack = tour.canGoBack
  const canGoNext = tour.canGoNext
  const selectedId = tour.selectedId

  function marked (id: string) {
    return isActive.value && selectedId.value === id
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

  const control = 'px-3 py-1 rounded-md text-sm border border-divider bg-surface text-on-surface hover:bg-surface-tint disabled:cursor-not-allowed disabled:border-transparent disabled:bg-transparent disabled:text-on-surface-variant/35 disabled:hover:bg-transparent'
</script>

<template>
  <div class="flex flex-col gap-4 w-full text-on-surface" data-tour-root="sequencer">
    <div class="flex flex-wrap items-center gap-3 px-3 py-2 rounded-lg bg-surface border border-divider">
      <input
        class="flex-1 min-w-32 px-3 py-1.5 rounded-md text-sm bg-surface border border-divider text-on-surface placeholder:text-on-surface-variant"
        :class="marked('search') ? 'ring-2 ring-primary' : ''"
        data-tour="search"
        placeholder="Search…"
        type="search"
      >

      <button
        class="px-3 py-1.5 rounded-md text-sm border border-divider bg-surface text-on-surface hover:bg-surface-tint disabled:opacity-50"
        :class="marked('settings') ? 'ring-2 ring-primary' : ''"
        data-tour="settings"
        :disabled="!marked('settings') || isReady"
        type="button"
        @click="confirm"
      >
        Settings
      </button>

      <button
        class="size-8 rounded-full text-xs font-medium bg-primary text-on-primary"
        :class="marked('avatar') ? 'ring-2 ring-primary' : ''"
        data-tour="avatar"
        type="button"
      >
        AJ
      </button>
    </div>

    <label class="flex flex-col gap-1 text-sm" data-tour="name">
      <span class="text-xs text-on-surface-variant">Name</span>

      <input
        v-model="name"
        class="px-3 py-1.5 rounded-md text-sm bg-surface text-on-surface border"
        :class="[
          marked('name') ? 'ring-2 ring-primary' : '',
          errors.length > 0 ? 'border-error' : 'border-divider',
        ]"
        type="text"
      >

      <span v-if="errors.length > 0" class="text-xs text-error">{{ errors[0] }}</span>
    </label>

    <div
      v-if="isActive && current"
      class="flex flex-col gap-1 px-3 py-2 rounded-lg text-sm bg-surface border border-divider"
    >
      <div class="flex items-baseline justify-between gap-2">
        <span class="font-medium">{{ current.title }}</span>
        <span class="text-xs text-on-surface-variant">{{ index }} / {{ tour.total }}</span>
      </div>

      <p class="text-on-surface-variant">{{ current.body }}</p>

      <p v-if="selectedId === 'settings'" class="text-xs text-on-surface-variant">
        Next and Prev stay off until you press Settings.
      </p>
    </div>

    <p v-else-if="isComplete" class="text-sm text-on-surface-variant">
      Tour complete. {{ note }}
    </p>

    <p v-else class="text-sm text-on-surface-variant">
      Press Start.
    </p>

    <div class="flex flex-wrap items-center gap-2">
      <button
        class="px-3 py-1 rounded-md text-sm bg-primary text-on-primary disabled:opacity-50"
        :disabled="isActive"
        type="button"
        @click="restart"
      >
        Start
      </button>

      <button
        :class="control"
        :disabled="!canGoBack"
        type="button"
        @click="onPrev"
      >
        Prev
      </button>

      <button
        :class="control"
        :disabled="isLast ? !isActive : !canGoNext"
        type="button"
        @click="onNext"
      >
        {{ isLast ? 'Complete' : 'Next' }}
      </button>

      <button
        :class="control"
        :disabled="!isActive"
        type="button"
        @click="onStop"
      >
        Stop
      </button>
    </div>
  </div>
</template>
