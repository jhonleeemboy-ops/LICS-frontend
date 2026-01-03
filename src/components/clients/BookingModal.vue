<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" @click.self="$emit('close')">
    <div class="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-xl font-bold text-gray-800">Book Appointment</h3>
        <button @click="$emit('close')" class="text-gray-500 hover:text-gray-700">
          <font-awesome-icon icon="xmark" class="text-2xl" />
        </button>
      </div>
      
      <form @submit.prevent="submitBooking">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Category</label>
            <select v-model="formData.category" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none">
              <option value="">Select a category</option>
              <option value="Public Health & Safety">Public Health & Safety</option>
              <option value="Land Use & Zoning">Land Use & Zoning</option>
              <option value="Environment & Natural Resources">Environment & Natural Resources</option>
              <option value="Business & Commerce">Business & Commerce</option>
              <option value="Traffic & Transportation">Traffic & Transportation</option>
              <option value="Community & Social Services">Community & Social Services</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Preferred Date</label>
            <input v-model="formData.date" type="date" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none" />
          </div>
          
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Preferred Time</label>
            <input v-model="formData.time" type="time" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none" />
          </div>
          
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Additional Notes (Optional)</label>
            <textarea v-model="formData.notes" rows="3" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none" placeholder="Describe your legal matter..."></textarea>
          </div>
        </div>
        
        <div class="flex gap-3 mt-6">
          <button type="button" @click="$emit('close')" class="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors">
            Cancel
          </button>
          <button type="submit" class="flex-1 px-4 py-3 bg-amber-700 text-white rounded-lg font-medium hover:bg-amber-600 transition-colors">
            Book Now
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['close', 'book'])

const formData = ref({
  category: '',
  date: '',
  time: '',
  notes: ''
})

const submitBooking = () => {
  emit('book', formData.value)
  formData.value = { category: '', date: '', time: '', notes: '' }
}
</script>