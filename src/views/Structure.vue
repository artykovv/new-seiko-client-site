<template>
  <div class="page-wrapper">
    <div class="page-container">
      <PageHeader @toggle-menu="showMenu = !showMenu" />
      
      <main class="structure-main">
        <div class="structure-header">
          <h1 class="page-title">Организация</h1>
        </div>

        <!-- Cabinet Selector -->
        <div class="selector-section">
          <label class="selector-label">Выберите кабинет</label>
          <select 
            v-model="selectedCabinetId" 
            @change="onCabinetChange"
            class="cabinet-select"
          >
            <option :value="null">Выберите кабинет...</option>
            <option 
              v-for="cabinet in cabinets" 
              :key="cabinet.id" 
              :value="cabinet.id"
            >
              {{ cabinet.personal_number }} - №{{ cabinet.sequence_number }}
            </option>
          </select>
        </div>

        <!-- Loading State -->
        <div v-if="loadingStructure" class="loading-state">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Загрузка...</span>
          </div>
          <p>Загрузка структуры...</p>
        </div>

        <!-- Structure Tree -->
        <div v-else-if="structureData && selectedCabinetId" class="card body genealogy-body genealogy-scroll">
          <div class="genealogy-tree">
            <ul class="mt-5">
              <li>
                <a :style="{ background: `linear-gradient(${structureData.paket_color})` }">
                    <div class="member-view-box">
                      <div class="member-footer">
                        <div class="name-container" @click="loadStructure(structureData.cabinet_id)" style="cursor: pointer;">
                          <div class="name">{{ structureData.participant_name }}</div>
                          <div class="name">{{ structureData.participant_lastname }}</div>
                        </div>
                        <div class="d-flex flex-column">
                          <button 
                            class="name btn"
                            @click="showCabinetDetails(structureData.cabinet_id)"
                            @contextmenu.prevent="loadStructure(structureData.cabinet_id)"
                          >
                            {{ structureData.cabinet_personal_number }}
                          </button>
                          <span class="cabinet-number">№{{ structureData.cabinet_sequence_number }}</span>
                        </div>
                      </div>
                    </div>
                </a>

                <ul class="active">
                  <!-- Left Child -->
                  <li v-if="structureData.left_child">
                    <a :style="{ background: `linear-gradient(${structureData.left_child.paket_color})` }">
                      <div class="member-view-box">
                        <div class="member-footer">
                          <div class="name-container" @click="loadStructure(structureData.left_child.cabinet_id)" style="cursor: pointer;">
                            <div class="name">{{ structureData.left_child.participant_name }}</div>
                            <div class="name">{{ structureData.left_child.participant_lastname }}</div>
                          </div>
                          <div class="d-flex flex-column">
                            <button 
                              class="name btn" 
                              @click="showCabinetDetails(structureData.left_child.cabinet_id)"
                              @contextmenu.prevent="loadStructure(structureData.left_child.cabinet_id)"
                            >
                              {{ structureData.left_child.cabinet_personal_number }}
                            </button>
                            <span class="cabinet-number">№{{ structureData.left_child.cabinet_sequence_number }}</span>
                          </div>
                        </div>
                      </div>
                    </a>

                    <ul v-if="structureData.left_child.left_child || structureData.left_child.right_child">
                      <!-- Left-Left Child -->
                      <li v-if="structureData.left_child.left_child">
                        <a :style="{ background: `linear-gradient(${structureData.left_child.left_child.paket_color})` }">
                          <div class="member-view-box">
                            <div class="member-footer">
                              <div class="name-container" @click="loadStructure(structureData.left_child.left_child.cabinet_id)" style="cursor: pointer;">
                                <div class="name">{{ structureData.left_child.left_child.participant_name }}</div>
                                <div class="name">{{ structureData.left_child.left_child.participant_lastname }}</div>
                              </div>
                              <div class="d-flex flex-column">
                                <button 
                                  class="name btn"
                                  @click="showCabinetDetails(structureData.left_child.left_child.cabinet_id)"
                                  @contextmenu.prevent="loadStructure(structureData.left_child.left_child.cabinet_id)"
                                >
                                  {{ structureData.left_child.left_child.cabinet_personal_number }}
                                </button>
                                <span class="cabinet-number">№{{ structureData.left_child.left_child.cabinet_sequence_number }}</span>
                              </div>
                            </div>
                          </div>
                        </a>

                        <!-- Third Level: Left-Left Children -->
                        <ul v-if="structureData.left_child.left_child.left_child || structureData.left_child.left_child.right_child">
                          <li v-if="structureData.left_child.left_child.left_child">
                            <a :style="{ background: `linear-gradient(${structureData.left_child.left_child.left_child.paket_color})` }">
                              <div class="member-view-box">
                                <div class="member-footer">
                                  <div class="name-container" @click="loadStructure(structureData.left_child.left_child.left_child.cabinet_id)" style="cursor: pointer;">
                                    <div class="name">{{ structureData.left_child.left_child.left_child.participant_name }}</div>
                                    <div class="name">{{ structureData.left_child.left_child.left_child.participant_lastname }}</div>
                                  </div>
                                  <div class="d-flex flex-column">
                                    <button 
                                      class="name btn"
                                      @click="showCabinetDetails(structureData.left_child.left_child.left_child.cabinet_id)"
                                      @contextmenu.prevent="loadStructure(structureData.left_child.left_child.left_child.cabinet_id)"
                                    >
                                      {{ structureData.left_child.left_child.left_child.cabinet_personal_number }}
                                    </button>
                                    <span class="cabinet-number">№{{ structureData.left_child.left_child.left_child.cabinet_sequence_number }}</span>
                                  </div>
                                </div>
                              </div>
                            </a>
                          </li>
                          <li v-if="structureData.left_child.left_child.right_child">
                            <a :style="{ background: `linear-gradient(${structureData.left_child.left_child.right_child.paket_color})` }">
                              <div class="member-view-box">
                                <div class="member-footer">
                                  <div class="name-container" @click="loadStructure(structureData.left_child.left_child.right_child.cabinet_id)" style="cursor: pointer;">
                                    <div class="name">{{ structureData.left_child.left_child.right_child.participant_name }}</div>
                                    <div class="name">{{ structureData.left_child.left_child.right_child.participant_lastname }}</div>
                                  </div>
                                  <div class="d-flex flex-column">
                                    <button 
                                      class="name btn"
                                      @click="showCabinetDetails(structureData.left_child.left_child.right_child.cabinet_id)"
                                      @contextmenu.prevent="loadStructure(structureData.left_child.left_child.right_child.cabinet_id)"
                                    >
                                      {{ structureData.left_child.left_child.right_child.cabinet_personal_number }}
                                    </button>
                                    <span class="cabinet-number">№{{ structureData.left_child.left_child.right_child.cabinet_sequence_number }}</span>
                                  </div>
                                </div>
                              </div>
                            </a>
                          </li>
                        </ul>
                      </li>

                      <!-- Left-Right Child -->
                      <li v-if="structureData.left_child.right_child">
                        <a :style="{ background: `linear-gradient(${structureData.left_child.right_child.paket_color})` }">
                          <div class="member-view-box">
                            <div class="member-footer">
                              <div class="name-container" @click="loadStructure(structureData.left_child.right_child.cabinet_id)" style="cursor: pointer;">
                                <div class="name">{{ structureData.left_child.right_child.participant_name }}</div>
                                <div class="name">{{ structureData.left_child.right_child.participant_lastname }}</div>
                              </div>
                              <div class="d-flex flex-column">
                                <button 
                                  class="name btn"
                                  @click="showCabinetDetails(structureData.left_child.right_child.cabinet_id)"
                                  @contextmenu.prevent="loadStructure(structureData.left_child.right_child.cabinet_id)"
                                >
                                  {{ structureData.left_child.right_child.cabinet_personal_number }}
                                </button>
                                <span class="cabinet-number">№{{ structureData.left_child.right_child.cabinet_sequence_number }}</span>
                              </div>
                            </div>
                          </div>
                        </a>

                        <!-- Third Level: Left-Right Children -->
                        <ul v-if="structureData.left_child.right_child.left_child || structureData.left_child.right_child.right_child">
                          <li v-if="structureData.left_child.right_child.left_child">
                            <a :style="{ background: `linear-gradient(${structureData.left_child.right_child.left_child.paket_color})` }">
                              <div class="member-view-box">
                                <div class="member-footer">
                                  <div class="name-container" @click="loadStructure(structureData.left_child.right_child.left_child.cabinet_id)" style="cursor: pointer;">
                                    <div class="name">{{ structureData.left_child.right_child.left_child.participant_name }}</div>
                                    <div class="name">{{ structureData.left_child.right_child.left_child.participant_lastname }}</div>
                                  </div>
                                  <div class="d-flex flex-column">
                                    <button 
                                      class="name btn"
                                      @click="showCabinetDetails(structureData.left_child.right_child.left_child.cabinet_id)"
                                      @contextmenu.prevent="loadStructure(structureData.left_child.right_child.left_child.cabinet_id)"
                                    >
                                      {{ structureData.left_child.right_child.left_child.cabinet_personal_number }}
                                    </button>
                                    <span class="cabinet-number">№{{ structureData.left_child.right_child.left_child.cabinet_sequence_number }}</span>
                                  </div>
                                </div>
                              </div>
                            </a>
                          </li>
                          <li v-if="structureData.left_child.right_child.right_child">
                            <a :style="{ background: `linear-gradient(${structureData.left_child.right_child.right_child.paket_color})` }">
                              <div class="member-view-box">
                                <div class="member-footer">
                                  <div class="name-container" @click="loadStructure(structureData.left_child.right_child.right_child.cabinet_id)" style="cursor: pointer;">
                                    <div class="name">{{ structureData.left_child.right_child.right_child.participant_name }}</div>
                                    <div class="name">{{ structureData.left_child.right_child.right_child.participant_lastname }}</div>
                                  </div>
                                  <div class="d-flex flex-column">
                                    <button 
                                      class="name btn"
                                      @click="showCabinetDetails(structureData.left_child.right_child.right_child.cabinet_id)"
                                      @contextmenu.prevent="loadStructure(structureData.left_child.right_child.right_child.cabinet_id)"
                                    >
                                      {{ structureData.left_child.right_child.right_child.cabinet_personal_number }}
                                    </button>
                                    <span class="cabinet-number">№{{ structureData.left_child.right_child.right_child.cabinet_sequence_number }}</span>
                                  </div>
                                </div>
                              </div>
                            </a>
                          </li>
                        </ul>
                      </li>
                    </ul>
                  </li>

                  <!-- Right Child -->
                  <li v-if="structureData.right_child">
                    <a :style="{ background: `linear-gradient(${structureData.right_child.paket_color})` }">
                      <div class="member-view-box">
                        <div class="member-footer">
                          <div class="name-container" @click="loadStructure(structureData.right_child.cabinet_id)" style="cursor: pointer;">
                            <div class="name">{{ structureData.right_child.participant_name }}</div>
                            <div class="name">{{ structureData.right_child.participant_lastname }}</div>
                          </div>
                          <div class="d-flex flex-column">
                            <button 
                              class="name btn"
                              @click="showCabinetDetails(structureData.right_child.cabinet_id)"
                              @contextmenu.prevent="loadStructure(structureData.right_child.cabinet_id)"
                            >
                              {{ structureData.right_child.cabinet_personal_number }}
                            </button>
                            <span class="cabinet-number">№{{ structureData.right_child.cabinet_sequence_number }}</span>
                          </div>
                        </div>
                      </div>
                    </a>

                    <ul v-if="structureData.right_child.left_child || structureData.right_child.right_child">
                      <!-- Right-Left Child -->
                      <li v-if="structureData.right_child.left_child">
                        <a :style="{ background: `linear-gradient(${structureData.right_child.left_child.paket_color})` }">
                          <div class="member-view-box">
                            <div class="member-footer">
                              <div class="name-container" @click="loadStructure(structureData.right_child.left_child.cabinet_id)" style="cursor: pointer;">
                                <div class="name">{{ structureData.right_child.left_child.participant_name }}</div>
                                <div class="name">{{ structureData.right_child.left_child.participant_lastname }}</div>
                              </div>
                              <div class="d-flex flex-column">
                                <button 
                                  class="name btn"
                                  @click="showCabinetDetails(structureData.right_child.left_child.cabinet_id)"
                                  @contextmenu.prevent="loadStructure(structureData.right_child.left_child.cabinet_id)"
                                >
                                  {{ structureData.right_child.left_child.cabinet_personal_number }}
                                </button>
                                <span class="cabinet-number">№{{ structureData.right_child.left_child.cabinet_sequence_number }}</span>
                              </div>
                            </div>
                          </div>
                        </a>

                        <!-- Third Level: Right-Left Children -->
                        <ul v-if="structureData.right_child.left_child.left_child || structureData.right_child.left_child.right_child">
                          <li v-if="structureData.right_child.left_child.left_child">
                            <a :style="{ background: `linear-gradient(${structureData.right_child.left_child.left_child.paket_color})` }">
                              <div class="member-view-box">
                                <div class="member-footer">
                                  <div class="name-container" @click="loadStructure(structureData.right_child.left_child.left_child.cabinet_id)" style="cursor: pointer;">
                                    <div class="name">{{ structureData.right_child.left_child.left_child.participant_name }}</div>
                                    <div class="name">{{ structureData.right_child.left_child.left_child.participant_lastname }}</div>
                                  </div>
                                  <div class="d-flex flex-column">
                                    <button 
                                      class="name btn"
                                      @click="showCabinetDetails(structureData.right_child.left_child.left_child.cabinet_id)"
                                      @contextmenu.prevent="loadStructure(structureData.right_child.left_child.left_child.cabinet_id)"
                                    >
                                      {{ structureData.right_child.left_child.left_child.cabinet_personal_number }}
                                    </button>
                                    <span class="cabinet-number">№{{ structureData.right_child.left_child.left_child.cabinet_sequence_number }}</span>
                                  </div>
                                </div>
                              </div>
                            </a>
                          </li>
                          <li v-if="structureData.right_child.left_child.right_child">
                            <a :style="{ background: `linear-gradient(${structureData.right_child.left_child.right_child.paket_color})` }">
                              <div class="member-view-box">
                                <div class="member-footer">
                                  <div class="name-container" @click="loadStructure(structureData.right_child.left_child.right_child.cabinet_id)" style="cursor: pointer;">
                                    <div class="name">{{ structureData.right_child.left_child.right_child.participant_name }}</div>
                                    <div class="name">{{ structureData.right_child.left_child.right_child.participant_lastname }}</div>
                                  </div>
                                  <div class="d-flex flex-column">
                                    <button 
                                      class="name btn"
                                      @click="showCabinetDetails(structureData.right_child.left_child.right_child.cabinet_id)"
                                      @contextmenu.prevent="loadStructure(structureData.right_child.left_child.right_child.cabinet_id)"
                                    >
                                      {{ structureData.right_child.left_child.right_child.cabinet_personal_number }}
                                    </button>
                                    <span class="cabinet-number">№{{ structureData.right_child.left_child.right_child.cabinet_sequence_number }}</span>
                                  </div>
                                </div>
                              </div>
                            </a>
                          </li>
                        </ul>
                      </li>

                      <!-- Right-Right Child -->
                      <li v-if="structureData.right_child.right_child">
                        <a :style="{ background: `linear-gradient(${structureData.right_child.right_child.paket_color})` }">
                          <div class="member-view-box">
                            <div class="member-footer">
                              <div class="name-container" @click="loadStructure(structureData.right_child.right_child.cabinet_id)" style="cursor: pointer;">
                                <div class="name">{{ structureData.right_child.right_child.participant_name }}</div>
                                <div class="name">{{ structureData.right_child.right_child.participant_lastname }}</div>
                              </div>
                              <div class="d-flex flex-column">
                                <button 
                                  class="name btn"
                                  @click="showCabinetDetails(structureData.right_child.right_child.cabinet_id)"
                                  @contextmenu.prevent="loadStructure(structureData.right_child.right_child.cabinet_id)"
                                >
                                  {{ structureData.right_child.right_child.cabinet_personal_number }}
                                </button>
                                <span class="cabinet-number">№{{ structureData.right_child.right_child.cabinet_sequence_number }}</span>
                              </div>
                            </div>
                          </div>
                        </a>

                        <!-- Third Level: Right-Right Children -->
                        <ul v-if="structureData.right_child.right_child.left_child || structureData.right_child.right_child.right_child">
                          <li v-if="structureData.right_child.right_child.left_child">
                            <a :style="{ background: `linear-gradient(${structureData.right_child.right_child.left_child.paket_color})` }">
                              <div class="member-view-box">
                                <div class="member-footer">
                                  <div class="name-container" @click="loadStructure(structureData.right_child.right_child.left_child.cabinet_id)" style="cursor: pointer;">
                                    <div class="name">{{ structureData.right_child.right_child.left_child.participant_name }}</div>
                                    <div class="name">{{ structureData.right_child.right_child.left_child.participant_lastname }}</div>
                                  </div>
                                  <div class="d-flex flex-column">
                                    <button 
                                      class="name btn"
                                      @click="showCabinetDetails(structureData.right_child.right_child.left_child.cabinet_id)"
                                      @contextmenu.prevent="loadStructure(structureData.right_child.right_child.left_child.cabinet_id)"
                                    >
                                      {{ structureData.right_child.right_child.left_child.cabinet_personal_number }}
                                    </button>
                                    <span class="cabinet-number">№{{ structureData.right_child.right_child.left_child.cabinet_sequence_number }}</span>
                                  </div>
                                </div>
                              </div>
                            </a>
                          </li>
                          <li v-if="structureData.right_child.right_child.right_child">
                            <a :style="{ background: `linear-gradient(${structureData.right_child.right_child.right_child.paket_color})` }">
                              <div class="member-view-box">
                                <div class="member-footer">
                                  <div class="name-container" @click="loadStructure(structureData.right_child.right_child.right_child.cabinet_id)" style="cursor: pointer;">
                                    <div class="name">{{ structureData.right_child.right_child.right_child.participant_name }}</div>
                                    <div class="name">{{ structureData.right_child.right_child.right_child.participant_lastname }}</div>
                                  </div>
                                  <div class="d-flex flex-column">
                                    <button 
                                      class="name btn"
                                      @click="showCabinetDetails(structureData.right_child.right_child.right_child.cabinet_id)"
                                      @contextmenu.prevent="loadStructure(structureData.right_child.right_child.right_child.cabinet_id)"
                                    >
                                      {{ structureData.right_child.right_child.right_child.cabinet_personal_number }}
                                    </button>
                                    <span class="cabinet-number">№{{ structureData.right_child.right_child.right_child.cabinet_sequence_number }}</span>
                                  </div>
                                </div>
                              </div>
                            </a>
                          </li>
                        </ul>
                      </li>
                    </ul>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else-if="!loadingStructure && !selectedCabinetId" class="empty-state">
          <i class="bi bi-diagram-3"></i>
          <p>Выберите кабинет для просмотра структуры</p>
        </div>
      </main>
    </div>

    <MenuModal :is-open="showMenu" @close="showMenu = false" />

    <!-- Cabinet Details Modal -->
    <Transition name="modal">
      <div v-if="selectedCabinet" class="modal-overlay" @click="closeCabinetModal">
        <div class="modal-content" @click.stop>
          <button @click="closeCabinetModal" class="btn-close-modal">
            <i class="bi bi-x-lg"></i>
          </button>

          <div class="modal-body">
            <div class="modal-header-section">
              <h2 class="modal-title">{{ selectedCabinet.personal_number }}</h2>
              <p class="modal-subtitle">{{ selectedCabinet.paket_name }}</p>
            </div>

            <div class="modal-details">
              <div class="detail-section">
                <h3 class="section-title">Основная информация</h3>
                <div class="detail-row">
                  <span class="detail-label">Код:</span>
                  <span class="detail-value">{{ selectedCabinet.code }}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Номер последовательности:</span>
                  <span class="detail-value">№{{ selectedCabinet.sequence_number }}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Статус:</span>
                  <span class="detail-value status">{{ selectedCabinet.status_name }}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Филиал:</span>
                  <span class="detail-value">{{ selectedCabinet.branch_name }}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Дата регистрации:</span>
                  <span class="detail-value">{{ formatDate(selectedCabinet.register_at) }}</span>
                </div>
              </div>

              <div class="detail-section">
                <h3 class="section-title">Оборот за все время</h3>
                <div class="detail-row">
                  <span class="detail-label">Левый:</span>
                  <span class="detail-value turnover">${{ selectedCabinet.left_turnover_all_time }}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Правый:</span>
                  <span class="detail-value turnover">${{ selectedCabinet.right_turnover_all_time }}</span>
                </div>
              </div>

              <div class="detail-section">
                <h3 class="section-title">Оборот за текущий месяц</h3>
                <div class="detail-row">
                  <span class="detail-label">Левый:</span>
                  <span class="detail-value turnover">${{ selectedCabinet.left_turnover_current_month }}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Правый:</span>
                  <span class="detail-value turnover">${{ selectedCabinet.right_turnover_current_month }}</span>
                </div>
              </div>

              <div class="detail-section">
                <h3 class="section-title">Команда</h3>
                <div class="detail-row">
                  <span class="detail-label">Прямые рефералы:</span>
                  <span class="detail-value">{{ selectedCabinet.direct_referrals_count }}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Левая команда:</span>
                  <span class="detail-value">{{ selectedCabinet.left_team_count }}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Правая команда:</span>
                  <span class="detail-value">{{ selectedCabinet.right_team_count }}</span>
                </div>
              </div>
            </div>

            <div class="modal-actions">
              <button 
                @click="switchToCabinet(selectedCabinet.id)"
                class="btn-switch"
              >
                <i class="bi bi-diagram-3"></i>
                Перейти к структуре
              </button>
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
const loadingStructure = ref(false)
const cabinets = ref([])
const selectedCabinetId = ref(null)
const structureData = ref(null)
const selectedCabinet = ref(null)

