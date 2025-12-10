<template>
  <div class="page-wrapper">
    <div class="page-container">
      <PageHeader @toggle-menu="showMenu = !showMenu" />
      
      <main class="orders-main">
        <div class="orders-header">
          <h1 class="page-title">Заказы</h1>
          <p class="page-subtitle">История заказов по кабинетам</p>
        </div>

        <!-- Loading State -->
        <div v-if="loadingOrders" class="loading-state">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Загрузка...</span>
          </div>
          <p>Загрузка заказов...</p>
        </div>


        <!-- No Orders -->
        <div v-else-if="orders.length === 0" class="empty-state">
          <i class="bi bi-inbox"></i>
          <p>Заказы не найдены</p>
        </div>

        <!-- Orders List -->
        <div v-else class="orders-content">
          <div class="orders-grid">
            <div 
              v-for="order in orders" 
              :key="order.id"
              class="order-card"
              @click="showOrderDetails(order.id)"
            >
              <div class="order-header">
                <div class="order-id">Заказ #{{ order.id }}</div>
                <div class="order-status" :class="`status-${order.status.name}`">
                  {{ order.status.description }}
                </div>
              </div>

              <div class="order-body">
                <!-- <div class="order-info-row">
                  <span class="info-label">Кабинет:</span>
                  <span class="info-value">{{ order.cabinet.personal_number }}</span>
                </div> -->
                <div class="order-info-row">
                  <span class="info-label">Участник:</span>
                  <span class="info-value">{{ formatParticipantName(order.cabinet.participant) }}</span>
                </div>
                <div class="order-info-row">
                  <span class="info-label">Дата заказа:</span>
                  <span class="info-value">{{ formatDate(order.order_date) }}</span>
                </div>
                <div class="order-info-row">
                  <span class="info-label">Способ доставки:</span>
                  <span class="info-value">{{ order.delivery_method.description }}</span>
                </div>
              </div>

              <div class="order-footer">
                <div class="order-total">
                  <span>Итого:</span>
                  <span class="total-amount">${{ order.total_amount }}</span>
                </div>
                <button class="btn-view-details">
                  <i class="bi bi-eye"></i>
                  Детали
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>

    <MenuModal :is-open="showMenu" @close="showMenu = false" />

    <!-- Order Details Modal -->
    <Transition name="modal">
      <div v-if="selectedOrder" class="modal-overlay" @click="closeOrderModal">
        <div class="modal-content" @click.stop>
          <button @click="closeOrderModal" class="btn-close-modal">
            <i class="bi bi-x-lg"></i>
          </button>

          <div class="modal-body">
            <div class="modal-header-section">
              <h2 class="modal-title">Заказ #{{ selectedOrder.id }}</h2>
              <div class="order-status-badge" :class="`status-${selectedOrder.status.name}`">
                {{ selectedOrder.status.description }}
              </div>
            </div>

            <div class="modal-details">
              <!-- Order Info -->
              <div class="detail-section">
                <h3 class="section-title">Информация о заказе</h3>
                <!-- <div class="detail-row">
                  <span class="detail-label">Кабинет:</span>
                  <span class="detail-value">{{ selectedOrder.cabinet.personal_number }}</span>
                </div> -->
                <div class="detail-row">
                  <span class="detail-label">Участник:</span>
                  <span class="detail-value">{{ formatParticipantName(selectedOrder.cabinet.participant) }}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Email:</span>
                  <span class="detail-value">{{ selectedOrder.cabinet.participant.email }}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Дата заказа:</span>
                  <span class="detail-value">{{ formatDate(selectedOrder.order_date) }}</span>
                </div>
                <div class="detail-row" v-if="selectedOrder.delivery_date">
                  <span class="detail-label">Дата доставки:</span>
                  <span class="detail-value">{{ formatDate(selectedOrder.delivery_date) }}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Способ доставки:</span>
                  <span class="detail-value">{{ selectedOrder.delivery_method.description }}</span>
                </div>
                <div class="detail-row" v-if="selectedOrder.shipping_address">
                  <span class="detail-label">Адрес доставки:</span>
                  <span class="detail-value">{{ selectedOrder.shipping_address }}</span>
                </div>
                <div class="detail-row" v-if="selectedOrder.notes">
                  <span class="detail-label">Примечания:</span>
                  <span class="detail-value">{{ selectedOrder.notes }}</span>
                </div>
              </div>

              <!-- Order Items -->
              <div class="detail-section">
                <h3 class="section-title">Товары</h3>
                <div class="items-list">
                  <div 
                    v-for="item in selectedOrder.items" 
                    :key="item.id"
                    class="item-card"
                  >
                    <div class="item-info">
                      <div class="item-name">{{ item.product.name }}</div>
                      <div class="item-sku">{{ item.product.sku }}</div>
                      <div class="item-description">{{ item.product.description }}</div>
                    </div>
                    <div class="item-details">
                      <div class="item-quantity">
                        <span class="quantity-label">Количество:</span>
                        <span class="quantity-value">{{ item.quantity }} шт</span>
                      </div>
                      <div class="item-price">
                        <span class="price-label">Цена за шт:</span>
                        <span class="price-value">${{ item.unit_price }}</span>
                      </div>
                      <div class="item-total">
                        <span class="total-label">Итого:</span>
                        <span class="total-value">${{ item.total_price }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Order Total -->
              <div class="detail-section total-section">
                <div class="order-total-row">
                  <span class="total-label">Общая сумма заказа:</span>
                  <span class="total-amount">${{ selectedOrder.total_amount }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import PageHeader from '../components/PageHeader.vue'
import MenuModal from '../components/MenuModal.vue'
import { BACKEND_API_URL } from '../config'

const showMenu = ref(false)
const loadingCabinets = ref(false)
const loadingOrders = ref(false)
const cabinets = ref([])
const orders = ref([])
const selectedCabinetId = ref(null)
const selectedOrder = ref(null)

const fetchCabinets = async () => {
  loadingCabinets.value = true
  
  try {
    const token = localStorage.getItem('access_token')
    if (!token) {
      console.error('Token not found')
      return
    }

    const response = await fetch(
      `${BACKEND_API_URL}/api/cabinets/?page=1&page_size=1`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'accept': 'application/json'
        }
      }
    )

    if (response.ok) {
      const data = await response.json()
      cabinets.value = data.cabinets || []
      // Автоматически выбрать первый кабинет и загрузить заказы
      if (cabinets.value.length > 0) {
        selectedCabinetId.value = cabinets.value[0].id
        await fetchOrders(selectedCabinetId.value)
      }
    }
  } catch (err) {
    console.error('Error fetching cabinets:', err)
  } finally {
    loadingCabinets.value = false
  }
}

