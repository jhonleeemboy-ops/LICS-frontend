<template>
  <div 
    v-if="show"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" 
    @click.self="$emit('close')"
  >
    <div class="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-xl font-bold text-gray-800">Book Appointment</h3>
        <button @click="$emit('close')" class="text-gray-500 hover:text-gray-700">
          <font-awesome-icon icon="xmark" class="text-2xl" />
        </button>
      </div>

      <!-- Success Message -->
      <div v-if="successMessage" class="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
        <div class="flex items-center gap-2">
          <font-awesome-icon icon="check-circle" class="text-green-500" />
          <p class="text-green-700 text-sm">{{ successMessage }}</p>
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="errorMessage" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
        <div class="flex items-center gap-2">
          <font-awesome-icon icon="circle-exclamation" class="text-red-500" />
          <p class="text-red-700 text-sm">{{ errorMessage }}</p>
        </div>
      </div>
      
      <form @submit.prevent="submitBooking">
        <div class="space-y-4">
          <!-- Category -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              Legal Category <span class="text-red-500">*</span>
            </label>
            <select 
              v-model="formData.category" 
              required 
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none"
            >
              <option value="">Select a category</option>
              <option value="Public Health & Safety">Public Health & Safety</option>
              <option value="Land Use & Zoning">Land Use & Zoning</option>
              <option value="Environment & Natural Resources">Environment & Natural Resources</option>
              <option value="Business & Commerce">Business & Commerce</option>
              <option value="Traffic & Transportation">Traffic & Transportation</option>
              <option value="Community & Social Services">Community & Social Services</option>
              <option value="Family Law">Family Law</option>
              <option value="Criminal Law">Criminal Law</option>
              <option value="Labor & Employment">Labor & Employment</option>
            </select>
          </div>

          <!-- Preferred Lawyer (Optional) -->
          <div v-if="formData.category && availableLawyers.length > 0">
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              Preferred Lawyer (Optional)
            </label>
            <select 
              v-model="formData.lawyer"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none"
            >
              <option value="">Any available lawyer</option>
              <option v-for="lawyer in availableLawyers" :key="lawyer.id" :value="lawyer.name">
                {{ lawyer.name }} - {{ lawyer.specialization }}
              </option>
            </select>
          </div>

          <!-- Contact Name -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              Your Name <span class="text-red-500">*</span>
            </label>
            <input 
              v-model="formData.clientName" 
              type="text" 
              required 
              placeholder="Enter your full name"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none" 
            />
          </div>

          <!-- Contact Phone -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              Phone Number <span class="text-red-500">*</span>
            </label>
            <input 
              v-model="formData.clientPhone" 
              type="tel" 
              required 
              placeholder="+63 912 345 6789"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none" 
            />
          </div>

          <!-- Contact Email -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              Email Address <span class="text-red-500">*</span>
            </label>
            <input 
              v-model="formData.clientEmail" 
              type="email" 
              required 
              placeholder="your@email.com"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none" 
            />
          </div>
          
          <!-- Date -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              Preferred Date <span class="text-red-500">*</span>
            </label>
            <input 
              v-model="formData.date" 
              type="date" 
              :min="minDate"
              required 
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none" 
            />
          </div>
          
          <!-- Time -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              Preferred Time <span class="text-red-500">*</span>
            </label>
            <select
              v-model="formData.time"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none"
            >
              <option value="">Select time</option>
              <option value="8:00 AM">8:00 AM</option>
              <option value="9:00 AM">9:00 AM</option>
              <option value="10:00 AM">10:00 AM</option>
              <option value="11:00 AM">11:00 AM</option>
              <option value="1:00 PM">1:00 PM</option>
              <option value="2:00 PM">2:00 PM</option>
              <option value="3:00 PM">3:00 PM</option>
              <option value="4:00 PM">4:00 PM</option>
              <option value="5:00 PM">5:00 PM</option>
            </select>
          </div>

          <!-- Consultation Type -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              Consultation Type <span class="text-red-500">*</span>
            </label>
            <div class="grid grid-cols-3 gap-2">
              <label 
                class="flex flex-col items-center p-3 border-2 rounded-lg cursor-pointer transition-colors"
                :class="formData.consultationType === 'in-person' ? 'border-amber-500 bg-amber-50' : 'border-gray-300 hover:border-amber-300'"
              >
                <input 
                  type="radio" 
                  v-model="formData.consultationType" 
                  value="in-person" 
                  class="sr-only"
                  required
                />
                <font-awesome-icon icon="building" class="text-xl mb-1" :class="formData.consultationType === 'in-person' ? 'text-amber-600' : 'text-gray-500'" />
                <span class="text-xs font-medium">In-Person</span>
              </label>

              <label 
                class="flex flex-col items-center p-3 border-2 rounded-lg cursor-pointer transition-colors"
                :class="formData.consultationType === 'online' ? 'border-amber-500 bg-amber-50' : 'border-gray-300 hover:border-amber-300'"
              >
                <input 
                  type="radio" 
                  v-model="formData.consultationType" 
                  value="online" 
                  class="sr-only"
                  required
                />
                <font-awesome-icon icon="video" class="text-xl mb-1" :class="formData.consultationType === 'online' ? 'text-amber-600' : 'text-gray-500'" />
                <span class="text-xs font-medium">Online</span>
              </label>

              <label 
                class="flex flex-col items-center p-3 border-2 rounded-lg cursor-pointer transition-colors"
                :class="formData.consultationType === 'phone' ? 'border-amber-500 bg-amber-50' : 'border-gray-300 hover:border-amber-300'"
              >
                <input 
                  type="radio" 
                  v-model="formData.consultationType" 
                  value="phone" 
                  class="sr-only"
                  required
                />
                <font-awesome-icon icon="phone" class="text-xl mb-1" :class="formData.consultationType === 'phone' ? 'text-amber-600' : 'text-gray-500'" />
                <span class="text-xs font-medium">Phone</span>
              </label>
            </div>
          </div>
          
          <!-- Notes -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              Brief Description
            </label>
            <textarea 
              v-model="formData.notes" 
              rows="3" 
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none" 
              placeholder="Briefly describe your legal concern..."
            ></textarea>
          </div>
        </div>
        
        <div class="flex gap-3 mt-6">
          <button 
            type="button" 
            @click="$emit('close')" 
            class="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            :disabled="loading"
            class="flex-1 px-4 py-3 bg-amber-700 text-white rounded-lg font-medium hover:bg-amber-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <font-awesome-icon v-if="loading" icon="circle-notch" class="animate-spin" />
            <span>{{ loading ? 'Booking...' : 'Book Now' }}</span>
          </button>
        </div>
      </form>

      <!-- Info Notice -->
      <div class="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <div class="flex gap-2 text-xs text-blue-700">
          <font-awesome-icon icon="circle-info" class="mt-0.5" />
          <p>Your appointment will be confirmed within 24 hours. You'll receive updates via email.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAppointmentStore } from '@/stores/appointment'
