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
        <p class="text-amber-100 drop-shadow-md">Create your account</p>
      </div>

      <!-- Registration Form Card -->
      <div class="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-amber-200/30 p-6">
        <h2 class="text-2xl font-bold text-amber-900 mb-2 text-center">Create Account</h2>
        <p class="text-amber-700 text-sm mb-6 text-center">Sign up to get started</p>

        <!-- Error Message -->
        <div v-if="error" class="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl">
          <div class="flex items-center gap-3">
            <font-awesome-icon icon="circle-exclamation" class="text-red-500" />
            <p class="text-red-700 text-sm">{{ error }}</p>
          </div>
        </div>

        <!-- Success Message -->
        <div v-if="success" class="mb-4 p-4 bg-green-50 border border-green-200 rounded-xl">
          <div class="flex items-center gap-3">
            <font-awesome-icon icon="circle-check" class="text-green-500" />
            <p class="text-green-700 text-sm">{{ success }}</p>
          </div>
        </div>

        <form @submit.prevent="handleRegister">
          <!-- Full Name -->
          <div class="mb-4">
            <label class="block text-amber-900 text-sm font-semibold mb-2">
              Full Name
            </label>
            <div class="relative">
              <font-awesome-icon icon="user" class="absolute left-4 top-4 text-amber-600" />
              <input
                v-model="formData.name"
                type="text"
                placeholder="Enter your full name"
                required
                class="w-full pl-11 pr-4 py-3 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-amber-50/80 text-amber-900 placeholder-amber-400"
              />
            </div>
          </div>

          <!-- Email -->
          <div class="mb-4">
            <label class="block text-amber-900 text-sm font-semibold mb-2">
              Email Address
            </label>
            <div class="relative">
              <font-awesome-icon icon="envelope" class="absolute left-4 top-4 text-amber-600" />
              <input
                v-model="formData.email"
                type="email"
                placeholder="Enter your email"
                required
                class="w-full pl-11 pr-4 py-3 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-amber-50/80 text-amber-900 placeholder-amber-400"
              />
            </div>
          </div>

          <!-- Phone Number -->
          <div class="mb-4">
            <label class="block text-amber-900 text-sm font-semibold mb-2">
              Phone Number
            </label>
            <div class="relative">
              <font-awesome-icon icon="phone" class="absolute left-4 top-4 text-amber-600" />
              <input
                v-model="formData.phone"
                type="tel"
                placeholder="Enter your phone number"
                required
                class="w-full pl-11 pr-4 py-3 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-amber-50/80 text-amber-900 placeholder-amber-400"
              />
            </div>
          </div>

          <!-- Password -->
          <div class="mb-4">
            <label class="block text-amber-900 text-sm font-semibold mb-2">
              Password
            </label>
            <div class="relative">
              <font-awesome-icon icon="lock" class="absolute left-4 top-4 text-amber-600" />
              <input
                v-model="formData.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Create a password"
                required
                minlength="6"
                class="w-full pl-11 pr-12 py-3 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-amber-50/80 text-amber-900 placeholder-amber-400"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3 top-3 text-amber-600 hover:text-amber-800"
              >
                <font-awesome-icon :icon="showPassword ? 'eye-slash' : 'eye'" class="text-lg" />
              </button>
            </div>
          </div>

          <!-- Confirm Password -->
          <div class="mb-6">
            <label class="block text-amber-900 text-sm font-semibold mb-2">
              Confirm Password
            </label>
            <div class="relative">
              <font-awesome-icon icon="lock" class="absolute left-4 top-4 text-amber-600" />
              <input
                v-model="formData.confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                placeholder="Confirm your password"
                required
                minlength="6"
                class="w-full pl-11 pr-12 py-3 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-amber-50/80 text-amber-900 placeholder-amber-400"
              />
              <button
                type="button"
                @click="showConfirmPassword = !showConfirmPassword"
                class="absolute right-3 top-3 text-amber-600 hover:text-amber-800"
              >
                <font-awesome-icon :icon="showConfirmPassword ? 'eye-slash' : 'eye'" class="text-lg" />
              </button>
            </div>
          </div>

          <!-- Role Selection -->
          <div class="mb-6">
            <label class="block text-amber-900 text-sm font-semibold mb-3">
              Register As
            </label>
            <div class="grid grid-cols-2 gap-3">
              <button
                type="button"
                @click="formData.role = 'client'"
                :class="[
                  'p-4 border-2 rounded-lg transition-all',
                  formData.role === 'client'
                    ? 'border-amber-500 bg-amber-50'
                    : 'border-amber-300 hover:border-amber-400 hover:bg-amber-50/50'
                ]"
              >
                <font-awesome-icon icon="user-tie" :class="[
                  'text-3xl mb-2',
                  formData.role === 'client' ? 'text-amber-700' : 'text-amber-600'
                ]" />
                <p class="text-sm font-semibold text-amber-900">Client</p>
                <p class="text-xs text-amber-700">Seeking legal help</p>
              </button>

              <button
                type="button"
                @click="formData.role = 'lawyer'"
                :class="[
                  'p-4 border-2 rounded-lg transition-all',
                  formData.role === 'lawyer'
                    ? 'border-amber-500 bg-amber-50'
                    : 'border-amber-300 hover:border-amber-400 hover:bg-amber-50/50'
                ]"
              >
                <font-awesome-icon icon="scale-balanced" :class="[
                  'text-3xl mb-2',
                  formData.role === 'lawyer' ? 'text-amber-700' : 'text-amber-600'
                ]" />
                <p class="text-sm font-semibold text-amber-900">Lawyer</p>
                <p class="text-xs text-amber-700">Providing services</p>
              </button>
            </div>
          </div>

          <!-- Terms and Conditions -->
          <div class="mb-6">
            <label class="flex items-start gap-2 cursor-pointer">
              <input
                v-model="formData.agreeToTerms"
                type="checkbox"
                required
                class="mt-1 w-4 h-4 text-amber-600 border-amber-300 rounded focus:ring-amber-500"
              />
              <span class="text-xs text-amber-700">
                I agree to the 
                <a href="#" class="text-amber-700 font-semibold hover:text-amber-800 hover:underline">Terms and Conditions</a>
                and 
                <a href="#" class="text-amber-700 font-semibold hover:text-amber-800 hover:underline">Privacy Policy</a>
              </span>
            </label>
          </div>

          <!-- Register Button -->
          <button
            type="submit"
            :disabled="loading"
            class="w-full py-3.5 bg-gradient-to-r from-amber-700 to-amber-800 hover:from-amber-800 hover:to-amber-900 text-white rounded-lg font-semibold transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <font-awesome-icon v-if="loading" icon="circle-notch" class="animate-spin" />
            <font-awesome-icon v-else icon="user-plus" />
            {{ loading ? 'Creating Account...' : 'Create Account' }}
          </button>
        </form>

        <!-- Login Link -->
        <div class="mt-6 pt-6 border-t border-amber-200 text-center">
          <p class="text-sm text-amber-700">
            Already have an account?
            <router-link to="/login" class="text-amber-800 hover:text-amber-900 font-semibold ml-1 hover:underline inline-flex items-center gap-1">
              Login here
              <font-awesome-icon icon="arrow-right" class="text-xs" />
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
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import butuanBg from '@/assets/butuan.jpg'; // Import the background image

