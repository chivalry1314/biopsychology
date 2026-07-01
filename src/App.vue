<template>
  <div v-cloak class="min-h-screen flex flex-col justify-between bg-grid">
    <div class="scanlines"></div>

    <AppHeader :synapse-rate="calculatedSynapseRate" />

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
              :class="[
                'w-full text-left px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-300 flex items-center justify-between',
                activeTab === tab.id ? 'tab-active' : 'text-slate-400 hover:bg-slate-900'
              ]"
            >
              <span class="flex items-center gap-3"><i :class="tab.icon"></i> {{ tab.label }}</span>
              <i class="fa-solid fa-chevron-right text-xs opacity-60"></i>
            </button>
          </div>
        </div>

        <!-- Neurotransmitter Dashboard -->
        <NeurotransmitterDashboard
          :levels="ntLevels"
          :psychological-state="calculatedPsychologicalState"
          @update-levels="updateLevels"
          @apply-preset="presetHormone"
        />
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
              <p class="text-[11px] text-slate-500">点击不同脑区或下方按钮，联动触发神经元生理学通路与心理机制分析</p>
            </div>
            <div class="flex items-center space-x-2 text-[10px] font-mono text-slate-400 bg-slate-900/80 px-2 py-1 rounded border border-slate-800">
              <span>EEG WAVE</span>
              <span class="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
            </div>
          </div>

          <div class="relative flex-grow min-h-[300px] border border-slate-800 rounded-xl overflow-hidden flex items-center justify-center" style="background: radial-gradient(ellipse at center, #0f172a 0%, #020617 70%, #000000 100%);">
            <Brain3D :highlighted-region="selectedRegion" />

            <div class="absolute bottom-3 left-3 bg-slate-950/80 border border-slate-800 px-3 py-2 rounded-lg text-[10px] text-slate-400 flex items-center gap-2 pointer-events-none backdrop-blur-sm">
              <i class="fa-solid fa-arrows-spin text-blue-400 animate-spin"></i>
              <span>拖拽旋转模型 / 滚轮缩放 / 点击高亮关联区域</span>
            </div>

            <div class="absolute top-3 right-3 flex flex-col gap-2 pointer-events-none">
              <div class="bg-slate-950/70 border border-slate-800 px-3 py-1.5 rounded font-mono text-[10px] text-right">
                <span class="text-slate-500">脑电波(EEG):</span>
                <span class="text-cyan-400 font-bold ml-1 animate-pulse">{{ calculatedPsychologicalState.eegDisplay }}</span>
              </div>
            </div>
          </div>

          <div class="mt-4 grid grid-cols-3 sm:grid-cols-6 gap-2 z-10">
            <button
              v-for="region in regionList"
              :key="region.id"
              @click="selectRegion(region.id)"
              :class="[
                'py-2 px-1 rounded text-[11px] font-medium transition-all text-center border',
                selectedRegion === region.id
                  ? 'bg-blue-950/50 border-blue-500/80 text-blue-300'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200'
              ]"
            >
              {{ region.shortName }}
            </button>
          </div>
        </div>

        <!-- Synapse Stimulator -->
        <div
          v-show="activeTab === 'synapse-stimulator'"
          class="tab-content flex-grow bg-slate-950/85 border border-slate-800 rounded-xl p-5 backdrop-blur-md flex flex-col relative overflow-hidden"
        >
          <SynapseSimulator
            :active="activeTab === 'synapse-stimulator'"
            @update:binding-rate="synapseBindingRate = $event"
          />
        </div>

        <!-- Hormone Analyzer -->
        <div
          v-show="activeTab === 'hormone-analyzer'"
          class="tab-content flex-grow bg-slate-950/85 border border-slate-800 rounded-xl p-5 backdrop-blur-md flex flex-col relative overflow-hidden"
        >
          <HormoneAnalyzer :levels="ntLevels" :psychological-state="calculatedPsychologicalState" :active="activeTab === 'hormone-analyzer'" />
        </div>

        <!-- ANS Balance -->
        <div
          v-show="activeTab === 'ans-balance'"
          class="tab-content flex-grow bg-slate-950/85 border border-slate-800 rounded-xl p-5 backdrop-blur-md flex flex-col relative overflow-hidden"
        >
          <ANSBalance
            :levels="ntLevels"
            :psychological-state="calculatedPsychologicalState"
            :active="activeTab === 'ans-balance'"
            @update-levels="updateLevels"
            @apply-preset="handleANSPreset"
          />
        </div>

        <!-- EEG Rhythm -->
        <div
          v-show="activeTab === 'eeg-rhythm'"
          class="tab-content flex-grow bg-slate-950/85 border border-slate-800 rounded-xl p-5 backdrop-blur-md flex flex-col relative overflow-hidden"
        >
          <EEGRhythm
            :psychological-state="calculatedPsychologicalState"
            :active="activeTab === 'eeg-rhythm'"
            @apply-preset="handleANSPreset"
          />
        </div>

        <!-- HPA Axis -->
        <div
          v-show="activeTab === 'hpa-axis'"
          class="tab-content flex-grow bg-slate-950/85 border border-slate-800 rounded-xl p-5 backdrop-blur-md flex flex-col relative overflow-hidden"
        >
          <HPAAxis
            :levels="ntLevels"
            :psychological-state="calculatedPsychologicalState"
            :active="activeTab === 'hpa-axis'"
            @update-levels="updateLevels"
          />
        </div>

        <!-- Reward Pathway -->
        <div
          v-show="activeTab === 'reward-pathway'"
          class="tab-content flex-grow bg-slate-950/85 border border-slate-800 rounded-xl p-5 backdrop-blur-md flex flex-col relative overflow-hidden"
        >
          <RewardPathway
            :levels="ntLevels"
            :psychological-state="calculatedPsychologicalState"
            :active="activeTab === 'reward-pathway'"
            @update-levels="updateLevels"
          />
        </div>
      </div>

      <!-- RIGHT COLUMN -->
      <div class="xl:col-span-3 flex flex-col gap-6">
        <RegionDetail :region="currentRegion" :active-tab="activeTab" class="flex-grow" />
        <ClinicalCases @load-case="loadClinicalCase" />
      </div>
    </div>

    <AppFooter />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import AppHeader from './components/AppHeader.vue'
