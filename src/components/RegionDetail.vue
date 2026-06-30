<template>
  <div class="quantum-panel p-5 relative overflow-hidden flex flex-col h-full">
    <div class="flex items-center justify-between border-b border-slate-900 pb-3 mb-4">
      <h3 class="text-sm font-bold text-slate-300 flex items-center gap-2">
        <i class="fa-solid fa-microscope text-blue-400"></i> 生理解剖学与心理效应解碼
      </h3>
      <span class="text-[10px] bg-blue-900/30 text-blue-400 px-1.5 py-0.5 rounded font-mono-tech">{{ region.tag }}</span>
    </div>

    <div class="flex-grow space-y-4 overflow-y-auto pr-1" style="max-height: 480px;">
      <div>
        <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">活动靶区 / Targeted Anatomy</h4>
        <p class="text-sm text-cyan-400 font-semibold">{{ region.title }}</p>
      </div>

      <div>
        <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">主要生理学功能 / Physiological Functions</h4>
        <p class="text-xs text-slate-300 leading-relaxed">{{ region.physio }}</p>
      </div>

      <div>
        <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">核心关联心理机制 / Psychological Mechanics</h4>
        <p class="text-xs text-slate-300 leading-relaxed">{{ region.psycho }}</p>
      </div>

      <div class="border-t border-slate-900 pt-3">
        <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <i class="fa-solid fa-triangle-exclamation text-amber-500"></i> 病理与心理异常诊断
        </h4>
        <div class="rounded-lg bg-slate-900/60 p-2 border border-slate-800/80 text-xs text-slate-400">
          {{ region.clinical }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  region: {
    type: Object,
    required: true
  }
})
</script>
