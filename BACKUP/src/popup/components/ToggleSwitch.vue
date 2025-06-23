<template>
  <div 
    class="toggle-switch"
    :class="{ active: value, disabled }"
    @click="handleClick"
  >
    <div class="toggle-handle"></div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  value: boolean
  disabled?: boolean
}

interface Emits {
  (e: 'change'): void
}

const emit = defineEmits<Emits>()

function handleClick(): void {
  if (!props.disabled) {
    emit('change')
  }
}

const props = defineProps<Props>()
</script>

<style scoped>
.toggle-switch {
  position: relative;
  width: 50px;
  height: 26px;
  background: #ccc;
  border-radius: 13px;
  cursor: pointer;
  transition: background 0.3s ease;
  user-select: none;
}

.toggle-switch.active {
  background: #ff6b35;
}

.toggle-switch.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.toggle-handle {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 22px;
  height: 22px;
  background: white;
  border-radius: 50%;
  transition: transform 0.3s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.toggle-switch.active .toggle-handle {
  transform: translateX(24px);
}

.toggle-switch:hover:not(.disabled) {
  box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1);
}
</style> 