const fetchCabinets = async () => {
  loadingCabinets.value = true
  
  try {
    const token = localStorage.getItem('access_token')
    if (!token) {
      console.error('Token not found')
      return
    }

    const response = await fetch(
      `${BACKEND_API_URL}/api/client/cabinets/?page=1&page_size=100`,
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
      
      // Try to restore previously selected cabinet from localStorage
      const savedCabinetId = localStorage.getItem('selected_cabinet_id')
      
      if (savedCabinetId && cabinets.value.some(c => c.id === savedCabinetId)) {
        // If saved cabinet exists in the list, use it
        selectedCabinetId.value = savedCabinetId
        await loadStructure(savedCabinetId)
      } else if (cabinets.value.length > 0) {
        // Otherwise, select first cabinet and save it
        selectedCabinetId.value = cabinets.value[0].id
        localStorage.setItem('selected_cabinet_id', cabinets.value[0].id)
        await loadStructure(cabinets.value[0].id)
      }
    }
  } catch (err) {
    console.error('Error fetching cabinets:', err)
  } finally {
    loadingCabinets.value = false
  }
}

const loadStructure = async (cabinetId) => {
  if (!cabinetId) return
  
  loadingStructure.value = true
  selectedCabinetId.value = cabinetId
  
  // Save selected cabinet to localStorage
  localStorage.setItem('selected_cabinet_id', cabinetId)
  
  try {
    const token = localStorage.getItem('access_token')
    if (!token) {
      console.error('Token not found')
      return
    }

    const response = await fetch(
      `${BACKEND_API_URL}/api/client/structure/${cabinetId}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'accept': 'application/json'
        }
      }
    )

    if (response.ok) {
      structureData.value = await response.json()
    }
  } catch (err) {
    console.error('Error fetching structure:', err)
  } finally {
    loadingStructure.value = false
  }
}

const showCabinetDetails = async (cabinetId) => {
  if (!cabinetId) return
  
  try {
    const token = localStorage.getItem('access_token')
    if (!token) {
      console.error('Token not found')
      return
    }

    const response = await fetch(
      `${BACKEND_API_URL}/api/client/cabinets/${cabinetId}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'accept': 'application/json'
        }
      }
    )

    if (response.ok) {
      selectedCabinet.value = await response.json()
      document.body.style.overflow = 'hidden'
    }
  } catch (err) {
    console.error('Error fetching cabinet details:', err)
  }
}

