<template>
  <div class="register-wrapper">
    <div class="register-container">
      <div class="register-card">
        <!-- Logo Section -->
        <div class="logo-section">
          <img src="/logo.svg" alt="Seiko Logo" class="logo">
        </div>

        <!-- Progress Steps -->
        <div class="progress-steps">
          <div 
            v-for="(step, index) in steps" 
            :key="index"
            class="step-item"
            :class="{ 
              'active': currentStep === index + 1, 
              'completed': currentStep > index + 1 
            }"
          >
            <div class="step-circle">
              <i v-if="currentStep > index + 1" class="bi bi-check-lg"></i>
              <span v-else>{{ index + 1 }}</span>
            </div>
            <span class="step-label">{{ step }}</span>
          </div>
        </div>

        <!-- Title -->
        <h1 class="register-title">{{ stepTitles[currentStep - 1] }}</h1>
        <p class="register-subtitle">{{ stepSubtitles[currentStep - 1] }}</p>

        <!-- Error Alert -->
        <div v-if="error" class="alert alert-danger" role="alert">
          <i class="bi bi-exclamation-circle me-2"></i>
          {{ error }}
        </div>

        <!-- Registration Form -->
        <form @submit.prevent="handleNext" class="register-form" novalidate>
          <!-- Step 1: Personal Info -->
          <div v-show="currentStep === 1" class="form-step">
            <div class="form-group">
              <label for="email" class="form-label">
                <i class="bi bi-envelope me-2"></i>Email
              </label>
              <input
                type="email"
                class="form-control"
                id="email"
                v-model="formData.email"
                placeholder="name@example.com"
                autocomplete="email"
              />
            </div>

            <div class="form-group">
              <label for="password" class="form-label">
                <i class="bi bi-lock me-2"></i>Пароль
              </label>
              <div class="password-input-wrapper">
                <input
                  :type="showPassword ? 'text' : 'password'"
                  class="form-control"
                  id="password"
                  v-model="formData.password"
                  placeholder="Минимум 6 символов"
                  autocomplete="new-password"
                />
                <button
                  class="password-toggle"
                  type="button"
                  @click="showPassword = !showPassword"
                >
                  <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                </button>
              </div>
            </div>

            <div class="form-group">
              <label for="name" class="form-label">
                <i class="bi bi-person me-2"></i>Имя
              </label>
              <input
                type="text"
                class="form-control"
                id="name"
                v-model="formData.name"
                placeholder="Иван"
              />
            </div>

            <div class="form-group">
              <label for="lastname" class="form-label">
                <i class="bi bi-person me-2"></i>Фамилия
              </label>
              <input
                type="text"
                class="form-control"
                id="lastname"
                v-model="formData.lastname"
                placeholder="Иванов"
              />
            </div>

            <div class="form-group">
              <label for="patronymic" class="form-label">
                <i class="bi bi-person me-2"></i>Отчество
              </label>
              <input
                type="text"
                class="form-control"
                id="patronymic"
                v-model="formData.patronymic"
                placeholder="Иванович"
              />
            </div>
          </div>

          <!-- Step 2: Passport Info -->
          <div v-show="currentStep === 2" class="form-step">
            <div class="form-group">
              <label for="pin" class="form-label">
                <i class="bi bi-credit-card me-2"></i>ПИН
              </label>
              <input
                type="text"
                class="form-control"
                id="pin"
                v-model="formData.passport_info.pin"
                placeholder="1234567890123"
              />
            </div>

            <div class="form-group">
              <label for="passport_id" class="form-label">
                <i class="bi bi-card-text me-2"></i>Номер паспорта
              </label>
              <input
                type="text"
                class="form-control"
                id="passport_id"
                v-model="formData.passport_info.passport_id"
                placeholder="AN1234567"
              />
            </div>

            <div class="form-group">
              <label for="passport_issuer" class="form-label">
                <i class="bi bi-building me-2"></i>Кем выдан
              </label>
              <input
                type="text"
                class="form-control"
                id="passport_issuer"
                v-model="formData.passport_info.passport_issuer"
                placeholder="МВД КР"
              />
            </div>

            <div class="form-group">
              <label for="passport_issue_date" class="form-label">
                <i class="bi bi-calendar me-2"></i>Дата выдачи паспорта
              </label>
              <input
                type="date"
                class="form-control"
                id="passport_issue_date"
                v-model="formData.passport_info.passport_issue_date"
              />
            </div>

            <div class="form-group">
              <label for="date_birth" class="form-label">
                <i class="bi bi-calendar-heart me-2"></i>Дата рождения
              </label>
              <input
                type="date"
                class="form-control"
                id="date_birth"
                v-model="formData.passport_info.date_birth"
              />
            </div>

            <div class="form-group">
              <label for="phone_number" class="form-label">
                <i class="bi bi-phone me-2"></i>Номер телефона
              </label>
              <input
                type="tel"
                class="form-control"
                id="phone_number"
                v-model="formData.passport_info.phone_number"
                placeholder="996 XXX XXX XXX"
              />
            </div>
          </div>

          <!-- Step 3: Additional Passport Info -->
          <div v-show="currentStep === 3" class="form-step">
            <div class="form-group">
              <label for="bank" class="form-label">
                <i class="bi bi-bank me-2"></i>Банк
              </label>
              <input
                type="text"
                class="form-control"
                id="bank"
                v-model="formData.passport_info.bank"
                placeholder="Название банка"
              />
            </div>

            <div class="form-check-group">
              <div class="form-check-item">
                <input
                  type="checkbox"
                  class="form-check-input"
                  id="ip_inn"
                  v-model="formData.passport_info.ip_inn"
                />
                <label class="form-check-label" for="ip_inn">
                  <i class="bi bi-briefcase me-2"></i>ИП/ИНН
                </label>
              </div>

              <div class="form-check-item">
                <input
                  type="checkbox"
                  class="form-check-input"
                  id="pensioner"
                  v-model="formData.passport_info.pensioner"
                />
                <label class="form-check-label" for="pensioner">
                  <i class="bi bi-person-badge me-2"></i>Пенсионер
                </label>
              </div>
            </div>
          </div>

          <!-- Step 4: Cabinet Info -->
          <div v-show="currentStep === 4" class="form-step">
            <div class="form-group">
              <label for="code" class="form-label">
                <i class="bi bi-key me-2"></i>Код кабинета
              </label>
              <div class="input-with-button">
                <input
                  type="text"
                  class="form-control"
                  id="code"
                  v-model="formData.cabinet.code"
                  placeholder="AB123"
                  readonly
                />
                <button
                  type="button"
                  class="btn-generate"
                  @click="generateCabinetCode"
                  title="Сгенерировать код"
                >
                  <i class="bi bi-arrow-clockwise"></i>
                </button>
              </div>
              <small class="form-text">Автоматически сгенерированный код</small>
            </div>

            <div class="form-group">
              <label for="paket_id" class="form-label">
                <i class="bi bi-box me-2"></i>Пакет
              </label>
              <select
                class="form-select"
                id="paket_id"
                v-model.number="formData.cabinet.paket_id"
                @change="onPackageChange"
              >
                <option :value="null">Выберите пакет</option>
                <option v-for="paket in pakets" :key="paket.id" :value="paket.id">
                  {{ paket.name }} - ${{ paket.price }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label for="branch_id" class="form-label">
                <i class="bi bi-geo-alt me-2"></i>Филиал
              </label>
              <select
                class="form-select"
                id="branch_id"
                v-model.number="formData.cabinet.branch_id"
              >
                <option :value="null">Выберите филиал</option>
                <option v-for="branch in branches" :key="branch.id" :value="branch.id">
                  {{ branch.name }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label for="sponsor_search" class="form-label">
                <i class="bi bi-person-plus me-2"></i>Спонсор
              </label>
              <div class="position-relative">
                <input
                  type="text"
                  class="form-control"
                  id="sponsor_search"
                  v-model="sponsorSearchQuery"
                  @input="handleSponsorSearch"
                  placeholder="Поиск спонсора по ФИО или номеру..."
                  autocomplete="off"
                  :readonly="isReferralRegistration"
                  :class="{ 'readonly-field': isReferralRegistration }"
                />
                
                <div 
                  v-if="showSponsorDropdown && (sponsorSearchResults.length > 0 || sponsorSearchLoading) && !isReferralRegistration"
                  class="search-dropdown"
                >
                  <div v-if="sponsorSearchLoading" class="dropdown-item text-center py-2">
                    <div class="spinner-border spinner-border-sm text-primary" role="status">
                      <span class="visually-hidden">Загрузка...</span>
                    </div>
                  </div>
                  <div 
                    v-else
                    v-for="cabinet in sponsorSearchResults" 
                    :key="cabinet.id"
                    class="dropdown-item sponsor-item"
                    @click="selectSponsor(cabinet)"
                  >
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <div class="fw-semibold">{{ formatCabinetName(cabinet) }}</div>
                        <small class="text-muted">{{ cabinet.personal_number }}</small>
                      </div>
                      <i class="bi bi-chevron-right text-muted"></i>
                    </div>
                  </div>
                  <div v-if="sponsorSearchResults.length === 0 && sponsorSearchQuery.trim()" class="dropdown-item text-muted text-center py-2">
                    Спонсоры не найдены
                  </div>
                </div>
              </div>
              <small class="form-text" v-if="!isReferralRegistration">Обязательно</small>
              <small class="form-text text-success" v-else>
                <i class="bi bi-lock-fill me-1"></i>Спонсор установлен по реферальной ссылке
              </small>
            </div>

            <div class="form-group">
              <label for="mentor_search" class="form-label">
                <i class="bi bi-person-badge me-2"></i>Наставник
              </label>
              <div class="position-relative">
                <input
                  type="text"
                  class="form-control"
                  id="mentor_search"
                  v-model="mentorSearchQuery"
                  @input="handleMentorSearch"
                  @focus="showMentorDropdown = availableMentorPositions.length > 0"
                  placeholder="Поиск ментора по ФИО или номеру..."
                  autocomplete="off"
                  :disabled="!selectedSponsor"
                  :class="{ 'readonly-field': !selectedSponsor }"
                />
                
                <div 
                  v-if="showMentorDropdown && mentorSearchResults.length > 0"
                  class="search-dropdown"
                >
                  <div 
                    v-for="position in mentorSearchResults" 
                    :key="position.id"
                    class="dropdown-item sponsor-item"
                    @click="selectMentor(position)"
                  >
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <div class="fw-semibold">{{ formatMentorName(position) }}</div>
                        <small class="text-muted">{{ position.personal_number }}</small>
                      </div>
                      <i class="bi bi-chevron-right text-muted"></i>
                    </div>
                  </div>
                  <div v-if="mentorSearchResults.length === 0 && mentorSearchQuery.trim() && availableMentorPositions.length > 0" class="dropdown-item text-muted text-center py-2">
                    Наставники не найдены
                  </div>
                </div>
              </div>
              <small class="form-text" v-if="!selectedSponsor">
                <i class="bi bi-info-circle me-1"></i>Сначала выберите спонсора
              </small>
              <small class="form-text text-success" v-else-if="availableMentorPositions.length > 0">
                <i class="bi bi-check-circle me-1"></i>Доступно {{ availableMentorPositions.length }} позиций
              </small>
              <small class="form-text text-muted" v-else>
                Нет доступных позиций
              </small>
            </div>
          </div>

          <!-- Step 5: Product Selection -->
          <div v-show="currentStep === 5" class="form-step">
            <div class="package-selector-section mb-3">
              <label for="paket_select_step5" class="form-label">
                <i class="bi bi-box me-2"></i>Выбранный пакет
              </label>
              <select
                class="form-select"
                id="paket_select_step5"
                v-model.number="formData.cabinet.paket_id"
                @change="onPackageChange"
              >
                <option :value="null">Выберите пакет</option>
                <option v-for="paket in pakets" :key="paket.id" :value="paket.id">
                  {{ paket.name }} - ${{ paket.price }}
                </option>
              </select>
            </div>

            <div class="package-info-header">
              <div class="package-selected">
                <span class="text-muted">Сумма пакета:</span>
                <span class="fw-bold">${{ selectedPackage?.price || 0 }}</span>
              </div>
              <div class="package-remaining">
                <span class="text-muted">Выбрано товаров:</span>
                <span class="fw-bold" :class="selectedProductsTotal >= (selectedPackage?.price || 0) ? 'text-success' : 'text-warning'">
                  ${{ selectedProductsTotal.toFixed(2) }}
                </span>
              </div>
            </div>

            <div v-if="loadingProducts" class="text-center py-4">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Загрузка...</span>
              </div>
            </div>

            <div v-else class="products-list">
              <div 
                v-for="product in products" 
                :key="product.id"
                class="product-card"
                :class="{ 'selected': isProductSelected(product.id) }"
              >
                <div class="product-image-container">
                  <img 
                    v-if="product.images && product.images.length > 0" 
                    :src="product.images[0].src" 
                    :alt="product.name"
                    class="product-image"
                  />
                  <div v-else class="product-image-placeholder">
                    <i class="bi bi-box-seam"></i>
                  </div>
                </div>
                <div class="product-info">
                  <h6 class="product-name">{{ product.name }}</h6>
                  <p class="product-description">{{ product.description || product.sku || '-' }}</p>
                  <div class="product-price">${{ getProductPrice(product) }}</div>
                </div>
                <div class="product-actions">
                  <div v-if="isProductSelected(product.id)" class="quantity-controls">
                    <button 
                      class="quantity-btn minus"
                      type="button"
                      @click="decreaseQuantity(product.id)"
                      :disabled="getProductQuantity(product.id) <= 1"
                    >
                      <i class="bi bi-dash"></i>
                    </button>
                    <span class="quantity-value">{{ getProductQuantity(product.id) }}</span>
                    <button 
                      class="quantity-btn plus"
                      type="button"
                      @click="increaseQuantity(product.id)"
                      :disabled="!canAddProduct(product.id)"
                    >
                      <i class="bi bi-plus"></i>
                    </button>
                  </div>
                  <button 
                    v-else
                    class="add-product-btn"
                    type="button"
                    @click="toggleProduct(product.id)"
                    :disabled="!canAddProduct(product.id)"
                  >
                    <i class="bi bi-plus-lg"></i>
                  </button>
                  <button 
                    v-if="isProductSelected(product.id)"
                    class="remove-product-btn"
                    type="button"
                    @click="removeProductFromSelection(product.id)"
                    title="Удалить"
                  >
                    <i class="bi bi-x"></i>
                  </button>
                </div>
              </div>
            </div>

            <div class="order-summary">
              <div class="summary-row">
                <span class="summary-label">Выбрано товаров:</span>
                <span class="summary-value">{{ selectedProducts.reduce((sum, item) => sum + item.quantity, 0) }} шт.</span>
              </div>
              <div class="summary-row">
                <span class="summary-label">Сумма товаров:</span>
                <span class="summary-value">${{ selectedProductsTotal.toFixed(2) }}</span>
              </div>
              <div class="summary-row">
                <span class="summary-label">Минимум (пакет):</span>
                <span class="summary-value">${{ selectedPackage?.price || 0 }}</span>
              </div>
              <div v-if="selectedProductsTotal < (selectedPackage?.price || 0)" class="summary-row error-row">
                <span class="summary-label text-danger">Недостаточно:</span>
                <span class="summary-value text-danger">${{ ((selectedPackage?.price || 0) - selectedProductsTotal).toFixed(2) }}</span>
              </div>
              <div v-else class="summary-row success-row">
                <span class="summary-label text-success">✓ Минимум выполнен</span>
                <span class="summary-value text-success">+${{ (selectedProductsTotal - (selectedPackage?.price || 0)).toFixed(2) }}</span>
              </div>
            </div>
          </div>

          <!-- Step 6: Payment Method -->
          <div v-show="currentStep === 6" class="form-step">
            <!-- Payment Method Selection -->
            <div v-if="!showPhoneVerification && !showCodeVerification && !showSummary" class="payment-method-section">
              <label class="form-label">
                <i class="bi bi-credit-card me-2"></i>Способ оплаты
              </label>
              <div class="payment-methods-list">
                <div 
                  v-for="method in paymentMethods" 
                  :key="method.id"
                  class="payment-method-item"
                  :class="{ 'selected': formData.order.payment_method_id === method.id }"
                  @click="selectPaymentMethod(method.id)"
                >
                  <input
                    type="radio"
                    :id="`payment_${method.id}`"
                    :value="method.id"
                    v-model.number="formData.order.payment_method_id"
                    class="payment-radio"
                  />
                  <label :for="`payment_${method.id}`" class="payment-label">
                    <i class="bi bi-circle payment-icon-unchecked"></i>
                    <i class="bi bi-check-circle-fill payment-icon-checked"></i>
                    <span class="payment-name">{{ method.name }}</span>
                    <span v-if="method.description" class="payment-description">{{ method.description }}</span>
                  </label>
                </div>
              </div>
            </div>

            <!-- Phone Verification for Mbank -->
            <div v-if="showPhoneVerification && !showCodeVerification && !showSummary" class="verification-section">
              <div class="selected-payment-info">
                <span class="info-label">Способ оплаты:</span>
                <span class="info-value">{{ getSelectedPaymentMethodName() }}</span>
                <button 
                  type="button" 
                  class="btn-change"
                  @click="changePaymentMethod"
                  title="Изменить способ оплаты"
                >
                  <i class="bi bi-pencil"></i>
                </button>
              </div>
              
              <h5 class="verification-title">Введите номер телефона</h5>
              <p class="verification-subtitle">Мы отправим на номер СМС c кодом подтверждения</p>
              <div class="form-group">
                <input
                  type="tel"
                  class="form-control"
                  v-model="verificationPhone"
                  placeholder="996XXXXXXXXX"
                  inputmode="numeric"
                  @input="validatePhoneInput"
                  maxlength="12"
                />
                <small class="form-text">Введите номер без +, только цифры (например: 996702100400)</small>
              </div>
            </div>

            <!-- Code Verification for Mbank -->
            <div v-if="showCodeVerification && !showSummary" class="verification-section">
              <div class="selected-payment-info">
                <span class="info-label">Способ оплаты:</span>
                <span class="info-value">{{ getSelectedPaymentMethodName() }}</span>
              </div>

              <div class="selected-payment-info">
                <span class="info-label">Номер телефона:</span>
                <span class="info-value">{{ verificationPhone }}</span>
              </div>

              <div v-if="mbankDisplayName" class="selected-payment-info">
                <span class="info-label">Владелец счета:</span>
                <span class="info-value">{{ mbankDisplayName }}</span>
              </div>

              <h5 class="verification-title">Введите код</h5>
              <p class="verification-subtitle">
                Мы отправили код подтверждения на номер {{ verificationPhone }}
              </p>
              <div class="form-group">
                <input
                  type="text"
                  class="form-control code-input"
                  v-model="verificationCode"
                  placeholder="____"
                  maxlength="4"
                  inputmode="numeric"
                />
              </div>
              <p class="timer-text" v-if="verificationTimer > 0">
                Отправить новый код можно будет через {{ formatTimer(verificationTimer) }}
              </p>
              <button 
                v-else
                type="button"
                class="btn btn-link"
                @click="resendCode"
              >
                Отправить новый код
              </button>
            </div>

            <!-- Summary View -->
            <div v-if="showSummary" class="summary-view">
              <h5 class="summary-title">
                <i class="bi bi-check-circle-fill text-success me-2"></i>
                  Проверьте данные регистрации
              </h5>

              <!-- Payment Status Message for Mbank -->
              <div v-if="paymentStatusMessage" class="payment-status-alert" :class="{
                'status-processing': paymentStatusPolling && !paymentStatusMessage.includes('успешно'),
                'status-success': paymentStatusMessage.includes('успешно'),
                'status-error': paymentStatusMessage.includes('неуспешна')
              }">
                <div class="status-icon">
                  <span v-if="paymentStatusPolling && !paymentStatusMessage.includes('успешно')" class="spinner-border" role="status">
                    <span class="visually-hidden">Загрузка...</span>
                  </span>
                  <i v-else-if="paymentStatusMessage.includes('успешно')" class="bi bi-check-circle-fill"></i>
                  <i v-else-if="paymentStatusMessage.includes('неуспешна')" class="bi bi-x-circle-fill"></i>
                  <i v-else class="bi bi-clock-history"></i>
                </div>
                <div class="status-content">
                  <div class="status-title">
                    <span v-if="paymentStatusPolling && !paymentStatusMessage.includes('успешно')">Обработка платежа</span>
                    <span v-else-if="paymentStatusMessage.includes('успешно')">Оплата завершена</span>
                    <span v-else-if="paymentStatusMessage.includes('неуспешна')">Ошибка оплаты</span>
                    <span v-else>Проверка статуса</span>
                  </div>
                  <div class="status-message">
                    <span v-if="paymentStatusPolling && !paymentStatusMessage.includes('успешно')">Пожалуйста, подождите. Транзакция обрабатывается...</span>
                    <span v-else-if="paymentStatusMessage.includes('успешно')">Платеж успешно подтвержден. Вы можете войти в систему.</span>
                    <span v-else>{{ paymentStatusMessage }}</span>
                  </div>
                </div>
              </div>

              <!-- Login Credentials -->
              <div class="summary-section">
                <h6 class="summary-section-title">
                  <i class="bi bi-person-lock me-2"></i>Логин и пароль
                </h6>
                <div class="summary-item">
                  <span class="summary-label">Email (логин):</span>
                  <span class="summary-value">{{ formData.email }}</span>
                </div>
                <div class="summary-item">
                  <span class="summary-label">Пароль:</span>
                  <span class="summary-value">{{ '•'.repeat(formData.password.length) }}</span>
                </div>
              </div>

              <!-- Personal Info -->
              <div class="summary-section">
                <h6 class="summary-section-title">
                  <i class="bi bi-person me-2"></i>Личные данные
                </h6>
                <div class="summary-item">
                  <span class="summary-label">ФИО:</span>
                  <span class="summary-value">{{ formData.lastname }} {{ formData.name }} {{ formData.patronymic }}</span>
                </div>
              </div>

              <!-- Cabinet Info -->
              <div class="summary-section">
                <h6 class="summary-section-title">
                  <i class="bi bi-briefcase me-2"></i>Кабинет
                </h6>
                <div class="summary-item">
                  <span class="summary-label">Код кабинета:</span>
                  <span class="summary-value">{{ formData.cabinet.code }}</span>
                </div>
                <div class="summary-item" v-if="selectedSponsor">
                  <span class="summary-label">Спонсор:</span>
                  <span class="summary-value">{{ formatCabinetName(selectedSponsor) }}</span>
                </div>
                <div class="summary-item" v-if="selectedMentor">
                  <span class="summary-label">Наставник:</span>
                  <span class="summary-value">{{ formatMentorName(selectedMentor) }}</span>
                </div>
              </div>

              <!-- Package Info -->
              <div class="summary-section">
                <h6 class="summary-section-title">
                  <i class="bi bi-box me-2"></i>Пакет
                </h6>
                <div class="summary-item">
                  <span class="summary-label">Название:</span>
                  <span class="summary-value">{{ selectedPackage?.name }}</span>
                </div>
                <div class="summary-item">
                  <span class="summary-label">Стоимость:</span>
                  <span class="summary-value">${{ selectedPackage?.price }}</span>
                </div>
              </div>

              <!-- Selected Products -->
              <div class="summary-section">
                <h6 class="summary-section-title">
                  <i class="bi bi-cart me-2"></i>Выбранные товары
                </h6>
                <div v-for="item in selectedProducts" :key="item.id" class="summary-product">
                  <div class="product-summary-info">
                    <span class="product-summary-name">{{ getProductById(item.id)?.name }}</span>
                    <span class="product-summary-qty">× {{ item.quantity }}</span>
                  </div>
                  <span class="product-summary-price">${{ (getProductPrice(getProductById(item.id)) * item.quantity).toFixed(2) }}</span>
                </div>
              </div>

              <!-- Payment Info -->
              <div class="summary-section">
                <h6 class="summary-section-title">
                  <i class="bi bi-credit-card me-2"></i>Оплата
                </h6>
                <div class="summary-item">
                  <span class="summary-label">Способ оплаты:</span>
                  <span class="summary-value">{{ getSelectedPaymentMethodName() }}</span>
                </div>
                <div class="summary-item total-item">
                  <span class="summary-label">Итого (USD):</span>
                  <span class="summary-value total-value">${{ selectedProductsTotal.toFixed(2) }}</span>
                </div>
                <div class="summary-item total-item">
                  <span class="summary-label">Итого (сом):</span>
                  <span class="summary-value total-value">{{ (selectedProductsTotal * 85).toFixed(2) }} сом</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Navigation Buttons -->
          <div class="form-navigation">
            <button
              v-if="currentStep > 1 && !showCodeVerification && !showSummary"
              type="button"
              class="btn btn-secondary"
              @click="previousStep"
            >
              <i class="bi bi-arrow-left me-2"></i>Назад
            </button>

            <button
              v-if="currentStep < 6"
              type="submit"
              class="btn btn-primary"
            >
              Далее<i class="bi bi-arrow-right ms-2"></i>
            </button>

            <!-- Step 6: Payment Method Selection - Show Далее -->
            <button
              v-if="currentStep === 6 && !showPhoneVerification && !showCodeVerification && !showSummary"
              type="button"
              class="btn btn-primary"
              @click="proceedToNextStep"
              :disabled="!formData.order.payment_method_id"
            >
              Далее<i class="bi bi-arrow-right ms-2"></i>
            </button>

            <!-- Step 6: Phone Verification - Send Code -->
            <button
              v-if="currentStep === 6 && showPhoneVerification && !showCodeVerification && !showSummary"
              type="button"
              class="btn btn-primary"
              @click="sendVerificationCode"
              :disabled="!verificationPhone || verificationPhone.length < 10 || mbankCheckLoading"
            >
              <span v-if="mbankCheckLoading" class="spinner-border spinner-border-sm me-2"></span>
              {{ mbankCheckLoading ? 'Проверка...' : 'Далее' }}<i v-if="!mbankCheckLoading" class="bi bi-arrow-right ms-2"></i>
            </button>

            <!-- Step 6: Code Verification - Confirm Payment -->
            <button
              v-if="currentStep === 6 && showCodeVerification && !showSummary"
              type="button"
              class="btn btn-success"
              @click="confirmPayment"
              :disabled="verificationCode.length !== 4 || loading"
            >
              <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
              <i v-else class="bi bi-check-circle me-2"></i>
              {{ loading ? 'Подтверждение...' : 'Подтвердить оплату' }}
            </button>

            <!-- Step 6: Summary View - Complete Registration or Login -->
            <button
              v-if="currentStep === 6 && showSummary && !paymentStatusPolling"
              type="button"
              class="btn btn-success"
              :disabled="loading"
              @click="handleSummaryAction"
            >
              <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
              <i v-else class="bi bi-box-arrow-in-right me-2"></i>
              {{ paymentId.value ? 'Войти' : (loading ? 'Регистрация...' : 'Завершить регистрацию') }}
            </button>
          </div>
        </form>

        <!-- Footer -->
        <div class="register-footer">
          <p>Уже есть аккаунт? <router-link to="/login" class="footer-link">Войти</router-link></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { BACKEND_API_URL, MB_API_URL } from '../config'

const router = useRouter()

const steps = ['Личные данные', 'Паспорт', 'Доп. инфо', 'Кабинет', 'Товары', 'Оплата']
const stepTitles = [
  'Личная информация',
  'Паспортные данные',
  'Дополнительная информация',
  'Настройка кабинета',
  'Выбор товаров',
  'Способ оплаты'
]
const stepSubtitles = [
  'Введите ваши основные данные',
  'Заполните паспортную информацию',
  'Укажите банковские данные',
  'Настройте ваш кабинет',
  'Выберите товары минимум на сумму пакета (можно больше)',
  'Выберите способ оплаты и завершите регистрацию'
]

const currentStep = ref(1)
const showPassword = ref(false)
const error = ref('')
const loading = ref(false)

// Data for selects
const pakets = ref([])
const branches = ref([])
const products = ref([])
const loadingProducts = ref(false)
const paymentMethods = ref([])

// Selected products for order
const selectedProducts = ref([])
const selectedPackage = ref(null)

// Sponsor search
const sponsorSearchQuery = ref('')
const sponsorSearchResults = ref([])
const sponsorSearchLoading = ref(false)
const showSponsorDropdown = ref(false)
const selectedSponsor = ref(null)
let sponsorSearchTimeout = null

// Referral registration flag
const isReferralRegistration = ref(false)

// Mentor search
const mentorSearchQuery = ref('')
const mentorSearchResults = ref([])
const mentorSearchLoading = ref(false)
const showMentorDropdown = ref(false)
const selectedMentor = ref(null)
let mentorSearchTimeout = null

// Payment verification (for Mbank)
const verificationPhone = ref('')
const verificationCode = ref('')
const showPhoneVerification = ref(false)
const showCodeVerification = ref(false)
const verificationTimer = ref(0)
let verificationInterval = null
const mbankDisplayName = ref('')
const mbankCheckLoading = ref(false)
const paymentId = ref('')
const createdOrderId = ref(null)
const paymentStatusPolling = ref(false)
let pollingInterval = null
const paymentStatusMessage = ref('')

// Summary view
const showSummary = ref(false)

const formData = ref({
  email: '',
  password: '',
  name: '',
  lastname: '',
  patronymic: '',
  passport_info: {
    pin: '',
    passport_id: '',
    passport_issuer: '',
    passport_issue_date: '',
    bank: '',
    ip_inn: false,
    pensioner: false,
    phone_number: '',
    date_birth: ''
  },
  cabinet: {
    code: '',
    paket_id: null,
    branch_id: null,
    sponsor_id: null,
    mentor_id: null
  },
  order: {
    items: [],
    payment_method_id: null,
    shipping_address: '',
    notes: ''
  }
})

// Computed properties for product selection
const selectedProductsTotal = computed(() => {
  return selectedProducts.value.reduce((sum, item) => {
    const product = products.value.find(p => p.id === item.id)
    if (!product) return sum
    const price = getProductPrice(product)
    return sum + (price || 0) * (item.quantity || 1)
  }, 0)
})

const remainingAmount = computed(() => {
  if (!selectedPackage.value) return 0
  const packagePrice = typeof selectedPackage.value.price === 'string' 
    ? parseFloat(selectedPackage.value.price) 
    : selectedPackage.value.price
  // Positive value means user needs to add more products
  // Negative value means user exceeded minimum (which is allowed)
  return packagePrice - selectedProductsTotal.value
})

const isProductSelected = (productId) => {
  return selectedProducts.value.some(item => item.id === productId)
}

const getProductQuantity = (productId) => {
  const item = selectedProducts.value.find(item => item.id === productId)
  return item ? item.quantity : 0
}

const canAddProduct = (productId) => {
  if (!selectedPackage.value) return false
  const product = products.value.find(p => p.id === productId)
  if (!product) return false
  
  // Always allow adding products (no upper limit)
  return true
}

const toggleProduct = (productId) => {
  if (!canAddProduct(productId)) return
  
  const index = selectedProducts.value.findIndex(item => item.id === productId)
  if (index > -1) {
    selectedProducts.value.splice(index, 1)
  } else {
    selectedProducts.value.push({ id: productId, quantity: 1 })
  }
}

const increaseQuantity = (productId) => {
  const product = products.value.find(p => p.id === productId)
  if (!product) return
  
  // Always allow increasing quantity (no upper limit)
  const index = selectedProducts.value.findIndex(item => item.id === productId)
  if (index > -1) {
    selectedProducts.value[index].quantity++
  } else {
    selectedProducts.value.push({ id: productId, quantity: 1 })
  }
}

const decreaseQuantity = (productId) => {
  const index = selectedProducts.value.findIndex(item => item.id === productId)
  if (index > -1) {
    if (selectedProducts.value[index].quantity > 1) {
      selectedProducts.value[index].quantity--
    } else {
      selectedProducts.value.splice(index, 1)
    }
  }
}

const removeProductFromSelection = (productId) => {
  const index = selectedProducts.value.findIndex(item => item.id === productId)
  if (index > -1) {
    selectedProducts.value.splice(index, 1)
  }
}

// Generate cabinet code: 2 letters + 3 digits
const generateCabinetCode = () => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const code = 
    letters.charAt(Math.floor(Math.random() * letters.length)) +
    letters.charAt(Math.floor(Math.random() * letters.length)) +
    Math.floor(Math.random() * 1000).toString().padStart(3, '0')
  formData.value.cabinet.code = code
}

