<script setup lang="ts">
  import { ref, onBeforeUnmount } from 'vue';

  const props = withDefaults(
    defineProps<{
      disabled?: boolean;
      countdown?: number;
    }>(),
    {
      countdown: 5,
    },
  );

  const emit = defineEmits(['confirm']);

  const isConfirming = ref(false);
  const countdown = ref(3);
  let timeoutId: number | null = null;
  let intervalId: number | null = null;

  function resetState() {
    isConfirming.value = false;
    if (timeoutId) clearTimeout(timeoutId);
    if (intervalId) clearInterval(intervalId);
    timeoutId = null;
    intervalId = null;
  }

  function handleClick() {
    if (props.disabled) return;

    if (isConfirming.value) {
      emit('confirm');
      resetState();
    } else {
      isConfirming.value = true;
      countdown.value = props.countdown;

      timeoutId = window.setTimeout(resetState, props.countdown * 1000);
      intervalId = window.setInterval(() => {
        countdown.value -= 1;
      }, 1000);
    }
  }

  onBeforeUnmount(resetState);
</script>

<template>
  <button
    class="confirm-button"
    :class="{ 'is-confirming': isConfirming }"
    :disabled="disabled"
    @click="handleClick"
  >
    <span class="text">
      <slot v-if="!isConfirming"></slot>
      <span v-else>Confirm ({{ countdown }}s)</span>
    </span>
  </button>
</template>

<style scoped>
  .confirm-button {
    position: relative;
    overflow: hidden;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;
    min-width: 180px;
    outline: none;

    /* Default state (red) */
    background-color: #dc2626;
    color: white;
  }

  .confirm-button:hover:not(:disabled) {
    background-color: #b91c1c;
  }

  .confirm-button:disabled {
    background-color: #f87171;
    cursor: not-allowed;
  }

  /* Confirmation state (green) */
  .confirm-button.is-confirming {
    background-color: #22c55e; /* Brighter green */
  }

  .confirm-button.is-confirming:hover:not(:disabled) {
    background-color: #16a34a; /* Darker green */
  }

  .confirm-button::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 100%;
    z-index: 0;

    /* Animation color (darker green) */
    background-color: #16a34a;

    /* No transition when returning to initial state */
    transition: right 0s;
  }

  .confirm-button.is-confirming::before {
    right: 0;
    transition: right 5s linear;
  }

  .confirm-button .text {
    position: relative;
    z-index: 1; /* Keep text on top of the animation */
    color: white;
  }
</style>
