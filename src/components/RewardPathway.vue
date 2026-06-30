<template>
  <div class="flex flex-col h-full">
    <div class="flex justify-between items-center mb-4 z-10">
      <div>
        <h2 class="text-base font-bold text-slate-200 flex items-center gap-2">
          <i class="fa-solid fa-gift text-blue-400"></i>
          奖励通路与多巴胺奖赏 (Reward Pathway)
        </h2>
        <p class="text-[11px] text-slate-500">中脑边缘多巴胺回路：VTA → 伏隔核 → 前额叶皮层</p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-grow overflow-y-auto">
      <!-- Reward pathway SVG -->
      <div class="lg:col-span-5 flex flex-col gap-4">
        <div class="border border-slate-800 rounded-lg bg-slate-900/40 p-4 flex-grow min-h-[280px] relative overflow-hidden">
          <h4 class="text-xs font-semibold text-slate-400 mb-2">中脑边缘奖赏通路</h4>
          <svg ref="pathwaySvg" class="w-full h-[240px]" viewBox="0 0 360 240">
            <!-- Glow filters -->
            <defs>
              <filter id="glow-blue" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
              <filter id="glow-rose" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="5" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
              <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.6"/>
                <stop offset="50%" stop-color="#8b5cf6" stop-opacity="0.6"/>
                <stop offset="100%" stop-color="#ec4899" stop-opacity="0.6"/>
              </linearGradient>
            </defs>

            <!-- Path VTA -> NAc -> PFC -->
            <path
              d="M 60 180 Q 130 180 180 140 Q 230 100 300 80"
              fill="none"
              stroke="url(#pathGradient)"
              stroke-width="3"
              stroke-linecap="round"
              filter="url(#glow-blue)"
            />
            <!-- Reverse feedback PFC -> VTA -->
            <path
              d="M 300 120 Q 230 140 180 170 Q 130 200 60 200"
              fill="none"
              stroke="rgba(148,163,184,0.25)"
              stroke-width="2"
              stroke-dasharray="5 4"
            />

            <!-- Particles -->
            <circle
              v-for="p in particles"
              :key="p.id"
              :cx="p.x"
              :cy="p.y"
              r="4"
              fill="#60a5fa"
              filter="url(#glow-rose)"
              opacity="0.9"
            />

            <!-- Nodes -->
            <!-- VTA -->
            <g transform="translate(60, 180)">
              <circle
                r="28"
                :fill="vtaFill"
                stroke="#3b82f6"
                stroke-width="2"
                filter="url(#glow-blue)"
              />
              <text y="5" text-anchor="middle" fill="#e2e8f0" font-size="11" font-weight="bold">VTA</text>
              <text y="42" text-anchor="middle" fill="#60a5fa" font-size="9" font-family="Share Tech Mono">多巴胺源</text>
            </g>

            <!-- NAc -->
            <g transform="translate(180, 140)">
              <circle
                r="32"
                :fill="nacFill"
                stroke="#8b5cf6"
                stroke-width="2"
                filter="url(#glow-blue)"
              />
              <text y="5" text-anchor="middle" fill="#e2e8f0" font-size="11" font-weight="bold">NAc</text>
              <text y="46" text-anchor="middle" fill="#a78bfa" font-size="9" font-family="Share Tech Mono">奖赏中枢</text>
            </g>

            <!-- PFC -->
            <g transform="translate(300, 80)">
              <circle
                r="30"
                :fill="pfcFill"
                stroke="#ec4899"
                stroke-width="2"
                filter="url(#glow-blue)"
              />
              <text y="5" text-anchor="middle" fill="#e2e8f0" font-size="11" font-weight="bold">PFC</text>
              <text y="44" text-anchor="middle" fill="#f472b6" font-size="9" font-family="Share Tech Mono">决策评估</text>
            </g>
          </svg>
        </div>

        <!-- RPE gauge -->
        <div class="border border-slate-800 rounded-lg bg-slate-900/40 p-4">
          <h4 class="text-xs font-semibold text-slate-400 mb-3">奖赏预测误差 (Reward Prediction Error)</h4>
          <div class="relative h-6 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
            <div class="absolute inset-0 flex">
              <div class="flex-1 bg-gradient-to-r from-blue-900/40 to-transparent"></div>
              <div class="flex-1 bg-gradient-to-l from-rose-900/40 to-transparent"></div>
            </div>
            <div
              class="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)] transition-all duration-300"
              :style="{ left: rpePercent + '%' }"
            ></div>
            <div class="absolute inset-0 flex items-center justify-center text-[9px] font-mono text-slate-400">
              <span>预期过低</span>
              <span class="mx-4">预期匹配</span>
              <span>预期过高</span>
            </div>
          </div>
          <div class="flex justify-between mt-2 text-[10px] font-mono">
            <span class="text-blue-400">RPE: {{ rpeDisplay }}</span>
            <span :class="rpeClass">{{ rpeText }}</span>
          </div>
        </div>
      </div>

      <!-- Chart & controls -->
      <div class="lg:col-span-7 flex flex-col gap-4">
        <div class="border border-slate-800 rounded-lg bg-slate-900/40 p-4 flex-grow min-h-[240px] relative overflow-hidden">
          <div class="flex justify-between items-center mb-2">
            <h4 class="text-xs font-semibold text-slate-400">多巴胺 / 渴求 / 满足 动态曲线</h4>
            <div class="flex items-center gap-3 text-[10px] font-mono">
              <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-blue-400"></span>多巴胺</span>
              <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-rose-400"></span>渴求</span>
              <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-emerald-400"></span>满足</span>
            </div>
          </div>
          <div class="relative flex-grow min-h-[180px]">
            <canvas ref="chartCanvas" class="w-full h-full absolute inset-0"></canvas>
          </div>
        </div>

        <!-- Sliders -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="border border-slate-800 rounded-lg bg-slate-900/40 p-4">
            <h4 class="text-xs font-semibold text-slate-400 mb-3">奖赏输入</h4>
            <div class="space-y-4">
              <div>
                <div class="flex justify-between text-[10px] text-slate-500 mb-1">
                  <span>实际奖赏强度</span>
                  <span class="font-mono text-blue-400">{{ Math.round(rewardValue) }}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  :value="rewardValue"
                  @input="onRewardInput"
                  class="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
              </div>
              <div>
                <div class="flex justify-between text-[10px] text-slate-500 mb-1">
                  <span>预期奖赏强度</span>
                  <span class="font-mono text-purple-400">{{ Math.round(expectedReward) }}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  :value="expectedReward"
                  @input="onExpectedInput"
                  class="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
              </div>
            </div>
          </div>

          <div class="border border-slate-800 rounded-lg bg-slate-900/40 p-4">
            <h4 class="text-xs font-semibold text-slate-400 mb-3">状态指标</h4>
            <div class="grid grid-cols-2 gap-2">
              <div class="bg-slate-950/80 rounded p-2 border border-slate-800">
                <span class="text-[9px] text-slate-500 block">多巴胺爆发</span>
                <span class="text-sm font-mono font-bold text-blue-300">{{ Math.round(dopamineBurst) }}</span>
              </div>
              <div class="bg-slate-950/80 rounded p-2 border border-slate-800">
                <span class="text-[9px] text-slate-500 block">渴求 / 动机</span>
                <span class="text-sm font-mono font-bold text-rose-300">{{ Math.round(craving) }}</span>
              </div>
              <div class="bg-slate-950/80 rounded p-2 border border-slate-800">
                <span class="text-[9px] text-slate-500 block">满足 / 饱足</span>
                <span class="text-sm font-mono font-bold text-emerald-300">{{ Math.round(satiety) }}</span>
              </div>
              <div class="bg-slate-950/80 rounded p-2 border border-slate-800">
                <span class="text-[9px] text-slate-500 block">耐受指数</span>
                <span class="text-sm font-mono font-bold text-amber-300">{{ Math.round(tolerance) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Presets -->
        <div class="border border-slate-800 rounded-lg bg-slate-900/40 p-4">
          <h4 class="text-xs font-semibold text-slate-400 mb-3">场景预设</h4>
          <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
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
import { Chart, LineController, LineElement, PointElement, LinearScale, Title, Tooltip, Legend, Filler, CategoryScale } from 'chart.js'
import { useAudio } from '../composables/useAudio.js'

Chart.register(LineController, LineElement, PointElement, LinearScale, Title, Tooltip, Legend, Filler, CategoryScale)

const props = defineProps({
  levels: { type: Object, required: true },
  psychologicalState: { type: Object, required: true }
})

const emit = defineEmits(['update-levels'])
const { playSound } = useAudio()

const rewardValue = ref(35)
const expectedReward = ref(30)
const dopamineBurst = ref(15)
const craving = ref(20)
const satiety = ref(25)
const tolerance = ref(10)
const withdrawal = ref(0)
const particles = ref([])
const chartCanvas = ref(null)
let chart = null
let animationId = null
let particleIdCounter = 0

const dopamineHistory = Array(120).fill(15)
const cravingHistory = Array(120).fill(20)
const satietyHistory = Array(120).fill(25)

const presets = [
  { id: 'reward-baseline', label: '基线静息', icon: 'fa-solid fa-bed', class: 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800' },
  { id: 'reward-natural', label: '自然奖赏', icon: 'fa-solid fa-apple-whole', class: 'bg-emerald-950/40 border-emerald-800/50 text-emerald-300 hover:bg-emerald-900/50' },
  { id: 'reward-expected', label: '预期之内', icon: 'fa-solid fa-check-circle', class: 'bg-blue-950/40 border-blue-800/50 text-blue-300 hover:bg-blue-900/50' },
  { id: 'reward-surprise', label: '意外大奖', icon: 'fa-solid fa-star', class: 'bg-yellow-950/40 border-yellow-800/50 text-yellow-300 hover:bg-yellow-900/50' },
  { id: 'reward-addiction', label: '成瘾物质', icon: 'fa-solid fa-pills', class: 'bg-rose-950/40 border-rose-800/50 text-rose-300 hover:bg-rose-900/50' },
  { id: 'reward-withdrawal', label: '戒断反应', icon: 'fa-solid fa-heart-crack', class: 'bg-purple-950/40 border-purple-800/50 text-purple-300 hover:bg-purple-900/50' }
]

const rpe = computed(() => rewardValue.value - expectedReward.value)

const rpePercent = computed(() => {
  return Math.max(5, Math.min(95, 50 + rpe.value * 0.45))
})

const rpeDisplay = computed(() => {
  const v = rpe.value
  return (v > 0 ? '+' : '') + Math.round(v)
})

const rpeText = computed(() => {
  const v = rpe.value
  if (v > 25) return '意外奖赏 → 多巴胺爆发'
  if (v > 5) return '略高于预期'
  if (v >= -5) return '预期匹配'
  if (v >= -25) return '低于预期'
  return '奖赏缺失 → 多巴胺下降'
})

const rpeClass = computed(() => {
  const v = rpe.value
  if (v > 10) return 'text-blue-400'
  if (v < -10) return 'text-rose-400'
  return 'text-slate-400'
})

const vtaFill = computed(() => {
  const alpha = 0.15 + (dopamineBurst.value / 100) * 0.5
  return `rgba(59, 130, 246, ${alpha})`
})

const nacFill = computed(() => {
  const alpha = 0.15 + (dopamineBurst.value / 100) * 0.55
  return `rgba(139, 92, 246, ${alpha})`
})

const pfcFill = computed(() => {
  const alpha = 0.15 + (satiety.value / 100) * 0.4
  return `rgba(236, 72, 153, ${alpha})`
})

function initChart() {
  const ctx = chartCanvas.value.getContext('2d')
  const labels = Array.from({ length: 120 }, (_, i) => i)

  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: '多巴胺爆发',
          data: [...dopamineHistory],
          borderColor: '#60a5fa',
          backgroundColor: 'rgba(96, 165, 250, 0.1)',
          borderWidth: 2,
          tension: 0.4,
          fill: true,
          pointRadius: 0
        },
        {
          label: '渴求',
          data: [...cravingHistory],
          borderColor: '#fb7185',
          backgroundColor: 'transparent',
          borderWidth: 1.5,
          tension: 0.4,
          pointRadius: 0,
          borderDash: [4, 4]
        },
        {
          label: '满足',
          data: [...satietyHistory],
          borderColor: '#34d399',
          backgroundColor: 'transparent',
          borderWidth: 1.5,
          tension: 0.4,
          pointRadius: 0
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      interaction: { intersect: false, mode: 'index' },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(2, 6, 23, 0.9)',
          titleColor: '#94a3b8',
          bodyColor: '#e2e8f0',
          borderColor: 'rgba(148, 163, 184, 0.2)',
          borderWidth: 1,
          displayColors: true,
          callbacks: {
            title: () => '奖赏动态'
          }
        }
      },
      scales: {
        x: { display: false },
        y: {
          min: 0,
          max: 100,
          grid: { color: 'rgba(51, 65, 85, 0.3)' },
          ticks: { color: '#64748b', font: { size: 9, family: 'Share Tech Mono' }, stepSize: 25 }
        }
      }
    }
  })
}

