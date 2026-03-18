<script setup lang="ts">
  import { shallowRef } from 'vue'
  import Grid from './Grid.vue'

  const palette = [
    { id: 'red-300', hex: '#e57373', label: 'Red 300' },
    { id: 'red-500', hex: '#f44336', label: 'Red 500' },
    { id: 'red-700', hex: '#d32f2f', label: 'Red 700' },
    { id: 'pink-300', hex: '#f06292', label: 'Pink 300' },
    { id: 'pink-500', hex: '#e91e63', label: 'Pink 500' },
    { id: 'pink-700', hex: '#c2185b', label: 'Pink 700' },
    { id: 'purple-300', hex: '#ba68c8', label: 'Purple 300' },
    { id: 'purple-500', hex: '#9c27b0', label: 'Purple 500' },
    { id: 'purple-700', hex: '#7b1fa2', label: 'Purple 700' },
    { id: 'indigo-300', hex: '#7986cb', label: 'Indigo 300' },
    { id: 'indigo-500', hex: '#3f51b5', label: 'Indigo 500' },
    { id: 'indigo-700', hex: '#303f9f', label: 'Indigo 700' },
    { id: 'blue-300', hex: '#64b5f6', label: 'Blue 300' },
    { id: 'blue-500', hex: '#2196f3', label: 'Blue 500' },
    { id: 'blue-700', hex: '#1976d2', label: 'Blue 700' },
    { id: 'teal-300', hex: '#4db6ac', label: 'Teal 300' },
    { id: 'teal-500', hex: '#009688', label: 'Teal 500' },
    { id: 'teal-700', hex: '#00796b', label: 'Teal 700' },
    { id: 'green-300', hex: '#81c784', label: 'Green 300' },
    { id: 'green-500', hex: '#4caf50', label: 'Green 500' },
    { id: 'green-700', hex: '#388e3c', label: 'Green 700' },
    { id: 'amber-300', hex: '#ffd54f', label: 'Amber 300' },
    { id: 'amber-500', hex: '#ffc107', label: 'Amber 500' },
    { id: 'amber-700', hex: '#ffa000', label: 'Amber 700' },
  ]

  const selected = shallowRef('blue-500')
</script>

<template>
  <div class="flex justify-center">
    <Grid v-model="selected" :columns="6" :swatches="palette" />
  </div>
</template>
