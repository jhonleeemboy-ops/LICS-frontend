import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useAppointmentStore } from './appointment'
import { useAuthStore } from './auth'
import api from '@/api' // whatever path you use for axios instance
import { useAppointmentStore } from '@/stores/appointment'

export const useLawyerStore = defineStore('lawyer', () => {
  const activeFilter = ref('all')
  const selectedAppointment = ref(null)
  const isLoading = ref(false)

  // Lawyer Profile
  const lawyerProfile = ref({
    name: 'Attorney Jane Smith',
    email: 'lawyer@demo.com',
    barNumber: 'PH-2024-00123',
    specialization: 'Business & Family Law',
    yearsOfPractice: 8,
    rating: 4.8,
    consultationFee: '₱2,500/hour',
    availableSlots: ['Mon-Fri: 9AM-5PM'],
    bio: 'Specialized in business registration and family law matters with 8 years of experience.',
    lawFirm: 'Independent Practice',
  })

  // Appointments visible to this lawyer
  const appointments = computed(() => {
    const appointmentStore = useAppointmentStore()
    const authStore = useAuthStore()

    const currentLawyerEmail = authStore.user?.email || lawyerProfile.value.email
    const currentLawyerName = authStore.user?.name || lawyerProfile.value.name

    return appointmentStore.appointments.filter((apt) => {
      const isAssignedToMe =
        apt.lawyer === currentLawyerName || apt.lawyerEmail === currentLawyerEmail
      const isUnassigned =
        apt.lawyer === 'Pending Assignment' || apt.lawyer === 'To be assigned'
      return isAssignedToMe || isUnassigned
    })
  })

  // Stats based on this lawyer's appointments
  const stats = computed(() => {
    const total = appointments.value.length
    const pending = appointments.value.filter((a) => a.status === 'Pending').length
    const accepted = appointments.value.filter((a) => a.status === 'Accepted').length
    const rejected = appointments.value.filter((a) => a.status === 'Rejected').length

    return { total, pending, accepted, rejected }
  })

  // Filters
  const filters = computed(() => [
    { key: 'all', label: 'All Appointments', icon: 'list-check', count: stats.value.total },
    { key: 'pending', label: 'Pending', icon: 'clock', count: stats.value.pending },
    { key: 'accepted', label: 'Accepted', icon: 'circle-check', count: stats.value.accepted },
    { key: 'rejected', label: 'Rejected', icon: 'circle-xmark', count: stats.value.rejected },
  ])

  // Filtered appointments
  const filteredAppointments = computed(() => {
    if (activeFilter.value === 'all') {
      return appointments.value
    }
    return appointments.value.filter(
      (apt) => apt.status.toLowerCase() === activeFilter.value,
    )
  })

  // Status helpers
  const getStatusClass = (status) => {
    const classes = {
      pending: 'bg-amber-100 text-amber-800',
      accepted: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      completed: 'bg-blue-100 text-blue-800',
      cancelled: 'bg-gray-100 text-gray-800',
      rescheduled: 'bg-purple-100 text-purple-800',
    }
    return classes[status] || 'bg-gray-100 text-gray-800'
  }

  const getStatusIcon = (status) => {
    const icons = {
      pending: 'clock',
      accepted: 'check',
      rejected: 'xmark',
      completed: 'circle-check',
      cancelled: 'ban',
      rescheduled: 'calendar-days',
    }
    return icons[status] || 'question'
  }

  // Actions
  const fetchAppointments = async () => {
  isLoading.value = true
  try {
    const { data } = await api.get('/lawyer/appointments')
    const appointmentStore = useAppointmentStore()

    // backend already returns formatted appointments
    appointmentStore.appointments = data

    // optionally cache for offline use
    localStorage.setItem('appointments', JSON.stringify(data))
  } catch (error) {
    console.error('Error fetching appointments:', error)
  } finally {
    isLoading.value = false
  }
}

  const acceptAppointment = async (appointmentId) => {
    try {
      const appointmentStore = useAppointmentStore()
      const authStore = useAuthStore()

      const currentLawyerName = authStore.user?.name || lawyerProfile.value.name
      const currentLawyerEmail = authStore.user?.email || lawyerProfile.value.email

      appointmentStore.updateAppointment(appointmentId, {
        status: 'accepted',
        lawyer: currentLawyerName,
        lawyerEmail: currentLawyerEmail,
        acceptedAt: new Date().toISOString(),
      })

      localStorage.setItem('appointments', JSON.stringify(appointmentStore.appointments))

      return { success: true, message: 'Appointment accepted successfully!' }
    } catch (error) {
      console.error('Error accepting appointment:', error)
      return { success: false, message: 'Failed to accept appointment' }
    }
  }

  const rejectAppointment = async (appointmentId) => {
    try {
      const appointmentStore = useAppointmentStore()

      appointmentStore.updateAppointment(appointmentId, {
        status: 'rejected',
        rejectedAt: new Date().toISOString(),
      })

      localStorage.setItem('appointments', JSON.stringify(appointmentStore.appointments))

      return { success: true, message: 'Appointment rejected.' }
    } catch (error) {
      console.error('Error rejecting appointment:', error)
      return { success: false, message: 'Failed to reject appointment' }
    }
  }

  const rescheduleAppointment = async (appointmentId, newDate, newTime) => {
    try {
      const appointmentStore = useAppointmentStore()

      appointmentStore.rescheduleAppointment(appointmentId, newDate, newTime)

      localStorage.setItem('appointments', JSON.stringify(appointmentStore.appointments))

      return { success: true, message: 'Appointment rescheduled!' }
    } catch (error) {
      console.error('Error rescheduling appointment:', error)
      return { success: false, message: 'Failed to reschedule appointment' }
    }
  }

  const addNoteToAppointment = (appointmentId, note) => {
    const appointment = appointments.value.find((a) => a.id === appointmentId)
    if (appointment) {
      const appointmentStore = useAppointmentStore()
      appointment.notes = appointment.notes
        ? `${appointment.notes}\n\n[Lawyer Note - ${new Date().toLocaleDateString()}]: ${note}`
        : `[Lawyer Note - ${new Date().toLocaleDateString()}]: ${note}`

      localStorage.setItem('appointments', JSON.stringify(appointmentStore.appointments))
    }
  }

  const selectAppointment = (appointment) => {
    selectedAppointment.value = appointment
  }

  const clearSelectedAppointment = () => {
    selectedAppointment.value = null
  }

  const setActiveFilter = (filter) => {
    activeFilter.value = filter
  }

  const updateProfile = (profileData) => {
    lawyerProfile.value = { ...lawyerProfile.value, ...profileData }
    localStorage.setItem('lawyerProfile', JSON.stringify(lawyerProfile.value))
  }

  // ✅ NEW: Load profile from stored logged-in user
  const loadProfileFromStorage = () => {
    const savedUserJson = localStorage.getItem('user')
    if (!savedUserJson) return

    const savedUser = JSON.parse(savedUserJson)
    if (savedUser.role !== 'lawyer') return

    lawyerProfile.value = {
      name: savedUser.name,
      email: savedUser.email,
      barNumber: savedUser.barNumber || 'N/A',
      specialization:
        savedUser.specialization || lawyerProfile.value.specialization || 'General Practice',
      yearsOfPractice:
        savedUser.yearsOfPractice || lawyerProfile.value.yearsOfPractice || 0,
      rating: lawyerProfile.value.rating || 4.5,
      consultationFee: lawyerProfile.value.consultationFee || '₱2,500/hour',
      availableSlots: lawyerProfile.value.availableSlots || ['Mon-Fri: 9AM-5PM'],
      bio:
        lawyerProfile.value.bio ||
        `Specialized in ${savedUser.specialization || 'legal matters'}.`,
      lawFirm: savedUser.lawFirm || lawyerProfile.value.lawFirm || 'Independent Practice',
    }
  }

  const getAppointment = (appointmentId) =>
    appointments.value.find((apt) => apt.id === appointmentId)

  const getAppointmentsByDate = (date) =>
    appointments.value.filter((apt) => apt.date === date)

  const getUpcomingAppointments = (limit = 5) => {
    const upcoming = appointments.value
      .filter((apt) => apt.status === 'accepted')
      .sort((a, b) => new Date(a.date) - new Date(b.date))

    return upcoming.slice(0, limit)
  }

  const getClientHistory = (clientEmail) =>
    appointments.value.filter((apt) => apt.clientEmail === clientEmail)

  return {
    // State
    appointments,
    activeFilter,
    selectedAppointment,
    isLoading,
    lawyerProfile,

    // Getters
    stats,
    filters,
    filteredAppointments,
    getStatusClass,
    getStatusIcon,

    // Actions
    fetchAppointments,
    acceptAppointment,
    rejectAppointment,
    rescheduleAppointment,
    addNoteToAppointment,
    selectAppointment,
    clearSelectedAppointment,
    setActiveFilter,
    updateProfile,
    loadProfileFromStorage,
    getAppointment,
    getAppointmentsByDate,
    getUpcomingAppointments,
    getClientHistory,
  }
})
