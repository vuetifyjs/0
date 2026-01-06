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
  const displayName = shallowRef<string>('')
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

    const apiType = target.dataset.apiType
    const candidate = target.dataset.apiCandidate
    // Use apiName for lookup (handles plugin->composable mapping)
    const apiName = target.dataset.apiName || candidate
    if (!apiName || !apiType || !candidate) return

    // Reset state
    activeApi.value = null
    displayName.value = candidate

    if (apiType === 'component') {
      // Component names come as "Popover.Root" format
      // API data uses same format, so direct lookup
      if (!componentNames.has(apiName)) return
      activeApi.value = apiData.components[apiName]
    } else if (apiType === 'composable') {
      if (!composableNames.has(apiName)) return
      activeApi.value = apiData.composables[apiName]
    }

    if (!activeApi.value) return

    // Mark as valid hover target
    target.classList.add('api-hover-valid')
    activeTarget.value = target

    // Calculate position relative to viewport (above the element)
    const rect = target.getBoundingClientRect()
    const popoverMaxWidth = 450
    const viewportWidth = window.innerWidth
    const padding = 12

    // Clamp horizontal position to keep popover within viewport
    let left = rect.left + window.scrollX
    if (rect.left + popoverMaxWidth > viewportWidth - padding) {
      left = Math.max(padding, viewportWidth - popoverMaxWidth - padding + window.scrollX)
    }

    position.value = {
      top: rect.top + window.scrollY,
      left,
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
    // Remove valid class from previous target
    if (activeTarget.value) {
      activeTarget.value.classList.remove('api-hover-valid')
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

  const displayProps = computed(() => componentApi.value?.props || [])
  const displayEvents = computed(() => componentApi.value?.events || [])
  const displaySlots = computed(() => componentApi.value?.slots || [])

  // Filter to show only the hovered function (if it exists in the functions list)
  const displayFunctions = computed(() => {
    const functions = composableApi.value?.functions || []
    const hoveredFn = functions.find(fn => fn.name === displayName.value)
    return hoveredFn ? [hoveredFn] : functions
  })
  const displayOptions = computed(() => composableApi.value?.options || [])
  const displayProperties = computed(() => composableApi.value?.properties || [])
  const displayMethods = computed(() => composableApi.value?.methods || [])

  const apiLink = computed(() => {
    if (!activeApi.value) return null

    if (activeApi.value.kind === 'component') {
      // Component names are "Namespace.Part" (e.g., "Popover.Root")
      // Link to /api/namespace#namespace-part
      const name = activeApi.value.name
      const dotIndex = name.indexOf('.')
      if (dotIndex !== -1) {
        const namespace = name.slice(0, dotIndex)
        return `/api/${toKebab(namespace)}#${toKebab(name.replace('.', '-'))}`
      }
      // Standalone component (e.g., "Atom")
      return `/api/${toKebab(name)}`
    }

    // Composable
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
          <span class="popover-name">{{ displayName }}</span>
          <span class="popover-kind">{{ activeApi.kind }}</span>
        </div>

        <!-- Description -->
        <p v-if="activeApi.description" class="popover-description">
          {{ activeApi.description }}
        </p>

        <!-- Scrollable content -->
        <div class="popover-content">
          <!-- Component API -->
          <template v-if="componentApi">
            <div v-if="displayProps.length > 0" class="popover-section">
              <span class="popover-section-title">Props</span>
              <ul class="popover-list">
                <li v-for="prop in displayProps" :key="prop.name">
                  <div class="popover-item-header">
                    <span class="popover-item-name">{{ prop.name }}</span>
                    <code class="popover-type">{{ prop.type }}</code>
                    <code v-if="prop.default" class="popover-default">{{ prop.default }}</code>
                  </div>
                  <p v-if="prop.description" class="popover-item-description">
                    {{ prop.description }}
                  </p>
                </li>
              </ul>
            </div>

            <div v-if="displayEvents.length > 0" class="popover-section">
              <span class="popover-section-title">Events</span>
              <ul class="popover-list">
                <li v-for="event in displayEvents" :key="event.name">
                  <div class="popover-item-header">
                    <span class="popover-item-name">{{ event.name }}</span>
                    <code class="popover-type">{{ event.type }}</code>
                  </div>
                  <p v-if="event.description" class="popover-item-description">
                    {{ event.description }}
                  </p>
                </li>
              </ul>
            </div>

            <div v-if="displaySlots.length > 0" class="popover-section">
              <span class="popover-section-title">Slots</span>
              <ul class="popover-list">
                <li v-for="slot in displaySlots" :key="slot.name">
                  <div class="popover-item-header">
                    <span class="popover-item-name">{{ slot.name }}</span>
                    <code v-if="slot.type" class="popover-type">{{ slot.type }}</code>
                  </div>
                  <p v-if="slot.description" class="popover-item-description">
                    {{ slot.description }}
                  </p>
                </li>
              </ul>
            </div>
          </template>

          <!-- Composable API -->
          <template v-if="composableApi">
            <div v-if="displayFunctions.length > 0" class="popover-section">
              <span class="popover-section-title">Functions</span>
              <ul class="popover-list">
                <li v-for="fn in displayFunctions" :key="fn.name">
                  <div class="popover-item-header">
                    <span class="popover-item-name">{{ fn.name }}</span>
                  </div>
                  <code v-if="fn.signature" class="popover-signature">{{ fn.signature }}</code>
                  <p v-if="fn.description" class="popover-item-description">
                    {{ fn.description }}
                  </p>
                </li>
              </ul>
            </div>

            <div v-if="displayOptions.length > 0" class="popover-section">
              <span class="popover-section-title">Options</span>
              <ul class="popover-list">
                <li v-for="opt in displayOptions" :key="opt.name">
                  <div class="popover-item-header">
                    <span class="popover-item-name">{{ opt.name }}</span>
                    <code class="popover-type">{{ opt.type }}</code>
                    <code v-if="opt.default" class="popover-default">{{ opt.default }}</code>
                  </div>
                  <p v-if="opt.description" class="popover-item-description">
                    {{ opt.description }}
                  </p>
                </li>
              </ul>
            </div>

            <div v-if="displayProperties.length > 0" class="popover-section">
              <span class="popover-section-title">Properties</span>
              <ul class="popover-list">
                <li v-for="prop in displayProperties" :key="prop.name">
                  <div class="popover-item-header">
                    <span class="popover-item-name">{{ prop.name }}</span>
                    <code class="popover-type">{{ prop.type }}</code>
                  </div>
                  <p v-if="prop.description" class="popover-item-description">
                    {{ prop.description }}
                  </p>
                </li>
              </ul>
            </div>

            <div v-if="displayMethods.length > 0" class="popover-section">
              <span class="popover-section-title">Methods</span>
              <ul class="popover-list">
                <li v-for="method in displayMethods" :key="method.name">
                  <div class="popover-item-header">
                    <span class="popover-item-name">{{ method.name }}</span>
                    <code class="popover-type">{{ method.type }}</code>
                  </div>
                  <p v-if="method.description" class="popover-item-description">
                    {{ method.description }}
                  </p>
                </li>
              </ul>
            </div>
          </template>
        </div>

        <!-- Footer link -->
        <div class="popover-footer" @click.prevent.stop="navigateToApi">
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
  display: flex;
  flex-direction: column;
  min-width: 320px;
  max-width: 450px;
  max-height: 400px;
  padding: 12px;
  background: var(--v0-surface);
  border: 1px solid var(--v0-divider);
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  font-size: 13px;
  line-height: 1.5;
  transform: translateY(calc(-100% - 8px));
}

.popover-header {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  gap: 8px;
  margin: -12px -12px 0;
  padding: 12px;
  border-bottom: 1px solid var(--v0-divider);
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
  flex-shrink: 0;
  margin: 12px 0;
  color: var(--v0-text-secondary);
}

.popover-content {
  flex: 1;
  overflow-y: auto;
  margin: 0 -12px;
  padding: 0 12px;
}

.popover-section {
  margin-bottom: 0;
}

.popover-section-title {
  position: sticky;
  top: 0;
  z-index: 1;
  display: block;
  margin: 0 -12px;
  padding: 8px 12px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--v0-text-secondary);
  background: var(--v0-surface-tint);
  border-top: 1px solid var(--v0-divider);
  border-bottom: 1px solid var(--v0-divider);
}

.popover-section:first-child .popover-section-title {
  border-top: none;
}

.popover-list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.popover-list li {
  margin: 0 -12px;
  padding: 6px 12px;
  border-bottom: 1px solid color-mix(in srgb, var(--v0-divider) 50%, transparent);
}

.popover-list li:last-child {
  border-bottom: none;
}

.popover-item-header {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.popover-item-name {
  font-family: var(--v0-font-mono);
  font-size: 12px;
  font-weight: 500;
  color: var(--v0-primary);
}

.popover-item-description {
  margin: 4px 0 0;
  font-size: 11px;
  line-height: 1.4;
  color: var(--v0-text-secondary);
}

.popover-default {
  margin-left: auto;
  padding: 2px 6px;
  font-family: var(--v0-font-mono);
  font-size: 10px;
  background: var(--v0-surface-variant);
  border-radius: 4px;
}

.popover-type {
  padding: 2px 6px;
  font-family: var(--v0-font-mono);
  font-size: 11px;
  color: var(--v0-text-secondary);
  background: var(--v0-surface-variant);
  border-radius: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 200px;
}

.popover-signature {
  display: block;
  margin-top: 4px;
  padding: 4px 8px;
  font-family: var(--v0-font-mono);
  font-size: 11px;
  color: var(--v0-text-secondary);
  background: var(--v0-surface-variant);
  border-radius: 4px;
  overflow-x: auto;
  white-space: nowrap;
}

.popover-footer {
  flex-shrink: 0;
  margin: 0 -12px -12px;
  padding: 12px;
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
