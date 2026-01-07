<template>
  <div 
    class="min-h-screen flex items-center justify-center p-4 relative bg-cover bg-center"
    :style="{ backgroundImage: `url(${butuanBg})` }"
  >
    <!-- Overlay with brown tint -->
    <div class="absolute inset-0 bg-gradient-to-br from-amber-900/70 to-amber-800/60"></div>
    
    <div class="w-full max-w-3xl relative z-10">
      <!-- Logo and Title -->
      <div class="text-center mb-8">
        <div class="flex justify-center mb-4">
          <div class="w-16 h-16 bg-gradient-to-r from-amber-800 to-amber-700 rounded-xl flex items-center justify-center shadow-lg backdrop-blur-sm bg-white/10 border border-amber-300/20">
            <font-awesome-icon icon="scale-balanced" class="text-3xl text-white" />
          </div>
        </div>
        <h1 class="text-3xl font-bold text-white mb-2 drop-shadow-lg">Butuan City Legal Information System</h1>
        <p class="text-amber-100 drop-shadow-md">Create your account</p>
      </div>

      <!-- Register Card -->
      <div class="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-amber-200/30 p-8">
        <!-- Success Message -->
        <div v-if="successMessage" class="mb-4 p-4 bg-green-50 border border-green-200 rounded-xl">
          <div class="flex items-center gap-3">
            <font-awesome-icon icon="check-circle" class="text-green-500" />
            <div class="flex-1">
              <p class="text-green-700 text-sm font-medium">{{ successMessage }}</p>
              <p class="text-green-600 text-xs mt-1">Redirecting to login...</p>
            </div>
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl">
          <div class="flex items-center gap-3">
            <font-awesome-icon icon="circle-exclamation" class="text-red-500" />
            <p class="text-red-700 text-sm">{{ error }}</p>
          </div>
        </div>

        <!-- Role Selection (Step 1) -->
        <div v-if="step === 1" class="space-y-6">
          <div class="text-center mb-6">
            <h2 class="text-2xl font-bold text-gray-800 mb-2">Choose Your Role</h2>
            <p class="text-gray-600">Select how you want to register</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Client Registration Card -->
            <div 
              @click="selectRole('client')"
              class="p-6 border-2 border-amber-200 rounded-xl hover:border-amber-500 hover:bg-amber-50 cursor-pointer transition-all group"
            >
              <div class="text-center">
                <div class="w-20 h-20 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                  <font-awesome-icon icon="user-tie" class="text-4xl text-blue-600" />
                </div>
                <h3 class="text-xl font-bold text-gray-800 mb-2">Client</h3>
                <p class="text-sm text-gray-600 mb-4">Register as a client to access legal services and case management</p>
                <ul class="text-xs text-gray-500 space-y-1 text-left">
                  <li>✓ Quick registration</li>
                  <li>✓ Browse and hire lawyers</li>
                  <li>✓ Track your cases</li>
                  <li>✓ Secure document storage</li>
                </ul>
              </div>
            </div>

            <!-- Lawyer Registration Card -->
            <div 
              @click="selectRole('lawyer')"
              class="p-6 border-2 border-amber-200 rounded-xl hover:border-amber-500 hover:bg-amber-50 cursor-pointer transition-all group"
            >
              <div class="text-center">
                <div class="w-20 h-20 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                  <font-awesome-icon icon="scale-balanced" class="text-4xl text-purple-600" />
                </div>
                <h3 class="text-xl font-bold text-gray-800 mb-2">Lawyer</h3>
                <p class="text-sm text-gray-600 mb-4">Register as a lawyer to offer legal services and manage clients</p>
                <ul class="text-xs text-gray-500 space-y-1 text-left">
                  <li>✓ Professional verification</li>
                  <li>✓ Manage multiple clients</li>
                  <li>✓ Case management tools</li>
                  <li>✓ Professional profile</li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Back to Login -->
          <div class="text-center pt-4">
            <router-link to="/login" class="text-amber-700 hover:text-amber-900 text-sm">
              <font-awesome-icon icon="arrow-left" class="mr-2" />
              Back to Login
            </router-link>
          </div>
        </div>

        <!-- Client Registration Form (Step 2 - Client) -->
        <form v-if="step === 2 && formData.role === 'client'" @submit.prevent="handleRegister" class="space-y-4">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-bold text-gray-800">Client Registration</h2>
            <button type="button" @click="step = 1" class="text-amber-700 hover:text-amber-900 text-sm">
              <font-awesome-icon icon="arrow-left" class="mr-1" />
              Change Role
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Full Name -->
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700 mb-1">
                Full Name <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <font-awesome-icon icon="user" class="absolute left-4 top-1/2 -translate-y-1/2 text-amber-600" />
                <input
                  type="text"
                  id="name"
                  v-model="formData.name"
                  class="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  placeholder="Enter your full name"
                  required
                />
              </div>
            </div>

            <!-- Email -->
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
                Email <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <font-awesome-icon icon="envelope" class="absolute left-4 top-1/2 -translate-y-1/2 text-amber-600" />
                <input
                  type="email"
                  id="email"
                  v-model="formData.email"
                  class="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <!-- Phone -->
            <div>
              <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">
                Phone Number <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <font-awesome-icon icon="phone" class="absolute left-4 top-1/2 -translate-y-1/2 text-amber-600" />
                <input
                  type="tel"
                  id="phone"
                  v-model="formData.phone"
                  class="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  placeholder="+63 912 345 6789"
                  required
                />
              </div>
            </div>

            <!-- Date of Birth -->
            <div>
              <label for="dob" class="block text-sm font-medium text-gray-700 mb-1">
                Date of Birth <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <font-awesome-icon icon="calendar" class="absolute left-4 top-1/2 -translate-y-1/2 text-amber-600" />
                <input
                  type="date"
                  id="dob"
                  v-model="formData.dateOfBirth"
                  class="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  required
                />
              </div>
            </div>

            <!-- Password -->
            <div>
              <label for="password" class="block text-sm font-medium text-gray-700 mb-1">
                Password <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <font-awesome-icon icon="lock" class="absolute left-4 top-1/2 -translate-y-1/2 text-amber-600" />
                <input
                  :type="showPassword ? 'text' : 'password'"
                  id="password"
                  v-model="formData.password"
                  class="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  placeholder="Enter password"
                  required
                />
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  <font-awesome-icon :icon="showPassword ? 'eye-slash' : 'eye'" />
                </button>
              </div>
              <p class="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
            </div>

            <!-- Confirm Password -->
            <div>
              <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <font-awesome-icon icon="lock" class="absolute left-4 top-1/2 -translate-y-1/2 text-amber-600" />
                <input
                  :type="showConfirmPassword ? 'text' : 'password'"
                  id="confirmPassword"
                  v-model="formData.confirmPassword"
                  class="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  placeholder="Confirm password"
                  required
                />
                <button
                  type="button"
                  @click="showConfirmPassword = !showConfirmPassword"
                  class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  <font-awesome-icon :icon="showConfirmPassword ? 'eye-slash' : 'eye'" />
                </button>
              </div>
            </div>
          </div>

          <!-- Address -->
          <div>
            <label for="address" class="block text-sm font-medium text-gray-700 mb-1">
              Address <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <font-awesome-icon icon="location-dot" class="absolute left-4 top-4 text-amber-600" />
              <textarea
                id="address"
                v-model="formData.address"
                rows="3"
                class="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                placeholder="Enter your complete address"
                required
              ></textarea>
            </div>
          </div>

          <!-- Terms -->
          <div class="flex items-start">
            <input
              type="checkbox"
              id="terms"
              v-model="formData.acceptTerms"
              class="w-4 h-4 text-amber-600 rounded border-gray-300 focus:ring-amber-500 mt-1"
              required
            />
            <label for="terms" class="ml-2 text-sm text-gray-700">
              I agree to the <a href="#" class="text-amber-800 hover:underline font-medium">Terms and Conditions</a>
            </label>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3.5 rounded-lg flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <font-awesome-icon v-if="loading" icon="circle-notch" class="animate-spin" />
            <font-awesome-icon v-else icon="user-plus" />
            {{ loading ? 'Creating Account...' : 'Create Client Account' }}
          </button>
        </form>

        <!-- Lawyer Registration Form (Step 2 - Lawyer) -->
        <form v-if="step === 2 && formData.role === 'lawyer'" @submit.prevent="handleRegister" class="space-y-4">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-bold text-gray-800">Lawyer Registration</h2>
            <button type="button" @click="step = 1" class="text-amber-700 hover:text-amber-900 text-sm">
              <font-awesome-icon icon="arrow-left" class="mr-1" />
              Change Role
            </button>
          </div>

          <!-- Notice -->
          <div class="p-4 bg-purple-50 border border-purple-200 rounded-lg mb-4">
            <div class="flex gap-3">
              <font-awesome-icon icon="circle-info" class="text-purple-600 mt-1" />
              <div class="text-sm text-purple-800">
                <p class="font-medium mb-1">Professional Verification Required</p>
                <p class="text-xs">Your application will be reviewed by our admin team. Please provide accurate professional information.</p>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Full Name -->
            <div>
              <label for="lawyerName" class="block text-sm font-medium text-gray-700 mb-1">
                Full Name <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <font-awesome-icon icon="user" class="absolute left-4 top-1/2 -translate-y-1/2 text-purple-600" />
                <input
                  type="text"
                  id="lawyerName"
                  v-model="formData.name"
                  class="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Attorney [Your Name]"
                  required
                />
              </div>
            </div>

            <!-- Email -->
            <div>
              <label for="lawyerEmail" class="block text-sm font-medium text-gray-700 mb-1">
                Professional Email <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <font-awesome-icon icon="envelope" class="absolute left-4 top-1/2 -translate-y-1/2 text-purple-600" />
                <input
                  type="email"
                  id="lawyerEmail"
                  v-model="formData.email"
                  class="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="your.name@lawfirm.com"
                  required
                />
              </div>
            </div>

            <!-- Phone -->
            <div>
              <label for="lawyerPhone" class="block text-sm font-medium text-gray-700 mb-1">
                Contact Number <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <font-awesome-icon icon="phone" class="absolute left-4 top-1/2 -translate-y-1/2 text-purple-600" />
                <input
                  type="tel"
                  id="lawyerPhone"
                  v-model="formData.phone"
                  class="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="+63 912 345 6789"
                  required
                />
              </div>
            </div>

            <!-- Bar Number -->
            <div>
              <label for="barNumber" class="block text-sm font-medium text-gray-700 mb-1">
                PRC/Bar Number <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <font-awesome-icon icon="id-card" class="absolute left-4 top-1/2 -translate-y-1/2 text-purple-600" />
                <input
                  type="text"
                  id="barNumber"
                  v-model="formData.barNumber"
                  class="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Enter your Bar/PRC number"
                  required
                />
              </div>
            </div>

            <!-- Law Firm/Office -->
            <div>
              <label for="lawFirm" class="block text-sm font-medium text-gray-700 mb-1">
                Law Firm/Office <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <font-awesome-icon icon="building" class="absolute left-4 top-1/2 -translate-y-1/2 text-purple-600" />
                <input
                  type="text"
                  id="lawFirm"
                  v-model="formData.lawFirm"
                  class="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Your law firm or independent practice"
                  required
                />
              </div>
            </div>

            <!-- Years of Practice -->
            <div>
              <label for="yearsOfPractice" class="block text-sm font-medium text-gray-700 mb-1">
                Years of Practice <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <font-awesome-icon icon="briefcase" class="absolute left-4 top-1/2 -translate-y-1/2 text-purple-600" />
                <input
                  type="number"
                  id="yearsOfPractice"
                  v-model="formData.yearsOfPractice"
                  min="0"
                  class="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Years"
                  required
                />
              </div>
            </div>

            <!-- Password -->
            <div>
              <label for="lawyerPassword" class="block text-sm font-medium text-gray-700 mb-1">
                Password <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <font-awesome-icon icon="lock" class="absolute left-4 top-1/2 -translate-y-1/2 text-purple-600" />
                <input
                  :type="showPassword ? 'text' : 'password'"
                  id="lawyerPassword"
                  v-model="formData.password"
                  class="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Enter password"
                  required
                />
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  <font-awesome-icon :icon="showPassword ? 'eye-slash' : 'eye'" />
                </button>
              </div>
              <p class="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
            </div>

            <!-- Confirm Password -->
            <div>
              <label for="lawyerConfirmPassword" class="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <font-awesome-icon icon="lock" class="absolute left-4 top-1/2 -translate-y-1/2 text-purple-600" />
                <input
                  :type="showConfirmPassword ? 'text' : 'password'"
                  id="lawyerConfirmPassword"
                  v-model="formData.confirmPassword"
                  class="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Confirm password"
                  required
                />
                <button
                  type="button"
                  @click="showConfirmPassword = !showConfirmPassword"
                  class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  <font-awesome-icon :icon="showConfirmPassword ? 'eye-slash' : 'eye'" />
                </button>
              </div>
            </div>
          </div>

          <!-- Specialization -->
          <div>
            <label for="specialization" class="block text-sm font-medium text-gray-700 mb-1">
              Specialization/Practice Areas <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <font-awesome-icon icon="gavel" class="absolute left-4 top-4 text-purple-600" />
              <textarea
                id="specialization"
                v-model="formData.specialization"
                rows="2"
                class="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="e.g., Criminal Law, Family Law, Corporate Law"
                required
              ></textarea>
            </div>
          </div>

          <!-- Office Address -->
          <div>
            <label for="lawyerAddress" class="block text-sm font-medium text-gray-700 mb-1">
              Office Address <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <font-awesome-icon icon="location-dot" class="absolute left-4 top-4 text-purple-600" />
              <textarea
                id="lawyerAddress"
                v-model="formData.address"
                rows="3"
                class="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Enter your law office address"
                required
              ></textarea>
            </div>
          </div>

          <!-- Terms -->
          <div class="flex items-start">
            <input
              type="checkbox"
              id="lawyerTerms"
              v-model="formData.acceptTerms"
              class="w-4 h-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500 mt-1"
              required
            />
            <label for="lawyerTerms" class="ml-2 text-sm text-gray-700">
              I certify that all information provided is accurate and I agree to the <a href="#" class="text-purple-800 hover:underline font-medium">Terms and Conditions</a> and <a href="#" class="text-purple-800 hover:underline font-medium">Professional Code of Conduct</a>
            </label>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-3.5 rounded-lg flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <font-awesome-icon v-if="loading" icon="circle-notch" class="animate-spin" />
            <font-awesome-icon v-else icon="scale-balanced" />
            {{ loading ? 'Submitting Application...' : 'Submit Lawyer Application' }}
          </button>

          <p class="text-xs text-center text-gray-500 mt-2">
            Your application will be reviewed within 24-48 hours
          </p>
        </form>

        <!-- Login Link -->
        <div v-if="step === 2" class="mt-6 pt-6 border-t border-gray-200 text-center">
          <p class="text-gray-700">
            Already have an account?
            <router-link to="/login" class="text-amber-800 hover:text-amber-900 font-medium ml-1 hover:underline">
              Sign In
            </router-link>
          </p>
        </div>
      </div>

      <!-- Footer -->
      <div class="mt-6 text-center text-xs text-amber-100 drop-shadow-md">
        <p>© 2024 Butuan City Legal Information System. All rights reserved.</p>
        <p class="text-amber-200/80 mt-1">v1.0.0</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import butuanBg from '@/assets/butuan.jpg'
