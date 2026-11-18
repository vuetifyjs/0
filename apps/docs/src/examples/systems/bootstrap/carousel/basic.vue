<script setup lang="ts">
  import { BButton, BCarousel, BCarouselItem } from '@paper/bootstrap'

  import { shallowRef } from 'vue'

  const index = shallowRef(0)

  const slides = [
    { label: 'First slide', fill: '#777', text: '#555' },
    { label: 'Second slide', fill: '#666', text: '#444' },
    { label: 'Third slide', fill: '#555', text: '#333' },
  ]
</script>

<template>
  <BCarousel v-model="index" inner-class="rounded-5">
    <template #controls="{ next, prev }">
      <div class="d-flex justify-content-between align-items-center">
        <h5 class="mb-0">Top controls</h5>

        <div>
          <BButton
            icon
            size="sm"
            @click="prev"
          >
            <span aria-hidden="true" class="carousel-icon-prev" />
            <span class="visually-hidden">Previous</span>
          </BButton>

          <BButton
            icon
            size="sm"
            @click="next"
          >
            <span aria-hidden="true" class="carousel-icon-next" />
            <span class="visually-hidden">Next</span>
          </BButton>
        </div>
      </div>
    </template>

    <BCarouselItem
      v-for="slide in slides"
      :key="slide.label"
    >
      <svg
        :aria-label="`Placeholder: ${slide.label}`"
        class="d-block w-100"
        height="400"
        preserveAspectRatio="xMidYMid slice"
        role="img"
        width="800"
        xmlns="http://www.w3.org/2000/svg"
      >
        <title>Placeholder</title>

        <rect
          :fill="slide.fill"
          height="100%"
          width="100%"
        />

        <text
          dy=".3em"
          :fill="slide.text"
          font-size="48"
          text-anchor="middle"
          x="50%"
          y="50%"
        >
          {{ slide.label }}
        </text>
      </svg>
    </BCarouselItem>
  </BCarousel>
</template>
