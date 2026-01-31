<template>
  <div class="volume-control">
    <div class="volume-header">
      <button 
        class="mute-button" 
        @click="toggleMute"
        :aria-label="isMuted ? 'Unmute' : 'Mute'"
      >
        <svg v-if="!isMuted && volume > 50" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
        </svg>
        <svg v-else-if="!isMuted && volume > 0" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
        </svg>
        <svg v-else width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
          <line x1="23" y1="9" x2="17" y2="15"></line>
          <line x1="17" y1="9" x2="23" y2="15"></line>
        </svg>
      </button>
      <label for="volume-slider" class="volume-label">Volume</label>
    </div>
    
    <div class="slider-container">
      <input
        id="volume-slider"
        type="range"
        min="0"
        max="100"
        :value="volume"
        @input="handleVolumeChange"
        class="volume-slider"
        :disabled="isMuted"
      />
      <span class="volume-value">{{ volume }}%</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Number,
    default: 70
  }
})

const emit = defineEmits(['update:modelValue'])

const volume = ref(props.modelValue)
const isMuted = ref(false)
const volumeBeforeMute = ref(props.modelValue)

watch(() => props.modelValue, (newValue) => {
  volume.value = newValue
})

function handleVolumeChange(event) {
  const newVolume = parseInt(event.target.value)
  volume.value = newVolume
  
  if (isMuted.value && newVolume > 0) {
    isMuted.value = false
  }
  
  emit('update:modelValue', newVolume)
}

function toggleMute() {
  if (isMuted.value) {
    // Unmute - restore previous volume
    isMuted.value = false
    volume.value = volumeBeforeMute.value
    emit('update:modelValue', volumeBeforeMute.value)
  } else {
    // Mute - save current volume and set to 0
    volumeBeforeMute.value = volume.value
    isMuted.value = true
    volume.value = 0
    emit('update:modelValue', 0)
  }
}
</script>

<style scoped>
.volume-control {
  padding: 1rem;
  background: #f5f5f5;
  border-radius: 8px;
  max-width: 400px;
  margin: 0 auto;
}

.volume-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.mute-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: background-color 0.2s;
  color: #333;
}

.mute-button:hover {
  background-color: #e0e0e0;
}

.mute-button:active {
  background-color: #d0d0d0;
}

.volume-label {
  font-weight: 600;
  font-size: 0.95rem;
  color: #333;
}

.slider-container {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.volume-slider {
  flex: 1;
  height: 6px;
  border-radius: 3px;
  background: #ddd;
  outline: none;
  -webkit-appearance: none;
  appearance: none;
}

.volume-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #4a90e2;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.2s;
}

.volume-slider::-webkit-slider-thumb:hover {
  background: #357abd;
  transform: scale(1.1);
}

.volume-slider::-moz-range-thumb {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #4a90e2;
  cursor: pointer;
  border: none;
  transition: background-color 0.2s, transform 0.2s;
}

.volume-slider::-moz-range-thumb:hover {
  background: #357abd;
  transform: scale(1.1);
}

.volume-slider:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.volume-slider:disabled::-webkit-slider-thumb {
  cursor: not-allowed;
  background: #999;
}

.volume-slider:disabled::-moz-range-thumb {
  cursor: not-allowed;
  background: #999;
}

.volume-value {
  font-weight: 600;
  font-size: 0.9rem;
  color: #666;
  min-width: 45px;
  text-align: right;
}
</style>