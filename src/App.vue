<template>
  <div class="min-h-screen flex flex-col justify-between bg-grid">
    <div class="scanlines"></div>

    <AppHeader :synapse-rate="synapseRate" />

    <div class="flex-grow grid grid-cols-1 xl:grid-cols-12 gap-6 p-6 overflow-hidden relative z-10">
      <!-- LEFT COLUMN -->
      <div class="xl:col-span-3 flex flex-col gap-6">
        <!-- Navigation -->
        <div class="bg-slate-950/85 border border-slate-800 rounded-xl p-5 backdrop-blur-md relative overflow-hidden">
          <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
          <h3 class="text-sm font-bold text-slate-300 mb-4 flex items-center gap-2">
            <i class="fa-solid fa-network-wired text-blue-400"></i> 控制中枢 / CORE NAVIGATION
          </h3>
          <div class="space-y-2">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="switchTab(tab.id)"
              class="w-full text-left px-4 py-3 rounded-lg text-sm font-semibold text-slate-300 hover:bg-slate-900 transition-all duration-300 flex items-center justify-between"
              :class="activeTab === tab.id ? 'tab-active' : 'text-slate-400'"
            >
              <span class="flex items-center gap-3"><i :class="tab.icon"></i> {{ tab.label }}</span>
              <i class="fa-solid fa-chevron-right text-xs opacity-60"></i>
            </button>
          </div>
        </div>

        <!-- Neurotransmitter Dashboard -->
        <NeurotransmitterDashboard :levels="ntLevels" @update-levels="updateLevels" />
      </div>

      <!-- MIDDLE COLUMN -->
      <div class="xl:col-span-6 flex flex-col gap-6 min-h-[500px]">
        <!-- Brain Explorer -->
        <div
          v-show="activeTab === 'brain-explorer'"
          class="tab-content flex-grow bg-slate-950/85 border border-slate-800 rounded-xl p-5 backdrop-blur-md flex flex-col relative overflow-hidden"
        >
          <div class="absolute top-0 left-0 w-full h-1 bg-cyan-500/50 scanner-line"></div>

          <div class="flex justify-between items-center mb-2 z-10">
            <div>
              <h2 class="text-base font-bold text-slate-200 flex items-center gap-2">
                <i class="fa-solid fa-circle-dot text-cyan-400 animate-pulse"></i>
                3D 全脑定位与大脑皮层生理图谱
              </h2>
              <p class="text-[11px] text-slate-500">点击不同脑区激活特定的生理心理学神经元通路</p>
            </div>
            <div class="flex items-center space-x-2 text-[10px] font-mono text-slate-400 bg-slate-900/80 px-2 py-1 rounded border border-slate-800">
              <span>ROTATION</span>
              <span class="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
            </div>
          </div>

          <div class="relative flex-grow min-h-[300px] border border-slate-900 rounded-xl bg-gradient-to-b from-slate-950 to-slate-900 overflow-hidden flex items-center justify-center">
            <Brain3D :highlighted-region="selectedRegion" @select="selectRegion" />

            <div class="absolute bottom-3 left-3 bg-slate-950/80 border border-slate-800 px-3 py-2 rounded-lg text-[10px] text-slate-400 flex items-center gap-2 pointer-events-none backdrop-blur-sm">
              <i class="fa-solid fa-arrows-spin text-blue-400 animate-spin"></i>
              <span>拖拽旋转 / 滚轮缩放 / 点击高亮脑区</span>
            </div>

            <div class="absolute top-3 right-3 flex flex-col gap-2 pointer-events-none">
              <div class="bg-slate-950/70 border border-slate-800 px-3 py-1.5 rounded font-mono text-[10px] text-right">
                <span class="text-slate-500">脑电波(EEG):</span>
                <span class="text-cyan-400 font-bold ml-1 animate-pulse">{{ eegFrequency }}</span>
              </div>
            </div>
          </div>

          <div class="mt-4 grid grid-cols-3 sm:grid-cols-6 gap-2 z-10">
            <button
              v-for="region in regionList"
              :key="region.id"
              @click="selectRegion(region.id)"
              class="bg-slate-900 hover:bg-blue-950/30 border border-slate-800 hover:border-blue-700/50 py-2 px-1 rounded text-[11px] text-slate-300 font-medium transition-all text-center"
            >
              {{ region.short }}
            </button>
          </div>
        </div>

        <!-- Synapse Stimulator -->
        <div
          v-show="activeTab === 'synapse-stimulator'"
          class="tab-content flex-grow bg-slate-950/85 border border-slate-800 rounded-xl p-5 backdrop-blur-md flex flex-col relative overflow-hidden"
        >
          <SynapseSimulator />
        </div>

        <!-- Hormone Analyzer -->
        <div
          v-show="activeTab === 'hormone-analyzer'"
          class="tab-content flex-grow bg-slate-950/85 border border-slate-800 rounded-xl p-5 backdrop-blur-md flex flex-col relative overflow-hidden"
        >
          <HormoneAnalyzer :levels="ntLevels" />
        </div>
      </div>

      <!-- RIGHT COLUMN -->
      <div class="xl:col-span-3 flex flex-col gap-6">
        <RegionDetail :region="currentRegion" class="flex-grow" />
        <ClinicalCases @load-case="loadCase" />
      </div>
    </div>

    <AppFooter />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import AppHeader from './components/AppHeader.vue'
