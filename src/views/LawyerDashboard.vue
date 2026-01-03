<template>
  <div class="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100">
    <!-- Header -->
    <header class="bg-gradient-to-r from-amber-900 to-amber-800 text-white shadow-lg">
      <div class="container mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <div class="bg-amber-700 w-12 h-12 rounded-xl flex items-center justify-center">
              <font-awesome-icon icon="scale-balanced" class="text-2xl" />
            </div>
            <div>
              <h1 class="text-2xl font-bold">Lawyer Dashboard</h1>
              <p class="text-amber-200">Welcome, {{ lawyerStore.lawyerProfile.name }}</p>
            </div>
          </div>
          
          <div class="flex items-center gap-4">
            <div class="text-right hidden md:block">
              <p class="text-xs text-amber-200">Bar License</p>
              <p class="text-sm font-medium">{{ lawyerStore.lawyerProfile.barNumber }}</p>
            </div>
            <button 
              @click="handleLogout"
              class="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition font-medium"
            >
              <font-awesome-icon icon="right-from-bracket" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-4 py-8">
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <!-- Total Appointments -->
        <div class="bg-white rounded-xl shadow-md border border-amber-200 p-6 hover:shadow-lg transition-shadow">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-amber-700 font-medium">Total Appointments</h3>
            <div class="bg-amber-100 p-3 rounded-lg">
              <font-awesome-icon icon="calendar-days" class="text-amber-600 text-xl" />
            </div>
          </div>
          <p class="text-4xl font-bold text-amber-900">{{ lawyerStore.stats.total }}</p>
          <p class="text-sm text-amber-600 mt-2">All time consultations</p>
        </div>

        <!-- Pending -->
        <div class="bg-white rounded-xl shadow-md border border-amber-200 p-6 hover:shadow-lg transition-shadow">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-amber-700 font-medium">Pending</h3>
            <div class="bg-amber-100 p-3 rounded-lg">
              <font-awesome-icon icon="clock" class="text-amber-600 text-xl" />
            </div>
          </div>
          <p class="text-4xl font-bold text-amber-900">{{ lawyerStore.stats.pending }}</p>
          <p class="text-sm text-amber-600 mt-2">Awaiting review</p>
        </div>

        <!-- Accepted -->
        <div class="bg-white rounded-xl shadow-md border border-amber-200 p-6 hover:shadow-lg transition-shadow">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-amber-700 font-medium">Accepted</h3>
            <div class="bg-green-100 p-3 rounded-lg">
              <font-awesome-icon icon="circle-check" class="text-green-600 text-xl" />
            </div>
          </div>
          <p class="text-4xl font-bold text-green-700">{{ lawyerStore.stats.accepted }}</p>
          <p class="text-sm text-green-600 mt-2">Confirmed sessions</p>
        </div>

        <!-- Rejected -->
        <div class="bg-white rounded-xl shadow-md border border-amber-200 p-6 hover:shadow-lg transition-shadow">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-amber-700 font-medium">Rejected</h3>
            <div class="bg-red-100 p-3 rounded-lg">
              <font-awesome-icon icon="circle-xmark" class="text-red-600 text-xl" />
            </div>
          </div>
          <p class="text-4xl font-bold text-red-700">{{ lawyerStore.stats.rejected }}</p>
          <p class="text-sm text-red-600 mt-2">Declined requests</p>
        </div>
      </div>

      <!-- Filter Tabs -->
      <div class="bg-white rounded-xl shadow-md border border-amber-200 p-6 mb-8">
        <div class="flex flex-wrap gap-3">
          <button
            v-for="filter in lawyerStore.filters"
            :key="filter.key"
            @click="lawyerStore.setActiveFilter(filter.key)"
            :class="[
              'px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2',
              lawyerStore.activeFilter === filter.key
                ? 'bg-amber-600 text-white'
                : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
            ]"
          >
            <font-awesome-icon :icon="filter.icon" />
            {{ filter.label }} ({{ filter.count }})
          </button>
        </div>
      </div>

      <!-- Appointments List -->
      <div class="bg-white rounded-xl shadow-md border border-amber-200 p-8">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h2 class="text-2xl font-bold text-amber-900">Client Appointments</h2>
            <p class="text-amber-600 mt-1">Manage your consultation schedule</p>
          </div>
          <div class="flex items-center gap-3">
            <button 
              @click="refreshAppointments"
              :disabled="lawyerStore.isLoading"
              class="px-4 py-2 bg-amber-100 hover:bg-amber-200 text-amber-700 rounded-lg font-medium flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              <font-awesome-icon icon="arrow-rotate-right" :class="{ 'animate-spin': lawyerStore.isLoading }" class="text-sm" />
              <span>{{ lawyerStore.isLoading ? 'Loading...' : 'Refresh' }}</span>
            </button>
          </div>
        </div>
        
        <!-- Empty State -->
        <div v-if="lawyerStore.filteredAppointments.length === 0" class="text-center py-16">
          <div class="bg-amber-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <font-awesome-icon icon="calendar-xmark" class="text-amber-600 text-4xl" />
          </div>
          <p class="text-xl text-amber-600 font-medium mb-2">No appointments found</p>
          <p class="text-amber-500">You don't have any {{ lawyerStore.activeFilter !== 'all' ? lawyerStore.activeFilter : '' }} appointments scheduled.</p>
        </div>

        <!-- Appointments Table -->
        <div v-else class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-amber-50">
              <tr>
                <th class="text-left py-4 px-4 font-semibold text-amber-900">Client Name</th>
                <th class="text-left py-4 px-4 font-semibold text-amber-900">Date & Time</th>
                <th class="text-left py-4 px-4 font-semibold text-amber-900">Category</th>
                <th class="text-left py-4 px-4 font-semibold text-amber-900">Status</th>
                <th class="text-left py-4 px-4 font-semibold text-amber-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr 
                v-for="appointment in lawyerStore.filteredAppointments" 
                :key="appointment.id"
                class="border-b border-amber-100 hover:bg-amber-50 transition-colors"
              >
                <td class="py-4 px-4">
                  <div class="flex items-center gap-3">
                    <div class="bg-amber-100 w-10 h-10 rounded-full flex items-center justify-center">
                      <font-awesome-icon icon="user" class="text-amber-600" />
                    </div>
                    <div>
                      <p class="font-medium text-amber-900">{{ appointment.clientName }}</p>
                      <p class="text-xs text-amber-600">{{ appointment.clientEmail || 'client@email.com' }}</p>
                      <p class="text-xs text-amber-500">{{ appointment.clientPhone }}</p>
                    </div>
                  </div>
                </td>
                <td class="py-4 px-4">
                  <div class="text-amber-900 font-medium">{{ formatDate(appointment.date) }}</div>
                  <div class="text-sm text-amber-600">{{ appointment.time }}</div>
                </td>
                <td class="py-4 px-4">
                  <span class="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium">
                    {{ appointment.category }}
                  </span>
                </td>
                <td class="py-4 px-4">
                  <div class="flex items-center gap-2">
                    <span :class="lawyerStore.getStatusClass(appointment.status)" 
                      class="px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                      <font-awesome-icon :icon="lawyerStore.getStatusIcon(appointment.status)" class="text-xs" />
                      {{ appointment.status }}
                    </span>
                  </div>
                </td>
                <td class="py-4 px-4">
                  <div class="flex gap-2">
                    <button 
                      v-if="appointment.status === 'Pending'"
                      @click="handleAcceptAppointment(appointment.id)"
                      class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm font-medium flex items-center gap-2"
                      title="Accept Appointment"
                    >
                      <font-awesome-icon icon="check" class="text-xs" />
                      <span>Accept</span>
                    </button>
                    <button 
                      v-if="appointment.status === 'Pending'"
                      @click="handleRejectAppointment(appointment.id)"
                      class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm font-medium flex items-center gap-2"
                      title="Reject Appointment"
                    >
                      <font-awesome-icon icon="xmark" class="text-xs" />
                      <span>Reject</span>
                    </button>
                    <button 
                      @click="viewAppointmentDetails(appointment)"
                      class="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors text-sm font-medium flex items-center gap-2"
                      title="View Details"
                    >
                      <font-awesome-icon icon="eye" class="text-xs" />
                      <span>View</span>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>

    <!-- Help Button -->
    <button class="fixed bottom-8 right-8 w-14 h-14 bg-amber-800 hover:bg-amber-700 text-white rounded-full shadow-lg transition-colors flex items-center justify-center z-50">
      <font-awesome-icon icon="question" class="text-xl" />
    </button>

    <!-- Appointment Details Modal -->
    <AppointmentDetailsModal 
      v-if="lawyerStore.selectedAppointment"
      :appointment="lawyerStore.selectedAppointment"
      @close="lawyerStore.clearSelectedAppointment()"
      @accept="handleAcceptAppointment"
      @reject="handleRejectAppointment"
      @reschedule="handleRescheduleAppointment"
      @add-note="handleAddNote"
    />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useLawyerStore } from '@/stores/lawyer'
