<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" @click.self="$emit('close')">
    <div class="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-xl font-bold text-amber-900">Appointment Details</h3>
        <button @click="$emit('close')" class="text-amber-500 hover:text-amber-700">
          <font-awesome-icon icon="xmark" class="text-2xl" />
        </button>
      </div>
      
      <!-- Appointment Info -->
      <div class="space-y-4">
        <div>
          <p class="text-sm text-amber-600 mb-1">Lawyer</p>
          <p class="font-medium text-amber-900">{{ appointment.lawyer }}</p>
        </div>
        
        <div>
          <p class="text-sm text-amber-600 mb-1">Category</p>
          <p class="font-medium text-amber-900">{{ appointment.category }}</p>
        </div>
        
        <div class="grid grid-cols-2 gap-4">
          <div>
            <p class="text-sm text-amber-600 mb-1">Date</p>
            <p class="font-medium text-amber-900">{{ appointment.date }}</p>
          </div>
          <div>
            <p class="text-sm text-amber-600 mb-1">Time</p>
            <p class="font-medium text-amber-900">{{ appointment.time }}</p>
          </div>
        </div>
        
        <div>
          <p class="text-sm text-amber-600 mb-1">Status</p>
          <span :class="getStatusClass(appointment.status)" 
            class="px-3 py-1 rounded-full text-sm font-medium">
            {{ appointment.status }}
          </span>
        </div>
        
        <div v-if="appointment.location">
          <p class="text-sm text-amber-600 mb-1">Location</p>
          <p class="text-amber-700">{{ appointment.location }}</p>
        </div>
        
        <div v-if="appointment.contact">
          <p class="text-sm text-amber-600 mb-1">Contact</p>
          <p class="text-amber-700">{{ appointment.contact }}</p>
        </div>
        
        <div v-if="appointment.notes">
          <p class="text-sm text-amber-600 mb-1">Your Notes</p>
          <p class="text-amber-700 bg-amber-50 p-3 rounded-lg">{{ appointment.notes }}</p>
        </div>
      </div>
      
      <!-- Actions -->
      <div class="mt-6 pt-6 border-t border-amber-200 flex gap-3">
        <button 
          v-if="appointment.status === 'Pending'"
          @click="$emit('cancel', appointment.id)"
          class="flex-1 px-4 py-3 bg-red-100 text-red-700 rounded-lg font-medium hover:bg-red-200 transition-colors"
        >
          Cancel Appointment
        </button>
        <button 
          @click="$emit('close')"
          class="flex-1 px-4 py-3 bg-amber-100 text-amber-700 rounded-lg font-medium hover:bg-amber-200 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  appointment: {
    type: Object,
    required: true
  }
})

defineEmits(['close', 'cancel'])

const getStatusClass = (status) => {
  const classes = {
    'Pending': 'bg-amber-100 text-amber-800',
    'Accepted': 'bg-green-100 text-green-800',
    'Rejected': 'bg-red-100 text-red-800',
    'Completed': 'bg-blue-100 text-blue-800',
    'Cancelled': 'bg-gray-100 text-gray-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}
</script>