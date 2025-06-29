<template>
  <div class="hidden-order">
    <div class="order-info">
      <div class="order-title" :title="order.title">
        {{ order.title }}
      </div>
      <div class="order-meta">
        <span class="order-date">Ordinato il: {{ formatDate(order.date) }}</span></br>
        <span v-if="order.price" class="order-price">Prezzo: {{ order.price }}</span></br>
        <span class="hidden-date">Nascosto il: {{ formatHiddenDate(order.hiddenAt) }}</span>
      </div>
    </div>
    
    <button 
      class="restore-btn"
      @click="handleRestore"
      :title="`Ripristina ordine: ${order.title}`"
    >
      <i class="fas fa-undo"></i>
    </button>
  </div>
</template>

<script setup lang="ts">
import type { HiddenOrder } from '@/types'
import { format, formatDistanceToNow } from 'date-fns'
import { it } from 'date-fns/locale'

interface Props {
  order: HiddenOrder
}

interface Emits {
  (e: 'restore', orderId: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

function handleRestore(): void {
  emit('restore', props.order.id)
}

function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) {
      return dateString // Return original if parsing fails
    }
    return format(date, 'dd/MM/yyyy', { locale: it })
  } catch {
    return dateString
  }
}

function formatHiddenDate(dateString: string): string {
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) {
      return 'data sconosciuta'
    }
    return formatDistanceToNow(date, { 
      addSuffix: true, 
      locale: it 
    })
  } catch {
    return 'data sconosciuta'
  }
}
</script>

<style scoped>
.hidden-order {
  padding: 12px 20px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background-color 0.2s ease;
}

.hidden-order:last-child {
  border-bottom: none;
}

.hidden-order:hover {
  background-color: #f8f9fa;
}

.order-info {
  flex: 1;
  min-width: 0;
  margin-right: 12px;
}

.order-title {
  font-size: 13px;
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.3;
}

.order-meta {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 11px;
  color: #666;
  line-height: 1.2;
}

.order-date {
  font-weight: 500;
}

.order-price {
  color: #ff6b35;
  font-weight: 500;
}

.hidden-date {
  opacity: 0.8;
}

.restore-btn {
  background: #28a745;
  color: white;
  border: none;
  padding: 8px;
  border-radius: 50%;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

.restore-btn:hover {
  background: #218838;
  transform: translateY(-1px) scale(1.05);
  box-shadow: 0 2px 8px rgba(40, 167, 69, 0.3);
}

.restore-btn:active {
  transform: translateY(0) scale(1);
}
</style> 