<template>
  <div class="string-display">
    <h2>Strings</h2>
    <div class="strings-container">
      <div
        v-for="(note, index) in strings"
        :key="index"
        class="string-control"
        :class="{ 'playing': playingString === index }"
      >
        <span 
          class="string-number"
          :class="stringNumberColor(index)"
        >
          {{ strings.length - index }}
        </span>

        <select
          :value="note"
          @change="e => $emit('update-string', index, e.target.value)"
          class="note-selector"
        >
          <option v-for="n in availableNotes" :key="n" :value="n">
            {{ n }}
          </option>
        </select>

        <button
          v-if="playingString !== index"
          class="play-button"
          @click="$emit('play', index)"
        >
          ▶
        </button>
        <button
          v-else
          class="stop-button"
          @click="$emit('stop', index)"
        >
          ■
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  strings: {
    type: Array,
    required: true
  },
  playbackMode: {
    type: String,
    required: true
  },
  instrument: {
    type: String,
    required: true
  },
  currentTuning: {
    type: String,
    required: true
  },
  playingString: {
    type: Number,
    default: null
  }
})

const emit = defineEmits(['update-string', 'play', 'stop'])

const availableNotes = [
  'C0', 'C#0', 'D0', 'D#0', 'E0', 'F0', 'F#0', 'G0', 'G#0', 'A0', 'A#0', 'B0',
  'C1', 'C#1', 'D1', 'D#1', 'E1', 'F1', 'F#1', 'G1', 'G#1', 'A1', 'A#1', 'B1',
  'C2', 'C#2', 'D2', 'D#2', 'E2', 'F2', 'F#2', 'G2', 'G#2', 'A2', 'A#2', 'B2',
  'C3', 'C#3', 'D3', 'D#3', 'E3', 'F3', 'F#3', 'G3', 'G#3', 'A3', 'A#3', 'B3',
  'C4', 'C#4', 'D4', 'D#4', 'E4', 'F4', 'F#4', 'G4', 'G#4', 'A4', 'A#4', 'B4',
  'C5', 'C#5', 'D5', 'D#5', 'E5', 'F5', 'F#5', 'G5', 'G#5', 'A5', 'A#5', 'B5'
]

// String Color Schemes (by string count)
const BASS_SCHEMES = {
  4: ['green', 'black', 'red', 'brass'],
  5: ['green', 'black', 'red', 'brass', 'purple'],
  6: ['silver', 'green', 'black', 'red', 'brass', 'purple']
}

const GUITAR_SCHEMES = {
  6: ['silver', 'purple', 'green', 'black', 'red', 'brass'],
  7: ['silver', 'purple', 'green', 'black', 'red', 'brass', 'silver'],
  8: ['silver', 'purple', 'green', 'black', 'red', 'brass', 'purple', 'copper']
}

const SCHEMES = { bass: BASS_SCHEMES, guitar: GUITAR_SCHEMES }

const instrumentType = computed(() => {
  if (props.instrument === 'pure-tone') {
    const label = props.currentTuning.toLowerCase()
    
    if (label.includes('bass')) return 'bass'
    if (label.includes('guitar')) return 'guitar'

    return null
  }

  if (props.instrument === 'bass') return 'bass'
  if (props.instrument.endsWith('-guitar')) return 'guitar'
  
  return null
})

// Update on string/instrument change
const colorScheme = computed(
  () => SCHEMES[instrumentType.value]?.[props.strings.length] ?? null
)

function stringNumberColor(index) {
  const color = colorScheme.value?.[index]
  return color ? `string-number--${color}` : ''
}

</script>

<style scoped>
.strings-container {
  display: flex;
  flex-wrap: nowrap;
  flex-direction: row;
  gap: 15px;
  justify-content: center;
}

.string-control {
  display: flex;
  flex-direction: column;
  flex: 1 1 0;
  align-items: center;
  gap: 30px;
  background: var(--primary-slate);
  padding: 15px;
  border-radius: 12px;
  transition: all 0.3s;

  &:hover {
    background: var(--primary-slate);
  }
}

.string-control.playing {
  background: rgba(66, 153, 225, 0.3);
  border: 2px solid rgba(66, 153, 225, 0.6);
}

.string-number {
  font-size: 1.5em;
  font-weight: bold;
  min-width: 50px;
  text-align: center;
  background: var(--primary-slate);
  padding: 8px;
  border-radius: 8px;
}

/* String color guide */
.string-number--green  { 
  background: #2f855a; 
}

.string-number--black  { 
  background: #222; 
}

.string-number--red    { 
  background: #c53030; 
}

.string-number--brass  { 
  background: #b7791f; 
}

.string-number--purple { 
  background: #6b46c1; 
}

.string-number--silver { 
  background: #a0aec0; 
  color: #1a202c; 
}

.string-number--copper { 
  background: #b45309; 
}

.note-selector {
  flex: 1;
  padding: 10px 5px;
  background: var(--primary-slate);
  border: 2px solid var(--primary-slate);
  border-radius: 8px;
  color:var(--primary-text);
  font-size: 1.1em;
  cursor: pointer;

  option {
    background: #667eea;
    color:var(--primary-text);
  }
}

.play-button,
.stop-button {
  width: 60px;
  height: 60px;
  border: none;
  border-radius: 50%;
  color: var(--primary-text);
  font-size: 1.5em;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);

  &:active {
    transform: scale(0.95);
  }
}

.play-button {
  background: rgba(76, 175, 80, 0.7);

  &:hover {
    background: rgba(76, 175, 80, 0.9);
  }
}

.stop-button {
  background: rgba(239, 68, 68, 0.7);

  &:hover {
    background: rgba(239, 68, 68, 0.9);
  }
}
</style>
