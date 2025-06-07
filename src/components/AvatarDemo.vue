<template>
  <div class="p-6 space-y-8">
    <h2 class="text-2xl font-bold text-gray-800">VAvatar Component Demo</h2>

    <!-- Basic Avatar with Image -->
    <div class="space-y-4">
      <h3 class="text-lg font-semibold text-gray-700">Basic Avatar with Image</h3>
      <div class="flex items-center space-x-4">
        <VAvatarRoot class="w-10 h-10 rounded-full overflow-hidden inline-flex items-center justify-center bg-gray-100">
          <VAvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face" />
          <VAvatarFallback class="text-sm font-medium text-gray-600">JD</VAvatarFallback>
        </VAvatarRoot>

        <VAvatarRoot class="w-12 h-12 rounded-full overflow-hidden inline-flex items-center justify-center bg-gray-100">
          <VAvatarImage src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=150&h=150&fit=crop&crop=face" />
          <VAvatarFallback class="text-base font-medium text-gray-600">SM</VAvatarFallback>
        </VAvatarRoot>

        <VAvatarRoot class="w-15 h-15 rounded-full overflow-hidden inline-flex items-center justify-center bg-gray-100">
          <VAvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face" />
          <VAvatarFallback class="text-lg font-medium text-gray-600">AB</VAvatarFallback>
        </VAvatarRoot>
      </div>
    </div>

    <!-- Fallback Only Avatars -->
    <div class="space-y-4">
      <h3 class="text-lg font-semibold text-gray-700">Fallback Avatars (No Image)</h3>
      <div class="flex items-center space-x-4">
        <VAvatarRoot class="w-10 h-10 rounded-full overflow-hidden inline-flex items-center justify-center bg-blue-100">
          <VAvatarFallback class="text-sm font-medium text-blue-700">JD</VAvatarFallback>
        </VAvatarRoot>

        <VAvatarRoot class="w-12 h-12 rounded-full overflow-hidden inline-flex items-center justify-center bg-purple-100">
          <VAvatarFallback class="text-base font-medium text-purple-700">SM</VAvatarFallback>
        </VAvatarRoot>

        <VAvatarRoot class="w-15 h-15 rounded-full overflow-hidden inline-flex items-center justify-center bg-green-100">
          <VAvatarFallback class="text-lg font-medium text-green-700">AB</VAvatarFallback>
        </VAvatarRoot>
      </div>
    </div>

    <!-- Broken Image Fallback -->
    <div class="space-y-4">
      <h3 class="text-lg font-semibold text-gray-700">Broken Image Fallback</h3>
      <div class="flex items-center space-x-4">
        <VAvatarRoot class="w-12 h-12 rounded-full overflow-hidden inline-flex items-center justify-center bg-red-50">
          <VAvatarImage src="https://broken-url-that-does-not-exist.jpg" />
          <VAvatarFallback class="text-base font-medium text-red-600">?</VAvatarFallback>
        </VAvatarRoot>

        <VAvatarRoot class="w-12 h-12 rounded-full overflow-hidden inline-flex items-center justify-center bg-orange-50">
          <VAvatarImage src="invalid-image.png" />
          <VAvatarFallback class="text-base font-medium text-orange-600">!</VAvatarFallback>
        </VAvatarRoot>
      </div>
    </div>

    <!-- Different Shapes -->
    <div class="space-y-4">
      <h3 class="text-lg font-semibold text-gray-700">Different Shapes</h3>
      <div class="flex items-center space-x-4">
        <!-- Square Avatar -->
        <VAvatarRoot class="w-12 h-12 rounded-lg overflow-hidden inline-flex items-center justify-center bg-gray-100">
          <VAvatarImage src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face" />
          <VAvatarFallback class="text-base font-medium text-gray-600">SQ</VAvatarFallback>
        </VAvatarRoot>

        <!-- Rounded Rectangle -->
        <VAvatarRoot class="w-15 h-10 rounded-xl overflow-hidden inline-flex items-center justify-center bg-gray-100">
          <VAvatarImage src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=100&fit=crop&crop=face" />
          <VAvatarFallback class="text-sm font-medium text-gray-600">RR</VAvatarFallback>
        </VAvatarRoot>
      </div>
    </div>

    <!-- Large Avatars -->
    <div class="space-y-4">
      <h3 class="text-lg font-semibold text-gray-700">Large Avatars</h3>
      <div class="flex items-center space-x-6">
        <VAvatarRoot class="w-20 h-20 rounded-full overflow-hidden inline-flex items-center justify-center bg-gray-100 border-3 border-gray-300">
          <VAvatarImage src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face" />
          <VAvatarFallback class="text-xl font-medium text-gray-600">LG</VAvatarFallback>
        </VAvatarRoot>

        <VAvatarRoot class="w-25 h-25 rounded-full overflow-hidden inline-flex items-center justify-center bg-gray-100 border-4 border-gray-300">
          <VAvatarImage src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face" />
          <VAvatarFallback class="text-2xl font-medium text-gray-600">XL</VAvatarFallback>
        </VAvatarRoot>
      </div>
    </div>

    <!-- Custom Content in Fallback -->
    <div class="space-y-4">
      <h3 class="text-lg font-semibold text-gray-700">Custom Fallback Content</h3>
      <div class="flex items-center space-x-4">
        <VAvatarRoot class="w-12 h-12 rounded-full overflow-hidden inline-flex items-center justify-center bg-gray-100">
          <VAvatarFallback>
            <User />
          </VAvatarFallback>
        </VAvatarRoot>

        <VAvatarRoot class="w-12 h-12 rounded-full overflow-hidden inline-flex items-center justify-center bg-gray-100">
          <VAvatarFallback>
            <div class="text-xl">🎭</div>
          </VAvatarFallback>
        </VAvatarRoot>

        <VAvatarRoot class="w-12 h-12 rounded-full overflow-hidden inline-flex items-center justify-center bg-gray-100">
          <VAvatarFallback>
            <div class="w-5 h-5 bg-green-500 rounded-full" />
          </VAvatarFallback>
        </VAvatarRoot>

        <VAvatarRoot class="w-12 h-12 rounded-full overflow-hidden inline-flex items-center justify-center bg-gray-100">
          <VAvatarFallback>
            <Icon icon="ph:user-bold" width="20" />
          </VAvatarFallback>
        </VAvatarRoot>
      </div>
    </div>

    <!-- CSS Mask Smooth Corners -->
    <div class="space-y-4">
      <h3 class="text-lg font-semibold text-gray-700">CSS Mask Smooth Corners</h3>
      <div class="flex items-center space-x-4">
        <!-- Smooth rounded square -->
        <VAvatarRoot class="w-12 h-12 inline-flex items-center justify-center bg-gray-100 smooth-corners">
          <VAvatarImage src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face" />
          <VAvatarFallback class="text-base font-medium text-gray-600">SC</VAvatarFallback>
        </VAvatarRoot>

        <!-- Smooth rounded rectangle -->
        <VAvatarRoot class="w-15 h-10 inline-flex items-center justify-center bg-gray-100 smooth-corners smooth-corners-rect">
          <VAvatarImage src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=100&fit=crop&crop=face" />
          <VAvatarFallback class="text-sm font-medium text-gray-600">SR</VAvatarFallback>
        </VAvatarRoot>

        <!-- Large smooth corners -->
        <VAvatarRoot class="w-16 h-16 inline-flex items-center justify-center bg-gray-100 smooth-corners smooth-corners-large">
          <VAvatarImage src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face" />
          <VAvatarFallback class="text-lg font-medium text-gray-600">LG</VAvatarFallback>
        </VAvatarRoot>

        <!-- Ultra smooth corners -->
        <VAvatarRoot class="w-12 h-12 inline-flex items-center justify-center bg-gray-100 smooth-corners ultra-smooth-corners">
          <VAvatarImage src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face" />
          <VAvatarFallback class="text-base font-medium text-gray-600">US</VAvatarFallback>
        </VAvatarRoot>
      </div>
    </div>

    <!-- Avatar Group -->
    <div class="space-y-4">
      <h3 class="text-lg font-semibold text-gray-700">Avatar Group</h3>
      <div class="flex items-center">
        <VAvatarRoot class="w-10 h-10 rounded-full overflow-hidden inline-flex items-center justify-center bg-gray-100 border-2 border-white -ml-2 z-40">
          <VAvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face" />
          <VAvatarFallback class="text-sm font-medium text-gray-600">A</VAvatarFallback>
        </VAvatarRoot>

        <VAvatarRoot class="w-10 h-10 rounded-full overflow-hidden inline-flex items-center justify-center bg-gray-100 border-2 border-white -ml-2 z-30">
          <VAvatarImage src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face" />
          <VAvatarFallback class="text-sm font-medium text-gray-600">B</VAvatarFallback>
        </VAvatarRoot>

        <VAvatarRoot class="w-10 h-10 rounded-full overflow-hidden inline-flex items-center justify-center bg-gray-100 border-2 border-white -ml-2 z-20">
          <VAvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face" />
          <VAvatarFallback class="text-sm font-medium text-gray-600">C</VAvatarFallback>
        </VAvatarRoot>

        <VAvatarRoot class="w-10 h-10 rounded-full overflow-hidden inline-flex items-center justify-center bg-gray-300 border-2 border-white -ml-2 z-10">
          <VAvatarFallback class="text-xs font-medium text-gray-600">+3</VAvatarFallback>
        </VAvatarRoot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { Icon } from '@iconify/vue'
  import { User } from 'lucide-vue-next'
  import { VAvatarFallback, VAvatarImage, VAvatarRoot } from '../../lib'
</script>

<style>
.smooth-corners  {
  --smooth-corners: 5;
  mask-image: paint(smooth-corners);
  -webkit-mask-image: paint(smooth-corners);
}

.smooth-corners.smooth-corners-large {
  --smooth-corners: 3;
}

.smooth-corners.ultra-smooth-corners {
  --smooth-corners: 2.6;
}
</style>
