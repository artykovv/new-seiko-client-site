<template>
  <div class="home-wrapper">
    <div class="home-container">
      <PageHeader @toggle-menu="showMenu = !showMenu" />

      <!-- Main Content -->
      <main class="home-main">
        <!-- Loading State -->
        <div v-if="loading" class="loading-state">
          <div class="spinner-border text-light" role="status">
            <span class="visually-hidden">Загрузка...</span>
          </div>
        </div>

        <template v-else>
          <!-- User Info Card -->
          <div class="user-info-card">
            <div class="user-avatar">
              <i class="bi bi-person-circle"></i>
            </div>
            <div class="user-details">
              <h1 class="user-name">{{ formatUserName() }}</h1>
              <p class="user-email">{{ userData.email }}</p>
              
              <!-- Personal Number - Clickable -->
              <button 
                v-if="cabinetData.personal_number" 
                class="personal-number-btn"
                @click="copyPersonalNumber"
                :title="'Нажмите, чтобы скопировать'"
              >
                <span>{{ cabinetData.personal_number }}</span>
                <i class="bi bi-clipboard"></i>
              </button>
              
              <!-- Status Name -->
              <div class="user-status" v-if="cabinetData.status_name">
                <i class="bi bi-star-fill"></i>
                <span>{{ cabinetData.status_name }}</span>
              </div>

              <!-- Package Name with Upgrade Button -->
              <div class="user-package" v-if="cabinetData.paket_name">
                <div class="package-info">
                  <i class="bi bi-box-seam"></i>
                  <span>{{ cabinetData.paket_name }}</span>
                </div>
                <!-- <button class="upgrade-btn" @click="goToUpgrade">
                  <i class="bi bi-arrow-up-circle"></i>
                  <span>Upgrade</span>
                </button> -->
              </div>
            </div>
          </div>

          <!-- Copy Success Notification -->
          <transition name="fade">
            <div v-if="showCopyNotification" class="copy-notification">
              <i class="bi bi-check-circle-fill"></i>
              <span>Успешно скопировано</span>
            </div>
          </transition>

          <!-- Turnover Section -->
          <div class="stats-section">
            <h2 class="section-title">Товарооборот</h2>
            <div class="turnover-grid">
              <!-- Left Turnover -->
              <div class="turnover-column">
                <h3 class="turnover-column-title">Левая</h3>
                
                <div class="turnover-card">
                  <div class="turnover-icon left">
                    <i class="bi bi-arrow-left-circle"></i>
                  </div>
                  <div class="turnover-info">
                    <div class="turnover-value">${{ cabinetData.left_turnover_all_time }}</div>
                    <div class="turnover-label">За все время</div>
                  </div>
                </div>

                <div class="turnover-card">
                  <div class="turnover-icon left">
                    <i class="bi bi-calendar-month"></i>
                  </div>
                  <div class="turnover-info">
                    <div class="turnover-value">${{ cabinetData.left_turnover_current_month }}</div>
                    <div class="turnover-label">Текущий месяц</div>
                  </div>
                </div>
              </div>

              <!-- Right Turnover -->
              <div class="turnover-column right-column">
                <h3 class="turnover-column-title">Правая</h3>
                
                <div class="turnover-card">
                  <div class="turnover-info">
                    <div class="turnover-value">${{ cabinetData.right_turnover_all_time }}</div>
                    <div class="turnover-label">За все время</div>
                  </div>
                  <div class="turnover-icon right">
                    <i class="bi bi-arrow-right-circle"></i>
                  </div>
                </div>

                <div class="turnover-card">
                  <div class="turnover-info">
                    <div class="turnover-value">${{ cabinetData.right_turnover_current_month }}</div>
                    <div class="turnover-label">Текущий месяц</div>
                  </div>
                  <div class="turnover-icon right">
                    <i class="bi bi-calendar-month"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Bonuses Section -->
          <div class="bonuses-section">
            <h2 class="section-title">Бонусы за месяц</h2>
            
            <!-- Month Selector -->
            <div class="month-selector-card">
              <label class="selector-label">Выберите месяц</label>
              <select 
                v-model="selectedMonth" 
                @change="onMonthChange"
                class="month-select"
              >
                <option 
                  v-for="month in availableMonths" 
                  :key="month.value" 
                  :value="month.value"
                >
                  {{ month.label }}
                </option>
              </select>
            </div>

            <!-- Loading Bonuses -->
            <div v-if="loadingBonuses" class="loading-bonuses">
              <div class="spinner-border text-light" role="status">
                <span class="visually-hidden">Загрузка...</span>
              </div>
            </div>

            <!-- Bonuses Stats -->
            <div v-else class="bonuses-grid">
              <div class="bonus-stat-card">
                <div class="bonus-icon binary">
                  <i class="bi bi-diagram-3"></i>
                </div>
                <div class="bonus-info">
                <div class="bonus-value">${{ formatBonusAmount(bonusesSummary.binary_sum) }}</div>
                  <div class="bonus-label">Бинарные</div>
                </div>
              </div>

              <div class="bonus-stat-card">
                <div class="bonus-icon referral">
                  <i class="bi bi-people"></i>
                </div>
                <div class="bonus-info">
                <div class="bonus-value">${{ formatBonusAmount(bonusesSummary.referral_sum) }}</div>
                  <div class="bonus-label">Реферальные</div>
                </div>
              </div>

              <div class="bonus-stat-card">
                <div class="bonus-icon cheque">
                  <i class="bi bi-receipt"></i>
                </div>
                <div class="bonus-info">
                <div class="bonus-value">${{ formatBonusAmount(bonusesSummary.cheque_sum) }}</div>
                  <div class="bonus-label">Чековые</div>
                </div>
              </div>

              <div class="bonus-stat-card">
                <div class="bonus-icon sponsor">
                  <i class="bi bi-person-plus"></i>
                </div>
                <div class="bonus-info">
                <div class="bonus-value">${{ formatBonusAmount(bonusesSummary.sponsor_sum) }}</div>
                  <div class="bonus-label">Спонсорские</div>
                </div>
              </div>

              <div class="bonus-stat-card">
                <div class="bonus-icon status">
                  <i class="bi bi-star"></i>
                </div>
                <div class="bonus-info">
                <div class="bonus-value">${{ formatBonusAmount(bonusesSummary.status_sum) }}</div>
                  <div class="bonus-label">Статусные</div>
                </div>
              </div>

              <div class="bonus-stat-card total">
                <div class="bonus-icon total-icon">
                  <i class="bi bi-wallet2"></i>
                </div>
                <div class="bonus-info">
                <div class="bonus-value total-value">${{ formatBonusAmount(bonusesSummary.total_sum) }}</div>
                  <div class="bonus-label">Всего</div>
                </div>
              </div>

              <!-- All Time Bonus Card -->
              <div class="bonus-stat-card total all-time">
                <div class="bonus-icon total-icon">
                  <i class="bi bi-infinity"></i>
                </div>
                <div class="bonus-info">
                  <div v-if="loadingAllTimeBonuses" class="bonus-value total-value">
                    <span class="spinner-border spinner-border-sm" role="status"></span>
                  </div>
                  <div v-else class="bonus-value total-value">${{ formatBonusAmount(allTimeBonuses) }}</div>
                  <div class="bonus-label">За все время</div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </main>>
    </div>

    <MenuModal :is-open="showMenu" @close="showMenu = false" />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import PageHeader from '../components/PageHeader.vue'
