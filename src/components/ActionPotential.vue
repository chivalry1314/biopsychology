<template>
  <div class="space-y-4">
    <div class="canvas-container">
      <canvas ref="canvas"></canvas>
    </div>
    <div class="flex flex-wrap items-center gap-4">
      <button
        @click="start"
        class="course-btn"
        :class="{ 'opacity-60 cursor-not-allowed': running }"
        :disabled="running"
      >
        {{ running ? 'Simulating...' : (progress === 0 ? 'Initiate Stimulus' : 'Repeat Stimulus') }}
      </button>
      <button
        @click="reset"
        class="course-btn border-white/10 text-slate-400 hover:text-white"
      >
        Reset
      </button>
      <label class="flex items-center gap-3 text-sm text-slate-400 cursor-pointer">
        <div class="relative">
          <input
            v-model="myelinated"
            type="checkbox"
            class="peer sr-only"
          />
          <div class="w-10 h-5 rounded-full border border-white/15 bg-white/5 peer-checked:bg-cyan-500/20 peer-checked:border-cyan-500/40 transition-all"></div>
          <div class="absolute left-1 top-1 w-3 h-3 rounded-full bg-slate-500 peer-checked:bg-cyan-400 peer-checked:translate-x-5 transition-all"></div>
        </div>
        Myelinated (saltatory conduction)
      </label>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const canvas = ref(null)
let ctx, width, height, container
let animationId, resizeObserver
const running = ref(false)
const progress = ref(0)
const myelinated = ref(false)
const duration = 180

const resize = () => {
  width = container.clientWidth
  height = container.clientHeight
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  canvas.value.width = width * dpr
  canvas.value.height = height * dpr
  canvas.value.style.width = width + 'px'
  canvas.value.style.height = height + 'px'
  ctx.setTransform(1, 0, 0, 1, 0, 0)
  ctx.scale(dpr, dpr)
}

const start = () => {
  running.value = true
  progress.value = 0
}

const reset = () => {
  running.value = false
  progress.value = 0
}

const draw = () => {
  if (!ctx) return
  ctx.clearRect(0, 0, width, height)
  const cy = height / 2
  const pad = 60
  const axonLength = width - pad * 2

  ctx.beginPath()
  ctx.moveTo(pad, cy)
  ctx.lineTo(width - pad, cy)
  ctx.strokeStyle = 'rgba(255,255,255,0.12)'
  ctx.lineWidth = 3
  ctx.stroke()

  const nodes = myelinated.value ? 5 : 0
  if (myelinated.value) {
    ctx.fillStyle = 'rgba(255,255,255,0.3)'
    for (let i = 0; i < nodes; i++) {
      const x = pad + (axonLength / (nodes - 1)) * i
      ctx.beginPath()
      ctx.arc(x, cy, 5, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.fillStyle = 'rgba(6, 182, 212, 0.15)'
    for (let i = 0; i < nodes - 1; i++) {
      const x1 = pad + (axonLength / (nodes - 1)) * i
      const x2 = pad + (axonLength / (nodes - 1)) * (i + 1)
      ctx.fillRect(x1 + 8, cy - 10, x2 - x1 - 16, 20)
    }
  }

  if (running.value) {
    const t = progress.value / duration
    let x
    if (myelinated.value) {
      const segment = Math.min(Math.floor(t * 4), 3)
      const localT = t * 4 - segment
      const x1 = pad + (axonLength / 4) * segment
      const x2 = pad + (axonLength / 4) * (segment + 1)
      x = x1 + (x2 - x1) * localT
    } else {
      x = pad + axonLength * t
    }

    ctx.beginPath()
    ctx.strokeStyle = '#f43f5e'
    ctx.lineWidth = 3
    for (let i = -60; i <= 60; i += 2) {
      const wx = x + i
      const wy = cy - 50 * Math.exp(-(i * i) / 400) * Math.sin((i + 60) * 0.1)
      if (i === -60) ctx.moveTo(wx, wy)
      else ctx.lineTo(wx, wy)
    }
    ctx.stroke()

    const grad = ctx.createRadialGradient(x, cy, 0, x, cy, 40)
    grad.addColorStop(0, 'rgba(244, 63, 94, 0.35)')
    grad.addColorStop(1, 'rgba(244, 63, 94, 0)')
    ctx.fillStyle = grad
    ctx.beginPath()
    ctx.arc(x, cy, 40, 0, Math.PI * 2)
    ctx.fill()

    progress.value++
    if (progress.value > duration) {
      running.value = false
      progress.value = duration
    }
  }

  ctx.fillStyle = 'rgba(255,255,255,0.4)'
  ctx.font = '13px Inter, sans-serif'
  ctx.fillText('Soma', 20, cy + 24)
  ctx.fillText('Axon terminal', width - 90, cy + 24)

  animationId = requestAnimationFrame(draw)
}

onMounted(() => {
  container = canvas.value.parentElement
  ctx = canvas.value.getContext('2d')
  resize()
  resizeObserver = new ResizeObserver(resize)
  resizeObserver.observe(container)
  draw()
})

onUnmounted(() => {
  cancelAnimationFrame(animationId)
  resizeObserver.disconnect()
})
</script>

<style scoped>
.canvas-container {
  position: relative;
  width: 100%;
  height: 360px;
  border-radius: 1.25rem;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
}
canvas {
  display: block;
}
</style>
