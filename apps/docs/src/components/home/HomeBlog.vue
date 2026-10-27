<script setup lang="ts">
  // Components
  import DocsBlogList from '@/components/docs/DocsBlogList.vue'
</script>

<template>
  <section id="home-blog" class="home-blog py-20 md:py-28">
    <div class="text-center mb-12">
      <p class="section-overline mb-3">VUETIFY BLOG</p>

      <h2 class="text-2xl md:text-4xl font-bold tracking-tight">
        Latest from the Vuetify blog
      </h2>
    </div>

    <DocsBlogList :limit="3" />

    <div class="flex items-center justify-center mt-8">
      <router-link
        class="text-sm font-medium text-primary hover:underline inline-flex items-center gap-1"
        to="/blog"
      >
        All posts
        <AppIcon icon="right" :size="12" />
      </router-link>
    </div>
  </section>
</template>