// Fetch pakets
const fetchPakets = async () => {
  try {
    const response = await fetch(`${BACKEND_API_URL}/api/pakets/`, {
      headers: {
        'accept': 'application/json'
      }
    })
    
    if (response.ok) {
      pakets.value = await response.json()
    }
  } catch (err) {
    console.error('Error fetching pakets:', err)
  }
}

// Fetch branches
const fetchBranches = async () => {
  try {
    const response = await fetch(`${BACKEND_API_URL}/api/branches/`, {
      headers: {
        'accept': 'application/json'
      }
    })
    
    if (response.ok) {
      branches.value = await response.json()
    }
  } catch (err) {
    console.error('Error fetching branches:', err)
  }
}

// Fetch products
const fetchProducts = async () => {
  loadingProducts.value = true
  try {
    // Build URL with paket filter if selected
    let url = `${BACKEND_API_URL}/api/products/`
    if (formData.value.cabinet.paket_id) {
      url += `?paket_id=${formData.value.cabinet.paket_id}`
    }

    const response = await fetch(url, {
      headers: {
        'accept': 'application/json'
      }
    })
    
    if (response.ok) {
      const data = await response.json()
      products.value = data
    }
  } catch (err) {
    console.error('Error fetching products:', err)
  } finally {
    loadingProducts.value = false
  }
}

