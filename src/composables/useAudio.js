import { ref } from 'vue'

export function useAudio() {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)()
  const oscillator = ref(null)
  const gainNode = ref(null)
  const repeatInterval = ref(null)

  function noteToFrequency(note) {
    const noteMap = {
      'C': 0, 'C#': 1, 'Db': 1, 'D': 2, 'D#': 3, 'Eb': 3,
      'E': 4, 'F': 5, 'F#': 6, 'Gb': 6, 'G': 7, 'G#': 8,
      'Ab': 8, 'A': 9, 'A#': 10, 'Bb': 10, 'B': 11
    }

    const match = note.match(/^([A-G][b#]?)(\\d)$/)
    if (!match) return 440

    const noteName = match[1]
    const octave = parseInt(match[2])

    const noteNumber = noteMap[noteName]
    const midiNumber = (octave + 1) * 12 + noteNumber

    return 440 * Math.pow(2, (midiNumber - 69) / 12)
  }

  function getWaveform(instrument) {
    switch(instrument) {
      case 'bass':
        return 'sawtooth'
      case 'electric-guitar':
        return 'square'
      case 'acoustic-guitar':
        return 'triangle'
      case 'pure-tone':
      default:
        return 'sine'
    }
  }

  function playOnce(note, instrument) {
    const frequency = noteToFrequency(note)
    const waveform = getWaveform(instrument)

    const osc = audioContext.createOscillator()
    const gain = audioContext.createGain()

    osc.type = waveform
    osc.frequency.setValueAtTime(frequency, audioContext.currentTime)

    gain.gain.setValueAtTime(0, audioContext.currentTime)
    gain.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.01)
    gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 2)

    osc.connect(gain)
    gain.connect(audioContext.destination)

    osc.start()
    osc.stop(audioContext.currentTime + 2)
  }

  function playContinuous(note, instrument) {
    const frequency = noteToFrequency(note)
    const waveform = getWaveform(instrument)

    oscillator.value = audioContext.createOscillator()
    gainNode.value = audioContext.createGain()

    oscillator.value.type = waveform
    oscillator.value.frequency.setValueAtTime(frequency, audioContext.currentTime)

    gainNode.value.gain.setValueAtTime(0, audioContext.currentTime)
    gainNode.value.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.05)

    oscillator.value.connect(gainNode.value)
    gainNode.value.connect(audioContext.destination)

    oscillator.value.start()
  }

  function playNote(note, instrument, playbackMode) {
    stopNote()

    if (playbackMode === 'repeat') {
      playOnce(note, instrument)
      repeatInterval.value = setInterval(() => {
        playOnce(note, instrument)
      }, 3000)
    } else {
      playContinuous(note, instrument)
    }
  }

  function stopNote() {
    if (repeatInterval.value) {
      clearInterval(repeatInterval.value)
      repeatInterval.value = null
    }

    if (oscillator.value) {
      try {
        gainNode.value.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1)
        oscillator.value.stop(audioContext.currentTime + 0.1)
      } catch (e) {
        // Oscillator already stopped
      }
      oscillator.value = null
      gainNode.value = null
    }
  }

  return {
    playNote,
    stopNote
  }
}