<template>
  <div class="flex flex-col h-full">
    <div class="flex justify-between items-center mb-4 z-10">
      <div>
        <h2 class="text-base font-bold text-slate-200 flex items-center gap-2">
          <i class="fa-solid fa-heart-pulse text-rose-400"></i>
          自主神经系统平衡仪 (ANS Balance)
        </h2>
        <p class="text-[11px] text-slate-500">实时模拟交感神经与副交感神经的相对激活，观察心率、呼吸、瞳孔等生理指标变化</p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-grow overflow-y-auto">
      <!-- Left: Gauge + Sliders -->
      <div class="lg:col-span-5 flex flex-col gap-4">
        <div class="border border-slate-800 rounded-lg bg-slate-900/40 p-4 flex flex-col items-center justify-center min-h-[220px]">
          <h4 class="text-xs font-semibold text-slate-400 mb-2 w-full">ANS 平衡仪表盘</h4>
          <canvas ref="gaugeCanvas" width="280" height="160" class="w-full max-w-[280px] h-[160px]"></canvas>
          <div class="flex justify-between w-full max-w-[280px] text-[10px] mt-2">
            <span class="text-emerald-400 font-mono">副交感主导</span>
            <span class="text-slate-500 font-mono">{{ balanceLabel }}</span>
            <span class="text-rose-400 font-mono">交感主导</span>
          </div>
        </div>

        <div class="border border-slate-800 rounded-lg bg-slate-900/40 p-4 space-y-5">
          <h4 class="text-xs font-semibold text-slate-400">手动调节神经张力</h4>

          <div>
            <div class="flex justify-between text-[11px] mb-1">
              <span class="text-rose-400"><i class="fa-solid fa-fire-flame-curved"></i> 交感神经</span>
              <span class="text-rose-400 font-mono">{{ localSympathetic }}%</span>
            </div>
            <input
              :value="localSympathetic"
              type="range"
              min="5"
              max="95"
              step="1"
              class="ans-slider sympathetic"
              @input="onSympatheticInput"
              @pointerdown="isUserInteracting = true"
              @pointerup="isUserInteracting = false"
            />
            <p class="text-[10px] text-slate-500 mt-1">负责战斗/逃跑、心率加快、警觉提升</p>
          </div>

          <div>
            <div class="flex justify-between text-[11px] mb-1">
              <span class="text-emerald-400"><i class="fa-solid fa-leaf"></i> 副交感神经</span>
              <span class="text-emerald-400 font-mono">{{ localParasympathetic }}%</span>
            </div>
            <input
              :value="localParasympathetic"
              type="range"
              min="5"
              max="95"
              step="1"
              class="ans-slider parasympathetic"
              @input="onParasympatheticInput"
              @pointerdown="isUserInteracting = true"
              @pointerup="isUserInteracting = false"
            />
            <p class="text-[10px] text-slate-500 mt-1">负责休息/消化、心率减慢、细胞修复</p>
          </div>
        </div>

        <div class="border border-slate-800 rounded-lg bg-slate-900/40 p-4">
          <h4 class="text-xs font-semibold text-slate-400 mb-3">快速场景预设</h4>
          <div class="grid grid-cols-2 gap-2">
            <button
              v-for="preset in presets"
              :key="preset.id"
              @click="applyPreset(preset.id)"
              class="px-2 py-2 rounded text-[10px] font-semibold border transition-all"
              :class="preset.class"
            >
              <i :class="preset.icon" class="mr-1"></i>{{ preset.label }}
            </button>
          </div>
        </div>
      </div>

      <!-- Middle: Body Diagram -->
      <div class="lg:col-span-4 flex flex-col gap-4">
        <div class="border border-slate-800 rounded-lg bg-slate-900/40 p-4 flex flex-col items-center justify-center flex-grow min-h-[260px]">
          <h4 class="text-xs font-semibold text-slate-400 mb-3 w-full">生理系统激活图</h4>
          <svg viewBox="0 0 200 320" class="w-full max-w-[200px] h-auto">
            <!-- Body outline -->
            <ellipse cx="100" cy="35" rx="22" ry="26" fill="none" stroke="#475569" stroke-width="2" />
            <path d="M100 62 L100 155" stroke="#475569" stroke-width="2" />
            <path d="M70 95 Q55 130 60 165" stroke="#475569" stroke-width="2" fill="none" />
            <path d="M130 95 Q145 130 140 165" stroke="#475569" stroke-width="2" fill="none" />
            <path d="M85 155 L70 270" stroke="#475569" stroke-width="2" />
            <path d="M115 155 L130 270" stroke="#475569" stroke-width="2" />

            <!-- Brain -->
            <circle cx="100" cy="30" r="10" :fill="brainColor" opacity="0.9" />

            <!-- Eyes / pupils -->
            <circle cx="92" cy="32" r="3" fill="#0f172a" />
            <circle cx="108" cy="32" r="3" fill="#0f172a" />
            <circle cx="92" cy="32" :r="pupilSize" fill="#f59e0b" opacity="0.85" />
            <circle cx="108" cy="32" :r="pupilSize" fill="#f59e0b" opacity="0.85" />

            <!-- Heart -->
            <path
              d="M100 88 C95 82, 85 82, 85 92 C85 102, 100 112, 100 112 C100 112, 115 102, 115 92 C115 82, 105 82, 100 88"
              :fill="heartColor"
              opacity="0.9"
            />

            <!-- Lungs -->
            <ellipse cx="82" cy="115" rx="12" ry="18" :fill="lungColor" opacity="0.8" />
            <ellipse cx="118" cy="115" rx="12" ry="18" :fill="lungColor" opacity="0.8" />

            <!-- Sweat glands (skin) -->
            <circle cx="65" cy="100" :r="sweatRadius" :fill="sweatColor" opacity="0.8" />
            <circle cx="135" cy="100" :r="sweatRadius" :fill="sweatColor" opacity="0.8" />
            <circle cx="60" cy="140" :r="sweatRadius" :fill="sweatColor" opacity="0.8" />
            <circle cx="140" cy="140" :r="sweatRadius" :fill="sweatColor" opacity="0.8" />

            <!-- Stomach / digestion -->
            <ellipse cx="100" cy="165" rx="18" ry="14" :fill="digestColor" opacity="0.85" />

            <!-- Labels -->
            <text x="160" y="32" fill="#94a3b8" font-size="8" font-family="Noto Sans SC">大脑</text>
            <text x="130" y="92" fill="#94a3b8" font-size="8" font-family="Noto Sans SC">心脏</text>
            <text x="138" y="118" fill="#94a3b8" font-size="8" font-family="Noto Sans SC">呼吸</text>
            <text x="28" y="100" fill="#94a3b8" font-size="8" font-family="Noto Sans SC">汗腺</text>
            <text x="130" y="168" fill="#94a3b8" font-size="8" font-family="Noto Sans SC">消化</text>
          </svg>
        </div>

        <div class="border border-slate-800 rounded-lg bg-slate-950/80 p-4">
          <span class="text-[10px] text-purple-400 font-mono block mb-1">生理心理解读:</span>
          <p class="text-xs text-slate-300 leading-relaxed">{{ interpretation }}</p>
        </div>
      </div>

      <!-- Right: Metrics -->
      <div class="lg:col-span-3 flex flex-col gap-3">
        <h4 class="text-xs font-semibold text-slate-400">实时生理指标</h4>

        <div
          v-for="metric in metrics"
          :key="metric.id"
          class="border border-slate-800 rounded-lg bg-slate-900/40 p-3"
        >
          <div class="flex justify-between items-center mb-2">
            <span class="text-[11px] text-slate-400"><i :class="metric.icon" class="mr-1"></i>{{ metric.label }}</span>
            <span class="text-sm font-mono font-bold" :class="metric.color">{{ metric.value }}</span>
          </div>
          <div class="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
            <div
              class="h-full rounded-full transition-all duration-300"
              :class="metric.barColor"
              :style="{ width: metric.percent + '%' }"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'

