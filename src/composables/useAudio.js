let audioCtx = null

export function useAudio() {
  const ensureContext = () => {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)()
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume()
    }
  }

  const playSound = (freq, duration, type = 'sine') => {
    try {
      ensureContext()
      const osc = audioCtx.createOscillator()
      const gain = audioCtx.createGain()

      osc.type = type
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime)

      gain.gain.setValueAtTime(0.04, audioCtx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration)

      osc.connect(gain)
      gain.connect(audioCtx.destination)

      osc.start()
      osc.stop(audioCtx.currentTime + duration)
    } catch (e) {
      // Safe ignore browser auto-play blockers
    }
  }

  const playBeep = () => playSound(800, 0.08)

  const playSuccess = () => {
    playSound(440, 0.1)
    setTimeout(() => playSound(880, 0.15), 100)
  }

  return { playSound, playBeep, playSuccess }
}
