<template>
  <div class="playback-controls">
    <label>
      <input
        type="radio"
        value="repeat"
        :checked="modelValue === 'repeat'"
        @change="$emit('update:modelValue', 'repeat')"
      />
      Short Repeat
    </label>
    <label>
      <input
        type="radio"
        value="continuous"
        :checked="modelValue === 'continuous'"
        @change="$emit('update:modelValue', 'continuous')"
      />
      Longer/Continuous
    </label>
  </div>
</template>

<script setup>
defineProps({
  modelValue: {
    type: String,
    required: true
  }
})

defineEmits(['update:modelValue'])
</script>

<style scoped>
.playback-controls {
  display: flex;
  justify-content: center;
  gap: 30px;
  padding: 15px;
  background: var(--primary-slate);
  border-radius: 10px;
}

label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 1.1em;
}

input[type="radio"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

@media (max-width: 768px) {
  .playback-controls {
    flex-direction: column;
    gap: 15px;
  }
}
</style>
