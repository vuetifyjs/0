<script setup lang="ts">
  // Framework
  import { IN_BROWSER, Atom, Button, clamp, isArray, isNaN, isNumber, isObject, isString, useLogger, useStorage } from '@vuetify/v0'

  // Utilities
  import { onMounted, onScopeDispose, ref, toRef, watchEffect } from 'vue'
  import { RouterLink } from 'vue-router'

  // Types
  import type { AtomProps } from '@vuetify/v0'

  const SITE = 'v0-docs'
  const SNOOZE_MS = 7 * 24 * 60 * 60 * 1000
  const MIN_HEIGHT = 24
  const MAX_HEIGHT = 120
  const API = import.meta.env.VITE_API_SERVER_URL || 'https://api.vuetifyjs.com'
  const HEX = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/

  interface RemoteBanner {
    slug: string
    metadata: {
      closable?: boolean | null
      color?: string | null
      height?: number | null
      text?: string | null
      subtext?: string | null
      link?: string | null
      link_text?: string | null
      bg_blur?: number | null
      images?: {
        bg?: { url?: string } | null
        logo?: { url?: string } | null
      } | null
      site?: (string | null)[] | null
    }
  }

  const { as = 'header' } = defineProps<AtomProps>()

  const logger = useLogger()
  const storage = useStorage()
  const all = ref<RemoteBanner[]>([])
  const dismissed = storage.get<string[]>('v0-docs-banner-dismissed', [])
  const snoozed = storage.get<Record<string, number>>('v0-docs-banner-snooze', {})

  // '*' and 'docs' belong to the other properties. This strip only mounts a banner
  // whose site list contains the literal tag.
  function targetsDocs (site: unknown) {
    return isArray(site) && site.includes(SITE)
  }

  function dismissedSlugs () {
    return isArray(dismissed.value) ? dismissed.value.filter(isString) : []
  }

  function snoozeUntil (slug: string) {
    if (!isObject(snoozed.value)) return 0
    const until = snoozed.value[slug]
    return isNumber(until) ? until : 0
  }

  const banner = toRef(() => {
    const now = Date.now()
    const hidden = dismissedSlugs()

    return all.value.find(item => {
      if (!targetsDocs(item.metadata.site)) return false
      if (!isString(item.metadata.text) || item.metadata.text.length === 0) return false
      if (hidden.includes(item.slug)) return false
      return snoozeUntil(item.slug) <= now
    })
  })

  const text = toRef(() => banner.value?.metadata.text ?? '')
  const subtext = toRef(() => {
    const value = banner.value?.metadata.subtext
    return isString(value) ? value : ''
  })
  const closable = toRef(() => banner.value?.metadata.closable !== false)
  const color = toRef(() => hex(banner.value?.metadata.color))
  const height = toRef(() => banner.value ? bannerHeight(banner.value) : 0)
  const blur = toRef(() => {
    const value = banner.value?.metadata.bg_blur
    if (!isNumber(value) || isNaN(value) || value <= 0) return 0
    return clamp(value, 0, 40)
  })
  const image = toRef(() => httpsUrl(banner.value?.metadata.images?.bg?.url))
  const logo = toRef(() => httpsUrl(banner.value?.metadata.images?.logo?.url))
  const href = toRef(() => linkHref(banner.value?.metadata.link))
  const linkText = toRef(() => {
    const value = banner.value?.metadata.link_text
    return isString(value) ? value : ''
  })
  const external = toRef(() => !!href.value && !href.value.startsWith('/'))
  const colored = toRef(() => !!color.value || !!image.value)
  const barStyle = toRef(() => {
    const style: Record<string, string> = { height: `${height.value}px` }
    if (color.value) style.backgroundColor = color.value
    return style
  })

  function hex (value: unknown) {
    return isString(value) && HEX.test(value) ? value : undefined
  }

  function httpsUrl (value: unknown) {
    if (!isString(value)) return undefined

    try {
      const url = new URL(value)
      if (url.protocol === 'https:') return url.toString()
    } catch {
      // Ignore non-URLs from the CMS payload.
    }

    return undefined
  }

  function linkHref (value: unknown) {
    if (!isString(value) || value.length === 0) return undefined
    if (value.startsWith('/') && !value.startsWith('//')) return value
    return httpsUrl(value)
  }

  function bannerHeight (item: RemoteBanner) {
    const value = item.metadata.height
    if (isNumber(value) && !isNaN(value) && value > 0) {
      return clamp(Math.round(value), MIN_HEIGHT, MAX_HEIGHT)
    }

    return isString(item.metadata.subtext) && item.metadata.subtext.length > 0 ? 56 : MIN_HEIGHT
  }

  function parseBanners (payload: unknown) {
    if (!isObject(payload) || !isArray(payload.banners)) return []

    const banners: RemoteBanner[] = []
    for (const item of payload.banners) {
      if (!isObject(item) || !isString(item.slug) || !isObject(item.metadata)) continue
      banners.push(item as RemoteBanner)
    }
    return banners
  }

  async function fetchBanners () {
    const targeted = await fetch(`${API}/one/banners/site/${SITE}`)

    if (targeted.ok) return parseBanners(await targeted.json())
    // Until the site route is deployed, the public list is the same payload.
    if (targeted.status !== 404) return []

    const response = await fetch(`${API}/one/banners`)
    if (!response.ok) return []
    return parseBanners(await response.json())
  }

  function onDismiss () {
    const slug = banner.value?.slug
    if (!isString(slug)) return
    const slugs = dismissedSlugs()
    if (slugs.includes(slug)) return
    dismissed.value = [...slugs, slug]
  }

  function onSnooze () {
    const slug = banner.value?.slug
    if (!isString(slug)) return
    const current = isObject(snoozed.value) ? snoozed.value : {}
    snoozed.value = { ...current, [slug]: Date.now() + SNOOZE_MS }
  }

  onMounted(async () => {
    try {
      all.value = await fetchBanners()
    } catch (error) {
      logger.warn('Failed to fetch v0 docs banner', error)
    }
  })

  watchEffect(() => {
    if (!IN_BROWSER) return
    document.documentElement.style.setProperty('--app-banner-h', banner.value ? `${height.value}px` : '0px')
  })

  onScopeDispose(() => {
    if (!IN_BROWSER) return
    document.documentElement.style.removeProperty('--app-banner-h')
  })