function spawnParticles(count) {
  const burst = Math.floor(count / 8)
  for (let i = 0; i < burst; i++) {
    particles.value.push({
      id: particleIdCounter++,
      t: 0,
      speed: 0.008 + Math.random() * 0.012
    })
  }
  if (particles.value.length > 80) {
    particles.value.splice(0, particles.value.length - 80)
  }
}

function updateParticles() {
  const path = getPathPoints()
  particles.value = particles.value.map(p => {
    p.t += p.speed
    if (p.t >= 1) p.t = 1
    const idx = Math.floor(p.t * (path.length - 1))
    const pt = path[idx] || path[path.length - 1]
    return { ...p, x: pt.x, y: pt.y }
  }).filter(p => p.t < 1)
}

function getPathPoints() {
  // Quadratic bezier sampling for VTA(60,180) -> NAc(180,140) -> PFC(300,80)
  const points = []
  for (let i = 0; i <= 100; i++) {
    const t = i / 100
    // VTA -> NAc control point (130, 180)
    const x1 = (1 - t) * (1 - t) * 60 + 2 * (1 - t) * t * 130 + t * t * 180
    const y1 = (1 - t) * (1 - t) * 180 + 2 * (1 - t) * t * 180 + t * t * 140
    points.push({ x: x1, y: y1 })
  }
  for (let i = 0; i <= 100; i++) {
    const t = i / 100
    // NAc -> PFC control point (230, 100)
    const x2 = (1 - t) * (1 - t) * 180 + 2 * (1 - t) * t * 230 + t * t * 300
    const y2 = (1 - t) * (1 - t) * 140 + 2 * (1 - t) * t * 100 + t * t * 80
    points.push({ x: x2, y: y2 })
  }
  return points
}

