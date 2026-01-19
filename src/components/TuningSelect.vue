<template>
  <div class="tuning-selector">
    <h2>Select Tuning</h2>

    <div class="string-count-selector">
      <button
        v-for="count in availableStringCounts"
        :key="count"
        class="string-count-btn"
        :class="{ active: stringCount === count }"
        @click="$emit('update-string-count', count)"
      >
        {{ count }}
      </button>
    </div>

    <div class="tuning-controls">
      <select
        :value="currentTuning"
        @change="e => $emit('update-tuning', e.target.value)"
      >
        <optgroup label="Standard Tunings">
          <option
            v-for="(notes, name) in standardTunings"
            :key="name"
            :value="name"
          >
            {{ formatTuningName(name) }}
          </option>
        </optgroup>
        <optgroup label="Custom Tunings" v-if="filteredCustomTunings.length">
          <option
            v-for="tuning in filteredCustomTunings"
            :key="tuning.id"
            :value="'custom-' + tuning.id"
          >
            {{ tuning.name }}
          </option>
        </optgroup>
      </select>

      <button class="save-btn" @click="$emit('save')">
        💾 Save
      </button>

      <button
        v-if="currentTuning.startsWith('custom-')"
        class="delete-btn"
        @click="handleDelete"
      >
        🗑️ Delete
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { STANDARD_TUNINGS } from '../data/tunings'

const props = defineProps({
  instrument: {
    type: String,
    required: true
  },
  stringCount: {
    type: String,
    required: true
  },
  currentTuning: {
    type: String,
    required: true
  },
  customTunings: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['update-string-count', 'update-tuning', 'save', 'delete'])

const availableStringCounts = computed(() => {
  return Object.keys(STANDARD_TUNINGS[props.instrument] || {})
})

const standardTunings = computed(() => {
  return STANDARD_TUNINGS[props.instrument]?.[props.stringCount] || {}
})

const filteredCustomTunings = computed(() => {
  return props.customTunings.filter(t =>
    t.instrument === props.instrument &&
    t.stringCount === props.stringCount
  )
})

function formatTuningName(name) {
  return name.split('-').map(w =>
    w.charAt(0).toUpperCase() + w.slice(1)
  ).join(' ')
}

function handleDelete() {
  const tuningId = parseInt(props.currentTuning.replace('custom-', ''))
  emit('delete', tuningId)
}
</script>

<style scoped>
.tuning-selector {
  margin-bottom: 25px;
}

.string-count-selector {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
  flex-wrap: wrap;
  justify-content: center;
}

.string-count-btn {
  padding: 10px 20px;
  background: rgba(255,255,255,0.2);
  border: 2px solid rgba(255,255,255,0.3);
  border-radius: 8px;
  color: white;
  cursor: pointer;
  transition: all 0.3s;
}

.string-count-btn.active {
  background: rgba(255,255,255,0.4);
  border-color: white;
}

.tuning-controls {
  display: flex;
  gap: 10px;
  align-items: center;
}

select {
  flex: 1;
  padding: 12px;
  background: rgba(255,255,255,0.2);
  border: 2px solid rgba(255,255,255,0.3);
  border-radius: 8px;
  color: white;
  font-size: 1em;
  cursor: pointer;
}

select option {
  background: #667eea;
  color: white;
}

.save-btn,
.delete-btn {
  padding: 12px 20px;
  background: rgba(76, 175, 80, 0.7);
  border: 2px solid rgba(255,255,255,0.3);
  border-radius: 8px;
  color: white;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.3s;
}

.delete-btn {
  background: rgba(244, 67, 54, 0.7);
}

.save-btn:hover {
  background: rgba(76, 175, 80, 0.9);
}

.delete-btn:hover {
  background: rgba(244, 67, 54, 0.9);
}

@media (max-width: 768px) {
  .tuning-controls {
    flex-direction: column;
  }

  select,
  .save-btn,
  .delete-btn {
    width: 100%;
  }
}
</style>
