<template>
  <div>
    <header>
      <h1>Guitar Tuner</h1>
      <p>Project by me <a href="https://www.linkedin.com/in/tkdguy85/">Dallas III</a></p>
      <p>Peep the repo <a href="https://github.com/tkdguy85/guitar-tuner">here</a></p>
      <p>Check out the "Why I built this" article on <a href="https://dev.to/tkdguy85/vibe-coding-a-guitar-tuner-7cn">DevTo</a></p>
      <p>Otherwise, enjoy it and if you want a better experience <br> you can just use either a real tuner or Fender's tuner <a href="https://www.fender.com/online-guitar-tuner/electric-guitar-tuning">here</a></p>
    </header>

    <main>
      <section>
        <InstrumentSelector
          :selected="currentInstrument"
          @update="handleInstrumentChange"
        />
      </section>

      <section>
        <TuningSelector
          :instrument="currentInstrument"
          :string-count="currentStringCount"
          :current-tuning="currentTuning"
          :custom-tunings="customTunings"
          @update-string-count="handleStringCountChange"
          @update-tuning="handleTuningChange"
          @save="showSaveModal = true"
          @delete="deleteCustomTuning"
        />
      </section>

      <section>
        <PlaybackControls
          v-model="playbackMode"
        />
      </section>

      <section>
        <VolumeControl
          v-model="volumeLevel"
          @update:model-value="handleVolumeChange"
        />
      </section>
      
      <section>
        <StringDisplay
          :strings="currentStrings"
          :playback-mode="playbackMode"
          :instrument="currentInstrument"
          :playing-string="playingString"
          @update-string="updateString"
          @play="handlePlay"
          @stop="handleStop"
        />
      </section>
    </main>

    <SaveTuningModal
      v-if="showSaveModal"
      :instrument="currentInstrument"
      :string-count="currentStringCount"
      :strings="currentStrings"
      @save="saveCustomTuning"
      @close="showSaveModal = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import InstrumentSelector from './components/InstrumentSelector.vue'
import TuningSelector from './components/TuningSelect.vue'
import PlaybackControls from './components/PlaybackControls.vue'
import VolumeControl from './components/VolumeControl.vue'
import StringDisplay from './components/StringDisplay.vue'
import SaveTuningModal from './components/SaveTuningModal.vue'
import { useAudio } from './composables/useAudio'
import { useStorage } from './composables/useStorage'
import { STANDARD_TUNINGS } from './data/tunings'

const currentInstrument = ref('electric-guitar')
const currentStringCount = ref('6-string')
const currentTuning = ref('standard')
const playbackMode = ref('repeat')
const showSaveModal = ref(false)
const currentStrings = ref(['E2', 'A2', 'D3', 'G3', 'B3', 'E4'])
const playingString = ref(null)

const { customTunings, saveCustomTuning: saveToStorage, deleteCustomTuning: deleteFromStorage } = useStorage()
const { playNote, stopNote, setVolume, getVolume } = useAudio()

const availableStringCounts = computed(() => {
  return Object.keys(STANDARD_TUNINGS[currentInstrument.value] || {})
})

const availableTunings = computed(() => {
  return STANDARD_TUNINGS[currentInstrument.value]?.[currentStringCount.value] || {}
})

const volumeLevel = ref(Math.round(getVolume() * 100))

function handleInstrumentChange(instrument) {
  currentInstrument.value = instrument
  currentStringCount.value = availableStringCounts.value[0]
  currentTuning.value = 'standard'
  applyTuning()
}

function handleStringCountChange(count) {
  currentStringCount.value = count
  currentTuning.value = 'standard'
  applyTuning()
}

function handleTuningChange(tuning) {
  currentTuning.value = tuning
  applyTuning()
}

function applyTuning() {
  if (currentTuning.value.startsWith('custom-')) {
    const tuningId = parseInt(currentTuning.value.replace('custom-', ''))
    const customTuning = customTunings.value.find(t => t.id === tuningId)
    if (customTuning) {
      currentStrings.value = [...customTuning.notes]
    }
  } else {
    const notes = availableTunings.value[currentTuning.value]
    if (notes) {
      currentStrings.value = [...notes]
    }
  }
}

function updateString(index, note) {
  currentStrings.value[index] = note
}

function saveCustomTuning(name) {
  const tuning = {
    id: Date.now(),
    name,
    instrument: currentInstrument.value,
    stringCount: currentStringCount.value,
    notes: [...currentStrings.value]
  }

  saveToStorage(tuning)
  currentTuning.value = 'custom-' + tuning.id
  showSaveModal.value = false
}

function deleteCustomTuning(tuningId) {
  deleteFromStorage(tuningId)
  if (currentTuning.value === 'custom-' + tuningId) {
    currentTuning.value = 'standard'
    applyTuning()
  }
}

function handlePlay(index) {
  if (playbackMode.value === 'continuous' && playingString.value !== null && playingString.value !== index) {
    stopNote()
  }
  
  const note = currentStrings.value[index]
  playNote(note, currentInstrument.value, playbackMode.value)
  playingString.value = index
}

function handleStop(index) {
  stopNote()
  if (playingString.value === index) {
    playingString.value = null
  }
}

function handleStopAll() {
  stopNote()
  playingString.value = null
}

function handleVolumeChange(newVolume) {
  setVolume(newVolume / 100)
}

watch([currentInstrument, currentStringCount], () => {
  applyTuning()
})
</script>
