<template>
  <div 
    class="min-h-screen flex items-center justify-center p-4 relative bg-cover bg-center"
    :style="{ backgroundImage: `url(${butuanBg})` }"
  >
    <!-- Overlay with brown tint -->
    <div class="absolute inset-0 bg-gradient-to-br from-amber-900/70 to-amber-800/60"></div>
    
    <div class="w-full max-w-md relative z-10">
      <!-- Logo and Title -->
      <div class="text-center mb-8">
        <div class="flex justify-center mb-4">
          <div class="w-16 h-16 bg-gradient-to-r from-amber-800 to-amber-700 rounded-xl flex items-center justify-center shadow-lg backdrop-blur-sm bg-white/10 border border-amber-300/20">
            <font-awesome-icon icon="scale-balanced" class="text-3xl text-white" />
          </div>
        </div>
        <h1 class="text-3xl font-bold text-white mb-2 drop-shadow-lg">Butuan City Legal Information System</h1>
        <p class="text-amber-100 drop-shadow-md">Sign in to your account</p>
      </div>

      <!-- Login Card with glass morphism effect -->
      <div class="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-amber-200/30 p-8">
        <!-- Error Message -->
        <div v-if="error" class="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl">
          <div class="flex items-center gap-3">
            <font-awesome-icon icon="circle-exclamation" class="text-red-500" />
            <p class="text-red-700 text-sm">{{ error }}</p>
          </div>
        </div>

        <!-- Form -->
        <div class="space-y-4">
          <!-- Email Input -->
          <div>
            <label for="email" class="block text-sm font-medium text-amber-900 mb-1">
              Email
            </label>
            <div class="relative">
              <font-awesome-icon icon="envelope" class="absolute left-4 top-1/2 -translate-y-1/2 text-amber-600" />
              <input
                type="email"
                id="email"
                v-model="email"
                @keyup.enter="handleLogin"
                class="w-full pl-12 pr-4 py-3 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-amber-50/80"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <!-- Password Input -->
          <div>
            <label for="password" class="block text-sm font-medium text-amber-900 mb-1">
              Password
            </label>
            <div class="relative">
              <font-awesome-icon icon="lock" class="absolute left-4 top-1/2 -translate-y-1/2 text-amber-600" />
              <input
                :type="showPassword ? 'text' : 'password'"
                id="password"
                v-model="password"
                @keyup.enter="handleLogin"
                class="w-full pl-12 pr-12 py-3 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-amber-50/80"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-4 top-1/2 -translate-y-1/2 text-amber-600 hover:text-amber-800"
              >
                <font-awesome-icon :icon="showPassword ? 'eye-slash' : 'eye'" />
              </button>
            </div>
          </div>

          <!-- Remember Me Checkbox -->
          <div class="flex items-center">
            <input
              type="checkbox"
              id="remember"
              v-model="rememberMe"
              class="w-4 h-4 text-amber-600 rounded border-amber-300 focus:ring-amber-500"
            />
            <label for="remember" class="ml-2 text-sm text-amber-900">
              Remember me
            </label>
          </div>

          <!-- Sign In Button -->
          <button
            @click="handleLogin"
            :disabled="loading"
            class="w-full bg-gradient-to-r from-amber-700 to-amber-800 hover:from-amber-800 hover:to-amber-900 text-white font-semibold py-3.5 rounded-lg flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed mt-4"
          >
            <font-awesome-icon v-if="loading" icon="circle-notch" class="animate-spin" />
            <font-awesome-icon v-else icon="right-to-bracket" />
            {{ loading ? 'Signing In...' : 'Sign In' }}
          </button>
        </div>

        <!-- Register Link -->
        <div class="mt-8 pt-6 border-t border-amber-200 text-center">
          <p class="text-amber-700">
            Don't have an account?
            <router-link to="/register" class="text-amber-800 hover:text-amber-900 font-medium ml-1 hover:underline">
              Register
            </router-link>
          </p>
        </div>

        <!-- Admin Demo Account Only -->
        <div class="mt-6 pt-6 border-t border-amber-200">
          <p class="text-sm font-medium text-amber-800 mb-3 flex items-center gap-2">
            <font-awesome-icon icon="circle-info" class="text-amber-600" />
            Admin Demo Account:
          </p>
          
          <!-- Admin Demo -->
          <div 
            @click="fillAdminAccount()"
            class="flex items-center justify-between p-3 bg-amber-50/80 rounded-lg hover:bg-amber-100/90 cursor-pointer transition-colors border border-amber-200 hover:border-amber-300"
          >
            <div class="flex items-center gap-2">
              <font-awesome-icon icon="user-shield" class="text-amber-600" />
              <span class="font-medium text-amber-800">Admin:</span>
            </div>
            <div class="text-right">
              <span class="text-amber-700 font-medium">admin@demo.com</span>
              <span class="text-amber-500 mx-1">/</span>
              <span class="font-semibold text-amber-900">demo123</span>
            </div>
          </div>

          <!-- Quick Fill Button -->
          <button
            @click="fillAdminAccount()"
            class="w-full mt-3 text-xs bg-amber-100 hover:bg-amber-200 text-amber-700 py-2 rounded-lg transition-colors border border-amber-300 font-medium"
          >
            Fill Admin Account
          </button>
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
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { api } from '@/services/api'
import butuanBg from '@/assets/butuan.jpg'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)
const error = ref('')
const rememberMe = ref(false)

// Quick-fill admin credentials (real admin user in DB)
const adminAccount = {
  email: 'admin@butuan.gov',      // <-- your real admin email
  password: 'yourAdminPassword',  // <-- your real admin password
}

const fillAdminAccount = () => {
  email.value = adminAccount.email
  password.value = adminAccount.password
  error.value = ''
}

const handleLogin = async () => {
  try {
    loading.value = true
    error.value = ''

    // Real API login for all users (admin / client / lawyer)
    const response = await api.post('/login', {
      email: email.value,
      password: password.value,
    })

    const user = response.user
    const token = response.token

    // Map lawyer license to barNumber for frontend
    if (user.role === 'lawyer' && user.lawyer_profile) {
      user.barNumber = user.lawyer_profile.license_no
    }

    // Block pending lawyers on frontend too (backend already returns 403)
    if (user.role === 'lawyer' && user.status !== 'approved') {
      error.value = 'Your lawyer account is pending admin approval. Please wait for activation.'
      return
    }

    if (!token) {
      error.value = 'Login failed: no token returned.'
      return
    }

    // Save auth state
    authStore.token = token
    authStore.user = user
    authStore.isAuthenticated = true
    localStorage.setItem('auth_token', token)
    localStorage.setItem('user', JSON.stringify(user))

    if (rememberMe.value) {
      localStorage.setItem('isAuthenticated', 'true')
    } else {
      localStorage.removeItem('isAuthenticated')
    }

    // Redirect based on role
    switch (user.role.toLowerCase()) {
      case 'client':
        router.push('/client/dashboard')
        break
      case 'lawyer':
        router.push('/lawyer/dashboard')
        break
      case 'admin':
        router.push('/admin/dashboard')
        break
      default:
        router.push('/')
    }
  } catch (err) {
    console.error('Login failed:', err)
    error.value =
      err.status === 401
        ? 'Invalid credentials. Please check your email and password.'
        : err.status === 403
        ? 'Your account is pending admin approval. Please wait for activation.'
        : err.message || 'Login failed. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>

