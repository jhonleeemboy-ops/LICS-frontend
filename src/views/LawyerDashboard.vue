<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-md border-b">
      <div class="container mx-auto px-4 py-4 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <div class="text-4xl">⚖️</div>
          <div>
            <h1 class="text-2xl font-bold text-gray-800">Lawyer Dashboard</h1>
            <p class="text-gray-600">Welcome, {{ user?.name || 'Attorney Jane Smith' }}</p>
          </div>
        </div>
        
        <button 
          @click="handleLogout"
          class="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
        >
          <span class="text-xl">🚪</span>
          Logout
        </button>
      </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-4 py-8">
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <!-- Total -->
        <div class="bg-white rounded-xl shadow-md p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-gray-600 font-medium">Total</h3>
            <span class="text-4xl text-blue-500">📅</span>
          </div>
          <p class="text-4xl font-bold text-gray-800">{{ stats.total }}</p>
        </div>

        <!-- Pending -->
        <div class="bg-white rounded-xl shadow-md p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-gray-600 font-medium">Pending</h3>
            <span class="text-4xl text-amber-500">📋</span>
          </div>
          <p class="text-4xl font-bold text-amber-600">{{ stats.pending }}</p>
        </div>

        <!-- Accepted -->
        <div class="bg-white rounded-xl shadow-md p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-gray-600 font-medium">Accepted</h3>
            <span class="text-4xl text-green-500">✅</span>
          </div>
          <p class="text-4xl font-bold text-green-600">{{ stats.accepted }}</p>
        </div>

        <!-- Rejected -->
        <div class="bg-white rounded-xl shadow-md p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-gray-600 font-medium">Rejected</h3>
            <span class="text-4xl text-red-500">❌</span>
          </div>
          <p class="text-4xl font-bold text-red-600">{{ stats.rejected }}</p>
        </div>
      </div>

      <!-- Filter Tabs -->
      <div class="bg-white rounded-xl shadow-md p-6 mb-8">
        <div class="flex gap-3">
          <button
            v-for="filter in filters"
            :key="filter.key"
            @click="activeFilter = filter.key"
            :class="[
              'px-6 py-3 rounded-lg font-medium transition',
              activeFilter === filter.key
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]"
          >
            {{ filter.label }} ({{ stats[filter.key] }})
          </button>
        </div>
      </div>

      <!-- Appointments List -->
      <div class="bg-white rounded-xl shadow-md p-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-6">Client Appointments</h2>
        
        <!-- Empty State -->
        <div v-if="filteredAppointments.length === 0" class="text-center py-16">
          <div class="text-6xl mb-4">📭</div>
          <p class="text-xl text-gray-500">No appointments found.</p>
        </div>

        <!-- Appointments Table -->
        <div v-else class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b-2 border-gray-200">
                <th class="text-left py-4 px-4 font-semibold text-gray-700">Client Name</th>
                <th class="text-left py-4 px-4 font-semibold text-gray-700">Date</th>
                <th class="text-left py-4 px-4 font-semibold text-gray-700">Time</th>
                <th class="text-left py-4 px-4 font-semibold text-gray-700">Category</th>
                <th class="text-left py-4 px-4 font-semibold text-gray-700">Status</th>
                <th class="text-left py-4 px-4 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr 
                v-for="appointment in filteredAppointments" 
                :key="appointment.id"
                class="border-b border-gray-100 hover:bg-gray-50"
              >
                <td class="py-4 px-4 font-medium text-gray-800">{{ appointment.clientName }}</td>
                <td class="py-4 px-4 text-gray-600">{{ appointment.date }}</td>
                <td class="py-4 px-4 text-gray-600">{{ appointment.time }}</td>
                <td class="py-4 px-4 text-gray-600">{{ appointment.category }}</td>
                <td class="py-4 px-4">
                  <span :class="getStatusClass(appointment.status)" class="px-3 py-1 rounded-full text-sm font-medium">
                    {{ appointment.status }}
                  </span>
                </td>
                <td class="py-4 px-4">
                  <div class="flex gap-2">
                    <button 
                      v-if="appointment.status === 'Pending'"
                      @click="acceptAppointment(appointment.id)"
                      class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm"
                    >
                      Accept
                    </button>
                    <button 
                      v-if="appointment.status === 'Pending'"
                      @click="rejectAppointment(appointment.id)"
                      class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm"
                    >
                      Reject
                    </button>
                    <button 
                      class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
                    >
                      View
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
    <button class="fixed bottom-8 right-8 w-14 h-14 bg-gray-800 text-white rounded-full shadow-lg hover:bg-gray-900 transition flex items-center justify-center text-2xl">
      ?
    </button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import axios from 'axios';

const authStore = useAuthStore();
const router = useRouter();

const user = ref(null);
const activeFilter = ref('all');
const appointments = ref([]);

const stats = ref({
  total: 0,
  pending: 0,
  accepted: 0,
  rejected: 0
});

const filters = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'accepted', label: 'Accepted' },
  { key: 'rejected', label: 'Rejected' }
];

const filteredAppointments = computed(() => {
  if (activeFilter.value === 'all') {
    return appointments.value;
  }
  return appointments.value.filter(
    apt => apt.status.toLowerCase() === activeFilter.value
  );
});

const getStatusClass = (status) => {
  const classes = {
    Pending: 'bg-amber-100 text-amber-800',
    Accepted: 'bg-green-100 text-green-800',
    Rejected: 'bg-red-100 text-red-800'
  };
  return classes[status] || 'bg-gray-100 text-gray-800';
};

const fetchAppointments = async () => {
  try {
    const response = await axios.get('/api/appointments/lawyer', {
      headers: {
        Authorization: `Bearer ${authStore.token}`
      }
    });
    
    appointments.value = response.data.appointments || [];
    updateStats();
  } catch (error) {
    console.error('Error fetching appointments:', error);
  }
};

const updateStats = () => {
  stats.value.total = appointments.value.length;
  stats.value.pending = appointments.value.filter(a => a.status === 'Pending').length;
  stats.value.accepted = appointments.value.filter(a => a.status === 'Accepted').length;
  stats.value.rejected = appointments.value.filter(a => a.status === 'Rejected').length;
};

const acceptAppointment = async (id) => {
  try {
    await axios.put(`/api/appointments/${id}/accept`, {}, {
      headers: {
        Authorization: `Bearer ${authStore.token}`
      }
    });
    await fetchAppointments();
  } catch (error) {
    console.error('Error accepting appointment:', error);
  }
};

const rejectAppointment = async (id) => {
  try {
    await axios.put(`/api/appointments/${id}/reject`, {}, {
      headers: {
        Authorization: `Bearer ${authStore.token}`
      }
    });
    await fetchAppointments();
  } catch (error) {
    console.error('Error rejecting appointment:', error);
  }
};

const handleLogout = async () => {
  await authStore.logout();
  router.push('/login');
};

onMounted(() => {
  user.value = authStore.user;
  fetchAppointments();
});
</script>