const router = useRouter();

const formData = ref({
  name: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  role: 'client',
  agreeToTerms: false
});

const showPassword = ref(false);
const showConfirmPassword = ref(false);
const loading = ref(false);
const error = ref('');
const success = ref('');

const handleRegister = async () => {
  try {
    loading.value = true;
    error.value = '';
    success.value = '';

    // Validation
    if (formData.value.password !== formData.value.confirmPassword) {
      error.value = 'Passwords do not match!';
      loading.value = false;
      return;
    }

    if (formData.value.password.length < 6) {
      error.value = 'Password must be at least 6 characters long!';
      loading.value = false;
      return;
    }

    if (!formData.value.agreeToTerms) {
      error.value = 'You must agree to the Terms and Conditions!';
      loading.value = false;
      return;
    }

    // For frontend-only: simulate registration
    console.log('Registration data:', formData.value);
    
    success.value = 'Account created successfully! Redirecting to login...';

    // Store user data in localStorage for demo purposes
    const userData = {
      name: formData.value.name,
      email: formData.value.email,
      phone: formData.value.phone,
      role: formData.value.role,
      created: new Date().toISOString()
    };
    localStorage.setItem('registeredUser', JSON.stringify(userData));

    // Redirect to login after 2 seconds
    setTimeout(() => {
      router.push('/login');
    }, 2000);

  } catch (err) {
    error.value = err.response?.data?.message || 'Registration failed. Please try again.';
    console.error('Registration error:', err);
  } finally {
    loading.value = false;
  }
};
</script>