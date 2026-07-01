<template>
  <div class="bg-slate-950/85 border border-slate-800 rounded-xl p-5 backdrop-blur-md flex-grow flex flex-col">
    <div class="flex items-center justify-between border-b border-slate-900 pb-3 mb-4">
      <h3 class="text-sm font-bold text-slate-300 flex items-center gap-2">
        <i class="fa-solid fa-microscope text-blue-400"></i> 生理解剖学与心理效应解码
      </h3>
      <span class="text-[10px] bg-blue-900/30 text-blue-400 px-1.5 py-0.5 rounded font-mono">{{ displayContent.tag }}</span>
    </div>

    <div class="flex-grow space-y-4 overflow-y-auto pr-1" style="max-height: 480px;">
      <div>
        <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{{ targetLabel }}</h4>
        <p class="text-sm text-cyan-400 font-semibold">{{ displayContent.title }}</p>
      </div>

      <div v-if="displayContent.interaction" class="rounded-lg bg-blue-900/20 border border-blue-500/30 p-3">
        <h4 class="text-xs font-bold text-blue-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
          <i class="fa-solid fa-hand-pointer text-blue-400"></i> 交互说明 / Interaction Guide
        </h4>
        <p class="text-xs text-slate-300 leading-relaxed">{{ displayContent.interaction }}</p>
      </div>

      <div>
        <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">主要生理学功能 / Physiological</h4>
        <p class="text-xs text-slate-300 leading-relaxed">{{ displayContent.physio }}</p>
      </div>

      <div>
        <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">核心关联心理机制 / Psychological</h4>
        <p class="text-xs text-slate-300 leading-relaxed">{{ displayContent.psycho }}</p>
      </div>

      <div class="border-t border-slate-900 pt-3">
        <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <i class="fa-solid fa-triangle-exclamation text-amber-500"></i> 病理与心理异常诊断
        </h4>
        <div class="rounded-lg bg-slate-900/60 p-2 border border-slate-800/80 text-xs text-slate-400">
          {{ displayContent.clinical }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { featureDetails } from '../data/featureDetails.js'

const props = defineProps({
  region: {
    type: Object,
    required: true
  },
  activeTab: {
    type: String,
    default: 'brain-explorer'
  }
})

const isBrainTab = computed(() => props.activeTab === 'brain-explorer')

const displayContent = computed(() => {
  if (isBrainTab.value || !featureDetails[props.activeTab]) {
    return props.region
  }
  return featureDetails[props.activeTab]
})

const targetLabel = computed(() => {
  return isBrainTab.value
    ? '活动靶区 / Targeted Anatomy'
    : '核心对象 / Core Target'
})
</script>
