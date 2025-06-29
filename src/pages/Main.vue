<script setup lang="ts">
  import HiddenOrderItem from '@/components/HiddenOrderItem.vue';
  import ToggleSwitch from '@/components/ToggleSwitch.vue';
  import type { HiddenOrder } from '@/types';
  import { storage } from '@/utils/storage';
  import { onMounted, ref } from 'vue';

  const loading = ref(true);
  const isEnabled = ref(true);
  const showHidden = ref(false);
  const hiddenOrders = ref<HiddenOrder[]>([]);

  onMounted(async () => {
    await loadData();
  });

  async function loadData(): Promise<void> {
    try {
      loading.value = true;
      const data = await storage.getAll();

      isEnabled.value = data.isEnabled;
      showHidden.value = data.showHidden;
      hiddenOrders.value = data.hiddenOrders.sort(
        (a, b) =>
          new Date(b.hiddenAt).getTime() - new Date(a.hiddenAt).getTime(),
      );
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      loading.value = false;
    }
  }

  async function handleToggleEnabled(): Promise<void> {
    try {
      const newState = await storage.toggleEnabled();
      isEnabled.value = newState;
    } catch (error) {
      console.error('Error toggling enabled state:', error);
    }
  }

  async function handleToggleShowHidden(): Promise<void> {
    try {
      const newState = await storage.toggleShowHidden();
      showHidden.value = newState;
    } catch (error) {
      console.error('Error toggling show hidden state:', error);
    }
  }

  async function handleRestoreOrder(orderId: string): Promise<void> {
    try {
      await storage.unhideOrder(orderId);
      hiddenOrders.value = hiddenOrders.value.filter(
        (order) => order.id !== orderId,
      );
    } catch (error) {
      console.error('Error restoring order:', error);
    }
  }

  async function handleClearAll(): Promise<void> {
    if (
      !window.confirm(
        'Sei sicuro di voler ripristinare tutti gli ordini nascosti?',
      )
    ) {
      return;
    }

    try {
      loading.value = true;
      await storage.clearAllHiddenOrders();
      hiddenOrders.value = [];
    } catch (error) {
      console.error('Error clearing all orders:', error);
    } finally {
      loading.value = false;
    }
  }
</script>

<template>
  <div class="popup-container">
    <!-- Stats -->
    <div class="stats">
      <div class="stat-card">
        <div class="stat-number">{{ isEnabled ? 'ON' : 'OFF' }}</div>
        <div class="stat-label">Stato estensione</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">{{ hiddenOrders.length }}</div>
        <div class="stat-label">Ordini nascosti</div>
      </div>
    </div>

    <!-- Controls -->
    <div class="controls">
      <div class="control-group">
        <div class="control-label">Abilita estensione</div>
        <ToggleSwitch
          :value="isEnabled"
          @change="handleToggleEnabled"
          :disabled="loading"
        />
      </div>
      <div class="control-group">
        <div class="control-label">Mostra ordini nascosti</div>
        <ToggleSwitch
          :value="showHidden"
          @change="handleToggleShowHidden"
          :disabled="loading || !isEnabled"
        />
      </div>
    </div>

    <!-- Hidden Orders List -->
    <div class="hidden-orders">
      <div class="hidden-orders-header">
        Ordini nascosti
        <span v-if="hiddenOrders.length > 0" class="count"
          >({{ hiddenOrders.length }})</span
        >
      </div>
      <div v-if="loading" class="loading">
        <div class="spinner"></div>
      </div>

      <div v-else-if="hiddenOrders.length === 0" class="empty-state">
        <div class="empty-state-icon">📦</div>
        <p>Nessun ordine nascosto</p>
        <small>Vai su Amazon e nascondi un ordine per vederlo qui</small>
      </div>

      <div v-else class="orders-list">
        <HiddenOrderItem
          v-for="order in hiddenOrders"
          :key="order.id"
          :order="order"
          @restore="handleRestoreOrder"
        />
      </div>
    </div>

    <!-- Clear All Button -->
    <button
      v-if="hiddenOrders.length > 0"
      class="clear-all-btn"
      @click="handleClearAll"
      :disabled="loading"
    >
      {{ loading ? 'Caricamento...' : 'Ripristina tutti gli ordini' }}
    </button>
  </div>
</template>

<style scoped>
  .popup-container {
    width: 500px;
    height: 100%;
    padding: 20px;
  }

  .stats {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
    margin-bottom: 20px;
  }

  .stat-card {
    background: white;
    padding: 15px;
    border-radius: 8px;
    text-align: center;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .stat-number {
    font-size: 24px;
    font-weight: 700;
    color: #ff6b35;
  }

  .stat-label {
    font-size: 12px;
    color: #666;
    margin-top: 5px;
  }

  .controls {
    background: white;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
  }

  .control-group {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
  }

  .control-group:last-child {
    margin-bottom: 0;
  }

  .control-label {
    font-size: 14px;
    font-weight: 500;
  }

  .hidden-orders {
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    max-height: 260px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .hidden-orders-header {
    padding: 15px 20px;
    border-bottom: 1px solid #eee;
    font-weight: 600;
    font-size: 14px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .count {
    color: #666;
    font-weight: 400;
    font-size: 12px;
  }

  .hidden-orders-content {
    flex: 1;
  }

  .empty-state {
    text-align: center;
    padding: 40px 20px;
    color: #666;
  }

  .empty-state-icon {
    font-size: 48px;
    margin-bottom: 15px;
    opacity: 0.5;
  }

  .empty-state p {
    font-weight: 500;
    margin-bottom: 8px;
  }

  .empty-state small {
    font-size: 11px;
    opacity: 0.8;
  }

  .loading {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 40px;
  }

  .spinner {
    width: 30px;
    height: 30px;
    border: 3px solid #f3f3f3;
    border-top: 3px solid #46b3cb;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  .orders-list {
    max-height: 250px;
    overflow-y: auto;
  }

  .clear-all-btn {
    width: 100%;
    background: #46b3cb;
    color: white;
    border: none;
    padding: 12px;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.2s;
    margin-top: 15px;
  }

  .clear-all-btn:hover:not(:disabled) {
    background: #46b3cb;
  }

  .clear-all-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
</style>
