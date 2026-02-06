<template>
  <div class="modal" @click.self="$emit('close')">
    <div class="modal-content">
      <h3>Save Custom Tuning</h3>
      <input
        v-model="tuningName"
        placeholder="Enter tuning name"
        @keyup.enter="handleSave"
        ref="inputRef"
      />
      <div class="modal-actions">
        <button @click="handleSave">Save</button>
        <button @click="$emit('close')">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

defineProps({
  instrument: String,
  stringCount: String,
  strings: Array
})

const emit = defineEmits(['save', 'close'])

const tuningName = ref('')
const inputRef = ref(null)

function handleSave() {
  if (tuningName.value.trim()) {
    emit('save', tuningName.value.trim())
    tuningName.value = ''
  }
}

onMounted(() => {
  inputRef.value?.focus()
})
</script>

<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 30px;
  border-radius: 15px;
  min-width: 300px;
  max-width: 90%;
}

.modal-content h3 {
  margin-bottom: 20px;
  text-align: center;
  color: var(--primary-text);
}

.modal-content input {
  width: 100%;
  padding: 12px;
  margin-bottom: 20px;
  background: var(--primary-slate);
  border: 2px solid var(--primary-slate);
  border-radius: 8px;
  color: var(--primary-text);
  font-size: 1em;
}

.modal-content input::placeholder {
  color: rgba(255,255,255,0.6);
}

.modal-actions {
  display: flex;
  gap: 10px;
}

.modal-actions button {
  flex: 1;
  padding: 12px;
  background: var(--primary-slate);
  border: 2px solid var(--primary-slate);
  border-radius: 8px;
  color: var(--primary-text);
  cursor: pointer;
  transition: all 0.3s;
}

.modal-actions button:first-child {
  background: rgba(76, 175, 80, 0.7);
}

.modal-actions button:hover {
  opacity: 0.9;
  transform: translateY(-2px);
}
</style>
