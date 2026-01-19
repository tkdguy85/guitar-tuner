<template>
  <div>
    <header>
      <h1>Guitar Tuner</h1>
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
        <StringDisplay
          :strings="currentStrings"
          :playback-mode="playbackMode"
          :instrument="currentInstrument"
          @update-string="updateString"
          @play="handlePlay"
          @stop="handleStop"
        />
      </section>
    </main>

    <footer>
      <p>Works offline • All devices supported</p>
    </footer>

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

const { customTunings, saveCustomTuning: saveToStorage, deleteCustomTuning: deleteFromStorage } = useStorage()
const { playNote, stopNote } = useAudio()

const availableStringCounts = computed(() => {
  return Object.keys(STANDARD_TUNINGS[currentInstrument.value] || {})
})

const availableTunings = computed(() => {
  return STANDARD_TUNINGS[currentInstrument.value]?.[currentStringCount.value] || {}
})

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
  const note = currentStrings.value[index]
  playNote(note, currentInstrument.value, playbackMode.value)
}

function handleStop() {
  stopNote()
}

watch([currentInstrument, currentStringCount], () => {
  applyTuning()
})
</script>