</script>

<template>
  <Atom
    v-if="banner"
    :as
    class="flex items-center fixed inset-x-0 top-0 z-1 overflow-hidden"
    :class="colored ? 'text-white' : 'text-on-primary bg-primary'"
    :style="barStyle"
  >
    <img
      v-if="image"
      alt=""
      class="absolute inset-0 w-full h-full object-cover pointer-events-none"
      :src="image"
      :style="blur ? { filter: `blur(${blur}px)` } : undefined"
    >

    <div
      v-if="image"
      class="absolute inset-0 bg-black/40 pointer-events-none"
    />

    <div class="relative z-1 flex items-center gap-3 w-full px-4 min-w-0">
      <img
        v-if="logo"
        alt=""
        class="object-contain shrink-0"
        :class="height >= 56 ? 'h-10 w-10' : 'h-4 w-4'"
        :src="logo"
      >

      <AppIcon
        v-else
        class="shrink-0"
        icon="vuetify-0"
        :size="height >= 56 ? 20 : 14"
      />

      <div class="min-w-0 flex-1 text-center">
        <a
          v-if="href && external && !linkText"
          class="block truncate font-medium underline underline-offset-2"
          :class="height >= 56 ? 'text-sm' : 'text-xs'"
          :href
          rel="noopener noreferrer"
          target="_blank"
        >
          {{ text }}
        </a>

        <RouterLink
          v-else-if="href && !linkText"
          class="block truncate font-medium underline underline-offset-2"
          :class="height >= 56 ? 'text-sm' : 'text-xs'"
          :to="href"
        >
          {{ text }}
        </RouterLink>

        <div v-else class="truncate font-medium" :class="height >= 56 ? 'text-sm' : 'text-xs'">
          {{ text }}
        </div>

        <div v-if="subtext && height >= 48" class="truncate text-xs opacity-80">
          {{ subtext }}
        </div>
      </div>

      <a
        v-if="href && linkText && external"
        class="shrink-0 rounded px-2.5 py-1 text-xs font-medium bg-white/20 hover:bg-white/30"
        :href
        rel="noopener noreferrer"
        target="_blank"
      >
        {{ linkText }}
      </a>

      <RouterLink
        v-else-if="href && linkText"
        class="shrink-0 rounded px-2.5 py-1 text-xs font-medium bg-white/20 hover:bg-white/30"
        :to="href"
      >
        {{ linkText }}
      </RouterLink>

      <div v-if="closable" class="flex items-center gap-2 shrink-0">
        <Button.Root
          aria-label="Snooze banner for a week"
          class="opacity-60 hover:opacity-100 transition-opacity"
          @click="onSnooze"
        >
          <AppIcon icon="clock" :size="12" />
        </Button.Root>

        <Button.Root
          aria-label="Dismiss banner"
          class="opacity-60 hover:opacity-100 transition-opacity"
          @click="onDismiss"
        >
          <AppIcon icon="close" :size="12" />
        </Button.Root>
      </div>
    </div>
  </Atom>
</template>