import MenuModal from '../components/MenuModal.vue'
import { BACKEND_API_URL } from '../config'

const router = useRouter()
const showMenu = ref(false)
const loading = ref(false)
const loadingBonuses = ref(false)
const userData = ref({
  name: '',
  lastname: '',
  patronymic: '',
  email: ''
})
const cabinetData = ref({
  id: '',
  personal_number: '',
  status_name: '',
  paket_id: null,
  paket_name: '',
  left_turnover_all_time: '0',
  right_turnover_all_time: '0',
  left_turnover_current_month: '0',
  right_turnover_current_month: '0'
})
const selectedMonth = ref('')
const bonusesSummary = ref({
  month: '',
  binary_sum: 0,
  referral_sum: 0,
  cheque_sum: 0,
  sponsor_sum: 0,
  status_sum: 0,
  total_sum: 0
})
const loadingAllTimeBonuses = ref(false)
const allTimeBonuses = ref('0')

const showCopyNotification = ref(false)

// Generate available months from 2024-12 to current month
const availableMonths = computed(() => {
  const months = []
  const startDate = new Date(2024, 11, 1) // December 2024
  const currentDate = new Date()
  
  let date = new Date(startDate)
  
  while (date <= currentDate) {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const value = `${year}-${month}`
    
    const monthNames = [
      'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
      'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
    ]
    const label = `${monthNames[date.getMonth()]} ${year}`
    
    months.push({ value, label })
    
    // Move to next month
    date.setMonth(date.getMonth() + 1)
  }
  
  return months.reverse() // Most recent first
})

