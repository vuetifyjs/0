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
    <CxAppBar>
      <CxAppBarStart>
        <router-link class="font-bold text-lg" to="/">Paper Showcase</router-link>
      </CxAppBarStart>
      <CxAppBarEnd />
    </CxAppBar>

    <CxAppNav>
      <ShowcaseNav />
    </CxAppNav>

    <CxAppMain>
      <router-view />
    </CxAppMain>
  </CxDocLayout>
</template>