const props = defineProps({
  levels: { type: Object, required: true },
  psychologicalState: { type: Object, required: true },
  active: { type: Boolean, default: false }
})

const emit = defineEmits(['update-levels', 'apply-preset'])

const gaugeCanvas = ref(null)
let animationId = null

// Local slider state
const localSympathetic = ref(50)
const localParasympathetic = ref(50)
const isUserInteracting = ref(false)

// Sync local sliders when props change (from App.vue / other components)
// Skip while user is dragging to avoid fighting the slider
watch(() => props.psychologicalState, (state) => {
  if (!state || isUserInteracting.value) return
  const newS = Math.round(state.sympathetic)
  const newP = Math.round(state.parasympathetic)
  // Only update if significantly different to avoid micro-jumps
  if (Math.abs(newS - localSympathetic.value) > 2) {
    localSympathetic.value = newS
  }
  if (Math.abs(newP - localParasympathetic.value) > 2) {
    localParasympathetic.value = newP
  }
}, { immediate: true, deep: true })

function emitLevelsFromANS() {
  const s = localSympathetic.value
  const p = localParasympathetic.value
  const newLevels = {
    norepinephrine: Math.round(s),
    serotonin: Math.round(p),
    dopamine: Math.round(50 + (s - p) * 0.25),
    endorphin: Math.round(40 + p * 0.4)
  }
  emit('update-levels', newLevels)
}