const closeCabinetModal = () => {
  selectedCabinet.value = null
  document.body.style.overflow = ''
}

const switchToCabinet = async (cabinetId) => {
  closeCabinetModal()
  await loadStructure(cabinetId)
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const onCabinetChange = () => {
  if (selectedCabinetId.value) {
    loadStructure(selectedCabinetId.value)
  }
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

.structure-main {
  padding: 2rem 1.5rem;
  min-height: calc(100vh - 72px);
}

.structure-header {
  text-align: center;
  margin-bottom: 2rem;
}

.page-title {
  font-size: 32px;
  font-weight: 700;
  color: white;
  margin-bottom: 0.5rem;
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

/* Loading State */
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

/* Genealogy Tree Styles */
.btn {
  padding: 0 !important;
}

.genealogy-scroll::-webkit-scrollbar {
  width: 5px;
  height: 8px;
}

.genealogy-scroll::-webkit-scrollbar-track {
  border-radius: 10px;
  background-color: #e4e4e4;
}

.genealogy-scroll::-webkit-scrollbar-thumb {
  background: #212121;
  border-radius: 10px;
  transition: 0.5s;
}

.genealogy-scroll::-webkit-scrollbar-thumb:hover {
  background: #d5b14c;
  transition: 0.5s;
}

.genealogy-body {
  white-space: nowrap;
  overflow-x: auto;
  overflow-y: hidden;
  padding: 50px;
  min-height: 500px;
  padding-top: 10px;
  text-align: center;
  background: white;
  border-radius: 24px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.genealogy-tree {
  display: inline-block;
}

.genealogy-tree ul {
  padding-top: 20px;
  position: relative;
  padding-left: 0px;
  display: flex;
  justify-content: center;
}

.genealogy-tree li {
  float: left;
  text-align: center;
  list-style-type: none;
  position: relative;
  padding: 20px 5px 0 5px;
}

.genealogy-tree li::before,
.genealogy-tree li::after {
  content: '';
  position: absolute;
  top: 0;
  right: 50%;
  border-top: 2px solid #ccc;
  width: 50%;
  height: 18px;
}

.genealogy-tree li::after {
  right: auto;
  left: 50%;
  border-left: 2px solid #ccc;
}

.genealogy-tree li:only-child::after,
.genealogy-tree li:only-child::before {
  display: none;
}

.genealogy-tree li:only-child {
  padding-top: 0;
}

.genealogy-tree li:first-child::before,
.genealogy-tree li:last-child::after {
  border: 0 none;
}

.genealogy-tree li:last-child::before {
  border-right: 2px solid #ccc;
  border-radius: 0 5px 0 0;
}

.genealogy-tree li:first-child::after {
  border-radius: 5px 0 0 0;
}

.genealogy-tree ul ul::before {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  border-left: 2px solid #ccc;
  width: 0;
  height: 20px;
}

.genealogy-tree li a {
  text-decoration: none;
  color: #666;
  font-family: arial, verdana, tahoma;
  font-size: 11px;
  display: inline-block;
  border-radius: 20px;
}

.genealogy-tree li a:hover,
.genealogy-tree li a:hover + ul li a {
  background: #ffffff;
  color: #fbba00;
}

.genealogy-tree li a:hover + ul li::after,
.genealogy-tree li a:hover + ul li::before,
.genealogy-tree li a:hover + ul::before,
.genealogy-tree li a:hover + ul ul::before {
  border-color: #fbba00;
}

.member-view-box {
  padding: 20px;
  text-align: center;
  border-radius: 20px;
  position: relative;
  border: 1px;
  border-color: #e4e4e4;
  border-style: solid;
}

.member-footer {
  text-align: center;
}

.name-container {
  margin-bottom: 10px;
}

.member-footer .name {
  color: #ffffff;
  font-size: 20px;
  margin-bottom: 5px;
}

.name {
  color: #ffffff;
  font-size: 20px;
  margin-bottom: 5px;
}

.cabinet-number {
  color: rgba(255, 255, 255, 0.8);
  font-size: 12px;
  font-weight: 600;
  margin-top: 2px;
}

.d-flex {
  display: flex;
}

.flex-column {
  flex-direction: column;
}

/* Mobile optimizations */
@media (max-width: 600px) {
  .structure-main {
    padding: 1rem 0.5rem;
  }

  .page-title {
    font-size: 20px;
  }

  .selector-section {
    padding: 1rem;
    margin-bottom: 1rem;
  }

  .genealogy-body {
    padding: 10px;
    min-height: 400px;
  }

  .genealogy-tree li {
    padding: 10px 3px 0 3px;
  }

  .genealogy-tree ul {
    padding-top: 10px;
  }

  .genealogy-tree li::before,
  .genealogy-tree li::after {
    height: 10px;
  }

  .genealogy-tree ul ul::before {
    height: 10px;
  }

  .member-view-box {
    padding: 6px 8px;
    /* border-radius: 12px; */
    /* min-width: 80px; */
  }

  .member-footer .name {
    color: #ffffff;
    font-size: 9px;
    margin-bottom: 2px;
    line-height: 1.2;
  }

  .name {
    color: #ffffff;
    font-size: 9px;
    margin-bottom: 2px;
    line-height: 1.2;
  }

  .name-container {
    margin-bottom: 4px;
  }

  .cabinet-number {
    font-size: 8px;
    margin-top: 1px;
  }

  .d-flex.flex-column {
    gap: 2px;
  }
}

/* Small phones */
@media (max-width: 380px) {
  .genealogy-body {
    padding: 5px;
  }

  .member-view-box {
    padding: 4px 6px;
    min-width: 70px;
  }

  .member-footer .name,
  .name {
    font-size: 8px;
  }

  .genealogy-tree li {
    padding: 8px 2px 0 2px;
  }
}

/* Tablet */
@media (min-width: 768px) {
  .structure-main {
    padding: 3rem 2rem;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .structure-main {
    padding: 3rem;
  }
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
  max-width: 600px;
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
  color: #667eea;
  margin-bottom: 0.5rem;
}

.modal-subtitle {
  font-size: 16px;
  color: #6c757d;
  font-weight: 500;
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
  font-size: 16px;
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

.detail-value.status {
  color: #667eea;
}

.detail-value.turnover {
  color: #28a745;
  font-size: 16px;
}

.modal-actions {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 2px solid #f0f0f0;
}

.btn-switch {
  width: 100%;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-switch:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
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

/* Mobile modal */
@media (max-width: 600px) {
  .modal-content {
    max-width: 100%;
    margin: 0.5rem;
  }

  .modal-body {
    padding: 1.5rem;
  }

  .modal-title {
    font-size: 22px;
  }

  .detail-section {
    padding: 1rem;
  }
}
</style>