// Get product price based on selected paket
const getProductPrice = (product) => {
  // If paket is selected and product has paket_prices
  if (formData.value.cabinet.paket_id && product.paket_prices && product.paket_prices.length > 0) {
    const paketPrice = product.paket_prices.find(pp => pp.paket_id === formData.value.cabinet.paket_id)
    if (paketPrice) {
      return typeof paketPrice.price === 'string' ? parseFloat(paketPrice.price) : paketPrice.price
    }
  }
  // Otherwise use cost_price
  return typeof product.cost_price === 'string' ? parseFloat(product.cost_price) : product.cost_price
}

// Handle package change
const onPackageChange = () => {
  const paket = pakets.value.find(p => p.id === formData.value.cabinet.paket_id)
  selectedPackage.value = paket
  selectedProducts.value = [] // Reset selected products when package changes
  // Fetch products with new paket filter
  fetchProducts()
}

// Sponsor search
const handleSponsorSearch = () => {
  clearTimeout(sponsorSearchTimeout)
  
  if (!sponsorSearchQuery.value.trim()) {
    sponsorSearchResults.value = []
    showSponsorDropdown.value = false
    return
  }
  
  sponsorSearchTimeout = setTimeout(async () => {
    await searchSponsors()
  }, 500)
}

const searchSponsors = async () => {
  if (!sponsorSearchQuery.value.trim()) {
    sponsorSearchResults.value = []
    return
  }
  
  sponsorSearchLoading.value = true
  try {
    const params = new URLSearchParams({
      search: sponsorSearchQuery.value.trim(),
      page: '1',
      page_size: '20'
    })
    
    const response = await fetch(`${BACKEND_API_URL}/api/cabinets/search/?${params.toString()}`, {
      headers: {
        'accept': 'application/json'
      }
    })
    
    if (response.ok) {
      const data = await response.json()
      sponsorSearchResults.value = data.cabinets || []
      showSponsorDropdown.value = true
    }
  } catch (err) {
    console.error('Error searching sponsors:', err)
    sponsorSearchResults.value = []
  } finally {
    sponsorSearchLoading.value = false
  }
}