function onSympatheticInput(e) {
  localSympathetic.value = parseInt(e.target.value, 10)
  emitLevelsFromANS()
}

function onParasympatheticInput(e) {
  localParasympathetic.value = parseInt(e.target.value, 10)
  emitLevelsFromANS()
}

const presets = [
  { id: 'deep-relax', label: '深度放松', icon: 'fa-solid fa-spa', class: 'bg-emerald-950/50 border-emerald-700/50 text-emerald-300 hover:bg-emerald-900/50' },
  { id: 'exam-stress', label: '考试压力', icon: 'fa-solid fa-book-open', class: 'bg-amber-950/50 border-amber-700/50 text-amber-300 hover:bg-amber-900/50' },
  { id: 'intense-exercise', label: '剧烈运动', icon: 'fa-solid fa-person-running', class: 'bg-rose-950/50 border-rose-700/50 text-rose-300 hover:bg-rose-900/50' },
  { id: 'panic-attack', label: '惊恐发作', icon: 'fa-solid fa-bolt', class: 'bg-purple-950/50 border-purple-700/50 text-purple-300 hover:bg-purple-900/50' }
]

function applyPreset(id) {
  emit('apply-preset', `ans-${id}`)
}

// Computed metrics
const S = computed(() => localSympathetic.value)
const P = computed(() => localParasympathetic.value)
const diff = computed(() => S.value - P.value)

const heartRate = computed(() => Math.round(60 + diff.value * 0.4))
const hrv = computed(() => Math.round(100 - Math.abs(diff.value)))
const respRate = computed(() => (12 + diff.value * 0.08).toFixed(1))
const pupilSize = computed(() => (2 + S.value * 0.03).toFixed(1))
const gsr = computed(() => Math.round(S.value * 0.8))
const digestion = computed(() => Math.round(P.value * 0.9))

