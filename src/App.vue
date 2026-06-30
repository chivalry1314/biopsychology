<template>
  <div class="relative min-h-screen">
    <div class="course-bg"></div>
    <div class="course-grid"></div>

    <!-- Header -->
    <header class="sticky top-0 z-50 border-b border-white/5 bg-[#03040a]/80 backdrop-blur-xl">
      <div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
            <span class="text-sm">🧠</span>
          </div>
          <div class="text-sm font-medium tracking-wide text-slate-300">
            生理心理学 <span class="text-slate-600">|</span> Physiological Psychology
          </div>
        </div>
        <div class="course-pill">
          <span class="course-pill-dot"></span>
          CLASSROOM EDITION
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-6 py-10 relative z-10">
      <!-- Hero Section -->
      <section class="grid lg:grid-cols-2 gap-8 mb-20">
        <!-- Left Column -->
        <div class="space-y-8">
          <div class="space-y-6">
            <div class="course-pill">
              <span class="course-pill-dot"></span>
              PHYSIOLOGICAL PSYCHOLOGY / CLASSROOM EDITION
            </div>

            <h1 class="course-title text-6xl md:text-7xl lg:text-8xl text-white">
              生理心理学
            </h1>

            <div class="course-body max-w-xl space-y-4">
              <p>
                以更直观的 3D 大脑示意图为入口，把 cerebral cortex、limbic system、diencephalon、basal ganglia 与 language network 放进同一页课程框架。
              </p>
              <p>
                中文主叙述配英文对照，面向课堂投屏、双语讲解和复习整理。首屏优先强调结构感和空间层次，而不是平面解剖标签堆叠。
              </p>
            </div>
          </div>

          <div class="flex flex-wrap gap-3">
            <button
              v-for="cat in categories"
              :key="cat.key"
              @click="activeCategory = activeCategory === cat.key ? null : cat.key"
              :class="['course-btn', activeCategory === cat.key ? 'active' : '']"
            >
              {{ cat.en }}
            </button>
            <button
              @click="activeCategory = null"
              :class="['course-btn', activeCategory === null ? 'active' : '']"
            >
              All regions
            </button>
          </div>

          <div class="grid sm:grid-cols-3 gap-4">
            <div
              v-for="cat in categories"
              :key="cat.key"
              class="course-card p-5 relative overflow-hidden group cursor-pointer"
              :class="activeCategory === cat.key ? 'border-white/20' : ''"
              @click="activeCategory = activeCategory === cat.key ? null : cat.key"
            >
              <div class="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500" :class="cat.color"></div>
              <div class="relative z-10">
                <div class="text-[10px] font-bold tracking-[0.15em] text-slate-500 uppercase mb-2">{{ cat.en }}</div>
                <h3 class="text-lg font-bold text-white mb-1">{{ cat.label }}</h3>
                <p class="course-caption">{{ cat.desc }}</p>
              </div>
            </div>
          </div>

          <p class="course-caption max-w-lg">
            页面定位：主图用于建立空间结构印象，功能定位与损伤表现仍按下方课程化摘要阅读。
          </p>
        </div>

        <!-- Right Column -->
        <div class="space-y-6">
          <div class="course-card p-1 relative min-h-[560px]">
            <div class="course-card-glow"></div>
            <div class="absolute top-4 left-5 right-5 flex items-center justify-between z-10">
              <span class="text-xs text-slate-400">Interactive 3D brain model for classroom display</span>
              <span class="course-badge">
                <span class="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                DRAG / ZOOM MODEL
              </span>
            </div>

            <div class="relative h-full rounded-[1.25rem] overflow-hidden bg-[#05060c]">
              <Brain3D @select="selectedRegion = $event" />

              <!-- Floating labels -->
              <div class="absolute top-16 left-5 flex gap-2 z-10">
                <span class="course-badge">
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  REAL 3D MODEL
                </span>
                <span class="course-badge">
                  <span class="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                  LATERAL VIEW FOCUS
                </span>
              </div>

              <!-- Deep structures inset -->
              <div class="absolute top-16 right-5 w-44 course-info-card z-10">
                <div class="text-[10px] font-bold tracking-[0.15em] text-slate-500 uppercase mb-2">Deep Structures Inset</div>
                <h4 class="text-sm font-bold text-white mb-2">内侧/深部结构 Medial + deep view</h4>
                <div class="relative h-24 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center overflow-hidden">
                  <div class="absolute inset-0 flex items-center justify-center">
                    <div v-for="(r, i) in deepRegions" :key="r.en"
                         class="absolute w-6 h-6 rounded-full border border-white/20 flex items-center justify-center"
                         :style="{
                           background: 'rgba(255,255,255,0.08)',
                           top: [25, 45, 60, 40, 70][i] + '%',
                           left: [15, 40, 65, 80, 50][i] + '%'
                         }">
                      <span class="w-2 h-2 rounded-full" :style="{ background: '#' + r.color.toString(16).padStart(6, '0') }"></span>
                    </div>
                  </div>
                </div>
                <p class="course-caption mt-2">
                  把 hippocampus、amygdala、thalamus、hypothalamus 与 basal ganglia 从外侧观分离出来，课堂上更符合解剖展示习惯。
                </p>
              </div>

              <div class="course-corner tl"></div>
              <div class="tech-corner tr"></div>
              <div class="tech-corner bl"></div>
              <div class="tech-corner br"></div>
            </div>
          </div>

          <!-- Interaction Panel -->
          <div class="course-card p-6">
            <h3 class="text-lg font-bold text-white mb-4">交互方式 / Interaction</h3>
            <div class="grid sm:grid-cols-2 gap-4">
              <div class="course-info-card">
                <div class="course-info-label">Selected Region</div>
                <template v-if="selectedRegion">
                  <div class="flex items-center gap-2 mb-2">
                    <span class="w-2.5 h-2.5 rounded-full" :style="{ background: '#' + selectedRegion.color.toString(16).padStart(6, '0') }"></span>
                    <h4 class="text-lg font-bold text-white">{{ selectedRegion.name }} {{ selectedRegion.en }}</h4>
                  </div>
                  <p class="course-caption">{{ selectedRegion.desc }}</p>
                </template>
                <p v-else class="course-caption">点击 3D 模型中的彩色标记选择脑区，查看功能说明。</p>
              </div>
              <div class="course-info-card">
                <div class="course-info-label">Teaching Note</div>
                <template v-if="selectedRegion">
                  <p class="course-caption">{{ selectedRegion.teachingNote }}</p>
                </template>
                <p v-else class="course-caption">选择脑区后将显示课堂教学建议与讲解要点。</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Action Potential -->
      <section id="action-potential" class="mb-20 space-y-6">
        <div class="flex items-center gap-4">
          <h2 class="course-section-title text-3xl text-white">动作电位传导</h2>
          <span class="course-badge">Action Potential</span>
        </div>
        <div class="grid lg:grid-cols-3 gap-6">
          <div class="lg:col-span-2">
            <ActionPotential />
          </div>
          <div class="course-card p-6 space-y-4">
            <h3 class="font-bold text-white">机制说明</h3>
            <p class="course-caption">
              动作电位是神经元膜电位的快速、可传导变化。刺激达到阈值后，Na⁺ 通道开放引发去极化；随后 K⁺ 通道开放引发复极化。
            </p>
            <div class="space-y-2">
              <div class="flex items-center gap-3 text-sm">
                <span class="w-2.5 h-2.5 rounded-full bg-yellow-400"></span>
                <span class="text-slate-300">静息电位 ≈ -70mV</span>
              </div>
              <div class="flex items-center gap-3 text-sm">
                <span class="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                <span class="text-slate-300">去极化：Na⁺ 内流</span>
              </div>
              <div class="flex items-center gap-3 text-sm">
                <span class="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
                <span class="text-slate-300">复极化：K⁺ 外流</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Neurotransmitters -->
      <section id="neurotransmitters" class="mb-20 space-y-6">
        <div class="flex items-center gap-4">
          <h2 class="course-section-title text-3xl text-white">神经递质数据库</h2>
          <span class="course-badge">Neurotransmitters</span>
        </div>
        <Neurotransmitters />
      </section>

      <!-- Sleep -->
      <section id="sleep" class="mb-20 space-y-6">
        <div class="flex items-center gap-4">
          <h2 class="course-section-title text-3xl text-white">睡眠周期分析</h2>
          <span class="course-badge">Sleep Cycle</span>
        </div>
        <div class="course-card p-6">
          <SleepChart />
        </div>
      </section>

      <!-- Footer -->
      <footer class="border-t border-white/5 pt-8 pb-12 text-center">
        <p class="course-caption">
          生理心理学可视化 · Classroom Edition · Vue 3 + Vite + Three.js
        </p>
      </footer>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import Brain3D from './components/Brain3D.vue'
import ActionPotential from './components/ActionPotential.vue'
import Neurotransmitters from './components/Neurotransmitters.vue'
import SleepChart from './components/SleepChart.vue'
import { brainRegions, categories } from './data/brainRegions.js'
import './assets/tech-theme.css'

const selectedRegion = ref(null)
const activeCategory = ref(null)

const deepRegions = computed(() => {
  return brainRegions.filter(r =>
    ['Hippocampus', 'Amygdala', 'Thalamus', 'Hypothalamus', 'Basal Ganglia'].includes(r.fullEn)
  )
})
</script>

<style scoped>
:deep(.canvas-container) {
  border-radius: 1.25rem;
  background: #05060c;
}
</style>