import AppFooter from './components/AppFooter.vue'
import NeurotransmitterDashboard from './components/NeurotransmitterDashboard.vue'
import Brain3D from './components/Brain3D.vue'
import SynapseSimulator from './components/SynapseSimulator.vue'
import HormoneAnalyzer from './components/HormoneAnalyzer.vue'
import ANSBalance from './components/ANSBalance.vue'
import EEGRhythm from './components/EEGRhythm.vue'
import HPAAxis from './components/HPAAxis.vue'
import RewardPathway from './components/RewardPathway.vue'
import RegionDetail from './components/RegionDetail.vue'
import ClinicalCases from './components/ClinicalCases.vue'
import { brainRegions, regionList } from './data/brainRegions.js'
import { useAudio } from './composables/useAudio.js'

const { playSound, playBeep, playSuccess } = useAudio()

const tabs = [
  { id: 'brain-explorer', label: '3D 大脑与功能定位', icon: 'fa-solid fa-head-side-virus' },
  { id: 'synapse-stimulator', label: '突触递质传递模拟', icon: 'fa-solid fa-bolt-lightning' },
  { id: 'hormone-analyzer', label: '递质情绪协同分析', icon: 'fa-solid fa-vial' },
  { id: 'ans-balance', label: '自主神经平衡仪', icon: 'fa-solid fa-heart-pulse' },
  { id: 'eeg-rhythm', label: '脑电节律模拟', icon: 'fa-solid fa-wave-square' },
  { id: 'hpa-axis', label: 'HPA 轴压力反应', icon: 'fa-solid fa-chart-line' },
  { id: 'reward-pathway', label: '奖励通路与多巴胺', icon: 'fa-solid fa-gift' }
]

const activeTab = ref('brain-explorer')
const selectedRegion = ref('frontal')
const synapseBindingRate = ref(0)

const ntLevels = ref({
  dopamine: 75,
  serotonin: 60,
  norepinephrine: 45,
  endorphin: 50
})

const currentRegion = computed(() => brainRegions[selectedRegion.value])

