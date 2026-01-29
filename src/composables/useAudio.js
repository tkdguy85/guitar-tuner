import { ref } from 'vue'

export function useAudio() {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)()
  const currentSource = ref(null)
  const gainNode = ref(null)
  const repeatInterval = ref(null)
  const sampleCache = ref({})

  const noteMap = {
    'C': 0, 'C#': 1, 'Db': 1, 'D': 2, 'D#': 3, 'Eb': 3,
    'E': 4, 'F': 5, 'F#': 6, 'Gb': 6, 'G': 7, 'G#': 8,
    'Ab': 8, 'A': 9, 'A#': 10, 'Bb': 10, 'B': 11
  }

  const sampleUrls = {
    'bass': {
      'E2': 'https://gleitz.github.io/midi-js-soundfonts/MusyngKite/acoustic_bass-mp3/E2.mp3',
      'A2': 'https://gleitz.github.io/midi-js-soundfonts/MusyngKite/acoustic_bass-mp3/A2.mp3',
      'D3': 'https://gleitz.github.io/midi-js-soundfonts/MusyngKite/acoustic_bass-mp3/D3.mp3',
      'G3': 'https://gleitz.github.io/midi-js-soundfonts/MusyngKite/acoustic_bass-mp3/G3.mp3'
    },
    'electric-guitar': {
      'E2': 'https://gleitz.github.io/midi-js-soundfonts/MusyngKite/electric_guitar_clean-mp3/E2.mp3',
      'A2': 'https://gleitz.github.io/midi-js-soundfonts/MusyngKite/electric_guitar_clean-mp3/A2.mp3',
      'D3': 'https://gleitz.github.io/midi-js-soundfonts/MusyngKite/electric_guitar_clean-mp3/D3.mp3',
      'G3': 'https://gleitz.github.io/midi-js-soundfonts/MusyngKite/electric_guitar_clean-mp3/G3.mp3',
      'B3': 'https://gleitz.github.io/midi-js-soundfonts/MusyngKite/electric_guitar_clean-mp3/B3.mp3',
      'E4': 'https://gleitz.github.io/midi-js-soundfonts/MusyngKite/electric_guitar_clean-mp3/E4.mp3'
    },
    'acoustic-guitar': {
      'E2': 'https://gleitz.github.io/midi-js-soundfonts/MusyngKite/acoustic_guitar_nylon-mp3/E2.mp3',
      'A2': 'https://gleitz.github.io/midi-js-soundfonts/MusyngKite/acoustic_guitar_nylon-mp3/A2.mp3',
      'D3': 'https://gleitz.github.io/midi-js-soundfonts/MusyngKite/acoustic_guitar_nylon-mp3/D3.mp3',
      'G3': 'https://gleitz.github.io/midi-js-soundfonts/MusyngKite/acoustic_guitar_nylon-mp3/G3.mp3',
      'B3': 'https://gleitz.github.io/midi-js-soundfonts/MusyngKite/acoustic_guitar_nylon-mp3/B3.mp3',
      'E4': 'https://gleitz.github.io/midi-js-soundfonts/MusyngKite/acoustic_guitar_nylon-mp3/E4.mp3'
    },
    'pure-tone': null
  }

  function noteToFrequency(note) {
    const match = note.match(/^([A-G][b#]?)(\d)$/)
    if (!match) return 440

    const [, noteName, octave] = match
    const midiNumber = (parseInt(octave) + 1) * 12 + noteMap[noteName]
    return 440 * Math.pow(2, (midiNumber - 69) / 12)
  }

  function findClosestSample(note, instrument) {
    const samples = sampleUrls[instrument]
    if (!samples) return null

    const availableNotes = Object.keys(samples)
    if (availableNotes.includes(note)) return note

    const targetFreq = noteToFrequency(note)
    let closest = availableNotes[0]
    let minDiff = Math.abs(noteToFrequency(closest) - targetFreq)

    for (const sampleNote of availableNotes) {
      const diff = Math.abs(noteToFrequency(sampleNote) - targetFreq)
      if (diff < minDiff) {
        minDiff = diff
        closest = sampleNote
      }
    }

    return closest
  }

  async function loadSample(note, instrument) {
    const cacheKey = `${instrument}-${note}`
    if (sampleCache.value[cacheKey]) {
      return sampleCache.value[cacheKey]
    }

    const url = sampleUrls[instrument][note]
    try {
      const response = await fetch(url)
      const arrayBuffer = await response.arrayBuffer()
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)
      sampleCache.value[cacheKey] = audioBuffer
      return audioBuffer
    } catch (error) {
      console.error('Failed to load sample:', error)
      return null
    }
  }

  function createOscillator(note) {
    const osc = audioContext.createOscillator()
    const gain = audioContext.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(noteToFrequency(note), audioContext.currentTime)
    osc.connect(gain)
    gain.connect(audioContext.destination)

    return { osc, gain }
  }

  async function playSample(note, instrument, duration = null) {
    const closestNote = findClosestSample(note, instrument)
    if (!closestNote) return null

    const buffer = await loadSample(closestNote, instrument)
    if (!buffer) return null

    const source = audioContext.createBufferSource()
    const gain = audioContext.createGain()
    
    source.buffer = buffer
    
    const sampleFreq = noteToFrequency(closestNote)
    const targetFreq = noteToFrequency(note)
    source.playbackRate.value = targetFreq / sampleFreq

    source.connect(gain)
    gain.connect(audioContext.destination)

    const now = audioContext.currentTime
    gain.gain.setValueAtTime(0.5, now)
    
    if (duration) {
      gain.gain.exponentialRampToValueAtTime(0.01, now + duration)
      source.start()
      source.stop(now + duration)
    } else {
      source.start()
      source.loop = true
    }

    return { source, gain }
  }

  async function playOnce(note, instrument) {
    if (instrument === 'pure-tone') {
      const { osc, gain } = createOscillator(note)
      const now = audioContext.currentTime

      gain.gain.setValueAtTime(0, now)
      gain.gain.linearRampToValueAtTime(0.3, now + 0.01)
      gain.gain.exponentialRampToValueAtTime(0.01, now + 2)

      osc.start()
      osc.stop(now + 2)
    } else {
      await playSample(note, instrument, 2)
    }
  }

  async function playContinuous(note, instrument) {
    if (instrument === 'pure-tone') {
      const { osc, gain } = createOscillator(note)
      const now = audioContext.currentTime

      gain.gain.setValueAtTime(0, now)
      gain.gain.linearRampToValueAtTime(0.3, now + 0.05)

      osc.start()

      currentSource.value = osc
      gainNode.value = gain
    } else {
      const result = await playSample(note, instrument)
      if (result) {
        currentSource.value = result.source
        gainNode.value = result.gain
      }
    }
  }

  function playNote(note, instrument, playbackMode) {
    stopNote()

    if (playbackMode === 'repeat') {
      playOnce(note, instrument)
      repeatInterval.value = setInterval(() => playOnce(note, instrument), 3500)
    } else {
      playContinuous(note, instrument)
    }
  }

  function stopNote() {
    if (repeatInterval.value) {
      clearInterval(repeatInterval.value)
      repeatInterval.value = null
    }

    if (currentSource.value) {
      try {
        if (gainNode.value) {
          gainNode.value.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1)
        }
        currentSource.value.stop(audioContext.currentTime + 0.1)
      } catch (e) {
        // Source already stopped
      }
      currentSource.value = null
      gainNode.value = null
    }
  }

  return { playNote, stopNote }
}