const selectSponsor = async (cabinet) => {
  selectedSponsor.value = cabinet
  formData.value.cabinet.sponsor_id = cabinet.id
  sponsorSearchQuery.value = formatCabinetName(cabinet)
  showSponsorDropdown.value = false
  
  // Fetch available mentor positions when sponsor is selected
  await fetchAvailableMentorPositions(cabinet.id)
}

const formatCabinetName = (cabinet) => {
  if (!cabinet) return '-'
  
  // Build full name from participant fields
  const parts = []
  if (cabinet.participant_lastname) parts.push(cabinet.participant_lastname)
  if (cabinet.participant_name) parts.push(cabinet.participant_name)
  if (cabinet.participant_patronymic) parts.push(cabinet.participant_patronymic)
  
  const name = parts.length > 0 ? parts.join(' ') : '-'
  const personalNumber = cabinet.personal_number || '-'
  
  return `${name} (${personalNumber})`
}

// Available mentor positions from sponsor's structure
const availableMentorPositions = ref([])

// Fetch available mentor positions based on sponsor
const fetchAvailableMentorPositions = async (sponsorId) => {
  if (!sponsorId) {
    availableMentorPositions.value = []
    mentorSearchResults.value = []
    return
  }
  
  try {
    const response = await fetch(`${BACKEND_API_URL}/api/structure/find_free_positions/${sponsorId}`, {
      headers: {
        'accept': 'application/json'
      }
    })
    
    if (response.ok) {
      const data = await response.json()
      availableMentorPositions.value = data.available_positions || []
      // Initially show all available positions
      mentorSearchResults.value = availableMentorPositions.value
    } else {
      availableMentorPositions.value = []
      mentorSearchResults.value = []
    }
  } catch (err) {
    console.error('Error fetching available mentor positions:', err)
    availableMentorPositions.value = []
    mentorSearchResults.value = []
  }
}