import { api } from '@/services/api'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'book'])

const router = useRouter()
const appointmentStore = useAppointmentStore()

const loading = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

const formData = ref({
  category: '',
  lawyer: '',
  clientName: '',
  clientPhone: '',
  clientEmail: '',
  date: '',
  time: '',
  consultationType: '',
  notes: '' 
})

// Get minimum date (tomorrow)
const minDate = computed(() => {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  return tomorrow.toISOString().split('T')[0]
})

// Get available lawyers based on selected category
const availableLawyers = computed(() => {
  if (!formData.value.category) return []
  return appointmentStore.getLawyersByCategory(formData.value.category)
})

// Reset lawyer when category changes
watch(() => formData.value.category, () => {
  formData.value.lawyer = ''
})

const submitBooking = async () => {
  // ✅ Check if user is logged in FIRST
  const token = localStorage.getItem('auth_token')
  
  if (!token) {
    errorMessage.value = 'Please login to book an appointment'
    
    setTimeout(() => {
      emit('close')
      router.push('/login')
    }, 2000)
    
    return
  }

  try {
    loading.value = true
    errorMessage.value = ''
    successMessage.value = ''

    // Find lawyer ID if a specific lawyer was selected
    let lawyerId = null
    if (formData.value.lawyer) {
      const lawyersInCategory = appointmentStore.getLawyersByCategory(formData.value.category) || []
      const chosenLawyer = lawyersInCategory.find(l => l.name === formData.value.lawyer)
      if (chosenLawyer) {
        lawyerId = chosenLawyer.id
      }
    }

    // ✅ Call the API directly here
    const response = await api.post('/appointments', {
      lawyer_id: lawyerId,
      category: formData.value.category,
      date: formData.value.date,
      time: formData.value.time,
      client_name: formData.value.clientName,
      client_phone: formData.value.clientPhone,
      client_email: formData.value.clientEmail,
      consultation_type: formData.value.consultationType,
      notes: formData.value.notes
    })

    // Show success message
    successMessage.value = 'Appointment booked successfully!'
    
    // Emit to parent (for local state update if needed)
    emit('book', {
      ...formData.value,
      lawyerId,
      id: response.id
    })

    // Reset form and close after short delay
    setTimeout(() => {
      resetForm()
      emit('close')
    }, 1500)

  } catch (error) {
    console.error('Booking error:', error)
    
    // Handle 401 Unauthorized
    if (error.status === 401) {
      errorMessage.value = 'Session expired. Please login again.'
      setTimeout(() => {
        emit('close')
        router.push('/login')
      }, 2000)
    } else {
      errorMessage.value = error.message || 'Failed to book appointment. Please try again.'
    }
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  formData.value = {
    category: '',
    lawyer: '',
    clientName: '',
    clientPhone: '',
    clientEmail: '',
    date: '',
    time: '',
    consultationType: '',
    notes: ''
  }
  successMessage.value = ''
  errorMessage.value = ''
}

// Watch for modal close to reset messages
watch(() => props.show, (newVal) => {
  if (!newVal) {
    setTimeout(() => {
      successMessage.value = ''
      errorMessage.value = ''
    }, 300)
  }
})
</script>