export const sleepStages = [
  { name: '清醒', color: '#f59e0b', y: 0.15 },
  { name: 'N1', color: '#60a5fa', y: 0.35 },
  { name: 'N2', color: '#818cf8', y: 0.55 },
  { name: 'N3', color: '#4f46e5', y: 0.80 },
  { name: 'REM', color: '#ec4899', y: 0.20 }
]

export const sleepCycle = [
  { stage: 0, dur: 0.05 },
  { stage: 1, dur: 0.08 },
  { stage: 2, dur: 0.20 },
  { stage: 3, dur: 0.25 },
  { stage: 2, dur: 0.12 },
  { stage: 4, dur: 0.18 },
  { stage: 2, dur: 0.12 }
]

// Repeat the cycle 5 times for a full night
export const sleepData = Array.from({ length: 5 }, () => sleepCycle).flat()
