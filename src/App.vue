<script setup lang="ts">
  import { onMounted, ref } from 'vue';
  import { useRouter } from 'vue-router';

  const router = useRouter();

  const loading = ref(true);

  onMounted(() => {
    setTimeout(() => {
      router.replace('/home');
      loading.value = false;
    }, 300);
  });
</script>

<template>
  <div class="app-container" v-if="!loading">
      <router-view />
  </div>
  <div v-else>
    <div class="loading-container">
      <div class="loading-spinner"></div>
    </div>
  </div>
</template>

<style>
  body {
    margin: 0;
    font-family:
      -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu,
      Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }
</style>

<style scoped>
  .app-container {
    background-color: #f8fafc;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  .loading-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 500px;
    width: 800px;
    background-color: #f8fafc;
  }

  .loading-spinner {
    width: 60px;
    height: 60px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #3498db;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
</style>
