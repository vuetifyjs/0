<script setup lang="ts">
  /**
   * Provides hover popovers for API references in code blocks.
   *
   * Uses event delegation - attach to a container element and it will
   * handle hover events on any [data-api-candidate] elements within.
   *
   * The Shiki transformer marks potential API references at build time.
   * This component validates them against the actual API data client-side.
   */
  import apiData from 'virtual:api'

  // Utilities
  import { toKebab } from '@/utilities/strings'
  import { computed, onMounted, onUnmounted, ref, shallowRef } from 'vue'
  import { useRouter } from 'vue-router'

  // Types
  import type { Api, ComponentApi, ComposableApi } from '../../../build/generate-api'

  const router = useRouter()

  // Build lookup maps from API data
  const componentNames = new Set(Object.keys(apiData.components))
  const composableNames = new Set(Object.keys(apiData.composables))

  // Current hover state
  const activeTarget = shallowRef<HTMLElement | null>(null)
  const activeApi = shallowRef<Api | null>(null)
  const popoverEl = ref<HTMLDivElement>()
  const isVisible = ref(false)

  // Hover timing
  let hoverTimeout: ReturnType<typeof setTimeout> | null = null
  let hideTimeout: ReturnType<typeof setTimeout> | null = null
  const HOVER_DELAY = 200
  const HIDE_DELAY = 100 // Grace period when moving to popover

  // Position state
  const position = ref({ top: 0, left: 0 })

  function showPopover (target: HTMLElement) {
    // Cancel any pending hide
    if (hideTimeout) {
      clearTimeout(hideTimeout)
      hideTimeout = null
    }

    const candidate = target.dataset.apiCandidate
    const apiType = target.dataset.apiType
    if (!candidate || !apiType) return

    // Reset state
    activeApi.value = null

    if (apiType === 'component') {
      // Component names come as "Popover.Root" format
      // API data uses same format, so direct lookup
      if (!componentNames.has(candidate)) return
      activeApi.value = apiData.components[candidate]
    } else if (apiType === 'composable') {
      if (!composableNames.has(candidate)) return
      activeApi.value = apiData.composables[candidate]
    }

    if (!activeApi.value) return

    // Mark as valid hover target
    target.classList.add('api-hover-valid')
    activeTarget.value = target

    // Calculate position relative to viewport
    const rect = target.getBoundingClientRect()
    position.value = {
      top: rect.bottom + window.scrollY + 8,
      left: rect.left + window.scrollX,
    }

    isVisible.value = true
  }

  function hidePopover () {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout)
      hoverTimeout = null
    }
    if (hideTimeout) {
      clearTimeout(hideTimeout)
      hideTimeout = null
    }
    isVisible.value = false
    activeTarget.value = null
    activeApi.value = null
  }

  function scheduleHide () {
    if (hideTimeout) clearTimeout(hideTimeout)
    hideTimeout = setTimeout(hidePopover, HIDE_DELAY)
  }

  function cancelHide () {
    if (hideTimeout) {
      clearTimeout(hideTimeout)
      hideTimeout = null
    }
  }

  function onMouseEnter (e: MouseEvent) {
    const eventTarget = e.target
    if (!(eventTarget instanceof Element)) return

    // Cancel any pending hide when entering a target or popover
    const isPopover = eventTarget.closest('.docs-api-hover-popover')
    if (isPopover) {
      cancelHide()
      return
    }

    const target = eventTarget.closest('[data-api-candidate]') as HTMLElement | null
    if (!target) return

    cancelHide()
    if (hoverTimeout) clearTimeout(hoverTimeout)
    hoverTimeout = setTimeout(() => showPopover(target), HOVER_DELAY)
  }

  function onMouseLeave (e: MouseEvent) {
    const relatedTarget = e.relatedTarget

    // Don't schedule hide if moving to the popover or between hover targets
    if (relatedTarget instanceof Element) {
      if (relatedTarget.closest('.docs-api-hover-popover')) return
      if (relatedTarget.closest('[data-api-candidate]')) return
    }

    // Schedule hide with grace period
    scheduleHide()
  }

  function onPopoverMouseLeave (e: MouseEvent) {
    const relatedTarget = e.relatedTarget
    // Don't hide if moving back to a hover target
    if (relatedTarget instanceof Element && relatedTarget.closest('[data-api-candidate]')) return
    scheduleHide()
  }

  // Set up global event delegation on code blocks
  onMounted(() => {
    document.addEventListener('mouseenter', onMouseEnter, true)
    document.addEventListener('mouseleave', onMouseLeave, true)
  })

  onUnmounted(() => {
    document.removeEventListener('mouseenter', onMouseEnter, true)
    document.removeEventListener('mouseleave', onMouseLeave, true)
  })

  // Component-specific computed
  const componentApi = computed(() =>
    activeApi.value?.kind === 'component' ? activeApi.value as ComponentApi : null,
  )

  const composableApi = computed(() =>
    activeApi.value?.kind === 'composable' ? activeApi.value as ComposableApi : null,
  )

  // Limit displayed items for brevity
  const MAX_ITEMS = 5

  const displayProps = computed(() =>
    componentApi.value?.props.slice(0, MAX_ITEMS) || [],
  )

  const displayOptions = computed(() =>
    composableApi.value?.options.slice(0, MAX_ITEMS) || [],
  )

  const hasMore = computed(() => {
    if (componentApi.value) {
      return componentApi.value.props.length > MAX_ITEMS
    }
    if (composableApi.value) {
      return composableApi.value.options.length > MAX_ITEMS
    }
    return false
  })

  const apiLink = computed(() => {
    if (!activeApi.value) return null
    return `/api/${toKebab(activeApi.value.name)}`
  })

  function navigateToApi () {
    const link = apiLink.value
    if (!link) return
    hidePopover()
    router.push(link)
  }
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="isVisible && activeApi"
        ref="popoverEl"
        class="docs-api-hover-popover"
        :style="{
          top: `${position.top}px`,
          left: `${position.left}px`,
        }"
        @mouseleave="onPopoverMouseLeave"
      >
        <!-- API view (component or composable) -->
        <!-- Header -->
        <div class="popover-header">
          <span class="popover-name">{{ activeApi.name }}</span>
          <span class="popover-kind">{{ activeApi.kind }}</span>
        </div>

        <!-- Description -->
        <p v-if="activeApi.description" class="popover-description">
          {{ activeApi.description }}
        </p>

        <!-- Component Props -->
        <template v-if="componentApi">
          <div v-if="displayProps.length > 0" class="popover-section">
            <span class="popover-section-title">Props</span>
            <ul class="popover-list">
              <li v-for="prop in displayProps" :key="prop.name">
                <code>{{ prop.name }}</code>
                <span class="popover-type">{{ prop.type }}</span>
              </li>
            </ul>
            <span v-if="hasMore" class="popover-more">
              +{{ componentApi.props.length - MAX_ITEMS }} more
            </span>
          </div>
        </template>

        <!-- Composable Options -->
        <template v-if="composableApi">
          <div v-if="displayOptions.length > 0" class="popover-section">
            <span class="popover-section-title">Options</span>
            <ul class="popover-list">
              <li v-for="opt in displayOptions" :key="opt.name">
                <code>{{ opt.name }}</code>
                <span class="popover-type">{{ opt.type }}</span>
              </li>
            </ul>
            <span v-if="hasMore" class="popover-more">
              +{{ composableApi.options.length - MAX_ITEMS }} more
            </span>
          </div>
        </template>

        <!-- Footer link -->
        <div class="popover-footer" @click="navigateToApi">
          View API →
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.docs-api-hover-popover {
  position: absolute;
  z-index: 1000;
  min-width: 280px;
  max-width: 400px;
  padding: 12px;
  background: var(--v0-surface);
  border: 1px solid var(--v0-divider);
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  font-size: 13px;
  line-height: 1.5;
}

