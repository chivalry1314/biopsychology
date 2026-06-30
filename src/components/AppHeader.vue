<template>
  <header class="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md px-6 py-4 flex flex-wrap justify-between items-center z-10 relative">
    <div class="flex items-center space-x-3">
      <div class="w-10 h-10 rounded-lg bg-blue-600/20 border border-blue-500/50 flex items-center justify-center pulse-element">
        <i class="fa-solid fa-brain text-blue-400 text-xl"></i>
      </div>
      <div>
        <h1 class="text-xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 tech-font">
          BIO-PSYCHOLOGY QUANTUM VISUALIZER
        </h1>
        <p class="text-xs text-slate-400 tracking-widest uppercase">Vue 3 生理心理学全息交互诊断终端 v4.0</p>
      </div>
    </div>

    <div class="flex items-center space-x-6 text-xs text-slate-400 font-mono mt-4 md:mt-0">
      <div class="hidden lg:block border-l border-slate-800 pl-4">
        <span class="text-slate-500">突触网活跃度:</span>
        <span class="text-emerald-400 glow-emerald font-bold ml-1">{{ synapseRate }}</span>
      </div>
      <div class="hidden lg:block border-l border-slate-800 pl-4">
        <span class="text-slate-500">脑氧饱和度 (rSO₂):</span>
        <span class="text-blue-400 glow-blue font-bold ml-1">78 ml/100g/min</span>
      </div>
      <div class="border-l border-slate-800 pl-4 flex items-center space-x-2">
        <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        <span class="text-slate-300">VUE 3 CORE ACTIVE</span>
      </div>
    </div>
  </header>
</template>

<script setup>
defineProps({
  synapseRate: {
    type: String,
    default: '94.2%'
  }
})
</script>