function updateSimulation() {
  const r = rpe.value

  // Dopamine burst driven by RPE
  const targetDopamine = Math.max(5, Math.min(100, 15 + r * 1.2))
  dopamineBurst.value += (targetDopamine - dopamineBurst.value) * 0.08

  // Satiety from actual reward
  satiety.value += (rewardValue.value * 0.7 - satiety.value) * 0.03

  // Tolerance builds with chronic high dopamine
  if (dopamineBurst.value > 70) tolerance.value = Math.min(100, tolerance.value + 0.03)
  else tolerance.value = Math.max(0, tolerance.value - 0.015)

  // Withdrawal from high tolerance + low dopamine
  withdrawal.value = tolerance.value * 0.6 * (1 - dopamineBurst.value / 100)

  // Craving: driven by dopamine crash and withdrawal
  const targetCraving = dopamineBurst.value * 0.5 + withdrawal.value * 0.9 - satiety.value * 0.4
  craving.value += (targetCraving - craving.value) * 0.04
  craving.value = Math.max(0, Math.min(100, craving.value))

  // Histories
  dopamineHistory.push(dopamineBurst.value)
  dopamineHistory.shift()
  cravingHistory.push(craving.value)
  cravingHistory.shift()
  satietyHistory.push(satiety.value)
  satietyHistory.shift()

  if (chart) {
    chart.data.datasets[0].data = [...dopamineHistory]
    chart.data.datasets[1].data = [...cravingHistory]
    chart.data.datasets[2].data = [...satietyHistory]
    chart.update('none')
  }

  spawnParticles(dopamineBurst.value)
  updateParticles()
}

