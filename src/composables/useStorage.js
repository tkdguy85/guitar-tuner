import { ref } from 'vue'

const STORAGE_KEY = 'guitar-tuner-custom-tunings'

export function useStorage() {
  const customTunings = ref([])

  function loadCustomTunings() {
    try {
      const data = localStorage.getItem(STORAGE_KEY)
      if (data) {
        customTunings.value = JSON.parse(data)
      }
    } catch (e) {
      console.error('Failed to load custom tunings:', e)
      customTunings.value = []
    }
  }

  function saveToLocalStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(customTunings.value))
    } catch (e) {
      console.error('Failed to save custom tunings:', e)
    }
  }

  function saveCustomTuning(tuning) {
    customTunings.value.push(tuning)
    saveToLocalStorage()
  }

  function deleteCustomTuning(tuningId) {
    customTunings.value = customTunings.value.filter(t => t.id !== tuningId)
    saveToLocalStorage()
  }

  // Load tunings on initialization
  loadCustomTunings()

  return {
    customTunings,
    saveCustomTuning,
    deleteCustomTuning
  }
}