// Mentor search - filter from available positions
const handleMentorSearch = () => {
  clearTimeout(mentorSearchTimeout)
  
  if (!mentorSearchQuery.value.trim()) {
    // Show all available positions when search is empty
    mentorSearchResults.value = availableMentorPositions.value
    showMentorDropdown.value = false
    return
  }
  
  mentorSearchTimeout = setTimeout(() => {
    searchMentors()
  }, 300)
}

const searchMentors = () => {
  const query = mentorSearchQuery.value.trim().toLowerCase()
  
  if (!query) {
    mentorSearchResults.value = availableMentorPositions.value
    return
  }
  
  // Filter available positions by search query
  mentorSearchResults.value = availableMentorPositions.value.filter(position => {
    const fullName = `${position.lastname || ''} ${position.name || ''} ${position.patronymic || ''}`.toLowerCase()
    const personalNumber = (position.personal_number || '').toLowerCase()
    const code = (position.code || '').toLowerCase()
    
    return fullName.includes(query) || personalNumber.includes(query) || code.includes(query)
  })
  
  showMentorDropdown.value = true
}

const selectMentor = (position) => {
  selectedMentor.value = position
  formData.value.cabinet.mentor_id = position.id
  mentorSearchQuery.value = formatMentorName(position)
  showMentorDropdown.value = false
}

// Format mentor name from position data
const formatMentorName = (position) => {
  if (!position) return '-'
  
  const parts = []
  if (position.lastname) parts.push(position.lastname)
  if (position.name) parts.push(position.name)
  if (position.patronymic) parts.push(position.patronymic)
  
  const name = parts.length > 0 ? parts.join(' ') : '-'
  const personalNumber = position.personal_number || '-'
  
  return `${name} (${personalNumber})`
}

// Fetch payment methods
const fetchPaymentMethods = async () => {
  try {
    const response = await fetch(`${BACKEND_API_URL}/api/orders/payment-methods`, {
      headers: {
        'accept': 'application/json'
      }
    })
    
    if (response.ok) {
      paymentMethods.value = await response.json()
    }
  } catch (err) {
    console.error('Error fetching payment methods:', err)
  }
}

// Handle payment method change
const selectPaymentMethod = (methodId) => {
  formData.value.order.payment_method_id = methodId
  const selectedMethod = paymentMethods.value.find(m => m.id === methodId)
  
  // If Mbank is selected, show phone verification
  if (selectedMethod && selectedMethod.name === 'Мбанк') {
    showPhoneVerification.value = true
    verificationPhone.value = '996'
  } else {
    showPhoneVerification.value = false
    showCodeVerification.value = false
  }
}

// Get selected payment method name
const getSelectedPaymentMethodName = () => {
  const method = paymentMethods.value.find(m => m.id === formData.value.order.payment_method_id)
  return method ? method.name : ''
}

// Change payment method (go back to selection)
const changePaymentMethod = () => {
  showPhoneVerification.value = false
  showCodeVerification.value = false
  verificationPhone.value = ''
  verificationCode.value = ''
  if (verificationInterval) {
    clearInterval(verificationInterval)
  }
  verificationTimer.value = 0
}

// Validate phone input - only digits
const validatePhoneInput = () => {
  // Remove all non-digit characters
  verificationPhone.value = verificationPhone.value.replace(/\D/g, '')
}

// Change phone number (go back to phone input)
const changePhoneNumber = () => {
  showCodeVerification.value = false
  showPhoneVerification.value = true
  verificationCode.value = ''
  if (verificationInterval) {
    clearInterval(verificationInterval)
  }
  verificationTimer.value = 0
}

// Proceed to next step after payment method selection
const proceedToNextStep = () => {
  const selectedMethod = paymentMethods.value.find(m => m.id === formData.value.order.payment_method_id)
  
  // If Наличные (Cash), go directly to summary
  if (selectedMethod && selectedMethod.name === 'Наличные') {
    showSummary.value = true
  }
  // If Мбанк, phone verification is already shown by selectPaymentMethod
}

// Proceed to summary after code verification
const proceedToSummary = () => {
  showSummary.value = true
}

// Get product by ID
const getProductById = (productId) => {
  return products.value.find(p => p.id === productId)
}

// Handle summary action - either login (Mbank) or complete registration (Cash)
const handleSummaryAction = () => {
  // If payment was made via Mbank (paymentId exists), redirect to login
  if (paymentId.value) {
    router.push({
      path: '/login',
      query: { registered: 'true', paid: 'true' }
    })
  } else {
    // For cash payment, complete registration
    handleSubmit()
  }
}

// Send verification code - first check if phone exists in Mbank
const sendVerificationCode = async () => {
  mbankCheckLoading.value = true
  error.value = ''
  
  try {
    // Clean phone number (already digits only from validation)
    const cleanPhone = verificationPhone.value
    
    // Step 1: Check if phone exists in Mbank system
    const checkResponse = await fetch(`${MB_API_URL}/api/payment/check`, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        phone: cleanPhone
      })
    })
    
    const checkData = await checkResponse.json()
    
    if (!checkData.success) {
      error.value = checkData.message || 'Плательщик не найден в системе'
      mbankCheckLoading.value = false
      return
    }
    
    // Store displayName
    mbankDisplayName.value = checkData.displayName || ''
    
    // Step 2: Create registration
    const orderItems = selectedProducts.value.map(item => {
      const product = products.value.find(p => p.id === item.id)
      return {
        product_id: item.id,
        quantity: item.quantity,
        unit_price: product ? getProductPrice(product) : 0
      }
    })

    if (!formData.value.order.shipping_address) {
      formData.value.order.shipping_address = 'Адрес не указан'
    }

    const payload = {
      ...formData.value,
      order: {
        ...formData.value.order,
        items: orderItems
      }
    }

    const registerResponse = await fetch(`${BACKEND_API_URL}/api/participants/register`, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })

    if (registerResponse.status !== 201) {
      const errorData = await registerResponse.json()
      throw new Error(errorData.detail || 'Ошибка регистрации')
    }

    const registrationData = await registerResponse.json()
    createdOrderId.value = registrationData.order.id

    // Step 3: Start Mbank payment
    // Calculate amount: (total product amount * 85) * 100 = tyiyn
    const amountTyiyn = Math.round(selectedProductsTotal.value * 85 * 100)
    
    const paymentResponse = await fetch(`${MB_API_URL}/api/payment/start`, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        order_id: createdOrderId.value.toString(),
        phone: cleanPhone,
        amount_tyiyn: amountTyiyn,
        comment: `Оплата заказа №${createdOrderId.value}`
      })
    })

    const paymentData = await paymentResponse.json()
    
    if (!paymentData.payment_id) {
      throw new Error(paymentData.message || 'Ошибка инициализации платежа')
    }

    // Store payment_id
    paymentId.value = paymentData.payment_id
    
    // Start timer for OTP input
    startVerificationTimer()
    
    // Proceed to code verification
    showPhoneVerification.value = false
    showCodeVerification.value = true
    
  } catch (err) {
    console.error('Error in verification process:', err)
    error.value = err.message || 'Ошибка при обработке запроса'
  } finally {
    mbankCheckLoading.value = false
  }
}

// Resend verification code - restart payment to get new OTP
const resendCode = async () => {
  if (!createdOrderId.value) {
    error.value = 'Ошибка: заказ не найден'
    return
  }
  
  loading.value = true
  error.value = ''
  
  try {
    const cleanPhone = verificationPhone.value
    const amountTyiyn = Math.round(selectedProductsTotal.value * 85 * 100)
    
    const paymentResponse = await fetch(`${MB_API_URL}/api/payment/start`, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        order_id: createdOrderId.value.toString(),
        phone: cleanPhone,
        amount_tyiyn: amountTyiyn,
        comment: `Оплата заказа №${createdOrderId.value}`
      })
    })

    const paymentData = await paymentResponse.json()
    
    if (!paymentData.payment_id) {
      throw new Error(paymentData.message || 'Ошибка отправки нового кода')
    }

    // Update payment_id with new one
    paymentId.value = paymentData.payment_id
    
    // Clear old code and restart timer
    verificationCode.value = ''
    startVerificationTimer()
    
  } catch (err) {
    console.error('Error resending code:', err)
    error.value = err.message || 'Ошибка отправки нового кода'
  } finally {
    loading.value = false
  }
}