.popover-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.popover-name {
  font-weight: 600;
  font-family: var(--v0-font-mono);
  color: var(--v0-primary);
}

.popover-kind {
  padding: 2px 6px;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: var(--v0-surface-light);
  border-radius: 4px;
  opacity: 0.7;
}

.popover-description {
  margin: 0 0 12px;
  color: var(--v0-text-secondary);
}

.popover-section {
  margin-bottom: 8px;
}

.popover-section-title {
  display: block;
  margin-bottom: 4px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  opacity: 0.6;
}

.popover-list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.popover-list li {
  display: flex;
  align-items: baseline;
  gap: 8px;
  padding: 2px 0;
}

.popover-list code {
  font-family: var(--v0-font-mono);
  font-size: 12px;
  color: var(--v0-text);
}

.popover-type {
  font-family: var(--v0-font-mono);
  font-size: 11px;
  color: var(--v0-text-secondary);
  opacity: 0.7;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 200px;
}

.popover-more {
  display: block;
  margin-top: 4px;
  font-size: 11px;
  color: var(--v0-text-secondary);
  opacity: 0.6;
}

.popover-footer {
  margin-top: 12px;
  padding-top: 8px;
  border-top: 1px solid var(--v0-divider);
  font-size: 12px;
  color: var(--v0-primary);
  cursor: pointer;
}

.popover-footer:hover {
  text-decoration: underline;
}

/* Transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

<style>
/* Global styles for API hover targets */
[data-api-candidate] {
  cursor: help;
  text-decoration: underline;
  text-decoration-style: dotted;
  text-underline-offset: 2px;
  text-decoration-color: currentColor;
  text-decoration-thickness: 1px;
  opacity: 0.85;
}

[data-api-candidate]:hover {
  opacity: 1;
}
</style>
