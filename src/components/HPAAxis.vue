<template>
  <div class="flex flex-col h-full">
    <div class="flex justify-between items-center mb-4 z-10">
      <div>
        <h2 class="text-base font-bold text-slate-200 flex items-center gap-2">
          <i class="fa-solid fa-chart-line text-rose-400"></i>
          HPA 轴压力反应 (HPA Axis Stress Response)
        </h2>
        <p class="text-[11px] text-slate-500">下丘脑-垂体-肾上腺皮质轴级联与皮质醇动态反馈可视化</p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-grow overflow-y-auto">
      <!-- HPA diagram -->
      <div class="lg:col-span-5 flex flex-col gap-4">
        <div class="border border-slate-800 rounded-lg bg-slate-900/40 p-4 flex-grow min-h-[260px] relative overflow-hidden">
          <h4 class="text-xs font-semibold text-slate-400 mb-3">HPA 级联轴</h4>
          <div class="relative h-[220px] flex items-center justify-between px-4">
            <!-- Hypothalamus -->
            <div class="relative z-10 flex flex-col items-center gap-2 w-20">
              <div
                class="w-16 h-16 rounded-full border-2 flex items-center justify-center text-lg font-bold transition-all duration-500"
                :class="crh > 30 ? 'bg-rose-500/20 border-rose-500/60 text-rose-300 shadow-[0_0_20px_rgba(244,63,94,0.35)]' : 'bg-slate-900 border-slate-700 text-slate-400'"
              >
                <i class="fa-solid fa-brain"></i>
              </div>
              <span class="text-[10px] text-slate-300 text-center font-medium">下丘脑</span>
              <span class="text-[9px] text-rose-400 font-mono">CRH {{ Math.round(crh) }}</span>
            </div>

            <!-- Arrow 1 -->
            <div class="flex-1 h-[2px] bg-slate-800 relative mx-2">
              <div
                class="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-rose-400 shadow-[0_0_8px_rgba(244,63,94,0.8)]"
                :style="{ left: flow1 + '%' }"
              ></div>
              <div class="absolute right-0 top-1/2 -translate-y-1/2 border-4 border-transparent border-l-rose-500/60"></div>
            </div>

            <!-- Pituitary -->
            <div class="relative z-10 flex flex-col items-center gap-2 w-20">
              <div
                class="w-16 h-16 rounded-full border-2 flex items-center justify-center text-lg font-bold transition-all duration-500"
                :class="acth > 30 ? 'bg-amber-500/20 border-amber-500/60 text-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.35)]' : 'bg-slate-900 border-slate-700 text-slate-400'"
              >
                <i class="fa-solid fa-filter"></i>
              </div>
              <span class="text-[10px] text-slate-300 text-center font-medium">垂体</span>
              <span class="text-[9px] text-amber-400 font-mono">ACTH {{ Math.round(acth) }}</span>
            </div>

            <!-- Arrow 2 -->
            <div class="flex-1 h-[2px] bg-slate-800 relative mx-2">
              <div
                class="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.8)]"
                :style="{ left: flow2 + '%' }"
              ></div>
              <div class="absolute right-0 top-1/2 -translate-y-1/2 border-4 border-transparent border-l-amber-500/60"></div>
            </div>

            <!-- Adrenal -->
            <div class="relative z-10 flex flex-col items-center gap-2 w-20">
              <div
                class="w-16 h-16 rounded-full border-2 flex items-center justify-center text-lg font-bold transition-all duration-500"
                :class="cortisol > 30 ? 'bg-purple-500/20 border-purple-500/60 text-purple-300 shadow-[0_0_20px_rgba(168,85,247,0.35)]' : 'bg-slate-900 border-slate-700 text-slate-400'"
              >
                <i class="fa-solid fa-bolt"></i>
              </div>
              <span class="text-[10px] text-slate-300 text-center font-medium">肾上腺</span>
              <span class="text-[9px] text-purple-400 font-mono">Cort {{ Math.round(cortisol) }}</span>
            </div>
          </div>

          <!-- Feedback arc -->
          <div class="absolute bottom-6 left-1/2 -translate-x-1/2 w-[70%] h-[60px]">
            <svg class="w-full h-full" viewBox="0 0 300 60" preserveAspectRatio="none">
              <path
                d="M 10 10 Q 150 60 290 10"
                fill="none"
                stroke="rgba(168,85,247,0.35)"
                stroke-width="2"
                stroke-dasharray="6 4"
              />
            </svg>
            <div class="absolute top-0 left-1/2 -translate-x-1/2 text-[9px] text-purple-400 font-mono bg-slate-950/80 px-2 py-0.5 rounded border border-purple-500/30">
              负反馈抑制
            </div>
          </div>
        </div>

        <!-- Phase indicator -->
        <div class="border border-slate-800 rounded-lg bg-slate-900/40 p-4">
          <h4 class="text-xs font-semibold text-slate-400 mb-3">压力反应阶段 (GAS)</h4>
          <div class="grid grid-cols-4 gap-2">
            <div
              v-for="p in phases"
              :key="p.id"
              class="py-2 px-1 rounded text-center text-[10px] border transition-all"
              :class="phase === p.id ? p.activeClass : 'bg-slate-900 border-slate-800 text-slate-500'"
            >
              <div class="font-bold mb-0.5">{{ p.label }}</div>
              <div class="opacity-80">{{ p.range }}</div>
            </div>
          </div>
          <p class="text-[11px] text-slate-400 mt-3 leading-relaxed">{{ phaseDescription }}</p>
        </div>
      </div>

      <!-- Chart -->
      <div class="lg:col-span-7 flex flex-col gap-4">
        <div class="border border-slate-800 rounded-lg bg-slate-900/40 p-4 flex-grow min-h-[260px] relative overflow-hidden">
          <div class="flex justify-between items-center mb-2">
            <h4 class="text-xs font-semibold text-slate-400">皮质醇水平动态曲线</h4>
            <div class="flex items-center gap-2 text-[10px] font-mono">
              <span class="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></span>
              <span class="text-purple-400">实时采样</span>
            </div>
          </div>
          <div class="relative flex-grow min-h-[200px]">
            <canvas ref="chartCanvas" class="w-full h-full absolute inset-0"></canvas>
          </div>
        </div>

        <!-- Controls & metrics -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="border border-slate-800 rounded-lg bg-slate-900/40 p-4">
            <h4 class="text-xs font-semibold text-slate-400 mb-3">压力源控制</h4>
            <div class="space-y-4">
              <div>
                <div class="flex justify-between text-[10px] text-slate-500 mb-1">
                  <span>压力强度</span>
                  <span class="font-mono text-rose-400">{{ Math.round(stressorIntensity) }}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  :value="stressorIntensity"
                  @input="onStressorInput"
                  class="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
                />
              </div>
              <div class="flex items-center gap-3">
                <button
                  @click="isChronic = !isChronic"
                  class="px-3 py-1.5 rounded text-[10px] font-mono border transition-all"
                  :class="isChronic ? 'bg-rose-950/50 border-rose-700 text-rose-300' : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-600'"
                >
                  慢性压力模式: {{ isChronic ? 'ON' : 'OFF' }}
                </button>
              </div>
            </div>
          </div>

          <div class="border border-slate-800 rounded-lg bg-slate-900/40 p-4">
            <h4 class="text-xs font-semibold text-slate-400 mb-3">生理影响指标</h4>
            <div class="grid grid-cols-2 gap-2">
              <div class="bg-slate-950/80 rounded p-2 border border-slate-800">
                <span class="text-[9px] text-slate-500 block">血糖 mobilization</span>
                <span class="text-sm font-mono font-bold text-rose-300">{{ glucose }} mg/dL</span>
              </div>
              <div class="bg-slate-950/80 rounded p-2 border border-slate-800">
                <span class="text-[9px] text-slate-500 block">免疫抑制</span>
                <span class="text-sm font-mono font-bold text-amber-300">{{ immune }}%</span>
              </div>
              <div class="bg-slate-950/80 rounded p-2 border border-slate-800">
                <span class="text-[9px] text-slate-500 block">抗炎水平</span>
                <span class="text-sm font-mono font-bold text-emerald-300">{{ antiInflammatory }}%</span>
              </div>
              <div class="bg-slate-950/80 rounded p-2 border border-slate-800">
                <span class="text-[9px] text-slate-500 block">NE 联动</span>
                <span class="text-sm font-mono font-bold text-cyan-300">{{ linkedNE }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Presets -->
        <div class="border border-slate-800 rounded-lg bg-slate-900/40 p-4">
          <h4 class="text-xs font-semibold text-slate-400 mb-3">场景预设</h4>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
            <button
              v-for="preset in presets"
              :key="preset.id"
              @click="applyPreset(preset.id)"
              class="py-2 px-2 rounded text-[10px] font-bold border transition-all flex items-center justify-center gap-2"
              :class="preset.class"
            >
              <i :class="preset.icon"></i>
              <span>{{ preset.label }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { Chart, LineController, LineElement, PointElement, LinearScale, TimeScale, Title, Tooltip, Legend, Filler, CategoryScale } from 'chart.js'
import { useAudio } from '../composables/useAudio.js'

Chart.register(LineController, LineElement, PointElement, LinearScale, TimeScale, Title, Tooltip, Legend, Filler, CategoryScale)

const props = defineProps({
  levels: { type: Object, required: true },
  psychologicalState: { type: Object, required: true }
})

const emit = defineEmits(['update-levels'])
const { playSound } = useAudio()

const stressorIntensity = ref(0)
const crh = ref(10)
const acth = ref(10)
const cortisol = ref(15)
const isChronic = ref(false)
const historyData = Array(120).fill(15)
const chartCanvas = ref(null)
let chart = null
let animationId = null
let time = 0
let highCortisolFrames = 0

const phases = [
  { id: 'baseline', label: '基线', range: '< 30', activeClass: 'bg-emerald-500/20 border-emerald-500/60 text-emerald-300' },
  { id: 'alarm', label: '警觉期', range: '30–55', activeClass: 'bg-rose-500/20 border-rose-500/60 text-rose-300' },
  { id: 'resistance', label: '抵抗期', range: '55–80', activeClass: 'bg-amber-500/20 border-amber-500/60 text-amber-300' },
  { id: 'exhaustion', label: '衰竭期', range: '> 80', activeClass: 'bg-purple-500/20 border-purple-500/60 text-purple-300' }
]

const phase = computed(() => {
  const c = cortisol.value
  if (c > 80 && highCortisolFrames > 300) return 'exhaustion'
  if (c > 55) return 'resistance'
  if (c > 30) return 'alarm'
  return 'baseline'
})

const phaseDescription = computed(() => {
  const desc = {
    baseline: '皮质醇维持在昼夜基线水平，HPA 轴处于静息负反馈平衡。能量储备稳定，免疫功能正常。',
    alarm: '压力源触发下丘脑释放 CRH，垂体分泌 ACTH，肾上腺皮质醇快速升高。机体进入“战斗或逃跑”准备。',
    resistance: '皮质醇持续高位，促进糖异生、升高血压、抑制免疫炎症，帮助机体维持高负荷应对。',
    exhaustion: '长期高皮质醇导致负反馈受体下调，HPA 轴失调，出现免疫抑制、血糖紊乱与能量耗竭。'
  }
  return desc[phase.value]
})

const flow1 = computed(() => {
  return 10 + (crh.value / 100) * 70 + Math.sin(time * 0.1) * 5
})

const flow2 = computed(() => {
  return 10 + (acth.value / 100) * 70 + Math.sin(time * 0.1 + 1) * 5
})

const glucose = computed(() => {
  return Math.round(90 + cortisol.value * 0.45)
})

const immune = computed(() => {
  return Math.round(Math.min(85, cortisol.value * 0.7))
})

const antiInflammatory = computed(() => {
  return Math.round(Math.min(95, cortisol.value * 0.9 + 20))
})

const linkedNE = computed(() => {
  return Math.round(15 + stressorIntensity.value * 0.8)
})

const presets = [
  { id: 'hpa-baseline', label: '基线安宁', icon: 'fa-solid fa-mug-hot', class: 'bg-emerald-950/40 border-emerald-800/50 text-emerald-300 hover:bg-emerald-900/50' },
  { id: 'hpa-acute-stress', label: '急性压力', icon: 'fa-solid fa-bolt', class: 'bg-rose-950/40 border-rose-800/50 text-rose-300 hover:bg-rose-900/50' },
  { id: 'hpa-chronic-stress', label: '慢性压力', icon: 'fa-solid fa-business-time', class: 'bg-amber-950/40 border-amber-800/50 text-amber-300 hover:bg-amber-900/50' },
  { id: 'hpa-recovery', label: '运动恢复', icon: 'fa-solid fa-spa', class: 'bg-cyan-950/40 border-cyan-800/50 text-cyan-300 hover:bg-cyan-900/50' }
]

function initChart() {
  const ctx = chartCanvas.value.getContext('2d')
  const labels = Array.from({ length: 120 }, (_, i) => i)

  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: '皮质醇 (Cortisol)',
        data: [...historyData],
        borderColor: '#a855f7',
        backgroundColor: 'rgba(168, 85, 247, 0.15)',
        borderWidth: 2,
        tension: 0.4,
        fill: true,
        pointRadius: 0,
        pointHoverRadius: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      interaction: { intersect: false, mode: 'index' },
      plugins: {
        legend: { display: false },
        tooltip: {
          enabled: true,
          backgroundColor: 'rgba(2, 6, 23, 0.9)',
          titleColor: '#94a3b8',
          bodyColor: '#c084fc',
          borderColor: 'rgba(168, 85, 247, 0.3)',
          borderWidth: 1,
          displayColors: false,
          callbacks: {
            title: () => '皮质醇水平',
            label: (ctx) => `${ctx.parsed.y.toFixed(1)} units`
          }
        }
      },
      scales: {
        x: { display: false, min: 0, max: 119 },
        y: {
          min: 0,
          max: 100,
          grid: { color: 'rgba(51, 65, 85, 0.3)' },
          ticks: {
            color: '#64748b',
            font: { size: 9, family: 'Share Tech Mono' },
            stepSize: 25
          }
        }
      }
    }
  })
}

