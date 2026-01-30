<script setup lang="ts">
  /**
   * Provides hover popovers for API references in code blocks.
   *
   * Uses event delegation - attach to a container element and it will
   * handle hover events on any [data-api-candidate] elements within.
   *
   * The Shiki transformer marks potential API references at build time.
   * This component validates them against the actual API data client-side.
   *
   * Vue API content is lazily loaded only when a Vue API is first hovered.
   */
  import apiData from 'virtual:api'

  // Framework
  import { IN_BROWSER, useDocumentEventListener } from '@vuetify/v0'

  // Components
  import DocsApiHoverList from './DocsApiHoverList.vue'
  import DocsApiHoverSection from './DocsApiHoverSection.vue'

  // Composables
  import { usePopoverPosition } from '@/composables/usePopoverPosition'

  // Utilities
  import { toKebab } from '@/utilities/strings'
  import { computed, onScopeDispose, ref, shallowRef, useTemplateRef } from 'vue'
  import { useRouter } from 'vue-router'

  // Types
  import type { Api, ComponentApi, ComposableApi } from '@build/generate-api'
  import type { VueApiEntry } from '@build/vue-api-content'

  // Extended API type to include Vue APIs
  type ExtendedApi = Api | VueApiEntry

  const router = useRouter()

  // Track navigation state to avoid event storms on iOS Safari during transitions
  const isNavigating = shallowRef(false)
  const unregisterBefore = router.beforeEach(() => {
    isNavigating.value = true
    // Hide popover immediately when navigation starts
    hidePopover()
  })
  // Re-enable after DOM settles (must exceed transition duration + Vue flush)
  const NAVIGATION_SETTLE_MS = 100
  const unregisterAfter = router.afterEach(() => {
    setTimeout(() => {
      isNavigating.value = false
    }, NAVIGATION_SETTLE_MS)
  })
  onScopeDispose(() => {
    unregisterBefore()
    unregisterAfter()
  })

  // Build lookup maps from API data
  const componentNames = new Set(Object.keys(apiData.components))
  const composableNames = new Set(Object.keys(apiData.composables))

  // Lazy-loaded Vue API content (cached after first load)
  let vueApiContent: Record<string, VueApiEntry> | null = null
  let vueApiPromise: Promise<Record<string, VueApiEntry>> | null = null

  async function getVueApiContent (): Promise<Record<string, VueApiEntry>> {
    if (vueApiContent) return vueApiContent
    if (!vueApiPromise) {
      vueApiPromise = import('@build/vue-api-content').then(m => {
        vueApiContent = m.VUE_API_CONTENT
        return vueApiContent
      })
    }
    return vueApiPromise
  }

  // Current hover state
  const activeTarget = shallowRef<HTMLElement | null>(null)
  const activeApi = shallowRef<ExtendedApi | null>(null)
  const activeApiType = shallowRef<'component' | 'composable' | 'vue' | null>(null)
  const displayName = shallowRef<string>('')
  const _popoverRef = useTemplateRef<HTMLDivElement>('popover')
  const isVisible = ref(false)

  // Hover timing
  let hoverTimeout: ReturnType<typeof setTimeout> | null = null
  let hideTimeout: ReturnType<typeof setTimeout> | null = null
  const HOVER_DELAY = 200
  const HIDE_DELAY = 100 // Grace period when moving to popover

  // Position state
  const { position, flipped: flipBelow, calculate: calculatePosition } = usePopoverPosition({
    maxWidth: 450,
    maxHeight: 400,
  })

  async function showPopover (target: HTMLElement) {
    if (!IN_BROWSER) return

    // Cancel any pending hide
    if (hideTimeout) {
      clearTimeout(hideTimeout)
      hideTimeout = null
    }

    const apiType = target.dataset.apiType as 'component' | 'composable' | 'vue' | undefined
    const candidate = target.dataset.apiCandidate
    // Use apiName for lookup (handles plugin->composable mapping)
    const apiName = target.dataset.apiName || candidate
    if (!apiName || !apiType || !candidate) return

    // Reset state
    activeApi.value = null
    activeApiType.value = null
    displayName.value = candidate

    switch (apiType) {
      case 'component': {
        // Component names come as "Popover.Root" format
        // API data uses same format, so direct lookup
        if (!componentNames.has(apiName)) return
        activeApi.value = apiData.components[apiName]
        activeApiType.value = 'component'

        break
      }
      case 'composable': {
        if (!composableNames.has(apiName)) return
        activeApi.value = apiData.composables[apiName]
        activeApiType.value = 'composable'

        break
      }
      case 'vue': {
        // Lazy load Vue API content
        const vueContent = await getVueApiContent()
        if (!vueContent[apiName]) return
        activeApi.value = vueContent[apiName]
        activeApiType.value = 'vue'

        break
      }
    // No default
    }

    if (!activeApi.value) return

    // Mark as valid hover target
    target.classList.add('api-hover-valid')
    activeTarget.value = target

    // Calculate position relative to viewport
    calculatePosition(target)

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
    activeApiType.value = null
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
    // Skip during navigation to avoid event storms on iOS Safari
    if (isNavigating.value) return

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
    // Skip during navigation to avoid event storms on iOS Safari
    if (isNavigating.value) return

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

  // Set up event delegation on document (persistent across route changes)
  // Handlers already filter for [data-api-candidate] elements
  useDocumentEventListener('mouseenter', onMouseEnter, { capture: true })
  useDocumentEventListener('mouseleave', onMouseLeave, { capture: true })

  // Type-specific computed
  const componentApi = computed(() =>
    activeApiType.value === 'component' ? activeApi.value as ComponentApi : null,
  )

  const composableApi = computed(() =>
    activeApiType.value === 'composable' ? activeApi.value as ComposableApi : null,
  )

  const vueApi = computed(() =>
    activeApiType.value === 'vue' ? activeApi.value as VueApiEntry : null,
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

    // Vue APIs link to external Vue documentation
    if (activeApiType.value === 'vue') {
      return (activeApi.value as VueApiEntry).href
    }

    if (activeApiType.value === 'component') {
      // Component names are "Namespace.Part" (e.g., "Popover.Root")
      // Link to /api/namespace#namespace-part
      const name = (activeApi.value as ComponentApi).name
      const dotIndex = name.indexOf('.')
      if (dotIndex !== -1) {
        const namespace = name.slice(0, dotIndex)
        return `/api/${toKebab(namespace)}#${toKebab(name.replace('.', '-'))}`
      }
      // Standalone component (e.g., "Atom")
      return `/api/${toKebab(name)}`
    }

    // Composable
    return `/api/${toKebab((activeApi.value as ComposableApi).name)}`
  })

  // Whether the link is external (Vue docs) or internal (v0 API page)
  const isExternalLink = computed(() => activeApiType.value === 'vue')

  function navigateToApi () {
    const link = apiLink.value
    if (!link) return
    hidePopover()

    if (isExternalLink.value) {
      window.open(link, '_blank', 'noopener,noreferrer')
    } else {
      router.push(link)
    }
  }
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="isVisible && activeApi"
        ref="popover"
        class="docs-api-hover-popover"
        :class="{ 'popover-flipped': flipBelow }"
        :style="{
          top: `${position.top}px`,
          left: `${position.left}px`,
        }"
        @mouseleave="onPopoverMouseLeave"
      >
        <!-- Header -->
        <div class="popover-header">
          <span class="popover-name">{{ displayName }}</span>
          <span v-if="vueApi" class="popover-kind popover-kind-vue">{{ vueApi.category }}</span>
          <span v-else class="popover-kind" :class="`popover-kind-${activeApiType}`">{{ (activeApi as Api).kind }}</span>
          <AppCloseButton class="ml-auto" @click.stop="hidePopover" />
        </div>

        <!-- Vue API content -->
        <template v-if="vueApi">
          <p class="popover-description">{{ vueApi.summary }}</p>
          <div class="popover-content">
            <DocsApiHoverSection title="When to use">
              <p>{{ vueApi.usage }}</p>
            </DocsApiHoverSection>
            <DocsApiHoverSection title="Signature">
              <code>{{ vueApi.signature }}</code>
            </DocsApiHoverSection>
          </div>
        </template>

        <!-- v0 API content (component or composable) -->
        <template v-else>
          <!-- Description -->
          <p v-if="(activeApi as Api).description" class="popover-description">
            {{ (activeApi as Api).description }}
          </p>

          <!-- Scrollable content -->
          <div class="popover-content">
            <!-- Component API -->
            <template v-if="componentApi">
              <DocsApiHoverSection v-if="displayProps.length > 0" title="Props">
                <DocsApiHoverList :items="displayProps" />
              </DocsApiHoverSection>
              <DocsApiHoverSection v-if="displayEvents.length > 0" title="Events">
                <DocsApiHoverList :items="displayEvents" />
              </DocsApiHoverSection>
              <DocsApiHoverSection v-if="displaySlots.length > 0" title="Slots">
                <DocsApiHoverList :items="displaySlots" />
              </DocsApiHoverSection>
            </template>

            <!-- Composable API -->
            <template v-if="composableApi">
              <DocsApiHoverSection v-if="displayFunctions.length > 0" title="Functions">
                <DocsApiHoverList :items="displayFunctions" show-signature />
              </DocsApiHoverSection>
              <DocsApiHoverSection v-if="displayOptions.length > 0" title="Options">
                <DocsApiHoverList :items="displayOptions" />
              </DocsApiHoverSection>
              <DocsApiHoverSection v-if="displayProperties.length > 0" title="Properties">
                <DocsApiHoverList :items="displayProperties" />
              </DocsApiHoverSection>
              <DocsApiHoverSection v-if="displayMethods.length > 0" title="Methods">
                <DocsApiHoverList :items="displayMethods" />
              </DocsApiHoverSection>
            </template>
          </div>
        </template>

        <!-- Footer link -->
        <button class="popover-footer" type="button" @click.stop="navigateToApi">
          {{ isExternalLink ? 'View Vue docs ↗' : 'View API →' }}
        </button>
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

.docs-api-hover-popover.popover-flipped {
  transform: none;
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
  color: var(--v0-on-surface);
  text-decoration: underline;
  text-decoration-style: dotted;
  text-underline-offset: 2px;
  text-decoration-color: currentColor;
  text-decoration-thickness: 1px;
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
  padding: 0 12px 12px;
}

/* Vue API specific styles */
.popover-kind-component {
  background: var(--v0-primary);
  color: var(--v0-on-primary);
  opacity: 1;
}

.popover-kind-composable {
  background: var(--v0-info);
  color: var(--v0-on-info);
  opacity: 1;
}

.popover-kind-vue {
  background: #41b883;
  color: #fff;
  opacity: 1;
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