const metrics = computed(() => [
  { id: 'hr', label: '心率 HR', value: `${heartRate.value} bpm`, percent: heartRate.value - 40, icon: 'fa-solid fa-heart', color: 'text-rose-400', barColor: 'bg-rose-400' },
  { id: 'hrv', label: '心率变异性 HRV', value: `${hrv.value} ms`, percent: hrv.value, icon: 'fa-solid fa-wave-square', color: 'text-cyan-400', barColor: 'bg-cyan-400' },
  { id: 'resp', label: '呼吸频率', value: `${respRate.value} /min`, percent: (respRate.value - 8) * 5, icon: 'fa-solid fa-lungs', color: 'text-blue-400', barColor: 'bg-blue-400' },
  { id: 'pupil', label: '瞳孔直径', value: `${pupilSize.value} mm`, percent: (pupilSize.value - 2) * 25, icon: 'fa-solid fa-eye', color: 'text-amber-400', barColor: 'bg-amber-400' },
  { id: 'gsr', label: '皮肤电反应', value: `${gsr.value} μS`, percent: gsr.value, icon: 'fa-solid fa-hand-dots', color: 'text-purple-400', barColor: 'bg-purple-400' },
  { id: 'digest', label: '消化活性', value: `${digestion.value}%`, percent: digestion.value, icon: 'fa-solid fa-utensils', color: 'text-emerald-400', barColor: 'bg-emerald-400' }
])

const balanceLabel = computed(() => {
  const ratio = S.value / (S.value + P.value)
  if (ratio < 0.35) return '恢复性主导'
  if (ratio < 0.45) return '轻度放松'
  if (ratio < 0.55) return '动态平衡'
  if (ratio < 0.70) return '警觉激活'
  return '应激唤醒'
})

const interpretation = computed(() => {
  if (S.value > 75) {
    return '交感神经高度激活：心率加快、瞳孔放大、皮肤出汗增加，血液从消化系统重新分配到骨骼肌。这是典型的战斗或逃跑反应，适合应对急性挑战，但长期维持会导致焦虑、失眠与免疫抑制。'
  }
  if (P.value > 75) {
    return '副交感神经高度激活：心率减慢、呼吸变深、消化活动增强。身体处于休息与消化模式，有利于细胞修复、记忆巩固和免疫再生。过度副交感优势可能表现为嗜睡或反应迟缓。'
  }
  if (Math.abs(diff.value) < 15) {
    return '交感与副交感系统处于协调平衡状态。自主神经系统能有效切换应对与恢复，这是心理韧性与生理健康的基础。'
  }
  if (S.value > P.value) {
    return '交感神经略占优势：身体处于轻度警觉状态，注意力集中，代谢率上升。适合学习、运动或任务执行，但需注意适时放松以避免慢性压力。'
  }
  return '副交感神经略占优势：身体偏向放松与恢复，适合休息、冥想或餐后消化。'
})

// SVG colors
const brainColor = computed(() => {
  const t = S.value / 100
  const r = Math.round(16 + (239 - 16) * t)
  const g = Math.round(185 + (68 - 185) * t)
  const b = Math.round(129 + (68 - 129) * t)
  return `rgb(${r}, ${g}, ${b})`
})

const heartColor = computed(() => {
  const intensity = S.value / 100
  const r = Math.round(244 * 0.3 + 244 * 0.7 * intensity)
  const g = Math.round(63 * 0.3 + 63 * 0.7 * (1 - intensity))
  const b = Math.round(94 * 0.3 + 94 * 0.7 * (1 - intensity))
  return `rgb(${r}, ${g}, ${b})`
})

const lungColor = computed(() => {
  const t = S.value / 100
  return `rgb(${100 + 100 * t}, ${150 + 80 * (1 - t)}, ${230})`
})

const sweatColor = computed(() => '#a855f7')
const sweatRadius = computed(() => 2 + (S.value / 100) * 5)

const digestColor = computed(() => {
  const t = P.value / 100
  return `rgb(${50 + 50 * (1 - t)}, ${180 + 40 * t}, ${130 + 40 * t})`
})