const fetchUserData = async () => {
  try {
    const token = localStorage.getItem('access_token')
    if (!token) return

    const response = await fetch(
      `${BACKEND_API_URL}/api/participants/me`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'accept': 'application/json'
        }
      }
    )

    if (response.ok) {
      userData.value = await response.json()
    }
  } catch (err) {
    console.error('Error fetching user data:', err)
  }
}

const fetchCabinetData = async () => {
  try {
    const token = localStorage.getItem('access_token')
    if (!token) return

    // First get cabinet ID
    const cabinetsResponse = await fetch(
      `${BACKEND_API_URL}/api/cabinets/?page=1&page_size=1`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'accept': 'application/json'
        }
      }
    )

    if (cabinetsResponse.ok) {
      const cabinetsData = await cabinetsResponse.json()
      if (cabinetsData.cabinets && cabinetsData.cabinets.length > 0) {
        const cabinetId = cabinetsData.cabinets[0].id
        
        // Get cabinet details
        const cabinetResponse = await fetch(
          `${BACKEND_API_URL}/api/cabinets/${cabinetId}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'accept': 'application/json'
            }
          }
        )

        if (cabinetResponse.ok) {
          const data = await cabinetResponse.json()
          cabinetData.value = {
            id: data.id || '',
            personal_number: data.personal_number || '',
            status_name: data.status_name || '',
            paket_id: data.paket_id || null,
            paket_name: data.paket_name || '',
            left_turnover_all_time: data.left_turnover_all_time || '0',
            right_turnover_all_time: data.right_turnover_all_time || '0',
            left_turnover_current_month: data.left_turnover_current_month || '0',
            right_turnover_current_month: data.right_turnover_current_month || '0'
          }
        }
      }
    }
  } catch (err) {
    console.error('Error fetching cabinet data:', err)
  }
}

const fetchBonusesSummary = async () => {
  if (!selectedMonth.value) return
  
  loadingBonuses.value = true
  
  try {
    const token = localStorage.getItem('access_token')
    if (!token) return

    const response = await fetch(
      `${BACKEND_API_URL}/api/bonuses/by-month/${selectedMonth.value}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'accept': 'application/json'
        }
      }
    )

    if (response.ok) {
      bonusesSummary.value = await response.json()
    } else {
      // Reset to zeros if no data
      bonusesSummary.value = {
        month: selectedMonth.value,
        binary_sum: 0,
        referral_sum: 0,
        cheque_sum: 0,
        sponsor_sum: 0,
        status_sum: 0,
        total_sum: 0
      }
    }
  } catch (err) {
    console.error('Error fetching bonuses summary:', err)
    bonusesSummary.value = {
      month: selectedMonth.value,
      binary_sum: 0,
      referral_sum: 0,
      cheque_sum: 0,
      sponsor_sum: 0,
      status_sum: 0,
      total_sum: 0
    }
  } finally {
    loadingBonuses.value = false
  }
}

const fetchAllTimeBonuses = async () => {
  loadingAllTimeBonuses.value = true
  
  try {
    const token = localStorage.getItem('access_token')
    if (!token) return

    const response = await fetch(
      `${BACKEND_API_URL}/api/bonuses/total`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'accept': 'application/json'
        }
      }
    )

    if (response.ok) {
      const data = await response.json()
      allTimeBonuses.value = data.total_sum || '0'
    } else {
      allTimeBonuses.value = '0'
    }
  } catch (err) {
    console.error('Error fetching all-time bonuses:', err)
    allTimeBonuses.value = '0'
  } finally {
    loadingAllTimeBonuses.value = false
  }
}

const onMonthChange = () => {
  fetchBonusesSummary()
}

