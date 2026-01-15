<script setup lang="ts">
  import { createTimeline, useProxyRegistry } from '@vuetify/v0'
  import { onMounted, shallowRef, toRef, watchEffect } from 'vue'

  type Point = { x: number, y: number }
  type Stroke = Point[]

  const timeline = createTimeline<{ id: string, value: Stroke }>({ size: 20, events: true })
  const proxy = useProxyRegistry(timeline)

  const canvas = shallowRef<HTMLCanvasElement>()
  const colorRef = shallowRef<HTMLDivElement>()
  const isDrawing = shallowRef(false)
  const currentStroke = shallowRef<Stroke>([])
  const strokeColor = shallowRef('#6366f1')

  const redoStackSize = shallowRef(0)
  const canUndo = toRef(() => proxy.size > 0)
  const canRedo = toRef(() => redoStackSize.value > 0)

  onMounted(() => {
    if (colorRef.value) {
      strokeColor.value = getComputedStyle(colorRef.value).backgroundColor
    }
  })

  watchEffect(() => {
    // Track proxy.values for reactive re-rendering
    const _ = proxy.values
    render()
  })

  function getPos (e: MouseEvent | TouchEvent): Point {
    const el = canvas.value!
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
    timeline.register({ value: [...currentStroke.value] })
    redoStackSize.value = 0
    currentStroke.value = []
    isDrawing.value = false
  }

  function render () {
    const ctx = canvas.value?.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, 600, 400)
    ctx.strokeStyle = strokeColor.value
    ctx.lineWidth = 4
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    for (const { value: stroke } of proxy.values) {
      if (stroke.length < 2) continue
      ctx.beginPath()
      ctx.moveTo(stroke[0].x, stroke[0].y)
      for (let i = 1; i < stroke.length; i++) {
        ctx.lineTo(stroke[i].x, stroke[i].y)
      }
      ctx.stroke()
    }

    if (currentStroke.value.length > 1) {
      ctx.beginPath()
      ctx.moveTo(currentStroke.value[0].x, currentStroke.value[0].y)
      for (let i = 1; i < currentStroke.value.length; i++) {
        ctx.lineTo(currentStroke.value[i].x, currentStroke.value[i].y)
      }
      ctx.stroke()
    }
  }

  function undo () {
    if (proxy.size === 0) return
    timeline.undo()
    redoStackSize.value++
  }

  function redo () {
    if (redoStackSize.value === 0) return
    timeline.redo()
    redoStackSize.value--
  }

  function clear () {
    timeline.clear()
    redoStackSize.value = 0
  }
</script>

<template>
  <div class="flex flex-col gap-3">
    <!-- Hidden element to get primary color -->
    <div ref="colorRef" class="hidden bg-primary" />

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
        {{ proxy.size }} strokes
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
        v-for="i in 20"
        :key="i"
        class="flex-1 rounded-sm transition-all duration-200"
        :class="i <= proxy.size ? 'bg-primary' : 'bg-divider'"
      />
    </div>
  </div>
</template>
