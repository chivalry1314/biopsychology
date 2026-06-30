<template>
  <div class="flex flex-col h-full">
    <div class="flex justify-between items-center mb-4 z-10">
      <div>
        <h2 class="text-base font-bold text-slate-200 flex items-center gap-2">
          <i class="fa-solid fa-wave-square text-cyan-400"></i>
          脑电节律模拟器 (EEG Rhythm Simulator)
        </h2>
        <p class="text-[11px] text-slate-500">实时可视化大脑电振荡频率与认知-情绪状态的生理心理学关联</p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-grow overflow-y-auto">
      <!-- Main waveform -->
      <div class="lg:col-span-8 flex flex-col gap-4">
        <div class="border border-slate-800 rounded-lg bg-slate-900/40 p-4 flex flex-col flex-grow min-h-[260px] relative overflow-hidden">
          <div class="flex justify-between items-center mb-2">
            <h4 class="text-xs font-semibold text-slate-400">实时脑电波形</h4>
            <div class="flex items-center gap-2 text-[10px] font-mono">
              <span class="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
              <span class="text-cyan-400">{{ currentBand.label }} 主导</span>
            </div>
          </div>
          <div class="relative flex-grow">
            <canvas ref="waveCanvas" class="w-full h-full absolute inset-0"></canvas>
            <!-- Grid overlay -->
            <div class="absolute inset-0 pointer-events-none opacity-20" style="background-image: linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px); background-size: 40px 30px;"></div>
          </div>
        </div>

        <!-- Band selector -->
        <div class="border border-slate-800 rounded-lg bg-slate-900/40 p-4">
          <h4 class="text-xs font-semibold text-slate-400 mb-3">选择主导脑电频段</h4>
          <div class="grid grid-cols-5 gap-2">
            <button
              v-for="band in bands"
              :key="band.id"
              @click="selectBand(band.id)"
              class="py-2 px-1 rounded text-[11px] font-bold border transition-all flex flex-col items-center gap-1"
              :class="currentBand.id === band.id ? band.activeClass : band.inactiveClass"
            >
              <span>{{ band.symbol }}</span>
              <span class="text-[9px] font-normal opacity-80">{{ band.range }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Side panel -->
      <div class="lg:col-span-4 flex flex-col gap-4">
        <div class="border border-slate-800 rounded-lg bg-slate-900/40 p-4">
          <h4 class="text-xs font-semibold text-slate-400 mb-3">当前状态</h4>
          <div class="space-y-3">
            <div class="bg-slate-950/80 rounded-lg p-3 border border-slate-800">
              <span class="text-[10px] text-slate-500 block mb-1">主导频率</span>
              <span class="text-xl font-mono font-bold text-cyan-400">{{ psychologicalState.eegDisplay }}</span>
            </div>
            <div class="bg-slate-950/80 rounded-lg p-3 border border-slate-800">
              <span class="text-[10px] text-slate-500 block mb-1">认知状态</span>
              <span class="text-sm font-semibold text-slate-200">{{ currentBand.state }}</span>
            </div>
          </div>
        </div>

        <div class="border border-slate-800 rounded-lg bg-slate-900/40 p-4 flex-grow">
          <h4 class="text-xs font-semibold text-slate-400 mb-3">频段能量分布</h4>
          <div class="space-y-2">
            <div v-for="band in bands" :key="band.id" class="flex items-center gap-2">
              <span class="text-[10px] w-8 font-mono" :class="currentBand.id === band.id ? 'text-cyan-400' : 'text-slate-500'">{{ band.symbol }}</span>
              <div class="flex-grow bg-slate-950 h-2 rounded-full overflow-hidden">
                <div
                  class="h-full rounded-full transition-all duration-500"
                  :class="band.barColor"
                  :style="{ width: bandEnergy(band.id) + '%', opacity: currentBand.id === band.id ? 1 : 0.35 }"
                ></div>
              </div>
              <span class="text-[9px] w-10 text-right font-mono text-slate-500">{{ bandEnergy(band.id) }}%</span>
            </div>
          </div>
        </div>

        <div class="border border-slate-800 rounded-lg bg-slate-950/80 p-4">
          <span class="text-[10px] text-purple-400 font-mono block mb-1">生理心理解读:</span>
          <p class="text-xs text-slate-300 leading-relaxed">{{ currentBand.interpretation }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'

const props = defineProps({
  psychologicalState: { type: Object, required: true },
  active: { type: Boolean, default: false }
})

const emit = defineEmits(['apply-preset'])

const waveCanvas = ref(null)
let animationId = null
let time = 0

const bands = [
  {
    id: 'delta',
    symbol: 'δ',
    label: 'δ 波',
    range: '0.5–4 Hz',
    freq: 2.5,
    visualFreq: 1.2,
    amplitude: 55,
    state: '深睡 / 深度恢复',
    interpretation: 'δ 波占主导时，大脑处于慢波睡眠或极度疲劳状态。意识活动降至最低，副交感系统主导修复过程，有利于免疫再生与记忆巩固。',
    activeClass: 'bg-purple-500/25 border-purple-500/60 text-purple-300',
    inactiveClass: 'bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-700',
    barColor: 'bg-purple-400'
  },
  {
    id: 'theta',
    symbol: 'θ',
    label: 'θ 波',
    range: '4–8 Hz',
    freq: 6,
    visualFreq: 2.5,
    amplitude: 42,
    state: '冥想 / 困倦 / 创造性联想',
    interpretation: 'θ 波增强常见于冥想、入睡前或自由联想状态。边缘系统活跃，情绪记忆加工增强，但注意力和执行控制相对下降。',
    activeClass: 'bg-blue-500/25 border-blue-500/60 text-blue-300',
    inactiveClass: 'bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-700',
    barColor: 'bg-blue-400'
  },
  {
    id: 'alpha',
    symbol: 'α',
    label: 'α 波',
    range: '8–13 Hz',
    freq: 10,
    visualFreq: 4,
    amplitude: 35,
    state: '放松 / 静息 / 闭眼清醒',
    interpretation: 'α 波是清醒放松的标志，尤其闭眼时枕叶明显。表明大脑处于准备但不过度消耗的状态，有利于恢复性注意与创造力。',
    activeClass: 'bg-emerald-500/25 border-emerald-500/60 text-emerald-300',
    inactiveClass: 'bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-700',
    barColor: 'bg-emerald-400'
  },
  {
    id: 'beta',
    symbol: 'β',
    label: 'β 波',
    range: '13–30 Hz',
    freq: 20,
    visualFreq: 7,
    amplitude: 28,
    state: '思考 / 专注 / 外显注意',
    interpretation: 'β 波占主导时，大脑处于活跃思考、问题解决或外显注意状态。前额叶皮层参与执行控制，但持续高 β 与焦虑、精神疲劳相关。',
    activeClass: 'bg-amber-500/25 border-amber-500/60 text-amber-300',
    inactiveClass: 'bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-700',
    barColor: 'bg-amber-400'
  },
  {
    id: 'gamma',
    symbol: 'γ',
    label: 'γ 波',
    range: '30–100 Hz',
    freq: 55,
    visualFreq: 12,
    amplitude: 20,
    state: '高度兴奋 / 信息整合 / 顿悟',
    interpretation: 'γ 波与高级认知整合、意识觉察和跨脑区同步有关。在强烈专注、顿悟或应激兴奋时出现，但持续过高可能提示躁狂或癫痫风险。',
    activeClass: 'bg-rose-500/25 border-rose-500/60 text-rose-300',
    inactiveClass: 'bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-700',
    barColor: 'bg-rose-400'
  }
]

function bandFromEegVal(eegVal) {
  if (eegVal < 4) return 'delta'
  if (eegVal < 8) return 'theta'
  if (eegVal < 13) return 'alpha'
  if (eegVal < 30) return 'beta'
  return 'gamma'
}

const currentBand = computed(() => {
  const id = bandFromEegVal(props.psychologicalState.eegVal)
  return bands.find(b => b.id === id) || bands[2]
})

function bandEnergy(bandId) {
  const currentId = currentBand.value.id
  if (bandId === currentId) return 78 + Math.round(Math.sin(time * 0.05 + bandId.length) * 15)
  const distance = Math.abs(bands.findIndex(b => b.id === bandId) - bands.findIndex(b => b.id === currentId))
  return Math.max(5, Math.round(35 - distance * 12 + Math.sin(time * 0.03 + bandId.length) * 8))
}

function selectBand(bandId) {
  emit('apply-preset', `eeg-${bandId}`)
}

function drawWave() {
  const canvas = waveCanvas.value
  if (!canvas) return

  const rect = canvas.getBoundingClientRect()
  if (rect.width <= 0 || rect.height <= 0) return

  const ctx = canvas.getContext('2d')
  const dpr = window.devicePixelRatio || 1
  canvas.width = rect.width * dpr
  canvas.height = rect.height * dpr
  ctx.scale(dpr, dpr)

  const w = rect.width
  const h = rect.height
  const cy = h / 2

  ctx.clearRect(0, 0, w, h)

  const band = currentBand.value
  const speed = band.visualFreq * 0.08
  time += speed

  // Draw main wave
  ctx.beginPath()
  ctx.lineWidth = 2.5
  ctx.strokeStyle = band.barColor.replace('bg-', '').replace('400', '') // fallback handled below
  // Map tailwind color classes to hex for canvas
  const colorMap = {
    'bg-purple-400': '#c084fc',
    'bg-blue-400': '#60a5fa',
    'bg-emerald-400': '#34d399',
    'bg-amber-400': '#fbbf24',
    'bg-rose-400': '#fb7185'
  }
  ctx.strokeStyle = colorMap[band.barColor] || '#38bdf8'
  ctx.shadowBlur = 12
  ctx.shadowColor = ctx.strokeStyle

  for (let x = 0; x < w; x++) {
    const normalizedX = x / w
    const phase = normalizedX * Math.PI * 8 + time
    const noise = Math.sin(phase * 2.3) * 0.3 + Math.sin(phase * 0.7) * 0.2
    const y = cy + Math.sin(phase) * band.amplitude * (1 + noise * 0.25) * (h / 220)
    if (x === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  }
  ctx.stroke()
  ctx.shadowBlur = 0

  // Draw second harmonic / noise trace
  ctx.beginPath()
  ctx.lineWidth = 1
  ctx.strokeStyle = colorMap[band.barColor] || '#38bdf8'
  ctx.globalAlpha = 0.35
  for (let x = 0; x < w; x++) {
    const normalizedX = x / w
    const phase = normalizedX * Math.PI * 12 - time * 1.3
    const y = cy + Math.sin(phase) * band.amplitude * 0.4 * (h / 220)
    if (x === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  }
  ctx.stroke()
  ctx.globalAlpha = 1

  // Center baseline
  ctx.beginPath()
  ctx.lineWidth = 1
  ctx.strokeStyle = 'rgba(148, 163, 184, 0.25)'
  ctx.moveTo(0, cy)
  ctx.lineTo(w, cy)
  ctx.stroke()
}

function animate() {
  if (props.active !== false) {
    drawWave()
  }
  animationId = requestAnimationFrame(animate)
}

onMounted(() => {
  animate()
})

onUnmounted(() => {
  if (animationId) cancelAnimationFrame(animationId)
})

watch(() => props.psychologicalState.eegVal, () => {
  drawWave()
})
</script>
