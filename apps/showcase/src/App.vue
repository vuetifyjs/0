<script setup lang="ts">
  import {
    CxAppBar, CxAppBarEnd, CxAppBarStart,
    CxAppMain, CxAppNav, CxDocLayout,
  } from '@paper/codex'

  // Components
  import ShowcaseNav from './components/ShowcaseNav.vue'
</script>

<template>
  <CxDocLayout>
    <CxAppBar class="bg-surface border-b border-divider px-4">
      <CxAppBarStart>
        <router-link class="font-bold text-lg text-on-surface" to="/">Paper Showcase</router-link>
      </CxAppBarStart>
      <CxAppBarEnd />
    </CxAppBar>

    <CxAppNav class="bg-surface border-r border-divider pt-14 px-2">
      <ShowcaseNav />
    </CxAppNav>

    <CxAppMain class="pt-16 px-8">
      <router-view />
    </CxAppMain>
  </CxDocLayout>
</template>