// Confirm payment with OTP
const confirmPayment = async () => {
  if (!paymentId.value || verificationCode.value.length !== 4) {
    return
  }
  
  loading.value = true
  error.value = ''
  
  try {
    const confirmResponse = await fetch(`${MB_API_URL}/api/payment/confirm`, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        payment_id: paymentId.value,
        otp: verificationCode.value
      })
    })
    
    const confirmData = await confirmResponse.json()
    
    // Check for errors
    if (confirmData.code === 225) {
      error.value = confirmData.message || 'Неверный код. Попробуйте ещё раз.'
      verificationCode.value = ''
      loading.value = false
      return
    }
    
    if (confirmData.code === 229) {
      error.value = confirmData.message || 'Лимит попыток исчерпан. Нажмите \'Оплатить заново\' для нового кода.'
      loading.value = false
      return
    }
    
    if (confirmData.detail) {
      error.value = confirmData.detail
      loading.value = false
      return
    }
    
    if (confirmData.code && confirmData.code !== 200) {
      error.value = confirmData.message || 'Ошибка подтверждения'
      loading.value = false
      return
    }
    
    // Success! OTP confirmed, now start polling payment status
    showCodeVerification.value = false
    showSummary.value = true
    
    // Start polling payment status
    startPaymentStatusPolling()
    
  } catch (err) {
    console.error('Error confirming payment:', err)
    error.value = 'Ошибка подтверждения платежа'
  } finally {
    loading.value = false
  }
}

// Check payment status
const checkPaymentStatus = async () => {
  if (!paymentId.value) {
    return
  }
  
  try {
    const statusResponse = await fetch(`${MB_API_URL}/api/payment/status/${paymentId.value}`, {
      method: 'GET',
      headers: {
        'accept': 'application/json'
      }
    })
    
    const statusData = await statusResponse.json()
    
    // Final statuses - stop polling
    if (statusData.code === 330) {
      // Success!
      stopPaymentStatusPolling()
      paymentStatusMessage.value = 'Оплата успешно завершена!'
      error.value = ''
      return
    }
    
    if (statusData.code === 332 || statusData.code === 333) {
      // Failed
      stopPaymentStatusPolling()
      paymentStatusMessage.value = ''
      error.value = statusData.message || 'Транзакция неуспешна'
      return
    }
    
    // Intermediate statuses - continue polling (331, 101, -1, 227)
    if ([331, 101, -1, 227].includes(statusData.code)) {
      paymentStatusMessage.value = 'Транзакция в обработке...'
      // Continue polling
      return
    }
    
  } catch (err) {
    console.error('Error checking payment status:', err)
    // Don't stop polling on network errors, just log
  }
}

// Start polling payment status every 12 seconds
const startPaymentStatusPolling = () => {
  paymentStatusPolling.value = true
  paymentStatusMessage.value = 'Проверка статуса платежа...'
  
  // Check immediately
  checkPaymentStatus()
  
  // Then check every 12 seconds
  pollingInterval = setInterval(() => {
    checkPaymentStatus()
  }, 12000) // 12 seconds
}

// Stop polling
const stopPaymentStatusPolling = () => {
  paymentStatusPolling.value = false
  if (pollingInterval) {
    clearInterval(pollingInterval)
    pollingInterval = null
  }
}

// Start verification timer (31 seconds)
const startVerificationTimer = () => {
  verificationTimer.value = 31
  
  if (verificationInterval) {
    clearInterval(verificationInterval)
  }
  
  verificationInterval = setInterval(() => {
    verificationTimer.value--
    if (verificationTimer.value <= 0) {
      clearInterval(verificationInterval)
    }
  }, 1000)
}

// Format timer display
const formatTimer = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

const previousStep = () => {
  // If on step 6 and showing summary, go back to payment method selection
  if (currentStep.value === 6 && showSummary.value) {
    showSummary.value = false
    
    // If it was Mbank with verification, reset to payment selection
    const selectedMethod = paymentMethods.value.find(m => m.id === formData.value.order.payment_method_id)
    if (selectedMethod && selectedMethod.name === 'Мбанк') {
      showPhoneVerification.value = false
      showCodeVerification.value = false
      verificationPhone.value = ''
      verificationCode.value = ''
      if (verificationInterval) {
        clearInterval(verificationInterval)
      }
      verificationTimer.value = 0
    }
    return
  }
  
  // If on step 6 and showing code verification, go back to phone input
  if (currentStep.value === 6 && showCodeVerification.value) {
    showCodeVerification.value = false
    showPhoneVerification.value = true
    verificationCode.value = ''
    if (verificationInterval) {
      clearInterval(verificationInterval)
    }
    verificationTimer.value = 0
    return
  }
  
  // If on step 6 and showing phone verification, go back to payment selection
  if (currentStep.value === 6 && showPhoneVerification.value) {
    showPhoneVerification.value = false
    verificationPhone.value = ''
    return
  }
  
  // Normal step navigation
  if (currentStep.value > 1) {
    currentStep.value--
    error.value = ''
  }
}

const validateCurrentStep = () => {
  error.value = ''
  
  // Step 1: Personal Info
  if (currentStep.value === 1) {
    if (!formData.value.email || !formData.value.email.includes('@')) {
      error.value = 'Пожалуйста, введите корректный email'
      return false
    }
    if (!formData.value.password || formData.value.password.length < 6) {
      error.value = 'Пароль должен содержать минимум 6 символов'
      return false
    }
    if (!formData.value.name || !formData.value.name.trim()) {
      error.value = 'Пожалуйста, введите имя'
      return false
    }
    if (!formData.value.lastname || !formData.value.lastname.trim()) {
      error.value = 'Пожалуйста, введите фамилию'
      return false
    }
  }
  
  // Step 2: Passport Info
  if (currentStep.value === 2) {
    if (!formData.value.passport_info.pin || !formData.value.passport_info.pin.trim()) {
      error.value = 'Пожалуйста, введите ПИН'
      return false
    }
    if (!formData.value.passport_info.passport_id || !formData.value.passport_info.passport_id.trim()) {
      error.value = 'Пожалуйста, введите номер паспорта'
      return false
    }
    if (!formData.value.passport_info.passport_issuer || !formData.value.passport_info.passport_issuer.trim()) {
      error.value = 'Пожалуйста, укажите кем выдан паспорт'
      return false
    }
    if (!formData.value.passport_info.passport_issue_date) {
      error.value = 'Пожалуйста, укажите дату выдачи паспорта'
      return false
    }
    if (!formData.value.passport_info.date_birth) {
      error.value = 'Пожалуйста, укажите дату рождения'
      return false
    }
    if (!formData.value.passport_info.phone_number || !formData.value.passport_info.phone_number.trim()) {
      error.value = 'Пожалуйста, введите номер телефона'
      return false
    }
  }
  
  // Step 3: Additional Info
  if (currentStep.value === 3) {
    if (!formData.value.passport_info.bank || !formData.value.passport_info.bank.trim()) {
      error.value = 'Пожалуйста, введите название банка'
      return false
    }
  }
  
  // Step 4: Cabinet Info
  if (currentStep.value === 4) {
    if (!formData.value.cabinet.code || !formData.value.cabinet.code.trim()) {
      error.value = 'Пожалуйста, сгенерируйте код кабинета'
      return false
    }
    if (!formData.value.cabinet.paket_id) {
      error.value = 'Пожалуйста, выберите пакет'
      return false
    }
    if (!formData.value.cabinet.branch_id) {
      error.value = 'Пожалуйста, выберите филиал'
      return false
    }
  }
  
  // Step 5: Product Selection
  if (currentStep.value === 5) {
    if (selectedProducts.value.length === 0) {
      error.value = 'Пожалуйста, выберите хотя бы один товар'
      return false
    }
    if (selectedProductsTotal.value < (selectedPackage.value?.price || 0)) {
      error.value = `Сумма товаров должна быть не меньше ${selectedPackage.value?.price || 0}$`
      return false
    }
  }
  
  // Step 6: Payment Method
  if (currentStep.value === 6) {
    if (!formData.value.order.payment_method_id) {
      error.value = 'Пожалуйста, выберите способ оплаты'
      return false
    }
  }
  
  return true
}

const handleNext = async () => {
  if (!validateCurrentStep()) {
    return
  }
  
  if (currentStep.value < 6) {
    currentStep.value++
    error.value = ''
    
    // Load products when entering step 5
    if (currentStep.value === 5 && products.value.length === 0) {
      await fetchProducts()
    }
    
    // Load payment methods when entering step 6
    if (currentStep.value === 6 && paymentMethods.value.length === 0) {
      await fetchPaymentMethods()
    }
  } else {
    await handleSubmit()
  }
}

