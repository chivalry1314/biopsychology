<template>
  <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
    <div
      v-for="nt in neurotransmitters"
      :key="nt.name"
      class="course-card p-5 space-y-3 cursor-default group region-card relative overflow-hidden"
    >
      <div class="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
      <div class="relative z-10">
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-3">
            <div
              class="w-2.5 h-2.5 rounded-full"
              :class="nt.color"
            ></div>
            <h4 class="font-bold text-white">{{ nt.name }}</h4>
          </div>
          <span class="text-[10px] text-slate-600 font-medium">{{ nt.en.slice(0, 3).toUpperCase() }}</span>
        </div>
        <p class="text-xs text-slate-500 mb-3">{{ nt.en }}</p>
        <div class="space-y-2 text-sm">
          <p class="text-slate-300">
            <span class="text-[10px] text-slate-500 uppercase tracking-wider block mb-1">Function</span>
            {{ nt.role }}
          </p>
          <p class="text-slate-400 text-xs leading-relaxed">
            <span class="text-[10px] text-slate-500 uppercase tracking-wider block mb-1">Related</span>
            {{ nt.related }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { neurotransmitters } from '../data/neurotransmitters.js'
</script>

<style scoped>
.region-card {
  transition: all 0.3s ease;
}
.region-card:hover {
  transform: translateY(-3px);
  border-color: rgba(255, 255, 255, 0.12);
}
</style>
