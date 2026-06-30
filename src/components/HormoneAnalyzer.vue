<template>
  <div class="flex flex-col h-full">
    <div class="flex justify-between items-center mb-4 z-10">
      <div>
        <h2 class="text-base font-bold text-slate-200 flex items-center gap-2">
          <i class="fa-solid fa-brain text-emerald-400"></i>
          多介质递质情绪协同分析仪表盘 (Vue-Chart)
        </h2>
        <p class="text-[11px] text-slate-500">基于您当前的生理化学底层配比，在高级情感状态空间中实时进行傅里叶情绪拓扑预测</p>
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
              <span class="text-rose-400"><i class="fa-solid fa-fire"></i> 交感系统 (ANS 激越)</span>
              <span class="text-emerald-400"><i class="fa-solid fa-droplet"></i> 副交感系统 (自稳态)</span>
            </div>
            <div class="w-full bg-slate-950 h-3 rounded-full relative overflow-hidden flex">
              <div class="bg-gradient-to-r from-rose-500 to-rose-400 h-full transition-all duration-500" :style="{ width: state.sympathetic + '%' }"></div>
              <div class="bg-gradient-to-r from-emerald-400 to-emerald-500 h-full transition-all duration-500" :style="{ width: state.parasympathetic + '%' }"></div>
            </div>
            <div class="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
              <span>{{ state.sympathetic }}% 警醒释放</span>
              <span>{{ state.parasympathetic }}% 细胞恢复</span>
            </div>
          </div>

          <div class="bg-slate-950/80 rounded-lg p-3 border border-slate-800/80">
            <span class="text-[10px] text-purple-400 font-mono block mb-1">生理心理医学关联分析 (Diagnostic Insight):</span>
            <p class="text-xs text-slate-300 leading-relaxed">{{ state.clinicalInsight }}</p>
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

const state = computed(() => {
  const da = props.levels.dopamine
  const se = props.levels.serotonin
  const ne = props.levels.norepinephrine
  const end = props.levels.endorphin

  let dominantText = '平衡、适应性基底稳态 (ANS自平衡)'
  let clinicalInsight = '各项大脑介质处于中立区域。内源性递质在经典负反馈机制下自行调节。自主神经系统无过度唤醒，各生理系统能量代谢均衡，属于生理健康的典范。'
  let sympathetic = 50
  let parasympathetic = 50
  let eegVal = 14.5

  if (da > 75 && se > 60 && ne < 55) {
    dominantText = '认知专注与温和奖赏状态 (DA/5-HT 协同中)'
    clinicalInsight = '当前状态下，多巴胺带来的积极探索意愿配合血清素的内啡肽稳定作用，呈现典型的专注创作或深度沉思相。自主神经系统极为平衡，ANS处于恢复性再生状态。'
    sympathetic = 40
    parasympathetic = 60
    eegVal = 12.8
  } else if (ne > 75 && da > 65) {
    dominantText = '高度警觉与应激唤醒状态 (去甲肾主导)'
    clinicalInsight = '由于去甲肾上腺素和多巴胺的高同步率，个体面临外部强烈事件。皮质醇分泌加快，心率上升。利于紧急战斗或高强度攻克难关，但长时间会导致神经衰弱与过度焦虑。'
    sympathetic = 80
    parasympathetic = 20
    eegVal = 22.4
  } else if (se < 40 && da < 40) {
    dominantText = '能量衰退与心境抑郁倾向'
    clinicalInsight = '多巴胺奖励中枢迟钝，缺乏行为动机；血清素处于生理匮乏，使得负向情绪敏感度成倍升高，常伴随失眠、精力耗竭、认知弹性崩溃。植物神经系统呈现低阈值阻断状态。'
    sympathetic = 30
    parasympathetic = 70
    eegVal = 6.2
  } else if (da > 85 && ne > 85) {
    dominantText = '兴奋冲动与高多巴胺激越'
    clinicalInsight = '皮质下多巴胺过度活跃。可能呈现轻躁狂或多动冲动，神经元活动电位发放率剧烈增加。交感神经处于高亢状态，血管收缩、肌肉张力极高，注意瞬时衰弱明显。'
    sympathetic = 85
    parasympathetic = 15
    eegVal = 28.1
  }

  return { dominantText, clinicalInsight, sympathetic, parasympathetic, eegVal }
})

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

const labels = [
  '行为驱动 (Drive)',
  '焦虑应激 (Anxiety)',
  '感官欣快 (Euphoria)',
  '抑郁倾向 (Depressive)',
  '自我稳定 (Homeostasis)',
  '突触可塑性 (Plasticity)'
]

const initChart = () => {
  const ctx = radarCanvas.value
  if (!ctx || typeof Chart === 'undefined') return

  chartInstance = new Chart(ctx, {
    type: 'radar',
    data: {
      labels,
      datasets: [{
        label: '情绪分子空间指纹',
        data: chartData.value,
        backgroundColor: 'rgba(59, 130, 246, 0.25)',
        borderColor: '#3b82f6',
        borderWidth: 2,
        pointBackgroundColor: '#60a5fa',
        pointBorderColor: '#fff'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        r: {
          angleLines: { color: 'rgba(51, 65, 85, 0.5)' },
          grid: { color: 'rgba(51, 65, 85, 0.5)' },
          pointLabels: {
            color: '#94a3b8',
            font: { family: 'Noto Sans SC', size: 10 }
          },
          ticks: {
            backdropColor: 'transparent',
            color: '#475569',
            font: { family: 'Share Tech Mono', size: 8 },
            max: 100,
            min: 0,
            stepSize: 20
          }
        }
      }
    }
  })
}

const updateChart = () => {
  if (chartInstance) {
    chartInstance.data.datasets[0].data = chartData.value
    chartInstance.update()
  }
}

onMounted(() => {
  initChart()
})

onUnmounted(() => {
  if (chartInstance) {
    chartInstance.destroy()
    chartInstance = null
  }
})

watch(() => props.levels, () => {
  updateChart()
}, { deep: true })
</script>
