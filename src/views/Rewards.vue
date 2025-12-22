<template>
  <div class="page-wrapper">
    <div class="page-container">
      <PageHeader @toggle-menu="showMenu = !showMenu" />
      
      <main class="rewards-main">
        <div class="rewards-header">
          <h1 class="page-title">Вознаграждения</h1>
          <p class="page-subtitle">История начислений бонусов</p>
        </div>

        <!-- Bonus Type Tabs -->
        <div class="tabs-section">
          <div class="tabs-nav">
            <button
              v-for="tab in bonusTabs"
              :key="tab.type"
              class="tab-button"
              :class="{ 'active': activeTab === tab.type }"
              @click="switchTab(tab.type)"
            >
              <i :class="tab.icon"></i>
              {{ tab.label }}
            </button>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loadingBonuses" class="loading-state">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Загрузка...</span>
          </div>
          <p>Загрузка бонусов...</p>
        </div>

        <!-- Empty State -->
        <div v-else-if="bonuses.length === 0" class="empty-state">
          <i class="bi bi-inbox"></i>
          <p>Бонусы не найдены</p>
        </div>

        <!-- Bonuses List -->
        <div v-else class="bonuses-content">
          <div class="bonuses-grid">
            <div 
              v-for="bonus in bonuses" 
              :key="bonus.id"
              class="bonus-card"
              :class="{ 'issued': bonus.issued }"
            >
              <div class="bonus-header">
                <div class="bonus-type">
                  <i :class="getCurrentTabIcon()"></i>
                  {{ getCurrentTabLabel() }}
                </div>
                <div class="bonus-amount">+${{ bonus.bonus_amount || '0.00' }}</div>
              </div>

              <div class="bonus-body">
                <div class="bonus-info-row">
                  <span class="info-label">Кабинет:</span>
                  <span class="info-value">{{ bonus.cabinet?.personal_number || '-' }}</span>
                </div>
                <div class="bonus-info-row" v-if="bonus.cabinet?.participant">
                  <span class="info-label">Участник:</span>
                  <span class="info-value">{{ formatParticipantName(bonus.cabinet.participant) }}</span>
                </div>
                <div class="bonus-info-row">
                  <span class="info-label">Статус:</span>
                  <span class="info-value" :class="bonus.issued ? 'status-issued' : 'status-pending'">
                    {{ bonus.issued ? 'Выдан' : 'Ожидает' }}
                  </span>
                </div>
                <div class="bonus-info-row">
                  <span class="info-label">Дата:</span>
                  <span class="info-value">{{ formatDate(bonus.issued ? bonus.issued_at : bonus.created_at) }}</span>
                </div>
                <div class="bonus-info-row" v-if="activeTab === 'binary'">
                  <span class="info-label">Период:</span>
                  <span class="info-value">{{ bonus.period || '-' }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Pagination -->
          <div v-if="totalPages > 1" class="pagination">
            <button 
              class="btn-page"
              :disabled="currentPage === 1"
              @click="changePage(currentPage - 1)"
            >
              <i class="bi bi-chevron-left"></i>
            </button>
            <span class="page-info">Страница {{ currentPage }} из {{ totalPages }}</span>
            <button 
              class="btn-page"
              :disabled="currentPage === totalPages"
              @click="changePage(currentPage + 1)"
            >
              <i class="bi bi-chevron-right"></i>
            </button>
          </div>
        </div>
      </main>
    </div>

    <MenuModal :is-open="showMenu" @close="showMenu = false" />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import PageHeader from '../components/PageHeader.vue'
import MenuModal from '../components/MenuModal.vue'
import { BACKEND_API_URL } from '../config'

const showMenu = ref(false)
const loadingBonuses = ref(false)
const bonuses = ref([])
const activeTab = ref('binary')
const currentPage = ref(1)
const totalPages = ref(1)
const totalBonuses = ref(0)
const pageSize = 20

const bonusTabs = [
  { type: 'binary', label: 'Бинарные', icon: 'bi bi-diagram-3' },
  { type: 'referral', label: 'Реферальные', icon: 'bi bi-people' },
  { type: 'cheque', label: 'Чековые', icon: 'bi bi-receipt' },
  { type: 'sponsor', label: 'Спонсорские', icon: 'bi bi-person-plus' },
  { type: 'status', label: 'Статусные', icon: 'bi bi-star' }
]

const fetchBonuses = async () => {
  loadingBonuses.value = true
  
  try {
    const token = localStorage.getItem('access_token')
    if (!token) {
      console.error('Token not found')
      return
    }

    const params = new URLSearchParams({
      page: currentPage.value.toString(),
      page_size: pageSize.toString()
    })

    const response = await fetch(
      `${BACKEND_API_URL}/api/bonuses/${activeTab.value}?${params.toString()}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'accept': 'application/json'
        }
      }
    )

    if (response.ok) {
      const data = await response.json()
      bonuses.value = data.bonuses || []
      totalBonuses.value = data.total || 0
      totalPages.value = Math.ceil(totalBonuses.value / pageSize)
    } else {
      bonuses.value = []
      totalBonuses.value = 0
      totalPages.value = 1
    }
  } catch (err) {
    console.error('Error fetching bonuses:', err)
    bonuses.value = []
    totalBonuses.value = 0
    totalPages.value = 1
  } finally {
    loadingBonuses.value = false
  }
}


const switchTab = (tabType) => {
  if (activeTab.value !== tabType) {
    activeTab.value = tabType
    currentPage.value = 1
    fetchBonuses()
  }
}

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    fetchBonuses()
  }
}

const getCurrentTabIcon = () => {
  const tab = bonusTabs.find(t => t.type === activeTab.value)
  return tab ? tab.icon : 'bi bi-wallet2'
}

const getCurrentTabLabel = () => {
  const tab = bonusTabs.find(t => t.type === activeTab.value)
  return tab ? tab.label : 'Бонусы'
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

onMounted(async () => {
  await fetchBonuses()
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

.rewards-main {
  padding: 2rem 1.5rem;
  min-height: calc(100vh - 72px);
}

.rewards-header {
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

/* Tabs Section */
.tabs-section {
  background: white;
  border-radius: 20px;
  padding: 1rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.tabs-nav {
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
}

.tab-button {
  padding: 0.875rem 1.5rem;
  background: #f8f9fa;
  color: #6c757d;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.tab-button:hover {
  background: #e9ecef;
  color: #495057;
}

.tab-button.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
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

/* Bonuses Grid */
.bonuses-content {
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

.bonuses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.bonus-card {
  background: white;
  border-radius: 20px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.bonus-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.bonus-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f0f0f0;
}

.bonus-type {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 14px;
  font-weight: 600;
  color: #667eea;
}

.bonus-amount {
  font-size: 24px;
  font-weight: 700;
  color: #28a745;
}

.bonus-body {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.bonus-info-row {
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

.status-issued {
  color: #28a745 !important;
  font-weight: 700 !important;
}

.status-pending {
  color: #ffc107 !important;
  font-weight: 700 !important;
}

.bonus-card.issued {
  border-left: 4px solid #28a745;
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  padding: 2rem 0;
}

.btn-page {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  color: #667eea;
  border: 2px solid #667eea;
  border-radius: 12px;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-page:hover:not(:disabled) {
  background: #667eea;
  color: white;
}

.btn-page:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  font-size: 14px;
  font-weight: 600;
  color: white;
}

/* Mobile */
@media (max-width: 600px) {
  .rewards-main {
    padding: 1.5rem 1rem;
  }

  .page-title {
    font-size: 24px;
  }

  .page-subtitle {
    font-size: 14px;
  }

  .selector-section,
  .tabs-section {
    padding: 1rem;
  }

  .tabs-nav {
    flex-wrap: nowrap;
  }

  .tab-button {
    padding: 0.75rem 1rem;
    font-size: 13px;
  }

  .bonuses-grid {
    grid-template-columns: 1fr;
  }

  .bonus-amount {
    font-size: 20px;
  }
}

/* Tablet */
@media (min-width: 768px) {
  .rewards-main {
    padding: 3rem 2rem;
  }

  .tabs-nav {
    flex-wrap: wrap;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .rewards-main {
    padding: 3rem;
  }
}
</style>