import { api } from '@/services/api' // ✅ ADD THIS IMPORT

const router = useRouter()

const step = ref(1)
const loading = ref(false)
const error = ref('')
const successMessage = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)

const formData = reactive({
  role: '',
  name: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  address: '',
  acceptTerms: false,
  // Client specific
  dateOfBirth: '',
  // Lawyer specific
  barNumber: '',
  lawFirm: '',
  yearsOfPractice: '',
  specialization: ''
})

const selectRole = (role) => {
  formData.role = role
  step.value = 2
  error.value = ''
}

// ✅ UPDATED FUNCTION TO USE API
const handleRegister = async () => {
  try {
    loading.value = true
    error.value = ''

    // Validate password length
    if (formData.password.length < 6) {
      error.value = 'Password must be at least 6 characters long'
      return
    }

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      error.value = 'Passwords do not match'
      return
    }

    // Prepare data to send to API
    const registrationData = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      password_confirmation: formData.confirmPassword, // Laravel expects this
      role: formData.role,
      address: formData.address
    }

    
    // Add role-specific fields
if (formData.role === 'client') {
  // backend doesn’t use date_of_birth in Option A, you can omit this if you want
  registrationData.date_of_birth = formData.dateOfBirth
} else if (formData.role === 'lawyer') {
  registrationData.specialization = formData.specialization;
  registrationData.license_no    = formData.barNumber;       // must match backend
  registrationData.availability  = formData.yearsOfPractice; // or another value you want
}


    // ✅ SEND TO LARAVEL API
    const response = await api.post('/register', registrationData)

    // Show success message
    if (formData.role === 'lawyer') {
      successMessage.value = 'Application submitted successfully! Your account will be activated after admin review.'
    } else {
      successMessage.value = 'Account created successfully!'
    }

    // Redirect to login after 3 seconds
    setTimeout(() => {
      router.push('/login')
    }, 3000)

  } catch (err) {
    console.error('Registration failed:', err)
    
    // Handle validation errors
    if (err.status === 422 && err.errors) {
      // Display first validation error
      const firstError = Object.values(err.errors)[0]
      error.value = Array.isArray(firstError) ? firstError[0] : firstError
    } else {
      error.value = err.message || 'Registration failed. Please try again.'
    }
  } finally {
    loading.value = false
  }
}
</script>