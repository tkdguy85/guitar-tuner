<template>
  <div class="instrument-selector">
    <h2>Select Instrument</h2>
    <div class="instruments">
      <button
        v-for="instrument in instruments"
        :key="instrument.value"
        class="instrument-btn"
        :class="{ active: selected === instrument.value }"
        @click="$emit('update', instrument.value)"
      >
        {{ instrument.icon }} {{ instrument.label }}
      </button>
    </div>
  </div>
</template>

<script setup>
  defineProps({
    selected: {
      type: String,
      required: true
    }
  })

  defineEmits(['update'])

  const instruments = [
    { value: 'bass', label: 'Bass', icon: '🎸' },
    { value: 'electric-guitar', label: 'Electric Guitar', icon: '⚡' },
    { value: 'acoustic-guitar', label: 'Acoustic Guitar', icon: '🎵' },
    { value: 'pure-tone', label: 'Pure Tones', icon: '〰️' }
  ]
</script>

<style scoped>
.instrument-selector {
  margin-bottom: 25px;
}

h2 {
  font-size: 1.3em;
  margin-bottom: 15px;
  text-align: center;
}

.instruments {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 10px;
}

.instrument-btn {
  padding: 15px;
  background: rgba(255,255,255,0.2);
  border: 2px solid rgba(255,255,255,0.3);
  border-radius: 10px;
  color: white;
  font-size: 1em;
  cursor: pointer;
  transition: all 0.3s;
}

.instrument-btn:hover {
  background: rgba(255,255,255,0.3);
  transform: translateY(-2px);
}

.instrument-btn.active {
  background: rgba(255,255,255,0.4);
  border-color: white;
  box-shadow: 0 0 20px rgba(255,255,255,0.3);
}

@media (max-width: 768px) {
  .instruments {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
