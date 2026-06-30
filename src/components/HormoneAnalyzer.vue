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
              <div class="bg-gradient-to-r from-rose-500 to-rose-400 h-full transition-all duration-500" :style="{ width: psychologicalState.sympathetic + '%' }"></div>
              <div class="bg-gradient-to-r from-emerald-400 to-emerald-500 h-full transition-all duration-500" :style="{ width: psychologicalState.parasympathetic + '%' }"></div>
            </div>
            <div class="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
              <span>{{ psychologicalState.sympathetic }}% 警醒释放</span>
              <span>{{ psychologicalState.parasympathetic }}% 细胞恢复</span>
            </div>
          </div>

          <div class="bg-slate-950/80 rounded-lg p-3 border border-slate-800/80">
            <span class="text-[10px] text-purple-400 font-mono block mb-1">生理心理医学关联分析 (Diagnostic Insight):</span>
            <p class="text-xs text-slate-300 leading-relaxed">{{ psychologicalState.clinicalInsight }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import Chart from 'chart.js/auto'

const props = defineProps({
  levels: {
    type: Object,
    required: true
  },
  psychologicalState: {
    type: Object,
    required: true
  },
  active: {
    type: Boolean,
    default: false
  }
})

const radarCanvas = ref(null)
let chartInstance = null

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
  if (!ctx) return

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

watch(() => props.active, (isActive) => {
  if (isActive) {
    setTimeout(() => {
      if (chartInstance) {
        chartInstance.resize()
        updateChart()
      } else {
        initChart()
      }
    }, 50)
  }
})
</script>