const handleSubmit = async () => {
  loading.value = true
  error.value = ''
  
  try {
    // Build order items from selected products
    const orderItems = selectedProducts.value.map(item => {
      const product = products.value.find(p => p.id === item.id)
      return {
        product_id: item.id,
        quantity: item.quantity,
        unit_price: product ? getProductPrice(product) : 0
      }
    })

    // Set default shipping address if empty
    if (!formData.value.order.shipping_address) {
      formData.value.order.shipping_address = 'Адрес не указан'
    }

    const payload = {
      ...formData.value,
      order: {
        ...formData.value.order,
        items: orderItems
      }
    }

    // Step 1: Create registration
    const response = await fetch(`${BACKEND_API_URL}/api/participants/register`, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })

    if (response.status !== 201) {
      const errorData = await response.json()
      throw new Error(errorData.detail || 'Ошибка регистрации')
    }

    const registrationData = await response.json()
    createdOrderId.value = registrationData.order.id

    // Step 2: Check if Mbank payment is selected
    const selectedMethod = paymentMethods.value.find(m => m.id === formData.value.order.payment_method_id)
    
    if (selectedMethod && selectedMethod.name === 'Мбанк') {
      // Initiate Mbank payment
      const cleanPhone = verificationPhone.value.replace(/[\s\-\(\)]/g, '')
      const amountTyiyn = Math.round(selectedProductsTotal.value * 85 * 100) // USD to KGS to tyiyn
      
      const paymentResponse = await fetch(`${MB_API_URL}/api/payment/start`, {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          order_id: createdOrderId.value.toString(),
          phone: cleanPhone,
          amount_tyiyn: amountTyiyn,
          comment: `Оплата заказа №${createdOrderId.value}`
        })
      })

      const paymentData = await paymentResponse.json()
      
      if (!paymentData.payment_id) {
        throw new Error('Ошибка инициализации платежа')
      }

      // Store payment_id for confirmation
      paymentId.value = paymentData.payment_id
      
      // Start timer for OTP input
      startVerificationTimer()
      
      // Show message about OTP
      error.value = ''
      
    } else {
      // For cash or other payment methods, redirect to login
      router.push({
        path: '/login',
        query: { registered: 'true' }
      })
    }
    
  } catch (e) {
    console.error('Registration error:', e)
    error.value = e.message || 'Ошибка регистрации. Пожалуйста, проверьте данные.'
  } finally {
    loading.value = false
  }
}

// Load sponsor by ID for referral registration
const loadSponsorById = async (cabinetId) => {
  try {
    const response = await fetch(`${BACKEND_API_URL}/api/cabinets/search/?cabinet_id=${cabinetId}`, {
      headers: {
        'accept': 'application/json'
      }
    })
    
    if (response.ok) {
      const data = await response.json()
      
      // Extract cabinet from cabinets array
      if (data.cabinets && data.cabinets.length > 0) {
        const cabinet = data.cabinets[0]
        selectedSponsor.value = cabinet
        formData.value.cabinet.sponsor_id = cabinet.id
        sponsorSearchQuery.value = formatCabinetName(cabinet)
        
        // Fetch available mentor positions for this sponsor
        await fetchAvailableMentorPositions(cabinet.id)
      } else {
        console.error('Sponsor not found')
        isReferralRegistration.value = false
      }
    } else {
      console.error('Failed to load sponsor')
      isReferralRegistration.value = false
    }
  } catch (err) {
    console.error('Error loading sponsor:', err)
    isReferralRegistration.value = false
  }
}

onMounted(async () => {
  fetchPakets()
  fetchBranches()
  generateCabinetCode()
  
  // Check for referral sponsor_id in URL
  const urlParams = new URLSearchParams(window.location.search)
  const sponsorId = urlParams.get('sponsor_id')
  
  if (sponsorId) {
    isReferralRegistration.value = true
    await loadSponsorById(sponsorId)
  }
})

onUnmounted(() => {
  // Cleanup polling interval when component is destroyed
  stopPaymentStatusPolling()
})
</script>

<style scoped>
/* All previous styles remain... */
.register-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem 1rem;
}

.register-container {
  width: 100%;
  max-width: 600px;
}

.register-card {
  background: white;
  border-radius: 24px;
  padding: 2rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.5s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.logo-section {
  text-align: center;
  margin-bottom: 1.5rem;
}

.logo {
  height: 60px;
  width: auto;
}

/* Progress Steps */
.progress-steps {
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
  position: relative;
}

.progress-steps::before {
  content: '';
  position: absolute;
  top: 20px;
  left: 10%;
  right: 10%;
  height: 2px;
  background: #e9ecef;
  z-index: 0;
}

.step-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
  position: relative;
  z-index: 1;
}

.step-circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #e9ecef;
  color: #6c757d;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.3s ease;
}