const copyPersonalNumber = async () => {
  try {
    // Create referral link with sponsor_id
    const baseUrl = window.location.origin
    const referralLink = `${baseUrl}/register?sponsor_id=${cabinetData.value.id}`
    
    await navigator.clipboard.writeText(referralLink)
    showCopyNotification.value = true
    
    // Hide notification after 2 seconds
    setTimeout(() => {
      showCopyNotification.value = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}

const formatUserName = () => {
  const { lastname, name, patronymic } = userData.value
  return `${lastname || ''} ${name || ''} ${patronymic || ''}`.trim() || 'Пользователь'
}

const formatBonusAmount = (amount) => {
  if (!amount && amount !== 0) return '0'
  const num = parseFloat(amount)
  // If has decimal part, show with 2 decimals
  if (num % 1 !== 0) {
    return num.toFixed(2)
  }
  // Otherwise show as integer
  return Math.floor(num).toString()
}

const goToUpgrade = () => {
  router.push('/upgrade')
}


onMounted(async () => {
  loading.value = true
  
  // Set current month as default
  const currentDate = new Date()
  const year = currentDate.getFullYear()
  const month = String(currentDate.getMonth() + 1).padStart(2, '0')
  selectedMonth.value = `${year}-${month}`
  
  await Promise.all([
    fetchUserData(),
    fetchCabinetData(),
    fetchBonusesSummary(),
    fetchAllTimeBonuses()
  ])
  
  loading.value = false
})
</script>

<style scoped>
.home-wrapper {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.home-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0;
}

/* Main Content */
.home-main {
  padding: 2rem 1.5rem;
  overflow: visible;
}

/* Loading State */
.loading-state {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
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

/* User Info Card */
.user-info-card {
  background: white;
  border-radius: 24px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  margin-bottom: 2rem;
  animation: fadeIn 0.6s ease-out;
  display: flex;
  align-items: center;
  gap: 1.5rem;
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

.user-avatar {
  font-size: 80px;
  color: #667eea;
  flex-shrink: 0;
}

.user-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.user-name {
  font-size: 28px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 0.75rem;
}

.user-email {
  font-size: 16px;
  color: #6c757d;
  margin: 0 0 1rem 0;
}

.personal-number-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: white;
  padding: 0.875rem 1.5rem;
  border-radius: 16px;
  font-size: 20px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 1rem;
  letter-spacing: 1px;
  width: fit-content;
}

.personal-number-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.5);
}

.personal-number-btn:active {
  transform: translateY(0);
}

.personal-number-btn i:first-child {
  font-size: 16px;
}

.personal-number-btn i:last-child {
  font-size: 18px;
  opacity: 0.9;
}

.user-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #fff3cd;
  border: 1px solid #ffc107;
  padding: 0.5rem 1rem;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  color: #856404;
  width: fit-content;
}

.user-status i {
  color: #ffc107;
  font-size: 16px;
}


/* Package Info with Upgrade Button */
.user-package {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 0.5rem;
}

.package-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #e7f3ff;
  border: 1px solid #2196f3;
  padding: 0.5rem 1rem;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  color: #1976d2;
}

.package-info i {
  color: #2196f3;
  font-size: 16px;
}

.upgrade-btn {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
  border: none;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.upgrade-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(67, 233, 123, 0.4);
}

.upgrade-btn:active {
  transform: translateY(0);
}

.upgrade-btn i {
  font-size: 16px;
}



/* Copy Notification */
.copy-notification {
  position: fixed;
  top: 100px;
  left: 50%;
  transform: translateX(-50%);
  background: #28a745;
  color: white;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 15px;
  font-weight: 600;
  z-index: 9999;
}

.copy-notification i {
  font-size: 20px;
}

/* Fade transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateX(-50%) translateY(-10px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-10px);
}

/* Turnover Section */
.stats-section {
  margin-bottom: 2rem;
  animation: fadeIn 0.6s ease-out 0.1s both;
}

.section-title {
  font-size: 20px;
  font-weight: 700;
  color: white;
  margin-bottom: 1rem;
  text-align: center;
}

