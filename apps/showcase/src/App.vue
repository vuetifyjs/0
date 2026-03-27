<script setup lang="ts">
  import {
    CxAppBar, CxAppBarEnd, CxAppBarStart,
    CxAppMain, CxAppNav, CxDocLayout,
    CxDropdown, CxDropdownContent, CxDropdownTrigger,
    CxKbd, CxSearch, CxSettings,
    CxSettingsSection, CxSettingsSectionTitle,
    CxSettingsToggle, CxSettingsToggleLabel,
    CxThemeToggle, CxToc,
  } from '@paper/codex'

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
  <CxDocLayout>
    <CxAppBar class="bg-surface border-b border-divider px-4">
      <CxAppBarStart>
        <router-link class="font-bold text-lg text-on-surface" to="/">Paper Showcase</router-link>
      </CxAppBarStart>
      <CxAppBarEnd class="flex items-center gap-2">
        <CxSearch>
          <CxKbd>⌘K</CxKbd>
        </CxSearch>
        <CxDropdown>
          <CxDropdownTrigger />
          <CxDropdownContent>
            <CxSettings>
              <CxSettingsSection>
                <CxSettingsSectionTitle>Appearance</CxSettingsSectionTitle>
                <CxSettingsToggle>
                  <CxSettingsToggleLabel>Compact mode</CxSettingsToggleLabel>
                </CxSettingsToggle>
              </CxSettingsSection>
            </CxSettings>
          </CxDropdownContent>
        </CxDropdown>
        <CxThemeToggle />
      </CxAppBarEnd>
    </CxAppBar>

    <CxAppNav class="bg-surface border-r border-divider pt-14 px-2">
      <ShowcaseNav />
    </CxAppNav>

    <CxAppMain class="pt-16 px-8">
      <router-view />
    </CxAppMain>

    <CxToc v-if="showToc" class="pt-14" />
  </CxDocLayout>
</template>
