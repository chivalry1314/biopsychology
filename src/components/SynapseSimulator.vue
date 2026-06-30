<template>
  <div class="quantum-panel p-5 relative overflow-hidden flex flex-col h-full">
    <div class="absolute top-0 left-0 w-full h-1 bg-cyan-500/50 scanner-line"></div>

    <div class="flex justify-between items-center mb-2 z-10">
      <div>
        <h2 class="text-base font-bold text-slate-200 flex items-center gap-2">
          <i class="fa-solid fa-bolt text-amber-400"></i>
          神经突触电-化学信号传递微观模拟
        </h2>
        <p class="text-[11px] text-slate-500">模拟兴奋性或抑制性递质在突触间隙中的释放与受体结合</p>
      </div>
    </div>

    <div class="relative flex-grow min-h-[300px] border border-slate-900 rounded-xl bg-slate-950 overflow-hidden">
      <canvas ref="canvas" class="absolute inset-0 w-full h-full"></canvas>

      <div class="absolute top-4 left-4 bg-slate-900/80 border border-slate-800 px-3 py-2 rounded-lg text-xs space-y-1 font-mono-tech">
        <div class="flex justify-between gap-4"><span class="text-slate-500">动作电位:</span> <span :class="apClass">{{ apText }}</span></div>
        <div class="flex justify-between gap-4"><span class="text-slate-500">囊泡释放速率:</span> <span class="text-blue-400">{{ releaseRate }}</span></div>
        <div class="flex justify-between gap-4"><span class="text-slate-500">受体结合率:</span> <span :class="bindingClass">{{ bindingRate }}%</span></div>
      </div>

      <div class="absolute bottom-4 left-4 flex gap-4 text-[10px] bg-slate-900/80 px-2 py-1.5 rounded border border-slate-800">
        <span class="flex items-center gap-1"><span class="w-2.5 h-2.5 rounded-full bg-cyan-400"></span> 多巴胺(兴奋)</span>
        <span class="flex items-center gap-1"><span class="w-2.5 h-2.5 rounded-full bg-emerald-400"></span> 5-羟色胺(调和)</span>
        <span class="flex items-center gap-1"><span class="w-2.5 h-2.5 rounded-full bg-rose-400"></span> 去甲肾上腺(强刺激)</span>
      </div>
    </div>

    <div class="mt-4 flex flex-wrap gap-3 items-center justify-between z-10">
      <div class="flex flex-wrap gap-2">
        <button
          v-for="type in transmitterTypes"
          :key="type.key"
          @click="triggerAction(type.key)"
          class="text-white font-medium text-xs px-4 py-2.5 rounded-lg flex items-center gap-2 transition-all shadow-lg"
          :class="type.buttonClass"
        >
          <i class="fa-solid fa-play"></i> {{ type.label }}
        </button>
      </div>
      <button
        @click="reset"
        class="border border-slate-800 hover:bg-slate-900 text-slate-400 hover:text-slate-200 text-xs px-3 py-2.5 rounded-lg transition-all"
      >
        重置突触
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const canvas = ref(null)
let ctx, width, height, animFrameId, resizeObserver
let vesicles = []
let receptors = []
let molecules = []
let actionPotentialWave = 0

const apText = ref('0 mV')
const apClass = ref('text-emerald-400 font-bold')
const releaseRate = ref('0 / sec')
const bindingRate = ref(0)
const bindingClass = ref('text-purple-400')

