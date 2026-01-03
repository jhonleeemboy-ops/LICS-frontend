<template>
  <!-- Chat Interface when selectedTopic exists -->
  <ChatInterface 
    v-if="selectedTopic"
    :topic="selectedTopic"
    @back="selectedTopic = ''"
  />

  <!-- Main Dashboard when no topic selected -->
  <div v-else class="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100">
    <!-- Top Navigation Bar -->
    <div class="bg-gradient-to-r from-amber-900 to-amber-800 text-white px-4 py-3">
      <div class="flex items-center justify-between">
        <!-- Left: Logo -->
        <div class="flex items-center gap-2">
          <div class="bg-amber-700 w-8 h-8 rounded-lg flex items-center justify-center">
            <font-awesome-icon icon="scale-balanced" class="text-lg" />
          </div>
          <div>
            <h1 class="text-sm font-bold">Legal Information</h1>
            <p class="text-xs text-amber-200">Chatbot System</p>
          </div>
        </div>
        
        <!-- Right: User & Actions -->
        <div class="flex items-center gap-2">
          <div class="text-right hidden sm:block">
            <p class="text-xs text-amber-200">Welcome</p>
            <p class="text-sm font-medium">{{ user?.name || 'User' }}</p>
          </div>
          
          <!-- Notification Badge -->
          <div class="relative">
            <button 
              @click="activeTab = 'history'"
              class="p-2 hover:bg-amber-700 rounded-lg transition-colors relative"
              title="Chat History"
            >
              <font-awesome-icon icon="message" />
              <span v-if="chatStore.unreadChatsCount > 0" 
                class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {{ chatStore.unreadChatsCount }}
              </span>
            </button>
          </div>
          
          <button 
            @click="handleLogout"
            class="p-2 bg-amber-700 hover:bg-amber-600 rounded-lg transition-colors"
            title="Logout"
          >
            <font-awesome-icon icon="right-from-bracket" />
          </button>
        </div>
      </div>
    </div>

    <!-- Main Navigation Tabs -->
    <div class="bg-white shadow-md border-b border-amber-200">
      <div class="flex px-4">
        <button 
          :class="activeTab === 'chat' ? 'text-amber-700 border-b-2 border-amber-700' : 'text-gray-600 hover:text-amber-700'"
          class="flex-1 py-3 font-medium flex items-center justify-center gap-2 transition-colors"
          @click="activeTab = 'chat'"
        >
          <font-awesome-icon icon="comment-dots" />
          <span>Chat</span>
          <span v-if="chatStore.unreadChatsCount > 0" 
            class="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {{ chatStore.unreadChatsCount }}
          </span>
        </button>
        
        <button 
          :class="activeTab === 'history' ? 'text-amber-700 border-b-2 border-amber-700' : 'text-gray-600 hover:text-amber-700'"
          class="flex-1 py-3 font-medium flex items-center justify-center gap-2 transition-colors"
          @click="activeTab = 'history'"
        >
          <font-awesome-icon icon="clock-rotate-left" />
          <span>History</span>
        </button>
        
        <button 
          :class="activeTab === 'appointments' ? 'text-amber-700 border-b-2 border-amber-700' : 'text-gray-600 hover:text-amber-700'"
          class="flex-1 py-3 font-medium flex items-center justify-center gap-2 transition-colors"
          @click="activeTab = 'appointments'"
        >
          <font-awesome-icon icon="calendar-days" />
          <span>Appointments</span>
          <span v-if="appointmentStore.pendingCount > 0" 
            class="bg-amber-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {{ appointmentStore.pendingCount }}
          </span>
        </button>

        <button 
          :class="activeTab === 'ordinance'
            ? 'text-amber-700 border-b-2 border-amber-700'
            : 'text-gray-600 hover:text-amber-700'"
          class="flex-1 py-3 font-medium flex items-center justify-center gap-2 transition-colors"
          @click="activeTab = 'ordinance'"
        >
          <font-awesome-icon icon="book-law" />
          <span>Ordinance</span>
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <main class="px-4 py-6 max-w-6xl mx-auto pb-24">
      <!-- Chat Section -->
      <div v-if="activeTab === 'chat'" class="space-y-6">
        <!-- Welcome Card -->
        <div class="bg-gradient-to-r from-amber-800 to-amber-700 text-white rounded-2xl p-6 shadow-lg">
          <div class="flex items-start justify-between">
            <div>
              <h2 class="text-2xl font-bold mb-2">Legal Chat Assistant</h2>
              <p class="text-amber-100">Get instant legal information and guidance</p>
            </div>
            <div class="hidden md:flex items-center gap-2">
              <button 
                @click="showBookingModal = true"
                class="px-4 py-2 bg-amber-600 hover:bg-amber-500 rounded-lg transition-colors font-medium flex items-center gap-2"
              >
                <font-awesome-icon icon="calendar-plus" />
                <span>Book Appointment</span>
              </button>
              <button 
                @click="startNewChat"
                class="px-4 py-2 bg-white text-amber-700 hover:bg-amber-50 rounded-lg transition-colors font-medium flex items-center gap-2"
              >
                <font-awesome-icon icon="message" />
                <span>New Chat</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Disclaimer -->
        <div class="bg-amber-50 border-l-4 border-amber-500 rounded-r-lg p-4 shadow-sm">
          <div class="flex items-start gap-3">
            <font-awesome-icon icon="triangle-exclamation" class="text-amber-500 text-xl mt-1" />
            <div>
              <h3 class="font-bold text-amber-800 text-lg mb-1">Legal Disclaimer</h3>
              <p class="text-amber-700">
                This chatbot provides general legal information only and does not constitute legal advice. 
                For specific legal matters, please consult a qualified attorney.
              </p>
            </div>
          </div>
        </div>

        <!-- Topics Section -->
        <div>
          <h3 class="text-xl font-bold text-gray-800 mb-4">Select a Legal Topic</h3>
          
          <!-- Butuan City Specific Topics -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div 
              v-for="topic in legalTopics" 
              :key="topic.name"
              class="bg-white rounded-xl border border-amber-200 p-4 hover:border-amber-400 hover:shadow-md transition-all cursor-pointer group"
              @click="selectTopic(topic.name)"
            >
              <div class="flex items-start gap-3">
                <div class="bg-amber-100 p-3 rounded-lg group-hover:bg-amber-200 transition-colors">
                  <font-awesome-icon :icon="topic.icon" class="text-amber-600 text-xl" />
                </div>
                <div>
                  <h4 class="font-bold text-gray-800 mb-1">{{ topic.name }}</h4>
                  <p class="text-gray-600 text-sm">{{ topic.description }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Divider -->
          <div class="text-center my-6">
            <div class="relative">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-amber-200"></div>
              </div>
              <div class="relative flex justify-center">
                <span class="px-4 bg-amber-50 text-gray-500 text-sm font-medium">Or type your question below</span>
              </div>
            </div>
          </div>

          <!-- Chat Input (for direct questions) -->
          <div class="bg-white rounded-2xl border border-amber-300 p-4 shadow-sm">
            <div class="flex gap-3">
              <input
                v-model="question"
                type="text"
                placeholder="Ask a legal question..."
                class="flex-1 px-4 py-3 border border-amber-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-700"
                @keyup.enter="sendDirectMessage"
              />
              <button 
                @click="sendDirectMessage"
                class="px-6 py-3 bg-amber-700 hover:bg-amber-600 text-white rounded-xl font-medium flex items-center gap-2 transition-colors"
              >
                <font-awesome-icon icon="paper-plane" />
                <span class="hidden sm:inline">Send</span>
              </button>
            </div>
            <div class="mt-3 flex flex-wrap gap-2">
              <button 
                v-for="suggestion in quickSuggestions" 
                :key="suggestion"
                @click="useSuggestion(suggestion)"
                class="px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-700 rounded-lg text-sm transition-colors"
              >
                {{ suggestion }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- History Tab -->
      <div v-if="activeTab === 'history'" class="bg-white rounded-2xl p-6 shadow-sm">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-xl font-bold text-gray-800">Chat History</h3>
          <button 
            v-if="chatStore.chatHistory.length > 0"
            @click="clearAllChats"
            class="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
          >
            Clear All
          </button>
        </div>
        
        <div v-if="chatStore.chatHistory.length === 0" class="text-center py-12">
          <font-awesome-icon icon="inbox" class="text-5xl text-gray-300 mb-3" />
          <p class="text-gray-500">No chat history yet</p>
          <p class="text-sm text-gray-400 mt-2">Start a conversation to see your history here</p>
        </div>

        <div v-else class="space-y-4">
          <div 
            v-for="chat in chatStore.chatHistory" 
            :key="chat.id" 
            class="border border-amber-200 rounded-xl p-4 hover:bg-amber-50 transition-colors cursor-pointer"
            @click="continueChat(chat)"
          >
            <div class="flex justify-between items-start mb-2">
              <div class="flex items-center gap-2">
                <h4 class="font-medium text-gray-800">{{ chat.topic }}</h4>
                <span v-if="chat.unreadCount > 0" 
                  class="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {{ chat.unreadCount }}
                </span>
              </div>
              <span class="text-sm text-gray-500">{{ chat.date }}</span>
            </div>
            <p class="text-gray-600 text-sm mb-2">{{ chat.lastMessage }}</p>
            <div class="flex items-center justify-between mt-3">
              <span class="text-xs text-amber-700">{{ chat.messageCount }} messages</span>
              <div class="flex gap-2">
                <button 
                  @click.stop="deleteChat(chat.id)"
                  class="text-red-600 hover:text-red-800 text-sm"
                  title="Delete chat"
                >
                  <font-awesome-icon icon="trash" />
                </button>
                <button 
                  @click.stop="continueChat(chat)"
                  class="text-amber-700 hover:text-amber-800 text-sm font-medium flex items-center gap-1"
                >
                  <span>Continue</span>
                  <font-awesome-icon icon="arrow-right" class="text-xs" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Appointments Tab -->
      <div v-if="activeTab === 'appointments'" class="bg-white rounded-2xl p-6 shadow-sm">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-xl font-bold text-gray-800">Appointments</h3>
          <button 
            @click="showBookingModal = true"
            class="px-4 py-2 bg-amber-700 hover:bg-amber-600 text-white rounded-lg font-medium flex items-center gap-2"
          >
            <font-awesome-icon icon="plus" />
            <span>New</span>
          </button>
        </div>
        
        <div v-if="appointmentStore.appointments.length === 0" class="text-center py-12">
          <font-awesome-icon icon="calendar-check" class="text-5xl text-amber-400 mb-3" />
          <p class="text-gray-500 mb-4">No upcoming appointments</p>
          <button 
            @click="showBookingModal = true"
            class="px-6 py-3 bg-amber-700 hover:bg-amber-600 text-white rounded-lg font-medium inline-flex items-center gap-2"
          >
            <font-awesome-icon icon="calendar-plus" />
            <span>Schedule New Appointment</span>
          </button>
        </div>

        <div v-else class="space-y-4">
          <div 
            v-for="appointment in appointmentStore.upcomingAppointments"
            :key="appointment.id"
            class="border border-amber-200 rounded-xl p-4"
          >
            <div class="flex items-start justify-between mb-3">
              <div>
                <h4 class="font-bold text-gray-800">{{ appointment.lawyer }}</h4>
                <p class="text-sm text-gray-600">{{ appointment.category }}</p>
              </div>
              <span :class="getStatusClass(appointment.status)" class="px-3 py-1 rounded-full text-xs font-medium">
                {{ appointment.status }}
              </span>
            </div>
            
            <div class="grid grid-cols-2 gap-3 text-sm mb-3">
              <div>
                <p class="text-gray-500 mb-1">Date</p>
                <p class="text-gray-800 font-medium">{{ appointment.date }}</p>
              </div>
              <div>
                <p class="text-gray-500 mb-1">Time</p>
                <p class="text-gray-800 font-medium">{{ appointment.time }}</p>
              </div>
            </div>

            <div class="flex gap-2">
              <button 
                v-if="appointment.status === 'Pending'"
                @click="cancelAppointment(appointment.id)"
                class="flex-1 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors font-medium"
              >
                Cancel
              </button>
              <button 
                class="flex-1 px-4 py-2 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-colors font-medium"
              >
                View Details
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Ordinance Tab -->
      <div v-if="activeTab === 'ordinance'" class="space-y-6">
        <div class="bg-white rounded-2xl p-6 shadow-sm">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-xl font-bold text-gray-800">
              City Ordinances
            </h3>
            <div class="text-sm text-gray-600">
              {{ ordinanceStore.activeOrdinances.length }} active ordinances
            </div>
          </div>

          <p class="text-gray-600 mb-6">
            Browse official ordinances of Butuan City for public awareness and legal guidance.
          </p>

          <!-- Search and Filter -->
          <div class="mb-6 space-y-3">
            <div class="relative">
              <font-awesome-icon icon="search" class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                v-model="ordinanceSearch"
                type="text"
                placeholder="Search ordinances by title, number, or content..."
                class="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
            </div>
            
            <div class="flex gap-3 overflow-x-auto pb-2">
              <button 
                @click="selectedCategory = ''"
                :class="[
                  'px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors',
                  selectedCategory === '' 
                    ? 'bg-amber-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                ]"
              >
                All Categories
              </button>
              <button 
                v-for="category in ordinanceStore.categories" 
                :key="category"
                @click="selectedCategory = category"
                :class="[
                  'px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors',
                  selectedCategory === category 
                    ? 'bg-amber-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                ]"
              >
                {{ category }}
                <span class="ml-1 text-xs opacity-75">
                  ({{ getOrdinanceCountByCategory(category) }})
                </span>
              </button>
            </div>
          </div>

          <!-- Ordinances Grid -->
          <div v-if="filteredClientOrdinances.length === 0" class="text-center py-12">
            <font-awesome-icon icon="inbox" class="text-5xl text-gray-300 mb-3" />
            <p class="text-gray-500">No ordinances found</p>
            <p class="text-sm text-gray-400 mt-2">Try adjusting your search or filters</p>
          </div>

          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div
              v-for="ordinance in filteredClientOrdinances"
              :key="ordinance.id"
              @click="openClientOrdinance(ordinance)"
              class="bg-white border border-amber-200 rounded-xl p-5 hover:border-amber-400 hover:shadow-md transition-all cursor-pointer group"
            >
              <div class="flex items-start justify-between mb-3">
                <div class="bg-amber-100 p-3 rounded-lg group-hover:bg-amber-200 transition-colors">
                  <font-awesome-icon icon="book-law" class="text-amber-600 text-xl" />
                </div>
                <span class="text-xs text-gray-500">{{ ordinance.views }} views</span>
              </div>
              
              <h4 class="font-bold text-gray-800 mb-2 line-clamp-2">{{ ordinance.title }}</h4>
              <p class="text-sm text-gray-600 mb-3 line-clamp-2">{{ ordinance.description }}</p>
              
              <div class="flex items-center justify-between text-xs text-gray-500 mb-3">
                <span>{{ ordinance.ordinanceNumber }}</span>
                <span>{{ formatDate(ordinance.effectiveDate) }}</span>
              </div>
              
              <div class="flex items-center justify-between">
                <span class="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs">
                  {{ ordinance.category }}
                </span>
                <button class="text-amber-600 hover:text-amber-700 font-medium text-sm flex items-center gap-1">
                  <span>Read More</span>
                  <font-awesome-icon icon="arrow-right" class="text-xs" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

    </main>

    <!-- ... existing help button and mobile actions ... -->

    <!-- Ordinance Detail Modal -->
    <div v-if="showOrdinanceModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 p-4 overflow-y-auto" @click.self="showOrdinanceModal = false">
      <div class="bg-white rounded-2xl shadow-2xl p-6 max-w-4xl w-full my-8 max-h-[90vh] overflow-y-auto">
        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
          <div>
            <h3 class="text-2xl font-bold text-gray-900">{{ selectedOrdinance.title }}</h3>
            <p class="text-gray-600 mt-1">{{ selectedOrdinance.ordinanceNumber }}</p>
          </div>
          <button @click="showOrdinanceModal = false" class="text-gray-500 hover:text-gray-700">
            <font-awesome-icon icon="xmark" class="text-2xl" />
          </button>
        </div>

        <!-- Ordinance Details -->
        <div class="space-y-6">
          <!-- Category and Date -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 class="text-sm font-medium text-gray-500 mb-2">Category</h4>
              <p class="px-3 py-2 bg-amber-100 text-amber-700 rounded-lg inline-block">
                {{ selectedOrdinance.category }}
              </p>
            </div>
            <div>
              <h4 class="text-sm font-medium text-gray-500 mb-2">Effective Date</h4>
              <p class="text-gray-900 font-medium">{{ formatDate(selectedOrdinance.effectiveDate) }}</p>
            </div>
          </div>

          <!-- Description -->
          <div>
            <h4 class="text-sm font-medium text-gray-500 mb-2">Description</h4>
            <p class="text-gray-900">{{ selectedOrdinance.description }}</p>
          </div>

          <!-- Content -->
          <div>
            <h4 class="text-sm font-medium text-gray-500 mb-2">Full Content</h4>
            <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <pre class="whitespace-pre-wrap text-gray-900 text-sm font-sans">{{ selectedOrdinance.content }}</pre>
            </div>
          </div>

          <!-- Tags -->
          <div v-if="selectedOrdinance.tags && selectedOrdinance.tags.length > 0">
            <h4 class="text-sm font-medium text-gray-500 mb-2">Related Topics</h4>
            <div class="flex flex-wrap gap-2">
              <span 
                v-for="tag in selectedOrdinance.tags" 
                :key="tag"
                class="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm"
              >
                {{ tag }}
              </span>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex gap-3 pt-6 border-t border-gray-200 mt-6">
          <button 
            @click="showOrdinanceModal = false"
            class="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
          >
            Close
          </button>
          <button 
            @click="askAboutOrdinance"
            class="flex-1 px-4 py-3 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition-colors flex items-center justify-center gap-2"
          >
            <font-awesome-icon icon="comment-dots" />
            <span>Ask Questions About This</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useChatStore } from '@/stores/chat'
import { useAppointmentStore } from '@/stores/appointment'
import { useOrdinanceStore } from '@/stores/ordinance'
import { useRouter } from 'vue-router'
import ChatInterface from '@/components/clients/ChatInterface.vue'
import BookingModal from '@/components/clients/BookingModal.vue'

const authStore = useAuthStore()
const chatStore = useChatStore()
const appointmentStore = useAppointmentStore()
const ordinanceStore = useOrdinanceStore()
const router = useRouter()

const user = ref(null)
const question = ref('')
const selectedTopic = ref('')
const activeTab = ref('chat')
const showBookingModal = ref(false)
const showOrdinanceModal = ref(false)
const selectedOrdinance = ref(null)
const ordinanceSearch = ref('')
const selectedCategory = ref('')

// Legal topics for quick access
const legalTopics = [
  { name: 'Public Health & Safety', description: 'Butuan City health and safety ordinances', icon: 'shield-heart' },
  { name: 'Land Use & Zoning', description: 'Property, construction, and land development', icon: 'landmark' },
  { name: 'Environment & Natural Resources', description: 'Environmental protection and conservation', icon: 'leaf' },
  { name: 'Business & Commerce', description: 'Business permits, licenses, and regulations', icon: 'briefcase' },
  { name: 'Traffic & Transportation', description: 'Road rules, parking, and transport regulations', icon: 'car' },
  { name: 'Community & Social Services', description: 'Social welfare, education, and community programs', icon: 'users' }
]

const quickSuggestions = [
  "How do I apply for a business permit?",
  "What are the traffic violations in Butuan?",
  "How to register a property?",
  "What are the requirements for building permit?",
  "How to report environmental concerns?"
]

// Computed property for filtered ordinances
const filteredClientOrdinances = computed(() => {
  let filtered = ordinanceStore.activeOrdinances

  // Filter by category
  if (selectedCategory.value) {
    filtered = filtered.filter(ord => ord.category === selectedCategory.value)
  }

  // Filter by search query
  if (ordinanceSearch.value.trim()) {
    const searchTerm = ordinanceSearch.value.toLowerCase()
    filtered = filtered.filter(ord =>
      ord.title.toLowerCase().includes(searchTerm) ||
      ord.description.toLowerCase().includes(searchTerm) ||
      ord.ordinanceNumber.toLowerCase().includes(searchTerm) ||
      ord.content.toLowerCase().includes(searchTerm) ||
      (ord.tags && ord.tags.some(tag => tag.toLowerCase().includes(searchTerm)))
    )
  }

  return filtered
})

const getOrdinanceCountByCategory = (category) => {
  return ordinanceStore.activeOrdinances.filter(ord => ord.category === category).length
}

// Lifecycle hook
onMounted(async () => {
  user.value = authStore.user
  await chatStore.loadChatsFromStorage()
})

// Ordinance-related methods
const openClientOrdinance = (ordinance) => {
  selectedOrdinance.value = ordinance
  showOrdinanceModal.value = true
  ordinanceStore.incrementViews(ordinance.id)
}

const askAboutOrdinance = () => {
  const ordinanceTitle = selectedOrdinance.value.title
  question.value = `I have questions about the ${ordinanceTitle}`
  showOrdinanceModal.value = false
  
  const newChat = chatStore.startNewChat(selectedOrdinance.value.category, question.value)
  chatStore.setCurrentChat(newChat)
  selectedTopic.value = selectedOrdinance.value.category
  question.value = ''
}

// ... existing chat methods ...
const selectTopic = (topic) => {
  selectedTopic.value = topic
  const newChat = chatStore.startNewChat(topic)
  chatStore.setCurrentChat(newChat)
}

const useSuggestion = (suggestion) => {
  question.value = suggestion
  let topic = 'General Inquiry'
  
  const lowerSuggestion = suggestion.toLowerCase()
  if (lowerSuggestion.includes('business') || lowerSuggestion.includes('permit')) {
    topic = 'Business & Commerce'
  } else if (lowerSuggestion.includes('property') || lowerSuggestion.includes('register')) {
    topic = 'Land Use & Zoning'
  } else if (lowerSuggestion.includes('traffic') || lowerSuggestion.includes('violation')) {
    topic = 'Traffic & Transportation'
  } else if (lowerSuggestion.includes('building')) {
    topic = 'Land Use & Zoning'
  } else if (lowerSuggestion.includes('environment')) {
    topic = 'Environment & Natural Resources'
  }
  
  const newChat = chatStore.startNewChat(topic, suggestion)
  chatStore.setCurrentChat(newChat)
  selectedTopic.value = topic
  question.value = ''
}

const sendDirectMessage = () => {
  if (question.value.trim()) {
    const newChat = chatStore.startNewChat('General Inquiry', question.value)
    chatStore.setCurrentChat(newChat)
    selectedTopic.value = 'General Inquiry'
    question.value = ''
  }
}

const startNewChat = () => {
  selectedTopic.value = ''
  question.value = ''
  activeTab.value = 'chat'
  chatStore.setCurrentChat(null)
}

const continueChat = (chat) => {
  const fullChat = chatStore.chats.find(c => c.id === chat.id)
  if (fullChat) {
    chatStore.setCurrentChat(fullChat)
    selectedTopic.value = chat.topic
  }
}

const deleteChat = async (chatId) => {
  if (confirm('Are you sure you want to delete this chat?')) {
    await chatStore.deleteChat(chatId)
  }
}

const clearAllChats = async () => {
  if (confirm('Are you sure you want to clear all chat history? This action cannot be undone.')) {
    await chatStore.clearAllChats()
  }
}

// Appointment methods
const handleBookAppointment = (appointmentData) => {
  const newAppointment = appointmentStore.bookAppointment(appointmentData)
  showBookingModal.value = false
  activeTab.value = 'appointments'
  
  alert(`Appointment booked successfully!\n\nDetails:\nDate: ${newAppointment.date}\nTime: ${newAppointment.time}\nLawyer: ${newAppointment.lawyer}\nStatus: ${newAppointment.status}\n\nYou will receive a confirmation once the lawyer accepts your request.`)
}

const cancelAppointment = (appointmentId) => {
  if (confirm('Are you sure you want to cancel this appointment?')) {
    appointmentStore.cancelAppointment(appointmentId)
  }
}

const getStatusClass = (status) => {
  const classes = {
    'Pending': 'bg-amber-100 text-amber-800',
    'Accepted': 'bg-green-100 text-green-800',
    'Rejected': 'bg-red-100 text-red-800',
    'Completed': 'bg-blue-100 text-blue-800',
    'Cancelled': 'bg-gray-100 text-gray-800',
    'Rescheduled': 'bg-purple-100 text-purple-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

// Utility methods
const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

const handleLogout = async () => {
  if (confirm('Are you sure you want to logout?')) {
    await authStore.logout()
    router.push('/login')
  }
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

pre {
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>