const calculatedPsychologicalState = computed(() => {
  const da = ntLevels.value.dopamine
  const se = ntLevels.value.serotonin
  const ne = ntLevels.value.norepinephrine
  const end = ntLevels.value.endorphin

  let dominantText = '平衡、适应性基底稳态 (ANS自平衡)'
  let clinicalInsight = '各项大脑介质处于中立区域。内源性递质在经典负反馈机制下自行调节。自主神经系统无过度唤醒，各生理系统能量代谢均衡，属于生理健康的典范。'

  // Continuous ANS calculation based primarily on NE (sympathetic) and SE (parasympathetic)
  let sympathetic = Math.round(Math.max(5, Math.min(95, 20 + ne * 0.6 + (da - 50) * 0.15 - (se - 50) * 0.15)))
  let parasympathetic = Math.round(Math.max(5, Math.min(95, 20 + se * 0.6 - (ne - 50) * 0.15 + (end - 50) * 0.15)))

  // Continuous EEG frequency estimate: NE drives arousal, DA drives activation, SE dampens it
  let eegVal = 10 + (ne - 50) * 0.18 + (da - 50) * 0.08 - (se - 50) * 0.05
  if (se < 45 && da < 45) eegVal -= 8
  if (ne > 80 && da > 80) eegVal += (ne - 80) * 0.35 + (da - 80) * 0.15
  eegVal = Math.max(1.5, Math.min(45, eegVal))

  if (da > 75 && se > 60 && ne < 55) {
    dominantText = '认知专注与温和奖赏状态 (DA/5-HT 协同中)'
    clinicalInsight = '当前状态下，多巴胺带来的积极探索意愿配合血清素的内啡肽稳定作用，呈现典型的专注创作或深度沉思相。自主神经系统极为平衡，ANS处于恢复性再生状态。'
  } else if (ne > 75 && da > 65) {
    dominantText = '高度警觉与应激唤醒状态 (去甲肾主导)'
    clinicalInsight = '由于去甲肾上腺素和多巴胺的高同步率，个体面临外部强烈事件。皮质醇分泌加快，心率上升。利于紧急战斗或高强度攻克难关，但长时间会导致神经衰弱与过度焦虑。'
  } else if (se < 40 && da < 40) {
    dominantText = '能量衰退与心境抑郁倾向'
    clinicalInsight = '多巴胺奖励中枢迟钝，缺乏行为动机；血清素处于生理匮乏，使得负向情绪敏感度成倍升高，常伴随失眠、精力耗竭、认知弹性崩溃。植物神经系统呈现低阈值阻断状态。'
  } else if (da > 85 && ne > 85) {
    dominantText = '兴奋冲动与高多巴胺激越'
    clinicalInsight = '皮质下多巴胺过度活跃。可能呈现轻躁狂或多动冲动，神经元活动电位发放率剧烈增加。交感神经处于高亢状态，血管收缩、肌肉张力极高，注意瞬时衰弱明显。'
  }

  const waveType = eegVal < 4 ? 'δ波 (深睡/疲惫)' : (eegVal < 8 ? 'θ波 (冥想/困倦)' : (eegVal < 13 ? 'α波 (静息/放松)' : (eegVal < 30 ? 'β波 (思考/专注)' : 'γ波 (极度兴奋)')))
  const eegDisplay = `${eegVal.toFixed(1)} Hz (${waveType})`

  return { dominantText, clinicalInsight, sympathetic, parasympathetic, eegVal, eegDisplay }
})

const calculatedSynapseRate = computed(() => {
  return (90 + synapseBindingRate.value * 0.1).toFixed(1)
})

const switchTab = (tabId) => {
  playBeep()
  activeTab.value = tabId
}

const selectRegion = (regionId) => {
  playSound(400, 0.15, 'sawtooth')
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

const presetHormone = (type) => {
  playSound(300 + (Math.random() * 400), 0.2)
  if (type === 'joy') {
    ntLevels.value = { dopamine: 95, serotonin: 85, norepinephrine: 65, endorphin: 80 }
  } else if (type === 'calm') {
    ntLevels.value = { dopamine: 40, serotonin: 90, norepinephrine: 25, endorphin: 60 }
  } else if (type === 'fight') {
    ntLevels.value = { dopamine: 80, serotonin: 30, norepinephrine: 95, endorphin: 40 }
  }
}

const handleANSPreset = (type) => {
  playSound(300 + (Math.random() * 400), 0.2)
  if (type === 'ans-deep-relax') {
    ntLevels.value = { dopamine: 35, serotonin: 90, norepinephrine: 15, endorphin: 70 }
  } else if (type === 'ans-exam-stress') {
    ntLevels.value = { dopamine: 75, serotonin: 45, norepinephrine: 80, endorphin: 35 }
  } else if (type === 'ans-intense-exercise') {
    ntLevels.value = { dopamine: 85, serotonin: 40, norepinephrine: 95, endorphin: 60 }
  } else if (type === 'ans-panic-attack') {
    ntLevels.value = { dopamine: 90, serotonin: 20, norepinephrine: 95, endorphin: 50 }
  } else if (type === 'eeg-delta') {
    ntLevels.value = { dopamine: 30, serotonin: 70, norepinephrine: 25, endorphin: 60 }
  } else if (type === 'eeg-theta') {
    ntLevels.value = { dopamine: 45, serotonin: 70, norepinephrine: 40, endorphin: 55 }
  } else if (type === 'eeg-alpha') {
    ntLevels.value = { dopamine: 60, serotonin: 60, norepinephrine: 50, endorphin: 60 }
  } else if (type === 'eeg-beta') {
    ntLevels.value = { dopamine: 85, serotonin: 50, norepinephrine: 80, endorphin: 45 }
  } else if (type === 'eeg-gamma') {
    ntLevels.value = { dopamine: 100, serotonin: 40, norepinephrine: 100, endorphin: 50 }
  } else {
    presetHormone(type)
  }
}

const loadClinicalCase = (caseType) => {
  playSuccess()
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

onMounted(() => {
  setTimeout(() => { playSuccess() }, 300)
})
</script>
