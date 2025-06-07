<template>
  <div class="p-6 space-y-8">
    <h2 class="text-2xl font-bold text-gray-800">VAvatar API Demo (Vuetify-like)</h2>

    <!-- Basic Usage -->
    <div class="space-y-4">
      <h3 class="text-lg font-semibold text-gray-700">Basic Usage</h3>
      <div class="flex items-center space-x-4">
        <VAvatar image="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face" />
        <VAvatar text="JD" />
        <VAvatar icon="ph:user-bold" />
        <VAvatar>
          <User />
        </VAvatar>
      </div>
    </div>

    <!-- Sizes -->
    <div class="space-y-4">
      <h3 class="text-lg font-semibold text-gray-700">Sizes</h3>
      <div class="flex items-center space-x-4">
        <VAvatar size="x-small" text="XS" />
        <VAvatar size="small" text="S" />
        <VAvatar size="default" text="D" />
        <VAvatar size="large" text="L" />
        <VAvatar size="x-large" text="XL" />
        <VAvatar :size="64" text="64" />
        <VAvatar size="80px" text="80" />
      </div>
    </div>

    <!-- Colors -->
    <div class="space-y-4">
      <h3 class="text-lg font-semibold text-gray-700">Colors</h3>
      <div class="flex items-center space-x-4">
        <VAvatar color="primary" text="P" />
        <VAvatar color="secondary" text="S" />
        <VAvatar color="success" text="✓" />
        <VAvatar color="warning" text="!" />
        <VAvatar color="error" text="✗" />
        <VAvatar color="info" text="i" />
      </div>
    </div>

    <!-- Variants -->
    <div class="space-y-4">
      <h3 class="text-lg font-semibold text-gray-700">Variants</h3>
      <div class="flex items-center space-x-4">
        <VAvatar text="F" variant="flat" />
        <VAvatar text="E" variant="elevated" />
        <VAvatar text="O" variant="outlined" />
        <VAvatar text="T" variant="text" />
        <VAvatar color="primary" text="T" variant="tonal" />
        <VAvatar text="P" variant="plain" />
      </div>
    </div>

    <!-- Rounded -->
    <div class="space-y-4">
      <h3 class="text-lg font-semibold text-gray-700">Rounded & Tile</h3>
      <div class="flex items-center space-x-4">
        <VAvatar rounded="none" text="N" />
        <VAvatar rounded="xs" text="XS" />
        <VAvatar rounded="sm" text="SM" />
        <VAvatar rounded="md" text="MD" />
        <VAvatar rounded="lg" text="LG" />
        <VAvatar rounded="xl" text="XL" />
        <VAvatar rounded="full" text="F" />
        <VAvatar text="T" tile />
      </div>
    </div>

    <!-- Border -->
    <div class="space-y-4">
      <h3 class="text-lg font-semibold text-gray-700">Border</h3>
      <div class="flex items-center space-x-4">
        <VAvatar border text="B" />
        <VAvatar border="sm" text="SM" />
        <VAvatar border="md" text="MD" />
        <VAvatar border="lg" text="LG" />
        <VAvatar :border="8" text="8" />
      </div>
    </div>

    <!-- Density -->
    <div class="space-y-4">
      <h3 class="text-lg font-semibold text-gray-700">Density</h3>
      <div class="flex items-center space-x-4">
        <VAvatar density="compact" text="C" variant="outlined" />
        <VAvatar density="comfortable" text="Co" variant="outlined" />
        <VAvatar density="default" text="D" variant="outlined" />
      </div>
    </div>

    <!-- Image with Fallback -->
    <div class="space-y-4">
      <h3 class="text-lg font-semibold text-gray-700">Image with Fallback</h3>
      <div class="flex items-center space-x-4">
        <VAvatar
          image="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
          text="JD"
        />
        <VAvatar
          color="error"
          image="https://broken-url.jpg"
          text="FB"
        />
        <VAvatar
          :delay-ms="1000"
          icon="ph:user-bold"
          image="https://slow-loading-image.jpg"
        />
      </div>
    </div>

    <!-- Complex Examples -->
    <div class="space-y-4">
      <h3 class="text-lg font-semibold text-gray-700">Complex Examples</h3>
      <div class="flex items-center space-x-4">
        <VAvatar
          border="md"
          color="primary"
          size="large"
          text="CEO"
          variant="elevated"
        />
        <VAvatar
          color="success"
          icon="ph:check-bold"
          rounded="lg"
          size="x-large"
          variant="tonal"
        />
        <VAvatar
          color="warning"
          :size="56"
          tile
          variant="outlined"
        >
          <div class="text-xl">🎭</div>
        </VAvatar>
      </div>
    </div>

    <!-- Avatar Group -->
    <div class="space-y-4">
      <h3 class="text-lg font-semibold text-gray-700">Avatar Group</h3>
      <div class="flex items-center">
        <VAvatar
          border="md"
          class="border-white -ml-2 z-40"
          image="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
        />
        <VAvatar
          border="md"
          class="border-white -ml-2 z-30"
          image="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face"
        />
        <VAvatar
          border="md"
          class="border-white -ml-2 z-20"
          image="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
        />
        <VAvatar
          border="md"
          class="border-white -ml-2 z-10"
          color="secondary"
          text="+3"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { User } from 'lucide-vue-next'
  import VAvatar from './VAvatar.vue'
</script>