// Canvas gauge drawing
function drawGauge() {
  const canvas = gaugeCanvas.value
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
  const cx = w / 2
  const cy = h - 20
  const radius = Math.max(10, Math.min(w, h * 2) / 2 - 10)
  if (radius <= 0) return

  ctx.clearRect(0, 0, w, h)

  // Background arc
  const startAngle = Math.PI
  const endAngle = 2 * Math.PI
  ctx.beginPath()
  ctx.arc(cx, cy, radius, startAngle, endAngle)
  ctx.lineWidth = 12
  ctx.strokeStyle = 'rgba(30, 41, 59, 0.8)'
  ctx.stroke()

  // Gradient arc segments
  const segments = 60
  for (let i = 0; i <= segments; i++) {
    const t = i / segments
    const angle = Math.PI + t * Math.PI
    ctx.beginPath()
    ctx.arc(cx, cy, radius, angle - 0.02, angle + 0.02)
    ctx.lineWidth = 12
    const r = Math.round(16 + 223 * t)
    const g = Math.round(185 - 117 * t)
    const b = Math.round(129 - 61 * t)
    ctx.strokeStyle = `rgb(${r}, ${g}, ${b})`
    ctx.stroke()
  }

  // Tick marks
  for (let i = 0; i <= 10; i++) {
    const t = i / 10
    const angle = Math.PI + t * Math.PI
    const x1 = cx + Math.cos(angle) * (radius - 18)
    const y1 = cy + Math.sin(angle) * (radius - 18)
    const x2 = cx + Math.cos(angle) * (radius - 26)
    const y2 = cy + Math.sin(angle) * (radius - 26)
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.lineWidth = 2
    ctx.strokeStyle = '#64748b'
    ctx.stroke()
  }

  // Needle
  const ratio = S.value / (S.value + P.value)
  const needleAngle = Math.PI + ratio * Math.PI
  const nx = cx + Math.cos(needleAngle) * (radius - 8)
  const ny = cy + Math.sin(needleAngle) * (radius - 8)

  ctx.beginPath()
  ctx.moveTo(cx, cy)
  ctx.lineTo(nx, ny)
  ctx.lineWidth = 4
  ctx.strokeStyle = '#f8fafc'
  ctx.stroke()

  // Center dot
  ctx.beginPath()
  ctx.arc(cx, cy, 6, 0, 2 * Math.PI)
  ctx.fillStyle = '#f8fafc'
  ctx.fill()

  // Center text
  ctx.fillStyle = '#f8fafc'
  ctx.font = 'bold 18px "Share Tech Mono", monospace'
  ctx.textAlign = 'center'
  ctx.fillText(`${Math.round(ratio * 100)}%`, cx, cy - 20)
  ctx.font = '10px "Noto Sans SC", sans-serif'
  ctx.fillStyle = '#94a3b8'
  ctx.fillText('交感指数', cx, cy - 5)
}

function animateGauge() {
  drawGauge()
  animationId = requestAnimationFrame(animateGauge)
}

onMounted(() => {
  animateGauge()
})

onUnmounted(() => {
  if (animationId) cancelAnimationFrame(animationId)
})

watch([S, P], () => {
  drawGauge()
})
</script>

<style scoped>
.ans-slider {
  width: 100%;
  height: 6px;
  border-radius: 3px;
  outline: none;
  -webkit-appearance: none;
  background: rgba(148, 163, 184, 0.2);
}

.ans-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  cursor: pointer;
  border: 2px solid #0f172a;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.5);
}

.ans-slider.sympathetic::-webkit-slider-thumb {
  background: #fb7185;
}

.ans-slider.parasympathetic::-webkit-slider-thumb {
  background: #34d399;
}

.ans-slider::-moz-range-thumb {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  cursor: pointer;
  border: 2px solid #0f172a;
}

.ans-slider.sympathetic::-moz-range-thumb {
  background: #fb7185;
}

.ans-slider.parasympathetic::-moz-range-thumb {
  background: #34d399;
}
</style>
