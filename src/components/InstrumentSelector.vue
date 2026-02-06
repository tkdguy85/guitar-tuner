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
        {{ instrument.label }}
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
    { value: 'bass', label: 'Bass'},
    { value: 'electric-guitar', label: 'Electric Guitar'},
    { value: 'acoustic-guitar', label: 'Acoustic Guitar'},
    { value: 'pure-tone', label: 'Pure Tones'}
  ]
</script>

<style scoped>
.instrument-selector {
  margin: 50px 0;
}

.instruments {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 10px;
}

.instrument-btn {
  padding: 15px;
  background: var(--primary-slate);
  border: 2px solid var(--primary-slate);
  border-radius: 10px;
  color:var(--primary-text);
  font-size: 1em;
  cursor: pointer;
  transition: all 0.3s;
}

.instrument-btn:hover {
  background: var(--primary-slate);
  transform: translateY(-2px);
}

.instrument-btn.active {
  background: rgba(255,255,255,0.4);
  border-color:var(--primary-text);
  box-shadow: 0 0 20px var(--primary-slate);
}

@media (max-width: 768px) {
  .instruments {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
