<script setup lang="ts">
  // Framework
  import { useResizeObserver } from '@vuetify/v0'

  // Composables
  import { useThemeToggle } from '@/composables/useThemeToggle'

  // Utilities
  import { onMounted, useTemplateRef, watch } from 'vue'

  const {
    curvature = 0,
    density = 20,
    intensity = 0.85,
    coverage = 15,
  } = defineProps<{
    /** -100..100. Bends the flat dot grid onto a sphere; the sign flips convex/concave, 0 is flat. */
    curvature?: number
    /** Grid spacing, in px. */
    density?: number
    /** Connecting-line alpha, as a percentage. */
    intensity?: number
    /** Percentage of the radius kept solid before the edge vignette fades out. */
    coverage?: number
  }>()

  const toggle = useThemeToggle()
  const canvas = useTemplateRef<HTMLCanvasElement>('canvas')

  function draw () {
    const el = canvas.value
    if (!el) return

    const ctx = el.getContext('2d')
    if (!ctx) return

    const rect = el.getBoundingClientRect()
    const w = rect.width
    const h = rect.height
    if (w === 0 || h === 0) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    el.width = Math.round(w * dpr)
    el.height = Math.round(h * dpr)
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, w, h)

    const ink = getComputedStyle(el).getPropertyValue('--v0-on-background').trim() || '#000'
    // Slightly bolder than the flat grid's 0.12 — the sphere is a deliberate
    // opt-in, so it should read rather than hide.
    const dotAlpha = toggle.isDark.value ? 0.16 : 0.2
    const lineAlpha = Math.max(0, intensity) / 100

    // Pole anchored to the top-right corner (matching the flat grid's diagonal
    // fade) so the sphere fans out across the viewport toward the bottom-left,
    // rather than doming from the centre.
    const cx = w
    const cy = 0
    // Full diagonal, so at max coverage the field reaches the far corner.
    const screenR = Math.hypot(w, h)

    const t = Math.max(-100, Math.min(100, curvature)) / 100
    const amt = Math.abs(t)

    const half = Math.ceil(screenR / density) + 1
    const gridR = half * density
    // Coverage (0..60 from the UI) sets how far the dome stays solid before it
    // fades out — the radial analogue of the flat grid's fade distance. Mapped
    // across most of the radius so the visible field clearly grows/shrinks
    // rather than only nudging a faint outer band.
    const edge = 0.3 + Math.max(0, Math.min(60, coverage)) / 60 * 0.95
    const band = 0.18

    // Bend a flat node onto the sphere: distance from centre becomes an arc
    // angle, so equal grid steps compress toward the rim (a sheet wrapping over
    // a ball). `depth` is the surface z — 1 at the pole, 0 at the silhouette.
    function project (gx: number, gy: number) {
      const nx = gx / gridR
      const ny = gy / gridR
      const r = Math.hypot(nx, ny)
      if (r === 0) return { x: cx, y: cy, depth: 1, vignette: 1 }
      const angle = Math.min(r, 1) * Math.PI / 2
      const sphere = t >= 0 ? Math.sin(angle) : 1 - Math.cos(angle)
      const rp = r * (1 - amt) + sphere * amt
      const x = cx + (nx / r) * rp * screenR
      const y = cy + (ny / r) * rp * screenR
      const d = Math.hypot(x - cx, y - cy) / screenR
      const vignette = 1 - clamp01((d - (edge - band)) / band)
      return { x, y, depth: Math.cos(angle), vignette }
    }

    // Warped mesh — connecting lines between adjacent nodes read as the
    // curving latitude/longitude of a globe.
    // Only the quadrant left-of and below the corner is on-screen (nx <= 0,
    // ny >= 0), so iterate just that span instead of the full grid.
    if (lineAlpha > 0) {
      ctx.strokeStyle = ink
      ctx.lineWidth = 1
      for (let i = -half; i <= 0; i++) {
        for (let j = 0; j <= half; j++) {
          const a = project(i * density, j * density)
          if (i < 0) stroke(ctx, a, project((i + 1) * density, j * density), lineAlpha, amt)
          if (j < half) stroke(ctx, a, project(i * density, (j + 1) * density), lineAlpha, amt)
        }
      }
    }

    // Dots — shrink and dim toward the rim so the field reads as a curved
    // surface, not a flat pattern.
    ctx.fillStyle = ink
    for (let i = -half; i <= 0; i++) {
      for (let j = 0; j <= half; j++) {
        const p = project(i * density, j * density)
        if (p.vignette <= 0) continue
        const depth = 1 - amt + p.depth * amt
        ctx.globalAlpha = dotAlpha * depth * p.vignette
        ctx.beginPath()
        ctx.arc(p.x, p.y, Math.max(0.5, depth * 1.5), 0, Math.PI * 2)
        ctx.fill()
      }
    }
    ctx.globalAlpha = 1
  }

  function stroke (
    ctx: CanvasRenderingContext2D,
    a: { x: number, y: number, depth: number, vignette: number },
    b: { x: number, y: number, depth: number, vignette: number },
    lineAlpha: number,
    amt: number,
  ) {
    const vignette = Math.min(a.vignette, b.vignette)
    if (vignette <= 0) return
    const depth = 1 - amt + ((a.depth + b.depth) / 2) * amt
    ctx.globalAlpha = lineAlpha * depth * vignette
    ctx.beginPath()
    ctx.moveTo(a.x, a.y)
    ctx.lineTo(b.x, b.y)
    ctx.stroke()
  }

  function clamp01 (value: number) {
    return Math.max(0, Math.min(1, value))
  }

  useResizeObserver(canvas, draw)
  watch(() => [curvature, density, intensity, coverage, toggle.isDark.value], draw)
  onMounted(draw)
</script>

<template>
  <canvas
    ref="canvas"
    aria-hidden="true"
    class="dot-sphere"
  />
</template>

<style scoped>
  .dot-sphere {
    width: 100%;
    height: 100%;
    display: block;
    pointer-events: none;
  }
</style>
