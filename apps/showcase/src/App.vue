<script setup lang="ts">
  import {
    HxAppBar, HxAppBarEnd, HxAppBarStart,
    HxAppMain, HxAppNav, HxDocLayout,
    HxDropdown, HxDropdownContent, HxDropdownTrigger,
    HxKbd, HxSearch, HxSettings,
    HxSettingsSection, HxSettingsSectionTitle,
    HxSettingsToggle, HxSettingsToggleLabel,
    HxThemeToggle, HxToc,
  } from '@paper/helix'

  // Components
  import ShowcaseNav from './components/ShowcaseNav.vue'

  // Utilities
  import { toRef } from 'vue'
  import { useRoute } from 'vue-router'

  const route = useRoute()
  const showToc = toRef(() => {
    const { ds, component, composable } = route.params
    return !!ds && (!!component || !!composable)
  })
</script>

<template>
  <HxDocLayout>
    <HxAppBar class="bg-surface border-b border-divider px-4">
      <HxAppBarStart>
        <router-link class="font-bold text-lg text-on-surface" to="/">Paper Showcase</router-link>
      </HxAppBarStart>
      <HxAppBarEnd class="flex items-center gap-2">
        <HxSearch>
          <HxKbd>⌘K</HxKbd>
        </HxSearch>
        <HxDropdown>
          <HxDropdownTrigger />
          <HxDropdownContent>
            <HxSettings>
              <HxSettingsSection>
                <HxSettingsSectionTitle>Appearance</HxSettingsSectionTitle>
                <HxSettingsToggle>
                  <HxSettingsToggleLabel>Compact mode</HxSettingsToggleLabel>
                </HxSettingsToggle>
              </HxSettingsSection>
            </HxSettings>
          </HxDropdownContent>
        </HxDropdown>
        <HxThemeToggle />
      </HxAppBarEnd>
    </HxAppBar>

    <HxAppNav class="bg-surface border-r border-divider pt-14 px-2">
      <ShowcaseNav />
    </HxAppNav>

    <HxAppMain class="pt-16 px-8">
      <router-view />
    </HxAppMain>

    <HxToc v-if="showToc" class="pt-14" />
  </HxDocLayout>
</template>