const transmitterTypes = [
  { key: 'dopamine', label: '释放多巴胺 (激励)', buttonClass: 'bg-blue-600 hover:bg-blue-700 shadow-blue-950/50' },
  { key: 'serotonin', label: '释放血清素 (情绪)', buttonClass: 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-950/50' },
  { key: 'norepinephrine', label: '释放去甲肾 (警戒)', buttonClass: 'bg-rose-600 hover:bg-rose-700 shadow-rose-950/50' }
]

const colorMap = {
  dopamine: '#22d3ee',
  serotonin: '#34d399',
  norepinephrine: '#fb7185'
}

const receptorColor = {
  dopamine: 'rgba(59, 130, 246, 0.4)',
  serotonin: 'rgba(16, 185, 129, 0.4)',
  norepinephrine: 'rgba(244, 63, 94, 0.4)'
}

const activeColor = {
  dopamine: '#3b82f6',
  serotonin: '#10b981',
  norepinephrine: '#f43f5e'
}

const resize = () => {
  const rect = canvas.value.getBoundingClientRect()
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  width = rect.width
  height = rect.height
  canvas.value.width = width * dpr
  canvas.value.height = height * dpr
  ctx.setTransform(1, 0, 0, 1, 0, 0)
  ctx.scale(dpr, dpr)
  initElements()
}

const initElements = () => {
  receptors = []
  const receptorCount = 10
  for (let i = 0; i < receptorCount; i++) {
    receptors.push({
      x: 60 + (i * (width - 120) / (receptorCount - 1)),
      y: height - 60,
      size: 14,
      type: i % 3 === 0 ? 'dopamine' : (i % 3 === 1 ? 'serotonin' : 'norepinephrine'),
      activated: false,
      activationTimer: 0
    })
  }

  vesicles = []
  for (let i = 0; i < 6; i++) {
    vesicles.push({
      x: 80 + (i * (width - 160) / 5),
      y: 60,
      radius: 12,
      loadedType: i % 3 === 0 ? 'dopamine' : (i % 3 === 1 ? 'serotonin' : 'norepinephrine'),
      fused: false
    })
  }

  molecules = []
  actionPotentialWave = 0
}

const triggerAction = (type) => {
  actionPotentialWave = 1
  apText.value = '+40 mV'
  apClass.value = 'text-rose-400 font-bold'

  vesicles.forEach(v => {
    if (!v.fused && v.loadedType === type) {
      v.fused = true
      const releaseCount = 15
      releaseRate.value = `${releaseCount}/动作`

      for (let j = 0; j < releaseCount; j++) {
        setTimeout(() => {
          molecules.push({
            x: v.x + (Math.random() - 0.5) * 20,
            y: 75,
            vx: (Math.random() - 0.5) * 2.5,
            vy: 1 + Math.random() * 3,
            type,
            bound: false,
            timer: 180
          })
        }, j * 20)
      }

      setTimeout(() => {
        v.fused = false
      }, 2000)
    }
  })
}

const reset = () => {
  initElements()
  apText.value = '-70 mV (静息)'
  apClass.value = 'text-emerald-400'
  releaseRate.value = '0 / sec'
  bindingRate.value = 0
}

const loop = () => {
  animFrameId = requestAnimationFrame(loop)

  ctx.fillStyle = '#020617'
  ctx.fillRect(0, 0, width, height)

  // Membranes
  ctx.lineWidth = 4
  ctx.strokeStyle = 'rgba(59, 130, 246, 0.25)'

  ctx.beginPath()
  ctx.moveTo(0, 70)
  ctx.bezierCurveTo(width / 3, 70, width / 2, 90, width, 70)
  ctx.stroke()

  ctx.beginPath()
  ctx.moveTo(0, height - 70)
  ctx.bezierCurveTo(width / 3, height - 70, width / 2, height - 80, width, height - 70)
  ctx.stroke()

  ctx.font = '10px Share Tech Mono, monospace'
  ctx.fillStyle = 'rgba(229, 231, 235, 0.4)'
  ctx.fillText('PRE-SYNAPTIC TERMINAL (突触前膜)', 20, 35)
  ctx.fillText('POST-SYNAPTIC DENSITY (突触后膜)', 20, height - 35)
  ctx.fillText('SYNAPTIC CLEFT (突触间隙 - ~20nm)', width - 220, height / 2)

  // Action potential wave
  if (actionPotentialWave > 0) {
    actionPotentialWave += 0.05
    ctx.strokeStyle = 'rgba(59, 130, 246, 0.8)'
    ctx.shadowColor = '#3b82f6'
    ctx.shadowBlur = 15
    ctx.lineWidth = 3

    const waveY = actionPotentialWave * 70
    ctx.beginPath()
    ctx.moveTo(0, waveY)
    for (let i = 0; i < width; i += 10) {
      ctx.lineTo(i, waveY + Math.sin(i * 0.05 + waveY) * 12)
    }
    ctx.stroke()
    ctx.shadowBlur = 0

    if (waveY > 120) {
      actionPotentialWave = 0
      apText.value = '-70 mV (静息)'
      apClass.value = 'text-emerald-400 font-bold'
    }
  }

  // Vesicles
  vesicles.forEach(v => {
    let color = colorMap[v.loadedType]
    ctx.strokeStyle = color
    ctx.lineWidth = 2
    ctx.fillStyle = v.fused ? 'rgba(59, 130, 246, 0.05)' : color + '25'

    const currentRadius = v.fused ? v.radius * 0.4 : v.radius
    const currentY = v.fused ? v.y + 10 : v.y

    ctx.beginPath()
    ctx.arc(v.x, currentY, currentRadius, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()

    if (!v.fused) {
      ctx.fillStyle = color
      for (let d = 0; d < 4; d++) {
        ctx.beginPath()
        ctx.arc(v.x + (d % 2 - 0.5) * 6, v.y + (Math.floor(d / 2) - 0.5) * 6, 2, 0, Math.PI * 2)
        ctx.fill()
      }
    }
  })

  // Molecules
  let activeBindingCount = 0
  for (let i = molecules.length - 1; i >= 0; i--) {
    const m = molecules[i]
    m.x += m.vx
    m.y += m.vy
    m.timer--

    const mColor = colorMap[m.type]
    ctx.fillStyle = mColor
    ctx.shadowColor = mColor
    ctx.shadowBlur = 4
    ctx.beginPath()
    ctx.arc(m.x, m.y, 3.5, 0, Math.PI * 2)
    ctx.fill()
    ctx.shadowBlur = 0

    receptors.forEach(r => {
      if (r.type === m.type) {
        const dist = Math.hypot(m.x - r.x, m.y - r.y)
        if (dist < r.size + 4 && !r.activated && !m.bound) {
          r.activated = true
          r.activationTimer = 120
          m.bound = true
        }
      }
    })

    if (m.timer <= 0 || m.bound || m.y > height - 60) {
      molecules.splice(i, 1)
    }
  }

  // Receptors
  receptors.forEach(r => {
    let rColor = receptorColor[r.type]

    if (r.activated) {
      activeBindingCount++
      r.activationTimer--
      if (r.activationTimer <= 0) r.activated = false
      rColor = activeColor[r.type]
      ctx.shadowColor = rColor
      ctx.shadowBlur = 10
    }

    ctx.strokeStyle = rColor
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.arc(r.x, r.y, r.size, Math.PI, 0, true)
    ctx.stroke()

    ctx.fillStyle = r.activated ? rColor + '30' : 'transparent'
    ctx.fill()
    ctx.shadowBlur = 0
  })

  const rate = receptors.length > 0 ? Math.round((activeBindingCount / receptors.length) * 100) : 0
  bindingRate.value = rate
  bindingClass.value = rate > 50 ? 'text-cyan-400 font-bold animate-pulse' : 'text-purple-400'
}

onMounted(() => {
  ctx = canvas.value.getContext('2d')
  resize()
  resizeObserver = new ResizeObserver(resize)
  resizeObserver.observe(canvas.value.parentElement)
  loop()
})

onUnmounted(() => {
  cancelAnimationFrame(animFrameId)
  resizeObserver.disconnect()
})
</script>
