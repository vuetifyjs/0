<script setup lang="ts">
  // Framework
  import { useBreakpoints, useNotifications, useProxyRegistry } from '@vuetify/v0'

  // Composables
  import { useAsk } from '@/composables/useAsk'
  import { useNavigation } from '@/composables/useNavigation'
  import { useSearch } from '@/composables/useSearch'
  import { useSettings } from '@/composables/useSettings'

  // Utilities
  import { toRef } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  // Stores
  import { useSkillzStore } from '@/stores/skillz'

  // Types
  import type { NotificationTicket } from '@vuetify/v0'

  const store = useSkillzStore()
  const route = useRoute()
  const router = useRouter()

  const notifications = useNotifications()
  const proxy = useProxyRegistry<NotificationTicket>(notifications)

  const ticket = toRef(() =>
    proxy.values.find(t => t.data?.type === 'skillz'),
  )

  const isSkillzPage = toRef(() => route.path.startsWith('/skillz/'))
  const ask = useAsk()
  const breakpoints = useBreakpoints()
  const navigation = useNavigation()
  const search = useSearch()
  const settings = useSettings()

  async function onResume () {
    const pending = store.pendingTour
    if (!pending) return

    const { tour } = pending

    await router.push(tour.startRoute)

    store.start(tour.id, {
      context: {
        ask,
        breakpoints,
        navigation,
        search,
        settings,
      },
    })
  }

  function onDismiss () {
    const pending = store.pendingTour
    if (pending) {
      store.dismiss(pending.tour.id)
    }
    ticket.value?.dismiss()
  }
</script>

<template>
  <Teleport to="body">
    <Transition name="slide-up">
      <div
        v-if="ticket && !isSkillzPage"
        class="fixed top-16 inset-x-0 mx-auto w-max z-50 flex items-center gap-3 px-4 py-3 bg-surface border border-divider rounded-xl shadow-xl"
      >
        <span class="text-sm text-on-surface">
          {{ ticket.subject }}
        </span>

        <div class="flex gap-2">
          <button
            class="px-3 py-1.5 text-sm text-on-surface-variant hover:text-on-surface transition-colors"
            type="button"
            @click="onDismiss"
          >
            Dismiss
          </button>

          <button
            class="px-3 py-1.5 text-sm font-semibold bg-primary text-on-primary rounded-lg hover:brightness-110 transition-[filter]"
            type="button"
            @click="onResume"
          >
            Resume
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(-25%);
  opacity: 0;
}
</style>