.step-item.active .step-circle {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.step-item.completed .step-circle {
  background: #28a745;
  color: white;
}

.step-label {
  font-size: 11px;
  color: #6c757d;
  text-align: center;
  font-weight: 500;
}

.step-item.active .step-label {
  color: #667eea;
  font-weight: 600;
}

.register-title {
  font-size: 24px;
  font-weight: 700;
  color: #1a1a1a;
  text-align: center;
  margin-bottom: 0.5rem;
}

.register-subtitle {
  font-size: 14px;
  color: #6c757d;
  text-align: center;
  margin-bottom: 1.5rem;
}

.register-form {
  margin-bottom: 1.5rem;
}

.form-step {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-label {
  display: flex;
  align-items: center;
  font-weight: 600;
  color: #495057;
  margin-bottom: 0.5rem;
  font-size: 13px;
}

.form-control,
textarea.form-control,
.form-select {
  border: 2px solid #e9ecef;
  border-radius: 12px;
  padding: 0.75rem 1rem;
  font-size: 15px;
  transition: all 0.3s ease;
  width: 100%;
}

.form-control:focus,
textarea.form-control:focus,
.form-select:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
  outline: none;
}

.readonly-field {
  background-color: #e9ecef !important;
  cursor: not-allowed !important;
  opacity: 0.7;
}

textarea.form-control {
  resize: vertical;
  min-height: 80px;
}

.password-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.password-input-wrapper .form-control {
  padding-right: 3rem;
}

.password-toggle {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  background: transparent;
  border: none;
  padding: 0 1rem;
  color: #6c757d;
  cursor: pointer;
  transition: color 0.3s ease;
}

.password-toggle:hover {
  color: #667eea;
}

.form-check-group {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
}

.form-check-item {
  display: flex;
  align-items: center;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.form-check-item:hover {
  background: #e9ecef;
}

.form-check-input {
  width: 20px;
  height: 20px;
  margin-right: 0.75rem;
  cursor: pointer;
  border: 2px solid #dee2e6;
  border-radius: 6px;
}

.form-check-input:checked {
  background-color: #667eea;
  border-color: #667eea;
}

.form-check-label {
  font-size: 14px;
  color: #495057;
  cursor: pointer;
  user-select: none;
  display: flex;
  align-items: center;
  font-weight: 500;
}

.input-with-button {
  display: flex;
  gap: 0.5rem;
}

.input-with-button .form-control {
  flex: 1;
}

.btn-generate {
  background: #667eea;
  border: none;
  color: white;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 48px;
}

.btn-generate:hover {
  background: #764ba2;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.btn-generate i {
  font-size: 18px;
}

.form-text {
  display: block;
  margin-top: 0.5rem;
  font-size: 12px;
  color: #6c757d;
}

.position-relative {
  position: relative;
}

.search-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  max-height: 300px;
  overflow-y: auto;
  z-index: 1000;
  margin-top: 0.5rem;
}

.dropdown-item {
  padding: 0.75rem 1rem;
  cursor: pointer;
  border-bottom: 1px solid #f0f0f0;
  transition: background-color 0.2s ease;
}

.dropdown-item:last-child {
  border-bottom: none;
}

.sponsor-item:hover {
  background-color: #f8f9fa;
}

.sponsor-item .fw-semibold {
  font-size: 0.95rem;
  margin-bottom: 0.25rem;
}

.sponsor-item small {
  font-size: 0.85rem;
}

.d-flex {
  display: flex;
}

.justify-content-between {
  justify-content: space-between;
}

.align-items-center {
  align-items: center;
}

.text-center {
  text-align: center;
}

.py-2 {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}

.text-muted {
  color: #6c757d;
}

.fw-semibold {
  font-weight: 600;
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

/* Product Selection Styles */
.package-selector-section {
  background: #ffffff;
  padding: 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
}

.package-selector-section .form-label {
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.package-info-header {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 12px;
  margin-bottom: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.package-selected,
.package-remaining {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.package-selected .text-muted,
.package-remaining .text-muted {
  font-size: 12px;
}

.package-selected .fw-bold,
.package-remaining .fw-bold {
  font-size: 16px;
}

.products-list {
  max-height: 400px;
  overflow-y: auto;
  margin-bottom: 1.5rem;
}

.product-card {
  background: #f8f9fa;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 1rem;
  display: flex;
  gap: 1rem;
  align-items: center;
  transition: all 0.3s ease;
}

.product-card.selected {
  border-color: #667eea;
  background: rgba(102, 126, 234, 0.05);
}

.product-image-container {
  flex-shrink: 0;
  width: 80px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  color: rgba(102, 126, 234, 0.3);
}

.product-info {
  flex: 1;
  min-width: 0;
}

.product-name {
  font-size: 15px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 0.25rem;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}

.product-description {
  font-size: 13px;
  color: #6c757d;
  margin-bottom: 0.5rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.product-price {
  font-size: 16px;
  font-weight: 700;
  color: #667eea;
}

.product-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: white;
  border-radius: 8px;
  padding: 0.25rem;
}

.quantity-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: #667eea;
  color: white;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.quantity-btn:hover:not(:disabled) {
  background: #764ba2;
}

.quantity-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.quantity-value {
  min-width: 30px;
  text-align: center;
  font-weight: 600;
  font-size: 14px;
}

.add-product-btn {
  width: 40px;
  height: 40px;
  border: 2px solid #667eea;
  background: transparent;
  color: #667eea;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.add-product-btn:hover:not(:disabled) {
  background: #667eea;
  color: white;
}

.add-product-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.remove-product-btn {
  width: 40px;
  height: 40px;
  border: none;
  background: #dc3545;
  color: white;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.remove-product-btn:hover {
  background: #c82333;
}

.order-summary {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 1rem;
  margin-top: 1.5rem;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #e9ecef;
}

.summary-row:last-child {
  border-bottom: none;
}

.summary-label {
  font-size: 14px;
  color: #495057;
}

.summary-value {
  font-size: 14px;
  font-weight: 600;
}

.total-row {
  padding-top: 1rem;
  margin-top: 0.5rem;
  border-top: 2px solid #dee2e6;
}

.total-row .summary-label,
.total-row .summary-value {
  font-size: 16px;
  font-weight: 700;
}

.error-row {
  background: #f8d7da;
  padding: 0.75rem;
  border-radius: 8px;
  margin: 0.5rem 0;
}

.text-success {
  color: #28a745;
}

.text-danger {
  color: #dc3545;
}

/* Navigation Buttons */
.form-navigation {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.form-navigation .btn {
  flex: 1;
  padding: 0.875rem;
  font-size: 15px;
  font-weight: 600;
  border-radius: 12px;
  border: none;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 50px;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background: #5a6268;
  transform: translateY(-2px);
}

.btn-success {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  color: white;
}

.btn-success:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(40, 167, 69, 0.4);
}

.btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.register-footer {
  text-align: center;
  padding-top: 1rem;
  border-top: 1px solid #e9ecef;
}

.register-footer p {
  margin: 0;
  font-size: 14px;
  color: #6c757d;
}

.footer-link {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s ease;
}

.footer-link:hover {
  color: #764ba2;
  text-decoration: underline;
}

.alert {
  border-radius: 12px;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  font-size: 13px;
  padding: 0.75rem 1rem;
}

/* Payment Method Section Styles */
.payment-method-section {
  margin-bottom: 1.5rem;
}

.payment-methods-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
}

.payment-method-item {
  background: #f8f9fa;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.payment-method-item:hover {
  background: #e9ecef;
  border-color: #dee2e6;
}

.payment-method-item.selected {
  background: rgba(102, 126, 234, 0.05);
  border-color: #667eea;
}

.payment-radio {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}

.payment-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  margin: 0;
  width: 100%;
}

.payment-icon-unchecked,
.payment-icon-checked {
  font-size: 20px;
  transition: all 0.3s ease;
}

.payment-icon-unchecked {
  color: #6c757d;
}

.payment-icon-checked {
  color: #667eea;
  display: none;
}

.payment-method-item.selected .payment-icon-unchecked {
  display: none;
}

.payment-method-item.selected .payment-icon-checked {
  display: inline;
}

.payment-name {
  font-size: 15px;
  font-weight: 600;
  color: #1a1a1a;
  flex: 1;
}

.payment-description {
  font-size: 13px;
  color: #6c757d;
}

/* Verification Section Styles */
.selected-payment-info {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.info-label {
  font-size: 13px;
  color: #6c757d;
  font-weight: 500;
}

.info-value {
  font-size: 15px;
  color: #1a1a1a;
  font-weight: 600;
  flex: 1;
}

.btn-change {
  background: transparent;
  border: 1px solid #667eea;
  color: #667eea;
  border-radius: 8px;
  padding: 0.5rem 0.75rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
}

.btn-change:hover {
  background: #667eea;
  color: white;
}

.btn-change i {
  font-size: 14px;
}

/* Summary View Styles */
.summary-view {
  max-height: 500px;
  overflow-y: auto;
  padding-right: 0.5rem;
}

.summary-title {
  font-size: 18px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 1.5rem;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Payment Status Alert Styles */
.payment-status-alert {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  padding: 1.5rem;
  border-radius: 12px;
  margin-bottom: 1.5rem;
  min-height: 100px;
  border: 2px solid;
  transition: all 0.3s ease;
}

.payment-status-alert .status-icon {
  flex-shrink: 0;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 28px;
}

.payment-status-alert .status-icon .spinner-border {
  width: 40px;
  height: 40px;
  border-width: 4px;
}

.payment-status-alert .status-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.payment-status-alert .status-title {
  font-size: 18px;
  font-weight: 700;
  margin: 0;
}

.payment-status-alert .status-message {
  font-size: 14px;
  line-height: 1.5;
  opacity: 0.9;
}

/* Processing State */
.payment-status-alert.status-processing {
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
  border-color: #2196f3;
  color: #0d47a1;
}

.payment-status-alert.status-processing .status-icon {
  background: rgba(33, 150, 243, 0.15);
  color: #2196f3;
}

.payment-status-alert.status-processing .spinner-border {
  color: #2196f3;
}

/* Success State */
.payment-status-alert.status-success {
  background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
  border-color: #4caf50;
  color: #1b5e20;
}

.payment-status-alert.status-success .status-icon {
  background: rgba(76, 175, 80, 0.15);
  color: #4caf50;
}

/* Error State */
.payment-status-alert.status-error {
  background: linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%);
  border-color: #f44336;
  color: #b71c1c;
}

.payment-status-alert.status-error .status-icon {
  background: rgba(244, 67, 54, 0.15);
  color: #f44336;
}

.summary-section {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 1rem;
}

.summary-section-title {
  font-size: 15px;
  font-weight: 700;
  color: #495057;
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
  border-bottom: 2px solid #e9ecef;
  padding-bottom: 0.5rem;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #e9ecef;
}

.summary-item:last-child {
  border-bottom: none;
}

.summary-label {
  font-size: 13px;
  color: #6c757d;
  font-weight: 500;
}

.summary-value {
  font-size: 14px;
  color: #1a1a1a;
  font-weight: 600;
  text-align: right;
}

.summary-product {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid #e9ecef;
}

.summary-product:last-child {
  border-bottom: none;
}

.product-summary-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1;
}

.product-summary-name {
  font-size: 14px;
  color: #1a1a1a;
  font-weight: 600;
}

.product-summary-qty {
  font-size: 12px;
  color: #6c757d;
}

.product-summary-price {
  font-size: 14px;
  color: #667eea;
  font-weight: 700;
}

.total-item {
  background: rgba(102, 126, 234, 0.05);
  padding: 0.75rem;
  border-radius: 8px;
  margin-top: 0.5rem;
}

.total-value {
  color: #667eea !important;
  font-size: 16px !important;
  font-weight: 700 !important;
}

/* Verification Section Styles */
.verification-section {
  text-align: center;
  padding: 2rem 0;
}

.verification-title {
  font-size: 20px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 0.5rem;
}

.verification-subtitle {
  font-size: 14px;
  color: #6c757d;
  margin-bottom: 1.5rem;
}

.code-input {
  text-align: center;
  font-size: 24px;
  font-weight: 700;
  letter-spacing: 8px;
  max-width: 200px;
  margin: 0 auto;
}

.timer-text {
  font-size: 13px;
  color: #6c757d;
  margin-top: 1rem;
}

.btn-link {
  background: transparent;
  border: none;
  color: #667eea;
  font-weight: 600;
  cursor: pointer;
  text-decoration: underline;
  padding: 0.5rem 1rem;
  font-size: 14px;
}

.btn-link:hover {
  color: #764ba2;
}

/* Mobile optimizations */
@media (max-width: 576px) {
  .register-wrapper {
    padding: 1rem;
  }

  .register-card {
    padding: 1.5rem;
    border-radius: 20px;
  }

  .logo {
    height: 50px;
  }

  .progress-steps {
    margin-bottom: 1.5rem;
  }

  .step-circle {
    width: 32px;
    height: 32px;
    font-size: 12px;
  }

  .step-label {
    font-size: 9px;
  }

  .register-title {
    font-size: 20px;
  }

  .register-subtitle {
    font-size: 13px;
  }

  .form-navigation {
    flex-direction: column-reverse;
  }

  .package-info-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .product-card {
    padding: 0.75rem;
    gap: 0.75rem;
  }

  .product-image-container {
    width: 60px;
    height: 60px;
  }

  .product-image-placeholder {
    font-size: 24px;
  }

  .product-name {
    font-size: 14px;
    -webkit-line-clamp: 2;
    line-clamp: 2;
  }

  .product-description {
    font-size: 12px;
  }

  .product-price {
    font-size: 14px;
  }

  .product-actions {
    flex-shrink: 0;
  }

  .quantity-controls {
    gap: 0.25rem;
  }

  .quantity-btn {
    width: 28px;
    height: 28px;
  }

  .quantity-value {
    min-width: 25px;
    font-size: 13px;
  }

  .add-product-btn,
  .remove-product-btn {
    width: 36px;
    height: 36px;
  }
}
</style>