import { useAuthStore } from '@/stores/auth'
import AppointmentDetailsModal from '@/components/clients/AppointmentDetailsModal.vue'

const router = useRouter()
const lawyerStore = useLawyerStore()
const authStore = useAuthStore()

onMounted(() => {
  // Load appointments
  lawyerStore.fetchAppointments()
  // Load lawyer profile from storage
  lawyerStore.loadProfileFromStorage()
})

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  })
}

const refreshAppointments = () => {
  lawyerStore.fetchAppointments()
}

const viewAppointmentDetails = (appointment) => {
  lawyerStore.selectAppointment(appointment)
}

const handleAcceptAppointment = async (appointmentId) => {
  const result = await lawyerStore.acceptAppointment(appointmentId)
  if (result.success) {
    alert(result.message)
  } else {
    alert(result.message)
  }
}

const handleRejectAppointment = async (appointmentId) => {
  const result = await lawyerStore.rejectAppointment(appointmentId)
  if (result.success) {
    alert(result.message)
  } else {
    alert(result.message)
  }
}

const handleRescheduleAppointment = async (appointmentId, newDate, newTime) => {
  const result = await lawyerStore.rescheduleAppointment(appointmentId, newDate, newTime)
  if (result.success) {
    alert(result.message)
  } else {
    alert(result.message)
  }
}

const handleAddNote = (appointmentId, note) => {
  lawyerStore.addNoteToAppointment(appointmentId, note)
}

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
/* Custom scrollbar for table */
.overflow-x-auto::-webkit-scrollbar {
  height: 8px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: #fef3c7;
  border-radius: 4px;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background: #d97706;
  border-radius: 4px;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background: #b45309;
}
</style>