import AppFooter from './components/AppFooter.vue'
import NeurotransmitterDashboard from './components/NeurotransmitterDashboard.vue'
import Brain3D from './components/Brain3D.vue'
import SynapseSimulator from './components/SynapseSimulator.vue'
import HormoneAnalyzer from './components/HormoneAnalyzer.vue'
import RegionDetail from './components/RegionDetail.vue'
import ClinicalCases from './components/ClinicalCases.vue'
import { brainRegions, regionList } from './data/brainRegions.js'
import './assets/tech-theme.css'

const tabs = [
  { id: 'brain-explorer', label: '3D 大脑与功能定位', icon: 'fa-solid fa-head-side-virus' },
  { id: 'synapse-stimulator', label: '突触递质传递模拟', icon: 'fa-solid fa-bolt-lightning' },
  { id: 'hormone-analyzer', label: '递质情绪协同分析', icon: 'fa-solid fa-vial' }
]

const activeTab = ref('brain-explorer')
const selectedRegion = ref('frontal')

const ntLevels = ref({
  dopamine: 75,
  serotonin: 60,
  norepinephrine: 45,
  endorphin: 50
})

const currentRegion = computed(() => brainRegions[selectedRegion.value])

const synapseRate = computed(() => {
  const base = 90
  const bindingBoost = ((ntLevels.value.dopamine + ntLevels.value.norepinephrine) / 200) * 10
  return `${(base + bindingBoost).toFixed(1)}%`
})

const eegFrequency = computed(() => {
  const da = ntLevels.value.dopamine
  const se = ntLevels.value.serotonin
  const ne = ntLevels.value.norepinephrine
  let freq = 14.5
  if (da > 75 && se > 60 && ne < 55) freq = 12.8
  else if (ne > 75 && da > 65) freq = 22.4
  else if (se < 40 && da < 40) freq = 6.2
  else if (da > 85 && ne > 85) freq = 28.1

  const waveType = freq < 8 ? 'θ波 (沉睡/疲惫)' : (freq < 13 ? 'α波 (静息/放松)' : (freq < 25 ? 'β波 (思考/专注)' : 'γ波 (极度兴奋)'))
  return `${freq.toFixed(1)} Hz (${waveType})`
})

const switchTab = (tabId) => {
  activeTab.value = tabId
}

const selectRegion = (regionId) => {
  selectedRegion.value = regionId
  const r = brainRegions[regionId]
  ntLevels.value = {
    dopamine: r.dopamine,
    serotonin: r.serotonin,
    norepinephrine: r.norepinephrine,
    endorphin: r.endorphin
  }
}

const updateLevels = (newLevels) => {
  ntLevels.value = { ...newLevels }
}

const loadCase = (caseType) => {
  if (caseType === 'depression') {
    ntLevels.value = { dopamine: 28, serotonin: 25, norepinephrine: 35, endorphin: 30 }
    selectedRegion.value = 'frontal'
  } else if (caseType === 'adhd') {
    ntLevels.value = { dopamine: 30, serotonin: 55, norepinephrine: 22, endorphin: 45 }
    selectedRegion.value = 'frontal'
  } else if (caseType === 'schizophrenia') {
    ntLevels.value = { dopamine: 98, serotonin: 40, norepinephrine: 80, endorphin: 50 }
    selectedRegion.value = 'temporal'
  } else if (caseType === 'addiction') {
    ntLevels.value = { dopamine: 100, serotonin: 30, norepinephrine: 85, endorphin: 85 }
    selectedRegion.value = 'temporal'
  }
}
</script>
