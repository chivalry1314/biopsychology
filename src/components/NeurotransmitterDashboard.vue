<template>
  <div class="bg-slate-950/85 border border-slate-800 rounded-xl p-5 backdrop-blur-md flex-grow flex flex-col justify-between">
    <div>
      <h3 class="text-sm font-bold text-slate-300 mb-4 flex items-center justify-between">
        <span class="flex items-center gap-2"><i class="fa-solid fa-flask-vial text-purple-400"></i> 生理化学递质调控</span>
        <span class="text-xs text-purple-400 font-mono">DASHBOARD</span>
      </h3>

      <div class="space-y-4">
        <div v-for="nt in neurotransmitters" :key="nt.key">
          <div class="flex justify-between text-xs mb-1">
            <span class="text-slate-400 flex items-center gap-1">
              <span class="w-2 h-2 rounded-full" :style="{ background: nt.hex }"></span>
              {{ nt.name }} ({{ nt.abbr }}) - {{ nt.role }}
            </span>
            <span class="font-mono font-semibold" :style="{ color: nt.hex }">{{ levels[nt.key] }}%</span>
          </div>
          <div class="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden flex items-center">
            <input
              type="range"
              min="0"
              max="100"
              :value="levels[nt.key]"
              @input="updateLevel(nt.key, $event.target.value)"
              class="w-full h-1 bg-slate-800 rounded-lg cursor-pointer"
              :style="{ accentColor: nt.hex }"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="mt-6 pt-4 border-t border-slate-900">
      <div class="rounded-lg bg-slate-900/50 p-3 border border-slate-800/60">
        <span class="text-[10px] text-slate-500 font-mono block mb-1">当前主导心理状态:</span>
        <p class="text-xs text-blue-300 flex items-center gap-2">
          <i class="fa-solid fa-circle-nodes text-blue-400 animate-pulse"></i>
          {{ dominantState }}
        </p>
      </div>
      <div class="mt-3 flex justify-between gap-2">
        <button
          @click="applyPreset('joy')"
          class="flex-1 bg-blue-950/40 hover:bg-blue-900/50 border border-blue-800/50 py-1.5 px-1 rounded text-[10px] font-mono text-blue-300 hover:text-blue-200 transition-all"
        >
          激悦模式
        </button>
        <button
          @click="applyPreset('calm')"
          class="flex-1 bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-800/50 py-1.5 px-1 rounded text-[10px] font-mono text-emerald-300 hover:text-emerald-200 transition-all"
        >
          镇静沉思
        </button>
        <button
          @click="applyPreset('fight')"
          class="flex-1 bg-rose-950/40 hover:bg-rose-900/50 border border-rose-800/50 py-1.5 px-1 rounded text-[10px] font-mono text-rose-300 hover:text-rose-200 transition-all"
        >
          战斗逃跑
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { neurotransmitters } from '../data/neurotransmitters.js'

const props = defineProps({
  levels: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update-levels'])

const updateLevel = (key, value) => {
  emit('update-levels', { ...props.levels, [key]: Number(value) })
}

const applyPreset = (type) => {
  let next
  if (type === 'joy') next = { dopamine: 95, serotonin: 85, norepinephrine: 65, endorphin: 80 }
  else if (type === 'calm') next = { dopamine: 40, serotonin: 90, norepinephrine: 25, endorphin: 60 }
  else if (type === 'fight') next = { dopamine: 80, serotonin: 30, norepinephrine: 95, endorphin: 40 }
  emit('update-levels', next)
}

const dominantState = computed(() => {
  const { dopamine: da, serotonin: se, norepinephrine: ne, endorphin: end } = props.levels
  if (da > 75 && se > 60 && ne < 55) return '认知专注与温和奖赏状态 (DA/5-HT 协同中)'
  if (ne > 75 && da > 65) return '高度警觉与应激唤醒状态 (去甲肾主导)'
  if (se < 40 && da < 40) return '能量衰退与心境抑郁倾向'
  if (da > 85 && ne > 85) return '兴奋冲动与高多巴胺激越'
  return '平衡、适应性基底稳态 (ANS自平衡)'
})
</script>

<style scoped>
input[type="range"] {
  -webkit-appearance: none;
  appearance: none;
  background: transparent;
}
input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  height: 12px;
  width: 12px;
  border-radius: 50%;
  background: currentColor;
  cursor: pointer;
  margin-top: -4px;
}
input[type="range"]::-webkit-slider-runnable-track {
  width: 100%;
  height: 4px;
  cursor: pointer;
  background: #1e293b;
  border-radius: 2px;
}
</style>
