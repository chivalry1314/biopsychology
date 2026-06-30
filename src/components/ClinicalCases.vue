<template>
  <div class="bg-slate-950/85 border border-slate-800 rounded-xl p-5 backdrop-blur-md relative overflow-hidden">
    <h3 class="text-sm font-bold text-slate-300 mb-3 flex items-center gap-2">
      <i class="fa-solid fa-hospital-user text-rose-400"></i> AI 生理心理临床案例模拟
    </h3>
    <div class="space-y-2">
      <p class="text-[11px] text-slate-400 leading-normal">
        点击下方生成典型的生理心理病理模型，快速载入对应突触递质与大脑通路。
      </p>
      <div class="grid grid-cols-2 gap-2 mt-2">
        <button
          v-for="c in cases"
          :key="c.key"
          @click="loadCase(c.key)"
          class="bg-slate-900 hover:bg-indigo-950/40 border border-slate-800 text-[11px] py-1.5 rounded transition-all text-left px-2 flex flex-col justify-between"
        >
          <span class="font-semibold text-slate-300">{{ c.name }}</span>
          <span class="text-[9px] text-slate-500 font-mono mt-0.5">{{ c.bio }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(['load-case'])

const cases = [
  { key: 'depression', name: '重度抑郁症', bio: '5-HT ↓ / DA ↓' },
  { key: 'adhd', name: 'ADHD多动症', bio: 'NE ↓ / DA ↓' },
  { key: 'schizophrenia', name: '精神分裂症', bio: 'DA ↑↑ (皮质下)' },
  { key: 'addiction', name: '成瘾行为', bio: 'DA 暴涨与崩盘' }
]

const loadCase = (key) => {
  emit('load-case', key)
}
</script>