function updateSimulation() {
  const stress = stressorIntensity.value
  const decay = isChronic.value ? 0.985 : 0.96
  const feedbackGain = isChronic.value ? 0.003 : 0.0045
  const baseFeedback = isChronic.value ? 0.55 : 0.75

  // CRH: driven by stress, self-decays
  const crhTarget = stress * 0.9
  crh.value += (crhTarget - crh.value) * 0.04

  // ACTH: driven by CRH
  acth.value += (crh.value - acth.value) * 0.06

  // Cortisol: driven by ACTH, inhibited by its own feedback
  const feedback = Math.max(0.25, baseFeedback - cortisol.value * feedbackGain)
  const cortisolDelta = (acth.value * 0.9 - cortisol.value * feedback) * 0.05
  cortisol.value = Math.max(5, Math.min(100, cortisol.value + cortisolDelta))

  // Natural diurnal baseline drift
  if (stress < 5) {
    cortisol.value = cortisol.value * decay + 12 * (1 - decay)
  }

  if (cortisol.value > 55) {
    highCortisolFrames++
  } else {
    highCortisolFrames = Math.max(0, highCortisolFrames - 2)
  }

  historyData.push(cortisol.value)
  historyData.shift()

  if (chart) {
    chart.data.datasets[0].data = [...historyData]
    chart.update('none')
  }

  time++
}

