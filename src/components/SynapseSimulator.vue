<template>
  <div class="flex flex-col h-full">
    <div class="flex justify-between items-center mb-2 z-10">
      <div>
        <h2 class="text-base font-bold text-slate-200 flex items-center gap-2">
          <i class="fa-solid fa-bolt text-amber-400"></i>
          神经突触电-化学信号传递微观模拟器
        </h2>
        <p class="text-[11px] text-slate-500">模拟兴奋性与抑制性递质分子在突触间隙(Synaptic Cleft)中的物理扩散、结合及清除过程</p>
      </div>
    </div>

    <div class="relative flex-grow min-h-[300px] border border-slate-900 rounded-xl bg-slate-950 overflow-hidden">
      <canvas ref="canvas" class="absolute inset-0 w-full h-full"></canvas>

      <div class="absolute top-4 left-4 bg-slate-900/80 border border-slate-800 px-3 py-2 rounded-lg text-xs space-y-1 font-mono">
        <div class="flex justify-between gap-4">
          <span class="text-slate-500">动作电位(AP):</span>
          <span :class="apActive ? 'text-rose-400 font-bold' : 'text-emerald-400'">{{ apValue }}</span>
        </div>
        <div class="flex justify-between gap-4">
          <span class="text-slate-500">囊泡释放速率:</span>
          <span class="text-blue-400">{{ releaseRate }} / 触发</span>
        </div>
        <div class="flex justify-between gap-4">
          <span class="text-slate-500">受体结合激活率:</span>
          <span :class="bindingRate > 50 ? 'text-cyan-400 font-bold animate-pulse' : 'text-purple-400'">{{ bindingRate }}%</span>
        </div>
      </div>

      <div class="absolute bottom-4 left-4 flex gap-4 text-[10px] bg-slate-900/80 px-2 py-1.5 rounded border border-slate-800">
        <span class="flex items-center gap-1"><span class="w-2.5 h-2.5 rounded-full bg-cyan-400"></span> 多巴胺(激励)</span>
        <span class="flex items-center gap-1"><span class="w-2.5 h-2.5 rounded-full bg-emerald-400"></span> 5-羟色胺(情绪)</span>
        <span class="flex items-center gap-1"><span class="w-2.5 h-2.5 rounded-full bg-rose-400"></span> 去甲肾(报警)</span>
      </div>
    </div>

    <div class="mt-4 flex flex-wrap gap-3 items-center justify-between z-10">
      <div class="flex gap-2">
        <button
          v-for="type in transmitterTypes"
          :key="type.key"
          @click="triggerAction(type.key)"
          class="text-white font-medium text-xs px-4 py-2.5 rounded-lg flex items-center gap-2 transition-all shadow-lg"
          :class="type.buttonClass"
        >
          <i class="fa-solid fa-circle-chevron-down"></i> {{ type.label }}
        </button>
      </div>
      <button
        @click="reset"
        class="border border-slate-800 hover:bg-slate-900 text-slate-400 hover:text-slate-200 text-xs px-3 py-2.5 rounded-lg transition-all"
      >
        重置突触模型
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useAudio } from '../composables/useAudio.js'

const props = defineProps({
  active: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:binding-rate'])
const { playSound, playBeep } = useAudio()

const canvas = ref(null)
let ctx, width, height, animFrameId, resizeObserver
let vesicles = []
let receptors = []
let molecules = []
let actionPotentialWave = 0

const apActive = ref(false)
const apValue = ref('-70 mV (静息)')
const releaseRate = ref(0)
const bindingRate = ref(0)

const transmitterTypes = [
  { key: 'dopamine', label: '发射多巴胺 (DA)', buttonClass: 'bg-blue-600 hover:bg-blue-700 shadow-blue-950/50' },
  { key: 'serotonin', label: '发射血清素 (5-HT)', buttonClass: 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-950/50' },
  { key: 'norepinephrine', label: '发射去甲肾 (NE)', buttonClass: 'bg-rose-600 hover:bg-rose-700 shadow-rose-950/50' }
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
  if (!canvas.value || !ctx) return
  const rect = canvas.value.getBoundingClientRect()
  if (rect.width === 0 || rect.height === 0) return
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
  playSound(600, 0.2, 'square')
  actionPotentialWave = 1
  apActive.value = true
  apValue.value = '+40 mV (去极化)'

  vesicles.forEach(v => {
    if (!v.fused && v.loadedType === type) {
      v.fused = true
      const count = 15
      releaseRate.value = count

      for (let j = 0; j < count; j++) {
        setTimeout(() => {
          molecules.push({
            x: v.x + (Math.random() - 0.5) * 20,
            y: 75,
            vx: (Math.random() - 0.5) * 2.5,
            vy: 1.2 + Math.random() * 3,
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
  playBeep()
  initElements()
  apActive.value = false
  apValue.value = '-70 mV (复极化)'
  releaseRate.value = 0
  bindingRate.value = 0
  emit('update:binding-rate', 0)
}

const loop = () => {
  animFrameId = requestAnimationFrame(loop)

  if (!props.active) return

  ctx.fillStyle = '#020617'
  ctx.fillRect(0, 0, width, height)

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
  ctx.fillText('PRE-SYNAPTIC MEMBRANE (突触前膜)', 20, 35)
  ctx.fillText('POST-SYNAPTIC DENSITY (突触后膜)', 20, height - 35)

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
      apActive.value = false
      apValue.value = '-70 mV (复极化)'
    }
  }

  vesicles.forEach(v => {
    let color = '#3b82f6'
    if (v.loadedType === 'serotonin') color = '#10b981'
    if (v.loadedType === 'norepinephrine') color = '#f43f5e'

    ctx.strokeStyle = color
    ctx.lineWidth = 2
    ctx.fillStyle = v.fused ? 'rgba(59, 130, 246, 0.05)' : color + '25'

    const r = v.fused ? v.radius * 0.4 : v.radius
    const y = v.fused ? v.y + 10 : v.y

    ctx.beginPath()
    ctx.arc(v.x, y, r, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()
  })

  for (let i = molecules.length - 1; i >= 0; i--) {
    const m = molecules[i]
    m.x += m.vx
    m.y += m.vy
    m.timer--

    const mColor = colorMap[m.type]
    ctx.fillStyle = mColor
    ctx.beginPath()
    ctx.arc(m.x, m.y, 3.5, 0, Math.PI * 2)
    ctx.fill()

    receptors.forEach(rec => {
      if (rec.type === m.type && !rec.activated && !m.bound) {
        const dist = Math.hypot(m.x - rec.x, m.y - rec.y)
        if (dist < rec.size + 4) {
          rec.activated = true
          rec.activationTimer = 120
          m.bound = true
          playSound(900 + Math.random() * 200, 0.05)
        }
      }
    })

    if (m.timer <= 0 || m.bound || m.y > height - 60) {
      molecules.splice(i, 1)
    }
  }

  let activeCount = 0
  receptors.forEach(rec => {
    let rColor = receptorColor[rec.type]

    if (rec.activated) {
      activeCount++
      rec.activationTimer--
      if (rec.activationTimer <= 0) rec.activated = false
      rColor = activeColor[rec.type]
    }

    ctx.strokeStyle = rColor
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.arc(rec.x, rec.y, rec.size, Math.PI, 0, true)
    ctx.stroke()
  })

  bindingRate.value = receptors.length > 0 ? Math.round((activeCount / receptors.length) * 100) : 0
  emit('update:binding-rate', bindingRate.value)
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

watch(() => props.active, (isActive) => {
  if (isActive) {
    setTimeout(resize, 50)
  }
})
</script>
