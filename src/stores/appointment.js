import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAppointmentStore = defineStore('appointment', () => {
  // State
  const appointments = ref([
    {
      id: 1,
      lawyer: 'Atty. Maria Santos',
      category: 'Business & Commerce',
      date: '2025-01-25',
      time: '10:00 AM',
      status: 'Pending',
      notes: 'Need consultation for new restaurant business registration',
      location: 'Butuan City Legal Office, Room 101',
      contact: '085-342-1234'
    },
    {
      id: 2,
      lawyer: 'Atty. Juan Dela Cruz',
      category: 'Land Use & Zoning',
      date: '2025-01-22',
      time: '2:00 PM',
      status: 'Accepted',
      notes: 'Property boundary dispute consultation',
      location: 'Butuan City Hall, Legal Department',
      contact: '085-342-5678'
    }
  ])

  const availableLawyers = ref([
    { id: 1, name: 'Atty. Maria Santos', specialization: 'Business Law', rating: 4.8 },
    { id: 2, name: 'Atty. Juan Dela Cruz', specialization: 'Property Law', rating: 4.9 },
    { id: 3, name: 'Atty. Ana Reyes', specialization: 'Family Law', rating: 4.7 },
    { id: 4, name: 'Atty. Carlos Lim', specialization: 'Criminal Law', rating: 4.6 }
  ])

  // Getters
  const upcomingAppointments = computed(() => {
    return appointments.value.filter(apt => apt.status === 'Pending' || apt.status === 'Accepted')
  })

  const pastAppointments = computed(() => {
    return appointments.value.filter(apt => apt.status === 'Completed' || apt.status === 'Cancelled')
  })

  const pendingCount = computed(() => {
    return appointments.value.filter(apt => apt.status === 'Pending').length
  })

  // Actions
  const bookAppointment = (appointmentData) => {
    const newAppointment = {
      id: Date.now(),
      lawyer: appointmentData.lawyer || 'Pending Assignment',
      category: appointmentData.category,
      date: appointmentData.date,
      time: appointmentData.time,
      status: 'Pending',
      notes: appointmentData.notes || '',
      location: 'To be assigned',
      contact: 'To be provided'
    }
    
    appointments.value.unshift(newAppointment)
    return newAppointment
  }

  const updateAppointment = (appointmentId, updates) => {
    const index = appointments.value.findIndex(apt => apt.id === appointmentId)
    if (index !== -1) {
      appointments.value[index] = { ...appointments.value[index], ...updates }
    }
  }

  const cancelAppointment = (appointmentId) => {
    const appointment = appointments.value.find(apt => apt.id === appointmentId)
    if (appointment) {
      appointment.status = 'Cancelled'
    }
  }

  const rescheduleAppointment = (appointmentId, newDate, newTime) => {
    const appointment = appointments.value.find(apt => apt.id === appointmentId)
    if (appointment) {
      appointment.date = newDate
      appointment.time = newTime
      appointment.status = 'Rescheduled'
    }
  }

  const getAppointment = (appointmentId) => {
    return appointments.value.find(apt => apt.id === appointmentId)
  }

  const getLawyersByCategory = (category) => {
    // This would typically come from an API
    // For now, return all lawyers
    return availableLawyers.value
  }

  return {
    // State
    appointments,
    availableLawyers,
    
    // Getters
    upcomingAppointments,
    pastAppointments,
    pendingCount,
    
    // Actions
    bookAppointment,
    updateAppointment,
    cancelAppointment,
    rescheduleAppointment,
    getAppointment,
    getLawyersByCategory
  }
})