.turnover-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.turnover-column {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.turnover-column-title {
  font-size: 18px;
  font-weight: 700;
  color: white;
  text-align: center;
  margin-bottom: 0.5rem;
}

.turnover-card {
  background: white;
  border-radius: 20px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s ease;
}

.turnover-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

.turnover-icon {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
  flex-shrink: 0;
}

.turnover-icon.left {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.turnover-icon.right {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.turnover-info {
  flex: 1;
}

.right-column .turnover-info {
  text-align: right;
}

.turnover-value {
  font-size: 24px;
  font-weight: 700;
  color: #1a1a1a;
  line-height: 1;
  margin-bottom: 0.5rem;
}

.turnover-label {
  font-size: 13px;
  color: #6c757d;
  font-weight: 500;
}

/* Bonuses Section */
.bonuses-section {
  margin-bottom: 2rem;
  animation: fadeIn 0.6s ease-out 0.2s both;
  overflow: visible;
}

.month-selector-card {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.1) 100%);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  overflow: visible;
  position: relative;
}

.selector-label {
  font-size: 14px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 0.75rem;
  display: block;
}

.month-select {
  width: 100%;
  padding: 0.875rem 1rem;
  background: rgba(255, 255, 255, 0.15);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  color: white;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='white' viewBox='0 0 16 16'%3E%3Cpath d='M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 16px;
  padding-right: 3rem;
}

.month-select:hover {
  background-color: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.3);
}

.month-select:focus {
  outline: none;
  background-color: rgba(255, 255, 255, 0.25);
  border-color: rgba(255, 255, 255, 0.4);
  box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.1);
}

.month-select option {
  background: #667eea;
  color: white;
  padding: 0.5rem;
}

/* Loading Bonuses */
.loading-bonuses {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 3rem;
}

.bonuses-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.bonus-stat-card {
  background: white;
  border-radius: 20px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s ease;
}

.bonus-stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

.bonus-stat-card.total {
  grid-column: 1 / -1;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.bonus-icon {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
  flex-shrink: 0;
}

.bonus-icon.binary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.bonus-icon.referral {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.bonus-icon.cheque {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.bonus-icon.sponsor {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.bonus-icon.status {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
}

.bonus-icon.total-icon {
  background: rgba(255, 255, 255, 0.2);
}

.bonus-info {
  flex: 1;
}

.bonus-value {
  font-size: 24px;
  font-weight: 700;
  color: #1a1a1a;
  line-height: 1;
  margin-bottom: 0.5rem;
}

.bonus-value.total-value {
  color: white;
  font-size: 32px;
}

.bonus-label {
  font-size: 13px;
  color: #6c757d;
  font-weight: 500;
}

.bonus-stat-card.total .bonus-label {
  color: rgba(255, 255, 255, 0.9);
}

/* All Time Bonus Card - Navy Blue Gradient */
.bonus-stat-card.total.all-time {
  background: linear-gradient(135deg, #000080 0%, #0000CD 50%, #4169E1 100%);
}

.bonus-stat-card.total.all-time:hover {
  background: linear-gradient(135deg, #0000CD 0%, #4169E1 50%, #1E90FF 100%);
}

/* Mobile optimizations */
@media (max-width: 576px) {
  .home-main {
    padding: 1.5rem 1rem;
  }

  .user-info-card {
    flex-direction: column;
    text-align: center;
    padding: 1.5rem;
  }

  .user-avatar {
    font-size: 60px;
  }

  .user-name {
    font-size: 22px;
  }

  .user-email {
    font-size: 14px;
  }

  .section-title {
    font-size: 18px;
  }

  .turnover-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
  }

  .turnover-column-title {
    font-size: 14px;
    margin-bottom: 0.25rem;
  }

  .turnover-card {
    padding: 0.75rem;
  }

  .turnover-icon {
    width: 36px;
    height: 36px;
    font-size: 18px;
  }

  .turnover-value {
    font-size: 16px;
  }

  .turnover-label {
    font-size: 11px;
  }

  .month-selector-card {
    padding: 1rem;
  }

  .bonuses-grid {
    grid-template-columns: 1fr;
  }

  .bonus-stat-card {
    padding: 1rem;
  }

  .bonus-icon {
    width: 40px;
    height: 40px;
    font-size: 20px;
  }

  .bonus-value {
    font-size: 20px;
  }

  .bonus-value.total-value {
    font-size: 24px;
  }

  .bonus-label {
    font-size: 12px;
  }
}

/* Tablet */
@media (min-width: 768px) {
  .home-main {
    padding: 3rem 2rem;
  }

  .bonuses-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .bonus-stat-card.total {
    grid-column: 1 / -1;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .home-main {
    padding: 3rem;
  }
}
</style>
