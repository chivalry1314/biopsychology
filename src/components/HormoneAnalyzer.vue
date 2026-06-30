<template>
  <div class="quantum-panel p-5 relative overflow-hidden flex flex-col h-full">
    <div class="flex justify-between items-center mb-4 z-10">
      <div>
        <h2 class="text-base font-bold text-slate-200 flex items-center gap-2">
          <i class="fa-solid fa-brain text-emerald-400"></i>
          多递质协同心理模型分析仪
        </h2>
        <p class="text-[11px] text-slate-500">利用量子心理模型分析多种生理化学底物对人类复杂情感、行为的综合决定论</p>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow">
      <div class="border border-slate-900 rounded-lg bg-slate-900/30 p-3 flex flex-col justify-between">
        <h4 class="text-xs font-semibold text-slate-400 mb-2">多向度人类心理状态空间坐标</h4>
        <div class="relative flex-grow flex items-center justify-center min-h-[220px]">
          <canvas ref="radarCanvas"></canvas>
        </div>
      </div>

      <div class="border border-slate-900 rounded-lg bg-slate-900/30 p-4 flex flex-col justify-between">
        <h4 class="text-xs font-semibold text-slate-400 mb-4">植物性神经系统平衡指数 (ANS)</h4>

        <div class="space-y-4">
          <div>
            <div class="flex justify-between text-[11px] mb-1">
              <span class="text-rose-400"><i class="fa-solid fa-fire"></i> 交感神经系统 (战斗)</span>
              <span class="text-emerald-400"><i class="fa-solid fa-droplet"></i> 副交感神经系统 (放松)</span>
            </div>
            <div class="w-full bg-slate-950 h-3 rounded-full relative overflow-hidden flex">
              <div class="bg-gradient-to-r from-rose-500 to-rose-400 h-full transition-all duration-500" :style="{ width: `${sympathetic}%` }"></div>
              <div class="bg-gradient-to-r from-emerald-400 to-emerald-500 h-full transition-all duration-500" :style="{ width: `${parasympathetic}%` }"></div>
            </div>
            <div class="flex justify-between text-[10px] font-mono-tech text-slate-500 mt-1">
              <span>{{ sympathetic }}% 觉醒度</span>
              <span>{{ parasympathetic }}% 稳态</span>
            </div>
          </div>

          <div class="bg-slate-950/80 rounded-lg p-3 border border-slate-800/80">
            <span class="text-[10px] text-purple-400 font-mono-tech block mb-1">生理心理医学关联分析 (Biomedical Insight):</span>
            <p class="text-xs text-slate-300 leading-relaxed">{{ clinicalExplanation }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'

const props = defineProps({
  levels: {
    type: Object,
    required: true
  }
})

const radarCanvas = ref(null)
let chartInstance = null

const sympathetic = ref(50)
const parasympathetic = ref(50)
const clinicalExplanation = ref('')

const labels = [
  '行为驱动 (Drive/Goal)',
  '焦虑应激 (Anxiety/Stress)',
  '感官欣快 (Euphoria)',
  '抑郁阈值 (Depressive Tendency)',
  '自稳态系数 (Homeostasis)',
  '突触可塑性/记忆 (Plasticity)'
]

const chartData = computed(() => {
  const da = props.levels.dopamine
  const se = props.levels.serotonin
  const ne = props.levels.norepinephrine
  const end = props.levels.endorphin

  return [
    Math.min(100, Math.round((da * 0.7) + (ne * 0.3))),
    Math.min(100, Math.max(0, Math.round((ne * 0.8) - (se * 0.4) + 20))),
    Math.min(100, Math.round((end * 0.6) + (da * 0.4))),
    Math.min(100, Math.max(0, Math.round(100 - (se * 0.6) - (da * 0.4)))),
    Math.min(100, Math.round((se * 0.7) + (end * 0.3))),
    Math.min(100, Math.round((da * 0.5) + (se * 0.3) + (ne * 0.2)))
  ]
})

const updateANS = () => {
  const da = props.levels.dopamine
  const se = props.levels.serotonin
  const ne = props.levels.norepinephrine

  if (da > 75 && se > 60 && ne < 55) {
    sympathetic.value = 40
    parasympathetic.value = 60
    clinicalExplanation.value = '当前状态下，多巴胺带来的积极探索意愿配合血清素的内啡肽稳定作用，呈现典型的专注创作或深度沉思相。自主神经系统极为平衡，ANS处于恢复性再生状态。'
  } else if (ne > 75 && da > 65) {
    sympathetic.value = 80
    parasympathetic.value = 20
    clinicalExplanation.value = '由于去甲肾上腺素和多巴胺的高同步率，个体面临外部强烈事件。皮质醇分泌加快，心率上升。利于紧急战斗或高强度攻克难关，但长时间会导致神经衰弱与过度焦虑。'
  } else if (se < 40 && da < 40) {
    sympathetic.value = 30
    parasympathetic.value = 70
    clinicalExplanation.value = '多巴胺奖励中枢迟钝，缺乏行为动机；血清素处于生理匮乏，使得负向情绪敏感度成倍升高，常伴随失眠、精力耗竭、认知弹性崩溃。植物神经系统呈现低阈值钝化。'
  } else if (da > 85 && ne > 85) {
    sympathetic.value = 85
    parasympathetic.value = 15
    clinicalExplanation.value = '皮质下多巴胺过度活跃。可能呈现轻躁狂或多动冲动，神经元活动电位发放率剧烈增加。交感神经处于高亢状态，血管收缩、肌肉张力极高。'
  } else {
    sympathetic.value = 50
    parasympathetic.value = 50
    clinicalExplanation.value = '各项大脑介质处于中立区域。内源性递质在经典负反馈机制下自行调节。自主神经系统无过度唤醒，各生理系统能量代谢均衡，属于生理健康的典范。'
  }
}

const drawRadar = () => {
  const canvas = radarCanvas.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  const rect = canvas.getBoundingClientRect()
  canvas.width = rect.width * dpr
  canvas.height = rect.height * dpr
  ctx.scale(dpr, dpr)

  const w = rect.width
  const h = rect.height
  const cx = w / 2
  const cy = h / 2
  const radius = Math.min(w, h) / 2 - 40
  const count = labels.length
  const data = chartData.value

  ctx.clearRect(0, 0, w, h)

  // Grid
  for (let r = 20; r <= 100; r += 20) {
    ctx.beginPath()
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count - Math.PI / 2
      const x = cx + Math.cos(angle) * radius * (r / 100)
      const y = cy + Math.sin(angle) * radius * (r / 100)
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.closePath()
    ctx.strokeStyle = 'rgba(51, 65, 85, 0.5)'
    ctx.stroke()
  }

  // Axes
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count - Math.PI / 2
    ctx.beginPath()
    ctx.moveTo(cx, cy)
    ctx.lineTo(cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius)
    ctx.strokeStyle = 'rgba(51, 65, 85, 0.5)'
    ctx.stroke()

    ctx.fillStyle = '#94a3b8'
    ctx.font = '10px Inter, Noto Sans SC, sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    const lx = cx + Math.cos(angle) * (radius + 22)
    const ly = cy + Math.sin(angle) * (radius + 22)
    ctx.fillText(labels[i], lx, ly)
  }

  // Data polygon
  ctx.beginPath()
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count - Math.PI / 2
    const value = data[i] / 100
    const x = cx + Math.cos(angle) * radius * value
    const y = cy + Math.sin(angle) * radius * value
    if (i === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  }
  ctx.closePath()
  ctx.fillStyle = 'rgba(59, 130, 246, 0.25)'
  ctx.fill()
  ctx.strokeStyle = '#3b82f6'
  ctx.lineWidth = 2
  ctx.stroke()

  // Points
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count - Math.PI / 2
    const value = data[i] / 100
    const x = cx + Math.cos(angle) * radius * value
    const y = cy + Math.sin(angle) * radius * value
    ctx.beginPath()
    ctx.arc(x, y, 4, 0, Math.PI * 2)
    ctx.fillStyle = '#60a5fa'
    ctx.fill()
    ctx.strokeStyle = '#fff'
    ctx.lineWidth = 1
    ctx.stroke()
  }
}

onMounted(() => {
  updateANS()
  drawRadar()
  window.addEventListener('resize', drawRadar)
})

onUnmounted(() => {
  window.removeEventListener('resize', drawRadar)
})

watch(() => props.levels, () => {
  updateANS()
  drawRadar()
}, { deep: true })
</script>