const fetchOrders = async (cabinetId) => {
  if (!cabinetId) return
  
  loadingOrders.value = true
  
  try {
    const token = localStorage.getItem('access_token')
    if (!token) {
      console.error('Token not found')
      return
    }

    const response = await fetch(
      `${BACKEND_API_URL}/api/orders/?cabinet_id=${cabinetId}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'accept': 'application/json'
        }
      }
    )

    if (response.ok) {
      orders.value = await response.json()
    } else {
      orders.value = []
    }
  } catch (err) {
    console.error('Error fetching orders:', err)
    orders.value = []
  } finally {
    loadingOrders.value = false
  }
}

const showOrderDetails = async (orderId) => {
  try {
    const token = localStorage.getItem('access_token')
    if (!token) {
      console.error('Token not found')
      return
    }

    const response = await fetch(
      `${BACKEND_API_URL}/api/orders/${orderId}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'accept': 'application/json'
        }
      }
    )

    if (response.ok) {
      selectedOrder.value = await response.json()
      document.body.style.overflow = 'hidden'
    }
  } catch (err) {
    console.error('Error fetching order details:', err)
  }
}

const closeOrderModal = () => {
  selectedOrder.value = null
  document.body.style.overflow = ''
}


const formatParticipantName = (participant) => {
  if (!participant) return '-'
  return `${participant.lastname || ''} ${participant.name || ''} ${participant.patronymic || ''}`.trim()
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(() => {
  fetchCabinets()
})
</script>

<style scoped>
.page-wrapper {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.page-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0;
}

.orders-main {
  padding: 2rem 1.5rem;
  min-height: calc(100vh - 72px);
}

.orders-header {
  text-align: center;
  margin-bottom: 2rem;
}

.page-title {
  font-size: 32px;
  font-weight: 700;
  color: white;
  margin-bottom: 0.5rem;
}

.page-subtitle {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.9);
}

/* Selector Section */
.selector-section {
  background: white;
  border-radius: 20px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.selector-label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #495057;
  margin-bottom: 0.75rem;
}

.cabinet-select {
  width: 100%;
  padding: 0.875rem 1rem;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 500;
  color: #495057;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cabinet-select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
}

/* Loading & Empty States */
.loading-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 24px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.loading-state p,
.empty-state p {
  margin-top: 1rem;
  color: #6c757d;
  font-size: 16px;
}