function animate() {
  updateSimulation()
  animationId = requestAnimationFrame(animate)
}

function syncLevels() {
  const ne = linkedNE.value
  if (Math.abs(props.levels.norepinephrine - ne) > 2) {
    emit('update-levels', {
      ...props.levels,
      norepinephrine: ne
    })
  }
}

function onStressorInput(e) {
  stressorIntensity.value = Number(e.target.value)
  syncLevels()
}

function applyPreset(id) {
  playSound(300 + (Math.random() * 400), 0.2)
  const map = {
    'hpa-baseline': { stressor: 10, chronic: false, levels: { dopamine: 35, serotonin: 80, norepinephrine: 23, endorphin: 65 } },
    'hpa-acute-stress': { stressor: 80, chronic: false, levels: { dopamine: 75, serotonin: 45, norepinephrine: 79, endorphin: 35 } },
    'hpa-chronic-stress': { stressor: 75, chronic: true, levels: { dopamine: 60, serotonin: 35, norepinephrine: 75, endorphin: 30 } },
    'hpa-recovery': { stressor: 15, chronic: false, levels: { dopamine: 40, serotonin: 85, norepinephrine: 27, endorphin: 70 } }
  }
  const cfg = map[id]
  if (!cfg) return
  stressorIntensity.value = cfg.stressor
  isChronic.value = cfg.chronic
  emit('update-levels', { ...props.levels, ...cfg.levels })
}

watch(() => props.levels.norepinephrine, (ne) => {
  // If NE changed externally and we're not dragging, gently map to stressor intensity
  if (ne !== linkedNE.value) {
    const targetStress = Math.max(0, Math.min(100, (ne - 15) / 0.8))
    stressorIntensity.value = Math.round(targetStress)
  }
}, { immediate: true })

onMounted(() => {
  initChart()
  animate()
})

onUnmounted(() => {
  if (animationId) cancelAnimationFrame(animationId)
  if (chart) chart.destroy()
})


</script>
