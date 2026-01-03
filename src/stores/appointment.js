import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAppointmentStore = defineStore('appointment', () => {
  // State
  const appointments = ref([
    {
      id: 1,
      lawyer: 'Atty. Maria Santos',
      category: 'Business & Commerce',
      date: '2024-01-25',
      time: '10:00 AM',
      status: 'Pending',
      notes: 'Need consultation for new restaurant business registration',
      location: 'Butuan City Legal Office, Room 101',
      contact: '085-342-1234',
      clientName: 'John Doe',
      clientEmail: 'john@example.com'
    },
    {
      id: 2,
      lawyer: 'Atty. Juan Dela Cruz',
      category: 'Land Use & Zoning',
      date: '2024-01-22',
      time: '2:00 PM',
      status: 'Accepted',
      notes: 'Property boundary dispute consultation',
      location: 'Butuan City Hall, Legal Department',
      contact: '085-342-5678',
      clientName: 'John Doe',
      clientEmail: 'john@example.com'
    }
  ])

  const bookingForm = ref({
    category: '',
    date: '',
    time: '',
    notes: ''
  })

  const showBookingModal = ref(false)
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

  const appointmentsByStatus = computed(() => {
    return {
      all: appointments.value.length,
      pending: appointments.value.filter(apt => apt.status === 'Pending').length,
      accepted: appointments.value.filter(apt => apt.status === 'Accepted').length,
      rejected: appointments.value.filter(apt => apt.status === 'Rejected').length
    }
  })

  // Actions
  const bookAppointment = (appointmentData) => {
    const newAppointment = {
      id: Date.now(),
      lawyer: 'Pending Assignment',
      category: appointmentData.category,
      date: appointmentData.date,
      time: appointmentData.time,
      status: 'Pending',
      notes: appointmentData.notes || '',
      location: 'To be assigned',
      contact: 'To be provided',
      clientName: 'Your Name',
      clientEmail: 'your@email.com'
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

  const openBookingModal = () => {
    showBookingModal.value = true
  }

  const closeBookingModal = () => {
    showBookingModal.value = false
    resetBookingForm()
  }

  const resetBookingForm = () => {
    bookingForm.value = {
      category: '',
      date: '',
      time: '',
      notes: ''
    }
  }

  const getLawyersByCategory = (category) => {
    return availableLawyers.value.filter(lawyer => 
      lawyer.specialization.toLowerCase().includes(category.toLowerCase().split(' ')[0])
    )
  }

  return {
    // State
    appointments,
    bookingForm,
    showBookingModal,
    availableLawyers,
    
    // Getters
    upcomingAppointments,
    pastAppointments,
    pendingCount,
    appointmentsByStatus,
    
    // Actions
    bookAppointment,
    updateAppointment,
    cancelAppointment,
    rescheduleAppointment,
    getAppointment,
    openBookingModal,
    closeBookingModal,
    resetBookingForm,
    getLawyersByCategory
  }
})