.empty-state i {
  font-size: 64px;
  color: #6c757d;
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

/* Orders Grid */
.orders-content {
  animation: fadeIn 0.6s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.orders-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.order-card {
  background: white;
  border-radius: 20px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
}

.order-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f0f0f0;
}

.order-id {
  font-size: 18px;
  font-weight: 700;
  color: #1a1a1a;
}

.order-status {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.status-pending {
  background: #fff3cd;
  color: #856404;
}

.status-processing {
  background: #cfe2ff;
  color: #084298;
}

.status-completed {
  background: #d1e7dd;
  color: #0f5132;
}

.status-cancelled {
  background: #f8d7da;
  color: #842029;
}

.order-body {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.order-info-row {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
}

.info-label {
  color: #6c757d;
  font-weight: 500;
}

.info-value {
  color: #1a1a1a;
  font-weight: 600;
  text-align: right;
}

.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 2px solid #f0f0f0;
}

.order-total {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.order-total span:first-child {
  font-size: 12px;
  color: #6c757d;
}

.total-amount {
  font-size: 24px;
  font-weight: 700;
  color: #28a745;
}

.btn-view-details {
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-view-details:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  z-index: 2000;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  overflow-y: auto;
}

.modal-content {
  background: white;
  border-radius: 24px;
  max-width: 800px;
  width: 100%;
  position: relative;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  max-height: 90vh;
  overflow-y: auto;
}

.btn-close-modal {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.1);
  border: none;
  border-radius: 50%;
  color: #1a1a1a;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 10;
}

.btn-close-modal:hover {
  background: rgba(0, 0, 0, 0.2);
  transform: rotate(90deg);
}

.modal-body {
  padding: 2rem;
}

.modal-header-section {
  text-align: center;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 2px solid #f0f0f0;
}

.modal-title {
  font-size: 28px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 1rem;
}

.order-status-badge {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
}

.modal-details {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.detail-section {
  background: #f8f9fa;
  border-radius: 16px;
  padding: 1.5rem;
}

.section-title {
  font-size: 18px;
  font-weight: 700;
  color: #495057;
  margin-bottom: 1rem;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid #e9ecef;
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-label {
  font-size: 14px;
  color: #6c757d;
  font-weight: 500;
}

.detail-value {
  font-size: 15px;
  color: #1a1a1a;
  font-weight: 600;
  text-align: right;
}

/* Items List */
.items-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.item-card {
  background: white;
  border-radius: 12px;
  padding: 1rem;
  border: 2px solid #e9ecef;
}

.item-info {
  margin-bottom: 0.75rem;
}

.item-name {
  font-size: 16px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 0.25rem;
}

.item-sku {
  font-size: 12px;
  color: #6c757d;
  margin-bottom: 0.5rem;
}

.item-description {
  font-size: 13px;
  color: #495057;
}

.item-details {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid #e9ecef;
}

.item-quantity,
.item-price,
.item-total {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.quantity-label,
.price-label,
.total-label {
  font-size: 11px;
  color: #6c757d;
  text-transform: uppercase;
}

.quantity-value,
.price-value {
  font-size: 14px;
  color: #1a1a1a;
  font-weight: 600;
}

.total-value {
  font-size: 16px;
  color: #28a745;
  font-weight: 700;
}

/* Total Section */
.total-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.order-total-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.order-total-row .total-label {
  font-size: 18px;
  color: white;
  font-weight: 600;
}

.order-total-row .total-amount {
  font-size: 32px;
  color: white;
  font-weight: 700;
}

/* Modal Transitions */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-content,
.modal-leave-to .modal-content {
  transform: scale(0.9);
}

/* Mobile */
@media (max-width: 600px) {
  .orders-main {
    padding: 1.5rem 1rem;
  }

  .page-title {
    font-size: 24px;
  }

  .page-subtitle {
    font-size: 14px;
  }

  .selector-section {
    padding: 1rem;
  }

  .orders-grid {
    grid-template-columns: 1fr;
  }

  .modal-content {
    margin: 0.5rem;
  }

  .modal-body {
    padding: 1.5rem;
  }

  .modal-title {
    font-size: 22px;
  }

  .item-details {
    grid-template-columns: 1fr;
  }

  .order-total-row .total-amount {
    font-size: 24px;
  }
}

/* Tablet */
@media (min-width: 768px) {
  .orders-main {
    padding: 3rem 2rem;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .orders-main {
    padding: 3rem;
  }
}
</style>