function animate() {
  updateSimulation()
  animationId = requestAnimationFrame(animate)
}

function syncDopamine() {
  const targetDA = Math.round(Math.max(10, Math.min(100, 30 + dopamineBurst.value * 0.6)))
  if (Math.abs(props.levels.dopamine - targetDA) > 2) {
    emit('update-levels', { ...props.levels, dopamine: targetDA })
  }
}

function onRewardInput(e) {
  rewardValue.value = Number(e.target.value)
  syncDopamine()
}

function onExpectedInput(e) {
  expectedReward.value = Number(e.target.value)
  syncDopamine()
}

function applyPreset(id) {
  playSound(300 + (Math.random() * 400), 0.2)
  const map = {
    'reward-baseline': { reward: 20, expected: 20, tolerance: 5 },
    'reward-natural': { reward: 55, expected: 25, tolerance: 10 },
    'reward-expected': { reward: 50, expected: 50, tolerance: 15 },
    'reward-surprise': { reward: 90, expected: 20, tolerance: 10 },
    'reward-addiction': { reward: 95, expected: 70, tolerance: 60 },
    'reward-withdrawal': { reward: 10, expected: 60, tolerance: 75 }
  }
  const cfg = map[id]
  if (!cfg) return
  rewardValue.value = cfg.reward
  expectedReward.value = cfg.expected
  tolerance.value = cfg.tolerance
  syncDopamine()
}

watch(() => props.levels.dopamine, (da) => {
  const expectedDA = Math.round(30 + dopamineBurst.value * 0.6)
  if (Math.abs(da - expectedDA) > 5) {
    const targetBurst = Math.max(0, Math.min(100, (da - 30) / 0.6))
    dopamineBurst.value = targetBurst
  }
}, { immediate: false })

onMounted(() => {
  initChart()
  animate()
})

onUnmounted(() => {
  if (animationId) cancelAnimationFrame(animationId)
  if (chart) chart.destroy()
})
</script>
