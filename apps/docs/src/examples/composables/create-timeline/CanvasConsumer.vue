<script setup lang="ts">
  import { onMounted, shallowRef, useTemplateRef, watchEffect } from 'vue'
  import { useCanvas } from './context'
  import type { Point, Stroke } from './context'

  const { strokes, size, canUndo, canRedo, add, undo, redo, clear } = useCanvas()

  const canvasRef = useTemplateRef<HTMLCanvasElement>('canvas')
  const isDrawing = shallowRef(false)
  const currentStroke = shallowRef<Stroke>([])
  const strokeColor = shallowRef('#6366f1')

  onMounted(() => {
    const primary = getComputedStyle(document.documentElement).getPropertyValue('--v0-primary').trim()
    if (primary) strokeColor.value = primary
  })

  watchEffect(() => {
    const _ = strokes.value
    render()
  })

  function getPos (e: MouseEvent | TouchEvent): Point {
    const el = canvasRef.value!
    const rect = el.getBoundingClientRect()
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
    const scaleX = el.width / rect.width
    const scaleY = el.height / rect.height
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    }
  }

  function startDraw (e: MouseEvent | TouchEvent) {
    isDrawing.value = true
    currentStroke.value = [getPos(e)]
  }

  function draw (e: MouseEvent | TouchEvent) {
    if (!isDrawing.value) return
    currentStroke.value.push(getPos(e))
    render()
  }

  function endDraw () {
    if (!isDrawing.value || currentStroke.value.length < 2) {
      isDrawing.value = false
      return
    }
    add(currentStroke.value)
    currentStroke.value = []
    isDrawing.value = false
  }

  function render () {
    const ctx = canvasRef.value?.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, 600, 400)
    ctx.strokeStyle = strokeColor.value
    ctx.lineWidth = 4
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    for (const stroke of strokes.value) {
      if (stroke.length < 2) continue
      ctx.beginPath()
      ctx.moveTo(stroke[0].x, stroke[0].y)
      for (let index = 1; index < stroke.length; index++) {
        ctx.lineTo(stroke[index].x, stroke[index].y)
      }
      ctx.stroke()
    }

    if (currentStroke.value.length > 1) {
      ctx.beginPath()
      ctx.moveTo(currentStroke.value[0].x, currentStroke.value[0].y)
      for (let index = 1; index < currentStroke.value.length; index++) {
        ctx.lineTo(currentStroke.value[index].x, currentStroke.value[index].y)
      }
      ctx.stroke()
    }
  }
</script>

<template>
  <div class="flex flex-col gap-3">
    <div class="flex gap-2 items-center">
      <button
        class="px-3 py-1 border border-divider rounded transition-opacity"
        :class="canUndo ? 'hover:bg-surface-tint' : 'opacity-40 cursor-not-allowed'"
        :disabled="!canUndo"
        @click="undo"
      >
        Undo
      </button>
      <button
        class="px-3 py-1 border border-divider rounded transition-opacity"
        :class="canRedo ? 'hover:bg-surface-tint' : 'opacity-40 cursor-not-allowed'"
        :disabled="!canRedo"
        @click="redo"
      >
        Redo
      </button>
      <button
        class="px-3 py-1 border border-divider rounded hover:bg-surface-tint"
        @click="clear"
      >
        Clear
      </button>
      <span class="ml-auto text-sm text-on-surface opacity-60">
        {{ size }} strokes
      </span>
    </div>

    <canvas
      ref="canvas"
      class="w-full aspect-[3/2] border border-divider rounded cursor-crosshair bg-surface touch-none"
      height="400"
      width="600"
      @mousedown="startDraw"
      @mouseleave="endDraw"
      @mousemove="draw"
      @mouseup="endDraw"
      @touchend="endDraw"
      @touchmove.prevent="draw"
      @touchstart.prevent="startDraw"
    />

    <div class="flex gap-1 h-2">
      <div
        v-for="index in 20"
        :key="index"
        class="flex-1 rounded-sm transition-all duration-200"
        :class="index <= size ? 'bg-primary' : 'bg-divider'"
      />
    </div>
  </div>
</template>
