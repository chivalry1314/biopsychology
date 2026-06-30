<template>
  <div class="space-y-5">
    <p class="course-body text-sm">
      典型的成人整夜睡眠包含 4-6 个周期，每个周期约 90 分钟。REM 睡眠比例随夜晚推移逐渐增加。
    </p>
    <div class="canvas-container">
      <canvas ref="canvas"></canvas>
    </div>
    <div class="grid grid-cols-2 md:grid-cols-5 gap-3 text-center">
      <div
        v-for="stage in sleepStages"
        :key="stage.name"
        class="course-info-card py-3"
      >
        <div
          class="w-3 h-3 rounded mx-auto mb-2"
          :style="{ background: stage.color }"
        ></div>
        <div class="text-sm text-white font-medium">{{ stage.name }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { sleepStages, sleepData } from '../data/sleepStages.js'

const canvas = ref(null)
let ctx, width, height, container
let resizeObserver

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
  draw()
}

const draw = () => {
  if (!ctx) return
  ctx.clearRect(0, 0, width, height)
  const pad = { top: 36, bottom: 36, left: 46, right: 24 }
  const cw = width - pad.left - pad.right
  const ch = height - pad.top - pad.bottom

  ctx.strokeStyle = 'rgba(255,255,255,0.06)'
  ctx.lineWidth = 1
  for (let i = 0; i < sleepStages.length; i++) {
    const y = pad.top + ch * sleepStages[i].y
    ctx.beginPath()
    ctx.moveTo(pad.left, y)
    ctx.lineTo(width - pad.right, y)
    ctx.stroke()
    ctx.fillStyle = 'rgba(255,255,255,0.4)'
    ctx.font = '12px Inter, sans-serif'
    ctx.fillText(sleepStages[i].name, 8, y + 4)
  }

  ctx.beginPath()
  ctx.moveTo(pad.left, height - pad.bottom)
  ctx.lineTo(width - pad.right, height - pad.bottom)
  ctx.strokeStyle = 'rgba(255,255,255,0.1)'
  ctx.stroke()

  const totalDur = sleepData.reduce((a, b) => a + b.dur, 0)
  let x = pad.left

  ctx.beginPath()
  ctx.moveTo(x, pad.top + ch * sleepStages[sleepData[0].stage].y)
  sleepData.forEach(d => {
    const w = (d.dur / totalDur) * cw
    const y = pad.top + ch * sleepStages[d.stage].y
    const nextX = x + w
    ctx.lineTo(nextX, y)
    x = nextX
  })
  ctx.lineWidth = 2.5
  ctx.strokeStyle = '#22d3ee'
  ctx.stroke()

  x = pad.left
  ctx.beginPath()
  ctx.moveTo(x, height - pad.bottom)
  sleepData.forEach(d => {
    const w = (d.dur / totalDur) * cw
    const y = pad.top + ch * sleepStages[d.stage].y
    const nextX = x + w
    ctx.lineTo(nextX, y)
    x = nextX
  })
  ctx.lineTo(width - pad.right, height - pad.bottom)
  ctx.closePath()
  ctx.fillStyle = 'rgba(34, 211, 238, 0.1)'
  ctx.fill()

  x = pad.left
  sleepData.forEach(d => {
    const w = (d.dur / totalDur) * cw
    const y = pad.top + ch * sleepStages[d.stage].y
    ctx.fillStyle = sleepStages[d.stage].color
    ctx.beginPath()
    ctx.arc(x, y, 3.5, 0, Math.PI * 2)
    ctx.fill()
    x += w
  })

  ctx.fillStyle = 'rgba(255,255,255,0.35)'
  ctx.font = '11px Inter, sans-serif'
  for (let i = 0; i <= 8; i++) {
    const lx = pad.left + (cw / 8) * i
    ctx.fillText(`${i}h`, lx - 6, height - 12)
  }
}

onMounted(() => {
  container = canvas.value.parentElement
  ctx = canvas.value.getContext('2d')
  resize()
  resizeObserver = new ResizeObserver(resize)
  resizeObserver.observe(container)
})

onUnmounted(() => {
  resizeObserver.disconnect()
})
</script>

<style scoped>
.canvas-container {
  position: relative;
  width: 100%;
  height: 240px;
  border-radius: 1rem;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
}
canvas {
  display: block;
}
</style>
